



module.exports = function(text){
	let style = document.createElement('style');
	style.innerHTML = text;

	return style;
}