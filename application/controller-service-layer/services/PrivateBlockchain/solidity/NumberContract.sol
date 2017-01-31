pragma solidity ^ 0.4.4;

contract docMapping{
  struct  FileHash1{
    string fh;
    string comment;
  }
 mapping(uint =>FileHash1) filehashes1;
 uint32 fileIndex;
 /*function stringsEqual(string memory _a, string memory _b) internal returns(bool) {
     bytes memory a = bytes(_a);
     bytes memory b = bytes(_b);
     if (a.length != b.length)
         return false;
     for (uint i = 0; i < a.length; i++)
         if (a[i] != b[i])
             return false;
     return true;
 }*/
      function strConcat(string _a, string _b, string _c) internal returns(string) {
          bytes memory _ba = bytes(_a);
          bytes memory _bb = bytes(_b);
          bytes memory _bc = bytes(_c);
          string memory abcde = new string(_ba.length + _bb.length + _bc.length);
          bytes memory babcde = bytes(abcde);
          uint k = 0;
          for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
          for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
          for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
          return string(babcde);
      }



}
contract documentAccessMapping is docMapping{
//TestLib.Data data;
    struct User {
        address parentId;
        uint8[] actions;
        address party;
    }

    struct FileHash{
      string fh;
      string comment;
    }

      uint8 nextState;
      address whichParty;


    //mapping(uint8 => stateChange) stateFlow;
    mapping(uint8 => uint8) roles;
    mapping(address => User) public users;
    mapping(string => string) states;
    mapping(address =>bool) partyState;// is parties sign the contract
    mapping(uint =>FileHash) filehashes;
    uint expireDate;
    uint inititeDate;
    address public admin;
    string hashValue;
    address _otherParty;
    uint fileIndex=0;

    mapping(uint8 => string) rolesInt;
    mapping(string => uint8) stateInt;
    string contractState;
    uint contractCreationTime;

    event GetValue(address str, uint add, string from);
    event fileModifyLog(address indexed _from,  string _message, string _fileHash, uint _callTime);

    event usersLog(address indexed _from, address indexed _to, string _message, string _methodName, uint _callTime);
    function assignAdminAction() internal{
      users[admin].parentId=admin;
      users[admin].actions=[1,2,3,4,5,6];
      users[admin].party=admin;
      users[_otherParty].parentId=admin;
      users[_otherParty].party=_otherParty;
      users[_otherParty].actions=[1,2,3,4,5,6];
      nextState = 1;
      whichParty = _otherParty;
    }
    function documentAccessMapping(string fileEncryptedHash,address ownerAddress,address[] ownerMember,uint8[] ownerAction,address secondPartyAddress,address[] secondPartyMember,uint8[] secondPartyAction,uint startfrom,uint endDate) {
        admin = msg.sender;
        _otherParty=secondPartyAddress;
        contractCreationTime = block.timestamp;
        hashValue=fileEncryptedHash;
        expireDate = endDate;
        inititeDate = startfrom;
        filehashes[fileIndex].fh=fileEncryptedHash;
        filehashes[fileIndex].comment="init";
        fileIndex++;
        createRoles();
        assignAdminAction();
        allStates();
        initizeRole(ownerAddress,ownerMember,ownerAction,secondPartyAddress,secondPartyMember,secondPartyAction);
    }



    function createRoles() internal  {
    //  string val = "h";

        roles[1] = 1;
        roles[2] = 2;
        roles[3] = 3;
        roles[4] = 4;
        roles[5] = 5;
        roles[6] = 6;
        rolesInt[1] = "CAN_ASSIGN";
        rolesInt[2] = "CAN_REVOKE";
        rolesInt[3] = "CAN_ACCEPT";
        rolesInt[4] = "CAN_DECLINE";
        rolesInt[5] = "CAN_REVIEW";
        rolesInt[6] = "CAN_ACK";

    }

    function allStates() internal {
        states["ACK"] = "ACK";
        states["REVIEW"] = "REVIEW";
        states["MODIFY"] = "MODIFY";
        states["ACCEPT"] = "ACCEPT";
        states["DECLINE"] = "DECLINE";
        states["REVOKE"] = "REVOKE";
        stateInt["ACK"] = 1;
        stateInt["REVIEW"] = 2;
        stateInt["MODIFY"] = 3;
        stateInt["ACCEPT"] = 4;
        stateInt["DECLINE"] = 5;
        stateInt["REVOKE"] = 6;
        /*
        states[1] = 1;
        states[2] = 2;
        states[3] = 3;
        states[4] = 4;
        states[5] = 5;
        states[6] = 6;
        stateInt[1] = "CAN_ASSIGN";
        stateInt[2] = "CAN_REVOKE";
        stateInt[3] = "CAN_ACCEPT";
        stateInt[4] = "CAN_DECLINE";
        stateInt[5] = "CAN_REVIEW";
        stateInt[6] = "CAN_ACK";
        */
    }
    function getHash() returns (string hashComment) {
      string memory finalStrAction;
      string memory comma = ',';
      string memory delimeter= '|';
      if(fileIndex>0){
        finalStrAction=strConcat(filehashes[0].fh,comma,filehashes[0].comment);
      }
      for (uint i = 1; i <fileIndex; i++) {
          string memory current=strConcat(filehashes[i].fh,comma,filehashes[i].comment);
          finalStrAction = strConcat(finalStrAction, delimeter,current);
      }
      usersLog(msg.sender,msg.sender,finalStrAction,"getHash",now);
      return (finalStrAction);
    }

    modifier isAcceptDecline {
      if(expire() == false){
     if (stateInt[contractState] == 4 || stateInt[contractState] == 5 ){
          usersLog(msg.sender,msg.sender,"State Cannot be change","isAcceptDecline",now);
         // throw;
        }else{
        _;
        }
      }else{
        usersLog(msg.sender,msg.sender,"Your contract is expired or in revoke state","isAcceptDecline",now);
      }

    }



    function checkRole(address id, uint8 argAction) internal returns(bool) {
        uint8[] actionArr = users[id].actions; //.actions;
        bool isAction = false;
        for (uint i = 0; i < actionArr.length; i++) {
            if (actionArr[i] == argAction) {
                isAction = true;
                break;
            }
        }
        return isAction;
    }
    function isPartyExist(address partyAddress) internal returns(bool) {
      if(partyAddress==address(0))
            return false;
      if(partyAddress==_otherParty || partyAddress==admin)
        return true;

      return false;
    }
    /*function GetData()  public returns(string) {
     data.value = ["himanshu","sharma","lion"];
     bool v =TestLib.getHash(data ,3 );
      return data.finalStrAction;

  }*/

    function assignAction(address userId, uint8[] argAction) isAcceptDecline public returns(string) {

     for(uint8 i = 0;i < argAction.length ; i++){
      if(isPartyExist(users[msg.sender].party)){
        if (checkRole(msg.sender, argAction[i])) { //1
            if ( users[userId].party != address(0) ) { //2
                 existingUser(userId, argAction[i]);
            } //2
            else {
                if(users[msg.sender].party==address(0)){ // if sender have no party
                   newUser(userId, argAction[i],msg.sender);
                }
                else{
                   newUser(userId, argAction[i],users[msg.sender].party);
                }
            }
        } //1
        else {
            usersLog(msg.sender,userId,"Sorry, You are not authorized","assignAction",now);//*
            /*GetValue(userId, users[userId].actions.length, "Not authorized");*/
            return 'Sorry, You are not authorized';
        }

      }else{
        usersLog(msg.sender,userId,"Sorry, This is not correct partyAddress","assignAction",now);

        return 'Sorry, This is not correct partyAddress';

      }
    }

    }
    function initizeRole(address ownerAddress,address[] ownerMember,uint8[] ownerAction,address secondPartyAddress,address[] secondPartyMember,uint8[] secondPartyAction)  public returns(string) {
        uint8 j =0;
        for(uint8 i =0;i < ownerMember.length ; i++){

             users[ownerMember[i]].parentId=ownerAddress;
             users[ownerMember[i]].party=ownerAddress;

            while(j < ownerAction.length){
              if(ownerAction[j] == 0){
                j++;
                break;
              }else{
               users[ownerMember[i]].actions.push(ownerAction[j]);
               j++;
             }

            }

        }
        j =0;
         for(i =0;i < secondPartyMember.length ; i++){

             users[secondPartyMember[i]].parentId=secondPartyAddress;
             users[secondPartyMember[i]].party=secondPartyAddress;

            while(j < secondPartyAction.length){
              if(secondPartyAction[j] == 0){
                j++;
                break;
              }else{
               users[secondPartyMember[i]].actions.push(secondPartyAction[j]);
               j++;
             }
            }


        }

    }
    function newUser(address userId, uint8 argAction,address partyAddress) internal returns(string) {
        if (roles[argAction] == argAction) {
            if (checkRole(msg.sender, roles[argAction])) {
                users[userId].actions.push(argAction);
                users[userId].parentId = msg.sender;
                users[userId].party=partyAddress;
                usersLog(msg.sender,userId,"New User Added","newUser",now);
                /*GetValue(userId, users[userId].actions.length, "New User Added");*/
            //    return "New User Added";
            } else {
                usersLog(msg.sender,userId,"New, Parent have not this action","newUser",now);
                /*GetValue(userId, users[userId].actions.length, "New, Parent have not this action");*/
              //  return "New, Parent have not this action"; //*

            }
        } else {
            usersLog(msg.sender,userId,"Enter right action, can not be add","newUser",now);
            /*GetValue(userId, users[userId].actions.length, "Enter right action, can not be add");*/
            //return "Enter right action, can not be add";//*
        }
    }

    function existingUser(address userId, uint8 argAction) internal returns(string) {
        if (checkRole(userId, roles[argAction])) { //3
            usersLog(msg.sender,userId,"Action Already Added","existingUser",now);
            /*GetValue(userId, users[userId].actions.length, "Action Already Added");*/
          //  return 'Action Already Added';
        } //3
        else {
            if (roles[argAction] == argAction) { //4
                if (msg.sender == users[userId].parentId) {
                    if (checkRole(users[userId].parentId, roles[argAction])) {
                        users[userId].actions.push(argAction);
                        usersLog(msg.sender,userId,"Action Added","existingUser",now);
                        /*GetValue(userId, users[userId].actions.length, "Action Added");*/
                      //  return 'Action Added';
                    } else {
                        usersLog(msg.sender,userId,"Parent have not this action to add","existingUser",now);
                        /*GetValue(userId, users[userId].actions.length, "Parent have not this action to add");*/
                    //    return 'Parent have not this action to add'; //*
                    }
                } else {
                    usersLog(msg.sender,userId,"Parent or admin is wrong","existingUser",now);
                    /*GetValue(userId, users[userId].actions.length, "Parent or admin is wrong");*/
                  //  return 'Parent or admin is wrong';//*
                }
            } //4
            else {
                usersLog(msg.sender,userId,"Action does not exist, not added","existingUser",now);
                /*GetValue(userId, users[userId].actions.length, "Action does not exist, not added");*/
              //  return 'Action does not exist, not added';
            }
        }
    }

    function acknowledge() isAcceptDecline {
        if (msg.sender == admin || (checkRole(msg.sender, roles[6]) && users[msg.sender].party!=address(0))) {
              contractState = "ACK";
              usersLog(msg.sender,msg.sender,"Contract in acknowledge state","acknowledge",now);
        }else{
            usersLog(msg.sender,msg.sender,"Sorry, You are not authorized","acknowledge",now);
        }
    }



    function removeAction(address userId, uint8[] argAction) isAcceptDecline {

        string memory message;
        bool isAction = false;
        uint index;
        uint i = 0;
        for(uint8 k = 0;k < argAction.length ; k++){
        if (msg.sender == users[userId].parentId) {

                  isAction = false;
                  index = 0;
            for (i = 0; i < users[userId].actions.length; i++) {
                if (users[userId].actions[i] == argAction[k]) {
                    index = i;
                    isAction = true;
                    break;
                }
            }
            if (isAction) {
                while (index < users[userId].actions.length - 1) {
                    users[userId].actions[index] = users[userId].actions[index + 1];
                    index++;
                }
                delete users[userId].actions[index];
                users[userId].actions.length--;

                message = 'Action removed';
            } else {
                message = 'Action does not exist';
            }
        } else {
            message = 'Sorry, You are not authorized';

        }
        usersLog(msg.sender,userId,message,"removeAction",now);
      }

    }

    function review(uint iscomment,string comment,string encryptFileHash) isAcceptDecline {
        string memory message;
        if (checkRole(msg.sender, roles[5])) {
            if (iscomment == 1) {
                filehashes[fileIndex].fh=encryptFileHash;
                filehashes[fileIndex].comment=comment;
                fileIndex++;
                hashValue=encryptFileHash;
                contractState = "MODIFY";
                message = 'Contract in Modify state';
                fileModifyLog(msg.sender,  message, hashValue, now);
            } else {
                contractState = "REVIEW";
                message = 'Contract in Review state';
            }
        } else {
            message = 'Sorry, You are not authorized';
        }
        usersLog(msg.sender,msg.sender,message,"review",now);
    }

   /*function revoke(address userId, string _message) isAcceptDecline {*/
    function revoke(string reason)  {
        string memory message;
        if (checkRole(msg.sender, roles[2])) {
          // check for accept state
          if (stateInt[contractState] == 4 ) {
            contractState = "REVOKE";
              message=reason;
          } else {
              message = 'Contract not Revoke , as not in accept state';
          }

        } else {
            message = 'Sorry, You are not authorized';
        }
        usersLog(msg.sender,msg.sender,message,'revoke',now);
    }

    function decline() isAcceptDecline {
    string memory message;
        if (checkRole(msg.sender, roles[4]) || msg.sender == admin) {   // 4 is CAN_DECLINE
            contractState = states["DECLINE"];
            message = 'Contract in Decline state';
        } else {
            message = 'Sorry, You are not authorized';
        }
      usersLog(msg.sender,msg.sender,message,"decline",now);
    }

    function sign() isAcceptDecline {
      string memory message;

      if (checkRole(msg.sender, 3) && users[msg.sender].party!=address(0)) { // 3 is CAN_ACCEPT
          partyState[users[msg.sender].party]=true;
          message = 'Contract Sign';

          if(isPartySign()){
              contractState = states["ACCEPT"];
              message = 'Contract in Accept state';
            }
            else
            {
              message ='All party have not sign the contract';

            }
              usersLog(msg.sender,msg.sender,message,'accept',now);
      } else {
          message = 'Sorry, You are not authorized';
      }
        usersLog(msg.sender,users[msg.sender].parentId,message,'signContract',now);
    }
    function isPartySign() internal returns(bool) {
      if(partyState[admin] && partyState[_otherParty])
          return true;

      return false;
    }

    function getUserAction(address userId) public returns(string action, string state, address parent,address party,uint expireContract) {
        uint8[] actionArray = users[userId].actions;
        string memory finalStrAction;
        string memory comma = ',';
        if (actionArray.length > 0) {
            finalStrAction = rolesInt[actionArray[0]];
        }
        for (uint i = 1; i < actionArray.length; i++) {
            finalStrAction = strConcat(finalStrAction, comma, rolesInt[actionArray[i]]);
        }
        usersLog(msg.sender,userId,finalStrAction,"getUserAction",now);
        return (finalStrAction,contractState, users[userId].parentId,users[userId].party,expireDate);
    }

    function expire() internal returns(bool isExpire) {
         if (block.timestamp >= expireDate) {
            return true;
        } else {
          //  return false;
          if (stateInt[contractState] == 6) {
              return true;
          } else {
              return false;
          }
        }
    }
}
