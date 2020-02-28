const ethers = require("ethers")
const { expect, use } = require("chai")
const { createMockProvider, getWallets, solidity, deployContract } = require("ethereum-waffle");
const { bigNumberify, parseEther, hexlify, formatEther } = require("ethers/utils");

const IERC20_INTERFACE = require("openzeppelin-solidity/build/contracts/IERC20");

// For: geth

// const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_URL);
// const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, "m/44'/60'/0'/0/1").connect(provider);
// const exitWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, "m/44'/60'/0'/0/2").connect(provider);

// For: ganache

const provider = createMockProvider() //{gasLimit: 7000000, gasPrice: 2000000000});
const [wallet, exitWallet]  = getWallets(provider);

use(solidity);

async function deployTestContract(file) {
    try {
        return await deployContract(wallet, require(file), [], {
            gasLimit: 6000000,
        })
    } catch (err) {
        console.log('Error deploying', file, ': ', err)
    }
}

async function getCallRevertReason(f) {
    let revertReason = "VM did not revert"
    let result;
    try {
        result = await f();
    } catch(e) {
        revertReason = (e.reason && e.reason[0]) || e.results[e.hashes[0]].reason
    } 
    return {revertReason, result};
}

module.exports = {
    provider,
    wallet,
    exitWallet,
    deployTestContract,
    getCallRevertReason,
    IERC20_INTERFACE
}