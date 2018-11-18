//contract abstraction that is specific to truffle
// give us a queryMeta artifact that represents our smart contract
var queryMeta = artifacts.require("./queryMeta.sol");

module.exports = function(deployer) {
  deployer.deploy(queryMeta);
};
