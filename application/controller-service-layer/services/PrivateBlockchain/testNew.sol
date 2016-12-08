pragma solidity ^0.4.4;
contract documentAccessMapping {
    address public admin;
    struct User{
      address parentId;
      string[] actions;
    }
    string contractState;
    address[] hashValue;
    event GetValue(address str,uint add,string from);
    mapping(string => string) roles;
    mapping(address => User) public users;
      mapping(string => string) states;

    function documentAccessMapping() {
        admin = msg.sender;
        createRoles();
    }
    function createRoles() internal{
        roles["CAN_ASSIGN"]="CAN_ASSIGN";
        roles["CAN_REVOKE"]="CAN_REVOKE";
        roles["CAN_ACCEPT"]="CAN_ACCEPT";
        roles["CAN_DECLINE"]="CAN_DECLINE";
        roles["CAN_REVIEW"]="CAN_REVIEW";
        roles["CAN_ACK"]="CAN_ACK";
    }
     function allStates() internal{
         states["ACK"]="ACK";
         states["REVIEW"]="REVIEW";
         states["MODIFY"]="MODIFY";
         states["ACCEPT"]="ACCEPT";
         states["DECLINE"]="DECLINE";
         states["REVOKE"]="REVOKE";
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
    function checkRole(address id,string argAction) internal returns(bool){
        string[] actionArr = users[id].actions;//.actions;
        bool isAction = false;
        for (uint i = 0; i < actionArr.length; i++) {
            if (stringsEqual(actionArr[i], argAction)) {
                isAction = true;
                break;
            }
        }
        return isAction;
    }
function assignAction(address userId, string argAction) public  returns(string) {
        if (checkRole(msg.sender,roles["CAN_ASSIGN"]) || msg.sender == admin) { //1
            if (users[userId].actions.length > 0) {//2
             if (checkRole(userId,roles[argAction])) { //3
                  GetValue(userId,users[userId].actions.length,"Action Already Added");
                  return 'Action Already Added';
              } //3
              else {
                    if(stringsEqual(roles[argAction], argAction)){ //4
                      if(msg.sender==users[userId].parentId){
                        if(checkRole(users[userId].parentId, roles[argAction]) || msg.sender == admin){
                            users[userId].actions.push(argAction);
                            GetValue(userId,users[userId].actions.length,"Action Added");
                            return 'Action Added';
                        }else{
                            GetValue(userId,users[userId].actions.length,"Parent have not this action to add");
                            return 'Parent have not this action to add';
                        }
                      }else{
                            GetValue(userId,users[userId].actions.length,"Parent or admin is wrong");
                            return 'Parent or admin is wrong';
                        }
                    } //4
                    else{
                      GetValue(userId,users[userId].actions.length,"Action does not exist, not added");
                      return 'Action does not exist, not added';
                    }
                }
              }//2
              else {
                  if(stringsEqual(roles[argAction], argAction)){
                    /*if(checkRole(msg.sender, roles[argAction]) || msg.sender==admin){*/
                        users[userId].actions.push(argAction);
                        users[userId].parentId=msg.sender;
                       GetValue(userId,users[userId].actions.length,"New User Added");
                        return "New User Added";
                    /*}
                    else
                    {
                        GetValue(userId,users[userId].actions.length,"New, Parent have not this action");
                        return "New, Parent have not this action";

                    /*}*/
                  }
                  else
                  {
                    GetValue(userId,users[userId].actions.length,"Enter right action, can not be add");
                    return "Enter right action, can not be add";
                  }
            }
        } //1
        else {
            GetValue(userId,users[userId].actions.length,"Not authorized");
            return 'Sorry, You are not authorized';
        }

    }

    function removeAction(address userId, string argAction) {

         string memory message;
         if (msg.sender == admin || msg.sender==users[userId].parentId) {
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

                 message='Action removed';
              } else {
                  message='Action does not exist';
                }
         } else {
              message='Sorry, You are not authorized';

      }

    }

    function review(uint comment) {
            string memory message;
         if (checkRole(msg.sender,'CAN_REVIEW') || msg.sender == admin) {
             if(comment == 1){
                 contractState=states["MODIFY"];
                 message='Contract in Modify state';
             }
             else{
                 contractState=states["REVIEW"];
             message='Contract in Review state';
          }
         } else {
                message='Sorry, You are not authorized';
          }
  //         usersLog(msg.sender,'review',block.timestamp);
    }

    function addInfo(address fileAddress) {
        string memory message;
         if (msg.sender == admin) {
             hashValue.push(fileAddress);
             message='Info added';

         } else {
          message='Sorry, You are not authorized';

      }
//       usersLog(msg.sender,'addInfo',block.timestamp);
    }

    function revoke(address userId,string _message){
        string memory message;
         if ((checkRole(users[msg.sender].parentId,'CAN_REVOKE') && users[userId].parentId == msg.sender) || admin == msg.sender ) {
              if(stringsEqual(contractState, 'ACCEPT')){
                  //message=_message;
              }else
              {
                  message='User removed successfully';
              }
              delete users[userId];
            } else {
             message='Sorry, You are not authorized';
          }
      //  usersLog(msg.sender,'revoke',block.timestamp);
    }
    function decline(){
          string memory message;
         if (checkRole(msg.sender,'CAN_DECLINE') || msg.sender == admin) {
             contractState=states["DECLINE"];
             message='Contract in Decline state';
         } else {
             message='Sorry, You are not authorized';
         }
//         usersLog(msg.sender,'decline',block.timestamp);
    }
    function accept(){
        string memory message;
         if (checkRole(msg.sender,'CAN_ACCEPT') || msg.sender == admin) {
             contractState=states["ACCEPT"];
             message='Contract in Accept state';
         } else {
              message='Sorry, You are not authorized';
         }
    //     usersLog(msg.sender,'accept',block.timestamp);
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

    function getUserAction(address userId) public  returns(string action, string state,address parent) {
        string[] actionArray = users[userId].actions;
        string memory finalStrAction;
        string memory comma = ',';
        if (actionArray.length > 0) {
            finalStrAction = actionArray[0];
        }
        for (uint i = 1; i < actionArray.length; i++) {
            finalStrAction = strConcat(finalStrAction, comma, actionArray[i]);
        }
        return (finalStrAction , contractState,users[userId].parentId);
    }
}
