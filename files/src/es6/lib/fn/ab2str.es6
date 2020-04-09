//字符串与2进制转换


function ab2str (arraybuffer) {
	return String.fromCharCode.apply(
		null,
		new Uint16Array(arraybuffer)
	);
}

function str2ab (str) {
	// UTF-16 编码中，一个字符在内存中需要占用两个字节
	var arraybuffer = new ArrayBuffer(str.length * 2);
	var u16Arr = new Uint16Array(arraybuffer);
	var len = u16Arr.length;

	for (var i=0; i<len; i++) {
		u16Arr[i] = str.charCodeAt(i);
	}
	return u16Arr;
}

module.exports = {
	ab2str,
	str2ab
};