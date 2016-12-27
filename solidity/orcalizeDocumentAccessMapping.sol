pragma solidity ^ 0.4.4;
// <ORACLIZE_API>
/*
Copyright (c) 2015-2016 Oraclize SRL
Copyright (c) 2016 Oraclize LTD



Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:



The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.



THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

//pragma solidity ^0.4.4;//please import oraclizeAPI_pre0.4.sol when solidity < 0.4.0

contract OraclizeI {
    address public cbAddress;
    function query(uint _timestamp, string _datasource, string _arg) payable returns (bytes32 _id);
    function query_withGasLimit(uint _timestamp, string _datasource, string _arg, uint _gaslimit) payable returns (bytes32 _id);
    function query2(uint _timestamp, string _datasource, string _arg1, string _arg2) payable returns (bytes32 _id);
    function query2_withGasLimit(uint _timestamp, string _datasource, string _arg1, string _arg2, uint _gaslimit) payable returns (bytes32 _id);
    function getPrice(string _datasource) returns (uint _dsprice);
    function getPrice(string _datasource, uint gaslimit) returns (uint _dsprice);
    function useCoupon(string _coupon);
    function setProofType(byte _proofType);
    function setCustomGasPrice(uint _gasPrice);
}
contract OraclizeAddrResolverI {
    function getAddress() returns (address _addr);
}
contract usingOraclize {
    uint constant day = 60*60*24;
    uint constant week = 60*60*24*7;
    uint constant month = 60*60*24*30;
    byte constant proofType_NONE = 0x00;
    byte constant proofType_TLSNotary = 0x10;
    byte constant proofStorage_IPFS = 0x01;
    uint8 constant networkID_auto = 0;
    uint8 constant networkID_mainnet = 1;
    uint8 constant networkID_testnet = 2;
    uint8 constant networkID_morden = 2;
    uint8 constant networkID_consensys = 161;

    OraclizeAddrResolverI OAR;

    OraclizeI oraclize;
    modifier oraclizeAPI {
        if(address(OAR)==0) oraclize_setNetwork(networkID_auto);
        oraclize = OraclizeI(OAR.getAddress());
        _;
    }
    modifier coupon(string code){
        oraclize = OraclizeI(OAR.getAddress());
        oraclize.useCoupon(code);
        _;
    }

    function oraclize_setNetwork(uint8 networkID) internal returns(bool){
        if (getCodeSize(0x1d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed)>0){ //mainnet
            OAR = OraclizeAddrResolverI(0x1d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed);
            return true;
        }
        if (getCodeSize(0xc03a2615d5efaf5f49f60b7bb6583eaec212fdf1)>0){ //ropsten testnet
            OAR = OraclizeAddrResolverI(0xc03a2615d5efaf5f49f60b7bb6583eaec212fdf1);
            return true;
        }
        if (getCodeSize(0x51efaf4c8b3c9afbd5ab9f4bbc82784ab6ef8faa)>0){ //browser-solidity
            OAR = OraclizeAddrResolverI(0x51efaf4c8b3c9afbd5ab9f4bbc82784ab6ef8faa);
            return true;
        }
        return false;
    }

    function oraclize_query(string datasource, string arg) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource);
        if (price > 1 ether + tx.gasprice*200000) return 0; // unexpectedly high price
        return oraclize.query.value(price)(0, datasource, arg);
    }
    function oraclize_query(uint timestamp, string datasource, string arg) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource);
        if (price > 1 ether + tx.gasprice*200000) return 0; // unexpectedly high price
        return oraclize.query.value(price)(timestamp, datasource, arg);
    }
    function oraclize_query(uint timestamp, string datasource, string arg, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource, gaslimit);
        if (price > 1 ether + tx.gasprice*gaslimit) return 0; // unexpectedly high price
        return oraclize.query_withGasLimit.value(price)(timestamp, datasource, arg, gaslimit);
    }
    function oraclize_query(string datasource, string arg, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource, gaslimit);
        if (price > 1 ether + tx.gasprice*gaslimit) return 0; // unexpectedly high price
        return oraclize.query_withGasLimit.value(price)(0, datasource, arg, gaslimit);
    }
    function oraclize_query(string datasource, string arg1, string arg2) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource);
        if (price > 1 ether + tx.gasprice*200000) return 0; // unexpectedly high price
        return oraclize.query2.value(price)(0, datasource, arg1, arg2);
    }
    function oraclize_query(uint timestamp, string datasource, string arg1, string arg2) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource);
        if (price > 1 ether + tx.gasprice*200000) return 0; // unexpectedly high price
        return oraclize.query2.value(price)(timestamp, datasource, arg1, arg2);
    }
    function oraclize_query(uint timestamp, string datasource, string arg1, string arg2, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource, gaslimit);
        if (price > 1 ether + tx.gasprice*gaslimit) return 0; // unexpectedly high price
        return oraclize.query2_withGasLimit.value(price)(timestamp, datasource, arg1, arg2, gaslimit);
    }
    function oraclize_query(string datasource, string arg1, string arg2, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource, gaslimit);
        if (price > 1 ether + tx.gasprice*gaslimit) return 0; // unexpectedly high price
        return oraclize.query2_withGasLimit.value(price)(0, datasource, arg1, arg2, gaslimit);
    }
    function oraclize_cbAddress() oraclizeAPI internal returns (address){
        return oraclize.cbAddress();
    }
    function oraclize_setProof(byte proofP) oraclizeAPI internal {
        return oraclize.setProofType(proofP);
    }
    function oraclize_setCustomGasPrice(uint gasPrice) oraclizeAPI internal {
        return oraclize.setCustomGasPrice(gasPrice);
    }
    function oraclize_setConfig(bytes config) oraclizeAPI internal {
        //return oraclize.setConfig(config);
    }

    function getCodeSize(address _addr) constant internal returns(uint _size) {
        assembly {
            _size := extcodesize(_addr)
        }
    }


    function parseAddr(string _a) internal returns (address){
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i=2; i<2+2*20; i+=2){
            iaddr *= 256;
            b1 = uint160(tmp[i]);
            b2 = uint160(tmp[i+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            iaddr += (b1*16+b2);
        }
        return address(iaddr);
    }


    function strCompare(string _a, string _b) internal returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
   }

    function indexOf(string _haystack, string _needle) internal returns (int)
    {
        bytes memory h = bytes(_haystack);
        bytes memory n = bytes(_needle);
        if(h.length < 1 || n.length < 1 || (n.length > h.length))
            return -1;
        else if(h.length > (2**128 -1))
            return -1;
        else
        {
            uint subindex = 0;
            for (uint i = 0; i < h.length; i ++)
            {
                if (h[i] == n[0])
                {
                    subindex = 1;
                    while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex])
                    {
                        subindex++;
                    }
                    if(subindex == n.length)
                        return int(i);
                }
            }
            return -1;
        }
    }

    function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string _a, string _b, string _c) internal returns (string) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string _a, string _b) internal returns (string) {
        return strConcat(_a, _b, "", "", "");
    }

    // parseInt
    function parseInt(string _a) internal returns (uint) {
        return parseInt(_a, 0);
    }

    // parseInt(parseFloat*10^_b)
    function parseInt(string _a, uint _b) internal returns (uint) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i=0; i<bresult.length; i++){
            if ((bresult[i] >= 48)&&(bresult[i] <= 57)){
                if (decimals){
                   if (_b == 0) break;
                    else _b--;
                }
                mint *= 10;
                mint += uint(bresult[i]) - 48;
            } else if (bresult[i] == 46) decimals = true;
        }
        if (_b > 0) mint *= 10**_b;
        return mint;
    }

    function uint2str(uint i) internal returns (string){
        if (i == 0) return "0";
        uint j = i;
        uint len;
        while (j != 0){
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (i != 0){
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }
        return string(bstr);
    }



}
// </ORACLIZE_API>
contract documentAccessMapping is usingOraclize {

    struct User {
        address parentId;
        string[] actions;
    }
    mapping(string => string) roles;
    mapping(address => User) public users;
    mapping(string => string) states;

    address public admin;
    string hashValue;

    string contractState;
    uint contractCreationTime;

    event GetValue(address str, uint add, string from);
    event usersLog(address indexed _from, address indexed _to, string _message, string _methodName, uint _callTime);



    function documentAccessMapping() payable {
        admin = msg.sender;
        contractCreationTime = block.timestamp;
        createRoles();
        allStates();
        OAR = OraclizeAddrResolverI(0x8e01836791039feaa0150a6379989a9b4af9a45d);
    }
    function __callback(bytes32 myid, string result) {
        // if (msg.sender != oraclize_cbAddress()) throw;
        // newDieselPrice(result);
        // DieselPriceUSD = parseInt(result, 2); // let's save it as $ cents
        // do something with the USD Diesel price
    }

    function update() payable {
       // newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("URL", "http://52.201.170.138/slideshow/?channel=Testing");
    }
    function getEther() payable {
      usersLog(msg.sender,this,"ether get","getEther",now);
    }
    modifier isAcceptDecline {
        if (stringsEqual(contractState,states["ACCEPT"]) || stringsEqual(contractState,states["DECLINE"]) ){
          usersLog(msg.sender,msg.sender,"State Cannot be change","isAcceptDecline",now);
          throw;
        }

        _;

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

    function addFileHash(string encryptedFileHash) isAcceptDecline {
        string memory message;
        if (msg.sender == admin) {
            hashValue=encryptedFileHash;
            message = 'file Hash added';
        } else {
            message = 'Sorry, You are not authorized';
        }
        usersLog(msg.sender,msg.sender,message,'addFileHash',now);
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
