App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3(); //to initialize app
  },

  initWeb3: function() { //initializes connection of our client application to our local blockchain
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  //loads up our contract into founded application so we can interact with it.
  initContract: function()
  {
    $.getJSON("queryMeta.json", function(queryMeta)
    {
      // Instantiate a new truffle contract from the artifact
      App.contracts.queryMeta = TruffleContract(queryMeta);
      // Connect provider to interact with contract
      App.contracts.queryMeta.setProvider(App.web3Provider);

      App.listenForEvents(); //call listenForEvents

      return App.render();
    });
  },

  //Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.queryMeta.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.updateMetaEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new update is recorded
        App.render();
      });
    });
  },

  //layout all content on the page
  render: function()
  {
    var queryMetaInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    // a lite-server in package.json
    web3.eth.getCoinbase(function(err, account)
    {
      if (err === null)
      {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data (list all items to the front side)
    App.contracts.queryMeta.deployed().then(function(instance)
    {
      queryMetaInstance = instance;
      return queryMetaInstance.EMRMetasCount();
    }).then(function(EMRMetasCount)
    {
      var EMRMetasResults = $("#EMRMetasResults");
      EMRMetasResults.empty();

      var EMRMetaSelect = $('#EMRMetaSelect');
      EMRMetaSelect.empty();

      for (var i = 1; i <= EMRMetasCount; i++)
      {
        queryMetaInstance.EMRMetas(i).then(function(EMRMeta)
        {
          var owner = EMRMeta[0];
          var timestamp = EMRMeta[1];
          var allowedRole = EMRMeta[2];

          // Render EMRMetas Result
          var EMRMetaTemplate = "<tr><th>" + owner + "</th><td>" + timestamp + "</td><td>" + allowedRole + "</td></tr>"
          EMRMetasResults.append(EMRMetaTemplate);

          // Render EMRMetas records to update
          var EMRMetaOption = "<option value ='" + owner + "' >" + owner + "</ option>"
          EMRMetaSelect.append(EMRMetaOption);
       });
      }

      loader.hide();
      content.show();
    });
  },

  updateMeta: function()
  {
    var metaId = $('#EMRMetaSelect').val();
    App.contracts.queryMeta.deployed().then(function(instance)
    {
      return instance.updateMetas(metaId, { from: App.account });
    }).then(function(result)
    {
      // Wait for Meta update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err)
    {
      console.error(err);
    });
  }
};

$(function()
{
  $(window).load(function()
  {
    App.init();
  });
});
