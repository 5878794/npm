




//窗口隐藏后显示时执行
//DEVICE.windowShowRun(function(){
//    console.log(123)
//});


var isHiddened = false,
	fn = function(){};
document.addEventListener('visibilitychange', function(e) {
	if(document.hidden){
		isHiddened = true;
	}else{
		if(isHiddened){
			fn();
		}
	}
}, false);


let windowShowRun = function(callback){
	fn = callback || function(){};
};


module.exports = windowShowRun;


//判断当前窗口是否被隐藏  （最小化，切换tab会触发）

//document.addEventListener('visibilitychange', function(e) {
//    console.log('hidden:' + document.hidden,
//        'state:' + document.visibilityState)
//
//
//      //document.hidden               隐藏：true   显示：false
//      //document.visibilityState      隐藏：hidden  显示：visible
//
//}, false);