module.exports.compileSolidity = (function() {
    fs.readFile('./solidity/binaryContract.sol', 'utf8', function(err, solidityCode) {
        if (err) {
            console.log("error in reading file: ", err);
            return;
        } else {
            Logger.info("File Path: ", './solidity/binaryContract.sol');
            Logger.info(new Date());
            Logger.info("-----compling solidity code ----------");
            Logger.info(new Date());
            // var compiled = solc.compile(solidityCode, 1).contracts.DieselPrice;
            try {
                var compiled = solc.compile(solidityCode, 1).contracts.documentAccessMapping;
                solAbi = JSON.parse(compiled.interface);
                solBytecode = compiled.bytecode;
                Logger.info("-----complile complete ----------");
                Logger.info(new Date());
                fs.writeFile('./solidity/abi.json', compiled.interface, (err) => {
                    //Logger.info("err", err);
                    console.log("err", err);
                    if (!err) {
                        fs.writeFile('./solidity/bytecode.txt', solBytecode, (err) => {
                            console.log("err", err);
                        });
                    }
                });
            } catch (e) {
                if (e) {
                    // Logger.info(e);
                    // console.log("error:", e);
                }
            }
        }
    });
})();
