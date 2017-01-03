pragma solidity ^ 0.4.4;
contract publicTransaction {
  string record;

  function publicTransaction(string transactionData) payable {
      record=transactionData;
  }
  function setData(string transactionData){
      record=transactionData;
  }
  function getData() public returns(string data) {
      return (record);
  }

}
