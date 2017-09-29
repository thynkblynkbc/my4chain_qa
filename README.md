# my4chain
A blockchain project

Install below dependcies on system :

1. Install Java required for activeMQ [ Command - sudo apt-get install default-jre ]

2. Install postgres database [ Command - sudo apt-get install postgresql postgresql-contrib ]
  postgres version on production server v9.5.8

3. Download go-ethereum-v1.5.9 and make build from downloaded repository [ Url - https://geth.ethereum.org/downloads/ depending on system os ]. You can change the difficulty or keep dificulty constant. We have kept difficulty constant as 0x10

4. Download apache activeMQ v5.14.5 [ Url - http://activemq.apache.org/ ]

5. Install pm2 to run the application [ Command - sudo npm install -g pm2 ]

6. Install node

  node version on all environments (dev/prod/qa) server - node v4.2.6
  npm version on all environments (dev/prod/qa) server - npm v3.5.2
