const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
const contractLucha = new ethers.Contract(process.env.LUCHA_CONTRACT,  require('../abi/lucha')['luchaABI'], provider);

/*
    Luchadores class.
    Used to retrieve onchain data regarding Luchadores.io NFT
*/
class Luchadores {

    // Check if provided wallet is a Luchadores.io NFT owner
    static async isOwnerOfALuchador(address) {
        console.log('get Luchadores balance for wallet ' + address);
        try {
            let result = await contractLucha.functions.balanceOf(address);
            if (result[0].isZero()) {
                return false;
            } else {
                return true;
            }
        } catch (err) {
            throw new Error('Error during blockchain query : ' + err.message);
        } 
    }

}

module.exports = Luchadores;