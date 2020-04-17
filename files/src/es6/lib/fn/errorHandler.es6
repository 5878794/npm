

require('../jq/extend');
let md5 = require('./md5');


var serverUrl = SETTING.jsErrorReportUrl;
var send = function(msg){
	if(!serverUrl){return;}


	//判断是否已提交过该问题,信息通过md5后对比
	let text = md5(msg),
		localData = window.localStorage.getItem('localData') || '[]';
	localData = JSON.parse(localData);

	if(localData.indexOf(text) > -1){
		return;
	}
	localData.push(text);
	window.localStorage.setItem('localData',JSON.stringify(localData));


	//增加时间戳
	msg = JSON.parse(msg);
	msg.time = new Date().getTime();
	msg = JSON.stringify(msg);


	//数据提交
	var xhr = new XMLHttpRequest();
	var formData = new FormData();
	formData.append('msg', msg);

	xhr.open('POST', serverUrl);
	xhr.send(formData);

	xhr.onreadystatechange = function(){
		if ( xhr.readyState == 4 && xhr.status == 200 ) {
			console.log('error report send ok')
		} else {
			console.log('error report send fail')
		}
	};

};





//程序代码错误
//由于有 then.catch  预计只有事件执行过程报错会进入这里
window.onerror = function (msg, url, row, col, error) {
	let info = error.stack,
		path = window.location.href,
		fileName = error.filename,
		msgText = error.message,
		lineNumber = error.lineNumber;

	let obj = {
		info:info,
		msgText:msgText,
		ver:window.__ver__,
		page:path,
		fileName:fileName,
		msg:msg,
		lineNumber:lineNumber
	};

	setTimeout(function(){
		send(JSON.stringify(obj));
	},100);
	// console.log(error.stack);
	// console.log(typeof error.stack)
	return false;
};



module.exports = {
	error(e){
		if(typeof e == 'string'){
			return;
		}
		let info = e.stack,
			url = window.location.href,
			fileName = e.filename,
			msg = e.message,
			lineNumber = e.lineNumber;

		let obj = {
			info:info,
			ver:window.__ver__,
			page:url,
			fileName:fileName,
			msg:msg,
			lineNumber:lineNumber
		};

		setTimeout(function(){
			send(JSON.stringify(obj));
		},100)

	},
	ajaxError(type,url,data,e){
		//返回200时  e=msg
		//非200      e=obj
		let state = e.status,
			msg = e.responseText;


		let obj = {
			state:state,
			ver:window.__ver__,
			api:url,
			msg:msg,
			type:type,
			data:data
		};

		setTimeout(function(){
			send(JSON.stringify(obj));
		},100);

	}
};
