pragma solidity ^ 0.4.4;
library TestLib {
  struct Data {
    uint n;
    string finalStrAction;
    string[] value;
  }
  function Get(Data storage self) returns(uint) {
    return self.n;
  }
  function strConcatH(string _a, string _b, string _c) internal returns(string) {
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
  function getHash(Data storage self,uint fileIndex)  returns (bool hashComment) {

    string memory comma = ',';
    string memory delimeter= '|';
    self.finalStrAction = '';
  //  uint8 fileIndex = 3;
    if(fileIndex>0){
      self.finalStrAction=strConcatH(self.finalStrAction,self.value[0],comma);
    }
     uint   i=1;
    for ( i = 1; i <fileIndex; i++) {

        self.finalStrAction = strConcatH(self.finalStrAction,self.value[i], delimeter);
    }
  //  usersLog(msg.sender,msg.sender,finalStrAction,"getHash",now);

    return true;
  }
}
