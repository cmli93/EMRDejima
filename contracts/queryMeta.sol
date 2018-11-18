pragma solidity  ^0.4.24;

contract queryMeta {

    //Model metadata of EMR
    struct EMRMeta {
        uint owner; //patient ID; public will have getter and setter function automatically
        string timestamp;
        uint allowedRole;
    }

    //Store EMRMetas
    mapping (uint => EMRMeta) public EMRMetas;

    struct Role{
      string name; //name of doctor or patient
      uint id;
      uint roleNum; /*
                    consider doctor only for the time being:
                      1 -> doctor
                      2 -> analyzer
                      3 -> insurance
                      4->  patient
                        */
    }

    //Store　roles
    mapping (uint => Role) public roles;

    /*
     * Contructor, will run whenever we deploy the contract to the blockchain
     * (initialized contract upon migration)
     * same name as the contract
    */
    function queryMeta () public {
           //先直接初始化一些roles
           roles[0] = Role("Alice", 888, 1); //doctor
           roles[1] = Role("Bob", 87, 4); //a patient

           //先直接初始化一些EMRMetas
           EMRMetas[0] = EMRMeta(123, "20181118", 1);
           EMRMetas[1] = EMRMeta(456, "20181119", 4);
    }

    //Read EMRMetas

}
