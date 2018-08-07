// hexutils.js - Helper functions for hex string to ascii string conversion

export function decodeFromHex(hex) {
	if (!hex || hex.length < 4 || hex[0] != "0" || hex[1] != "x" || hex.length % 2 != 0) {
		console.log(`Invalid hex string: ${hex}`);
		return "";
	} else {
		let result = "";

		for (let i = 2; i<hex.length; i+=2) {
			let n = parseInt(hex.slice(i, i+2), 16);
			result += String.fromCharCode(n);
		}

		try {
			return JSON.parse(result);
		} catch (e) {
			return "Error: message could not be decrypted";
		}
	}
}

export function encodeToHex(string) {
	let hexEncodedMessage = "0x";

	try {
		

		for (let i =0; i<string.length; i++){
			hexEncodedMessage += string[i].charCodeAt(0).toString(16);
		}

		// for (let c of string) {
		// 	console.log('string', c);
			
		// }
	} catch(e) {
		console.log("catch", e);
	}
	console.log(hexEncodedMessage);
	return hexEncodedMessage;
}

