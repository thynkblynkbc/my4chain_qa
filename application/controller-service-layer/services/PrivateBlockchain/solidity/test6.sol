
contract documentAccessMapping {
    address admin;
    address[] hashValue;
    string contractState;
    string userMessage;
    uint contractCreationTime;
    struct User{
        address parentId;
        string[] actions;
    }
    string message;
    mapping(string => string) roles;
    mapping(address => User)  users;
    mapping(string => string) states;
    string[] _blankArray;
    event getname(string str);
  //  event usersLog(address _from,string _methodName, uint _callTime);
    function allStates() internal{
        states["ACK"]="ACK";
        states["REVIEW"]="REVIEW";
        states["MODIFY"]="MODIFY";
        states["ACCEPT"]="ACCEPT";
        states["DECLINE"]="DECLINE";
        states["REVOKE"]="REVOKE";
    }
    function createRoles() internal{
        roles["CAN_ASSIGN"]="CAN_ASSIGN";
        roles["CAN_REVOKE"]="CAN_REVOKE";
        roles["CAN_ACCEPT"]="CAN_ACCEPT";
        roles["CAN_DECLINE"]="CAN_DECLINE";
        roles["CAN_REVIEW"]="CAN_REVIEW";
        roles["CAN_ACK"]="CAN_ACK";
    }

    function documentAccessMapping() {
        admin = msg.sender;
        contractCreationTime=block.timestamp;
        createRoles();
        allStates();
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
        string[] actionArr = users[id].actions;
        bool isAction = false;
        for (uint i = 0; i < actionArr.length; i++) {
            if (stringsEqual(actionArr[i], argAction)) {
                isAction = true;
                break;
            }
        }
        return isAction;
    }
    function acknowledge() {
         if(msg.sender==admin || checkRole(msg.sender,'CAN_ACK')){
             contractState=states["ACK"];
         }
    }

 function assignAction(address userId, string argAction) returns (string str){
    //   bool rolesB= checkRole(msg.sender,roles["CAN_ACCEPT"]);
    if (true ) {
          if (users[userId].actions.length > 0) {
              if (checkRole(userId,argAction)) {
                //  message='Action Already Added';
                  return('Action Already Added');
              } else {
                    // to do check in parent id , parent can only add action
                    if(stringsEqual(roles[argAction], argAction) && users[userId].parentId == msg.sender){
                          users[userId].actions.push(argAction);
                      //    message='Action Added';
                            return('Action Added');
                    }
                    else
                    {
                          return('This action can not be add');
                    }
              }
          } else {

            if(stringsEqual(roles[argAction], argAction)){
              users[userId].parentId=msg.sender;
              users[userId].actions.push(argAction);

          //    return('New user added');
            }else{
               return('This action can not be add');
            }
          }
      } else {
          return('Sorry, You are not authorized');
        }

    }
    function removeAction(address userId, string argAction) {
         string[] actionArr=_blankArray;
         string memory message;
         if (msg.sender == admin || msg.sender==users[userId].parentId) {
             bool isAction = false;
             uint index;
             actionArr = users[userId].actions;
             for (uint i = 0; i < actionArr.length; i++) {
                 if (stringsEqual(actionArr[i], argAction)) {
                     index = i;
                     isAction = true;
                     break;
                 }
             }
             if (isAction) {
                 while (index < actionArr.length - 1) {
                     actionArr[index] = actionArr[index + 1];
                     index++;
                 }
                 delete actionArr[index];
                 actionArr.length--;
                 users[userId].actions = actionArr;
                 message='Action removed';
              } else {
                   message='Action does not exist';
                }
         } else {
              message='Sorry, You are not authorized';

       }
    //   usersLog(msg.sender,'removeAction',block.timestamp);
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

    function getUserAction(address userId) public  returns(string action, string state,address parent,bool role) {
        string[] actionArr = users[userId].actions;
        string memory finalStrAction;
        string memory comma = ',';
        if (actionArr.length > 0) {
            finalStrAction = actionArr[0];
        }
        for (uint i = 1; i < users[userId].actions.length; i++) {
            finalStrAction = strConcat(finalStrAction, comma, actionArr[i]);
        }
        return (finalStrAction , contractState, users[userId].parentId,checkRole(userId,'CAN_ASSIGN'));
    }
    function expire() returns (bool isExpire) {
         if(block.timestamp<=contractCreationTime+300){
           return (false);
         }
         else{
           return (true);
         }
    }

}
