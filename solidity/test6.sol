
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
  

    function documentAccessMapping() {
        admin = msg.sender;
        contractCreationTime=block.timestamp;

    }





}
