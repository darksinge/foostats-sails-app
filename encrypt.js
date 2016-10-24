var utf8 = require('utf8');
var AES = require('aes');
var aesjs = require('aes-js');
module.exports = {

	decode: function(text) {

		var key = aesjs.util.convertStringToBytes('535207BDD2F786DF5819921BB5ADBDC8');
		var aes = new AES(key);
		return aes.decrypt(text);		
	}
}
