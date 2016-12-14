pragma solidity ^ 0.4.4;
contract documentAccessMapping {

    struct User {
        address parentId;
        string[] actions;
    }
    mapping(string => string) roles;
    mapping(address => User) public users;
    mapping(string => string) states;

    address public admin;
    address[] hashValue;

    string contractState;
    uint contractCreationTime;

    event GetValue(address str, uint add, string from);
    event usersLog(address indexed _from, address indexed _to, string _message, string _methodName, uint _callTime);



    function documentAccessMapping()  {
        admin = msg.sender;
        contractCreationTime = block.timestamp;
        createRoles();
        allStates();
    }

    modifier isAcceptDecline {
        if (stringsEqual(contractState,states["ACCEPT"]) || stringsEqual(contractState,states["DECLINE"]) ){
          usersLog(msg.sender,msg.sender,"State Cannot be change","isAcceptDecline",now);
         // throw;
        }else{
        _;
        }

    }

    function createRoles() internal {
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

    function newUser(address userId, string argAction) public returns(string) {
        if (stringsEqual(roles[argAction], argAction)) {
            if (checkRole(msg.sender, roles[argAction]) || msg.sender == admin) {
                users[userId].actions.push(argAction);
                users[userId].parentId = msg.sender;
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

    function existingUser(address userId, string argAction) public returns(string) {
        if (checkRole(userId, roles[argAction])) { //3
            usersLog(msg.sender,userId,"Action Already Added","existingUser",now);
            /*GetValue(userId, users[userId].actions.length, "Action Already Added");*/
            return 'Action Already Added';
        } //3
        else {
            if (stringsEqual(roles[argAction], argAction)) { //4
                if (msg.sender == users[userId].parentId) {
                    if (checkRole(users[userId].parentId, roles[argAction]) || msg.sender == admin) {
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
        if (msg.sender == admin || checkRole(msg.sender, roles["CAN_ACK"])) {
            contractState = states["ACK"];
              usersLog(msg.sender,msg.sender,"Contract in acknowledge state","acknowledge",now);
        }else{
            usersLog(msg.sender,msg.sender,"Sorry, You are not authorized","acknowledge",now);
        }
    }

    function assignAction(address userId, string argAction) isAcceptDecline public returns(string) {
        if (checkRole(msg.sender, roles["CAN_ASSIGN"]) || msg.sender == admin) { //1
            if (users[userId].actions.length > 0) { //2
                return existingUser(userId, argAction);
            } //2
            else {
                return newUser(userId, argAction);
            }
        } //1
        else {
            usersLog(msg.sender,userId,"Sorry, You are not authorized","assignAction",now);//*
            /*GetValue(userId, users[userId].actions.length, "Not authorized");*/
            return 'Sorry, You are not authorized';
        }
    }

    function removeAction(address userId, string argAction) isAcceptDecline {

        string memory message;
        if (msg.sender == admin || msg.sender == users[userId].parentId) {
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

    function review(uint comment) isAcceptDecline {
        string memory message;
        if (checkRole(msg.sender, roles["CAN_REVIEW"]) || msg.sender == admin) {
            if (comment == 1) {
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

    function addInfo(address fileAddress) isAcceptDecline {
        string memory message;
        if (msg.sender == admin) {
            hashValue.push(fileAddress);
            message = 'Info added';

        } else {
            message = 'Sorry, You are not authorized';

        }
        //       usersLog(msg.sender,'addInfo',block.timestamp);
    }
    //function revoke(string _message) {
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
        if (checkRole(msg.sender, roles["CAN_REVOKE"]) || msg.sender == admin) {
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

    function accept() isAcceptDecline {
        string memory message;
        if (checkRole(msg.sender, 'CAN_ACCEPT') || msg.sender == admin) {
            contractState = states["ACCEPT"];
            message = 'Contract in Accept state';
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

    function getUserAction(address userId) public returns(string action, string state, address parent) {
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
        return (finalStrAction, contractState, users[userId].parentId);
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