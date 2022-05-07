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

    // check if provided wallet is owner of provided nft id
    static async isOwnerOf(address, id) {
        console.log('Check if ' + address + ' is owner of ' + id);
        try {
            let result = await contractLucha.functions.ownerOf(id);
            console.log(result[0]);
            if (result != undefined && result[0].toLowerCase() == address.toLowerCase()) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw new Error('Error during blockchain query : ' + err.message);
        } 
    }

    // Get SVG
    static async getImageData(id) {
        console.log('Get image data for Luchador#' + id);
        try {
            let result = await contractLucha.functions.imageData(id);
            return result[0];
        } catch (err) {
            throw new Error('Error during blockchain query : ' + err.message);
        } 
    }

}

module.exports = Luchadores;