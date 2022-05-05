let constractLucha, db;

module.exports = (_contractLucha, _db) => {
    constractLucha = _contractLucha;
    db = _db;
    return Luchadores 
}

let Luchadores = class {

    static async isOwnerOfALuchador(address) {
        console.log('get Luchadores balance for wallet ' + address);
        try {
            let result = await constractLucha.functions.balanceOf(address);
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