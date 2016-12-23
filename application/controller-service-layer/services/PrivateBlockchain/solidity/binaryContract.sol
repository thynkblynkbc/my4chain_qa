pragma solidity ^ 0.4.4;
contract documentAccessMapping {

    struct User {
        address parentId;
        string[] actions;
        address party;
    }

    struct FileHash{
      string filehash;
      string comment;
    }

    mapping(string => string) roles;
    mapping(address => User) public users;
    mapping(string => string) states;
    mapping(address =>bool) partyState;// is parties sign the contract
    mapping(uint =>FileHash) filehash;

    address public admin;
    string hashValue;
    address _otherParty;
    uint fileIndex;


    string contractState;
    uint contractCreationTime;

    event GetValue(address str, uint add, string from);
    event usersLog(address indexed _from, address indexed _to, string _message, string _methodName, uint _callTime);
    function assignAdminAction() internal{
      users[admin].parentId=admin;
      users[admin].actions=["CAN_ASSIGN","CAN_REVOKE","CAN_ACCEPT","CAN_DECLINE","CAN_REVIEW","CAN_ACK"];
      users[admin].party=admin;
      users[_otherParty].parentId=admin;
      users[_otherParty].party=_otherParty;
    }
    function documentAccessMapping(address otherParty, string fileEncryptedHash) payable {
        admin = msg.sender;
        _otherParty=otherParty;
        contractCreationTime = block.timestamp;
        hashValue=fileEncryptedHash;
        filehash[fileIndex].filehash=fileEncryptedHash;
        filehash[fileIndex].comment="init";
        fileIndex++;
        createRoles();
        assignAdminAction();
        allStates();
    }
    /*function getHash() returns (string hashComment) {
      string memory finalStrAction;
      string memory comma = ',';
      string memory delimeter= '|';
      if(fileIndex>0){
        finalStrAction=strConcat(filehash[0].filehash,comma,filehash[0].comment);
      }
      for (uint i = 1; i <fileIndex; i++) {
          string memory current=strConcat(filehash[i].filehash,comma,filehash[i].comment);
          finalStrAction = strConcat(finalStrAction, delimeter,current);
      }
      usersLog(msg.sender,msg.sender,finalStrAction,"getHash",now);
      return (finalStrAction);
    }*/

    function createRoles() internal  {
        roles["CAN_ASSIGN"] = "CAN_ASSIGN";
        roles["CAN_REVOKE"] = "CAN_REVOKE";
        roles["CAN_ACCEPT"] = "CAN_ACCEPT";
        roles["CAN_DECLINE"] = "CAN_DECLINE";
        roles["CAN_REVIEW"] = "CAN_REVIEW";
        roles["CAN_ACK"] = "CAN_ACK";

    }

    function allStates() internal {
        states["ACK"] = "ACK";
        states["REVIEW"] = "REVIEW";
        states["MODIFY"] = "MODIFY";
        states["ACCEPT"] = "ACCEPT";
        states["DECLINE"] = "DECLINE";
        states["REVOKE"] = "REVOKE";
    }
    modifier isAcceptDecline {
        if (stringsEqual(contractState,states["ACCEPT"]) || stringsEqual(contractState,states["DECLINE"]) ){
          usersLog(msg.sender,msg.sender,"State Cannot be change","isAcceptDecline",now);
         // throw;
        }else{
        _;
        }

    }

    function stringsEqual(string memory _a, string memory _b) internal returns(bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length)
            return false;
        for (uint i = 0; i < a.length; i++)
            if (a[i] != b[i])
                return false;
        return true;
    }

    function checkRole(address id, string argAction) internal returns(bool) {
        string[] actionArr = users[id].actions; //.actions;
        bool isAction = false;
        for (uint i = 0; i < actionArr.length; i++) {
            if (stringsEqual(actionArr[i], argAction)) {
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
    function assignAction(address userId, string argAction) isAcceptDecline public returns(string) {
      if(isPartyExist(users[msg.sender].party)){
        if (checkRole(msg.sender, roles["CAN_ASSIGN"])) { //1
            if ( users[userId].party != address(0) ) { //2
                return existingUser(userId, argAction);
            } //2
            else {
                if(users[msg.sender].party==address(0)){ // if sender have no party
                  return newUser(userId, argAction,msg.sender);
                }
                else{
                  return newUser(userId, argAction,users[msg.sender].party);
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

    function newUser(address userId, string argAction,address partyAddress) internal returns(string) {
        if (stringsEqual(roles[argAction], argAction)) {
            if (checkRole(msg.sender, roles[argAction])) {
                users[userId].actions.push(argAction);
                users[userId].parentId = msg.sender;
                users[userId].party=partyAddress;
                usersLog(msg.sender,userId,"New User Added","newUser",now);
                /*GetValue(userId, users[userId].actions.length, "New User Added");*/
                return "New User Added";
            } else {
                usersLog(msg.sender,userId,"New, Parent have not this action","newUser",now);
                /*GetValue(userId, users[userId].actions.length, "New, Parent have not this action");*/
                return "New, Parent have not this action"; //*

            }
        } else {
            usersLog(msg.sender,userId,"Enter right action, can not be add","newUser",now);
            /*GetValue(userId, users[userId].actions.length, "Enter right action, can not be add");*/
            return "Enter right action, can not be add";//*
        }
    }

    function existingUser(address userId, string argAction) internal returns(string) {
        if (checkRole(userId, roles[argAction])) { //3
            usersLog(msg.sender,userId,"Action Already Added","existingUser",now);
            /*GetValue(userId, users[userId].actions.length, "Action Already Added");*/
            return 'Action Already Added';
        } //3
        else {
            if (stringsEqual(roles[argAction], argAction)) { //4
                if (msg.sender == users[userId].parentId) {
                    if (checkRole(users[userId].parentId, roles[argAction])) {
                        users[userId].actions.push(argAction);
                        usersLog(msg.sender,userId,"Action Added","existingUser",now);
                        /*GetValue(userId, users[userId].actions.length, "Action Added");*/
                        return 'Action Added';
                    } else {
                        usersLog(msg.sender,userId,"Parent have not this action to add","existingUser",now);
                        /*GetValue(userId, users[userId].actions.length, "Parent have not this action to add");*/
                        return 'Parent have not this action to add'; //*
                    }
                } else {
                    usersLog(msg.sender,userId,"Parent or admin is wrong","existingUser",now);
                    /*GetValue(userId, users[userId].actions.length, "Parent or admin is wrong");*/
                    return 'Parent or admin is wrong';//*
                }
            } //4
            else {
                usersLog(msg.sender,userId,"Action does not exist, not added","existingUser",now);
                /*GetValue(userId, users[userId].actions.length, "Action does not exist, not added");*/
                return 'Action does not exist, not added';
            }
        }
    }

    function acknowledge() isAcceptDecline {
        if (msg.sender == admin || (checkRole(msg.sender, roles["CAN_ACK"]) && users[msg.sender].party!=address(0))) {
              contractState = states["ACK"];
              usersLog(msg.sender,msg.sender,"Contract in acknowledge state","acknowledge",now);
        }else{
            usersLog(msg.sender,msg.sender,"Sorry, You are not authorized","acknowledge",now);
        }
    }



    function removeAction(address userId, string argAction) isAcceptDecline {

        string memory message;
        if (msg.sender == users[userId].parentId) {
            bool isAction = false;
            uint index;

            for (uint i = 0; i < users[userId].actions.length; i++) {
                if (stringsEqual(users[userId].actions[i], argAction)) {
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

    function review(uint iscomment,string comment,string encryptFileHash) isAcceptDecline {
        string memory message;
        if (checkRole(msg.sender, roles["CAN_REVIEW"])) {
            if (iscomment == 1) {
                /*filehash[fileIndex].filehash=encryptFileHash;
                filehash[fileIndex].comment=comment;
                fileIndex++;*/
                contractState = states["MODIFY"];
                message = 'Contract in Modify state';
            } else {
                contractState = states["REVIEW"];
                message = 'Contract in Review state';
            }
        } else {
            message = 'Sorry, You are not authorized';
        }
        usersLog(msg.sender,msg.sender,message,"review",now);
    }

    function addFileHash(string encryptFileHash) isAcceptDecline {
        string memory message;
        if (msg.sender == admin || msg.sender== _otherParty) {
            hashValue=encryptFileHash;
            message = 'File Hash added';

        } else {
            message = 'Sorry, You are not authorized';

        }
        usersLog(msg.sender,msg.sender,message,'addFileHash',now);
    }

    function revoke(address userId, string _message) isAcceptDecline {
        string memory message;
        /*if ((checkRole(users[msg.sender].parentId, roles["CAN_REVOKE"]) && users[userId].parentId == msg.sender) || admin == msg.sender) {
            if (stringsEqual(contractState, states["ACCEPT"])) {
                message=_message;
            } else {
                message = 'User removed successfully';
            }
            delete users[userId];
        } else {
            message = 'Sorry, You are not authorized';
        }
        usersLog(msg.sender,msg.sender,message,'revoke',now);*/
        if (checkRole(msg.sender, roles["CAN_REVOKE"])) {
          if (stringsEqual(contractState, states["ACCEPT"])) {
              message=_message;
          } else {
              message = 'Contract is in Revoke state';
          }
          contractState = states["REVOKE"];
        } else {
            message = 'Sorry, You are not authorized';
        }
        usersLog(msg.sender,msg.sender,message,'revoke',now);
    }

    function decline() isAcceptDecline {
        string memory message;
        if (checkRole(msg.sender, roles["CAN_DECLINE"]) || msg.sender == admin) {
            contractState = states["DECLINE"];
            message = 'Contract in Decline state';
        } else {
            message = 'Sorry, You are not authorized';
        }
      usersLog(msg.sender,msg.sender,message,"decline",now);
    }

    function signContract() accept {
      string memory message;
      if (checkRole(msg.sender, 'CAN_ACCEPT') && users[msg.sender].party!=address(0)) {
          partyState[users[msg.sender].party]=true;
          message = 'Contract Sign';
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
    modifier accept() {
        _;
        string memory message;
        if (checkRole(msg.sender, 'CAN_ACCEPT') || msg.sender == admin) {

          if(isPartySign()){
              contractState = states["ACCEPT"];
              message = 'Contract in Accept state';
            }
            else
            {
              message ='All party have not sign the contract';

            }
        } else {
            message = 'Sorry, You are not authorized';
        }
        usersLog(msg.sender,msg.sender,message,'accept',now);
    }


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

    function getUserAction(address userId) public returns(string action, string state, address parent,address party,address otherParty) {
        string[] actionArray = users[userId].actions;
        string memory finalStrAction;
        string memory comma = ',';
        if (actionArray.length > 0) {
            finalStrAction = actionArray[0];
        }
        for (uint i = 1; i < actionArray.length; i++) {
            finalStrAction = strConcat(finalStrAction, comma, actionArray[i]);
        }
        usersLog(msg.sender,userId,finalStrAction,"getUserAction",now);
        return (finalStrAction, contractState, users[userId].parentId,users[userId].party,_otherParty);
    }

    function expire() returns(bool isExpire) {
        /*if (block.timestamp <= contractCreationTime + 300) {
            return (false);
        } else {
            return (true);
        }*/
        //
        if (stringsEqual(contractState, states["REVOKE"])) {
            return true;
        } else {
          if (block.timestamp <= contractCreationTime + 300) {
              return false;
          } else {
              return true;
          }
        }
    }
}
