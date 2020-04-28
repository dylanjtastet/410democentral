export const hashProgCode = code => {
	if (code instanceof String) return strHash(code);
	if (code instanceof Array) {
		// Simple XOR composite hash
		return code.map(ci => strHash(ci)).reduce((x, y) => x ^ y);
	}
}

export const strHash = str => {
    let hash = 0, i;
    for (i = 0; i < str.length; i++) {
    	let chr = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
    }
    return hash;
}