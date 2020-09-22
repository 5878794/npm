//手机不支持

//文件转base64
//input读取文件对象，然后创建 FileReader 对象。 再然后 readAsDataURL
//var fileInput = document.querySelector('#fileInput');
//         fileInput.onchange = function () {
//             var file = this.files[0];
//             var reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = function () {
//                 var data = reader.result;
//                 console.log('data', data);
//             };
//         };


//base64转blob对象
let fromBase64 = function(base64){
	var arr = base64.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new Blob([u8arr], {type:mime});
};

//blob对象转uri 访问显示
let toURI = function(blob){
	return window.URL.createObjectURL(blob);
};


//text转blob对象
let fromText = function(text){
	return new Blob([text]);

};


//在新窗口打开blob文件
let openInNewWindow = function(blob){
	var src= toURI(blob);
	window.open(src);
};


module.exports = {fromBase64,toURI,fromText,openInNewWindow};