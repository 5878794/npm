



module.exports = function(fn){
	let url1 = window.location.href;
	url1 = url1.substr(url1.lastIndexOf('\/')+1);
	url1 = url1.split('.')[0];
	url1 = url1 || 'index';

	if(!window.appPage){window.appPage = {}}

	setTimeout(function(){
		window.appPage[url1] = fn;
	},10);

};