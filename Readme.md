#Created by Kuldeep Aggarwal
#Oodles Technologies
#For any help please mail to : kuldeep.aggarwal@oodlestechnologies.com

# README #

Setup Steps :
# first Install ethereum node on your system using following commands #
  Use below commands for linux:-
  -----------------------------------------------------------------------
	- sudo apt-get install software-properties-common
	- sudo add-apt-repository -y ppa:ethereum/ethereum
	- sudo apt-get update
	- sudo apt-get install ethereum
    reference:https://www.ethereum.org/cli
  -----------------------------------------------------------------------
# If etherum node sucessfully Installed , the run below command to download the blockchain
  -----------------------------------------------------------------------
  - geth help                                         // To make sure it works
  - geth --testnet --datadir ~/.ethereum-testnet      //.ethereum-testnet is separate dir
  -----------------------------------------------------------------------

# Now run these commands & you are good to proceed further
-  run command - npm install
-  using nodemon: sudo NODE_ENV=development nodemon --exec "node app.js"
