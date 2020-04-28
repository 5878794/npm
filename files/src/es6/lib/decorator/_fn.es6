



//判断是否是测试环境
let isTest = function(){
	// let setDebug = window.SETTING?.isDebug?? false;
	// if(!setDebug){return setDebug;}

	let url = window.location.host;
	return(
		url.indexOf('localhost') > -1 ||
		typeof url.substr(0,1) == 'number'
	)
};





export {isTest};