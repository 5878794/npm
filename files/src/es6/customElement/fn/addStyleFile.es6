


//文件路径默认到输出后的 trunk下的css文件中

module.exports = function(filePath){
	let style = document.createElement('link');
	style.rel = "stylesheet";
	style.href = filePath;
	return style;
};