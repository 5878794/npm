let device = require('../device');


//stamp2time和time2stamp   2个时间转换的毫秒数会被忽略。
let getDateTime = function(b){
	b = b || new Date().getTime();
	var a = new Date(parseInt(b));
	var year=a.getFullYear();
	var month=parseInt(a.getMonth())+1;
	month= (month<10)? "0"+month : month;
	var date=a.getDate();
	date= (date<10)? "0"+date : date;
	var hours=a.getHours();
	hours= (hours<10)? "0"+hours : hours;
	var minutes=a.getMinutes();
	minutes= (minutes<10)? "0"+minutes : minutes;
	var seconds=a.getSeconds();
	seconds= (seconds<10)? "0"+seconds : seconds;

	return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
};

let getDateTime1 = function(b){
	if(!b){
		return '时间待定';
	}
	// b = b || new Date().getTime();
	var a = new Date(parseInt(b));
	var year = a.getFullYear();
	var month = parseInt(a.getMonth()) + 1;
	month = (month < 10) ? "0" + month : month;
	var date = a.getDate();
	date = (date < 10) ? "0" + date : date;

	return year+"年"+month+"月"+date+"日";

};

let getDateTime2 = function(b){
	b = b || new Date().getTime();
	var a = new Date(parseInt(b));
	var year=a.getFullYear();
	var month=parseInt(a.getMonth())+1;
	month= (month<10)? "0"+month : month;
	var date=a.getDate();
	date= (date<10)? "0"+date : date;
	var hours=a.getHours();
	hours= (hours<10)? "0"+hours : hours;
	var minutes=a.getMinutes();
	minutes= (minutes<10)? "0"+minutes : minutes;
	var seconds=a.getSeconds();
	seconds= (seconds<10)? "0"+seconds : seconds;

	return year+"-"+month+"-"+date+" "+hours+":"+minutes;
};


//传入时间戳，输出日期部分
let getDate = function (b) {
	b = b || new Date().getTime();
	var a = new Date(parseInt(b));
	var year = a.getFullYear();
	var month = parseInt(a.getMonth()) + 1;
	month = (month < 10) ? "0" + month : month;
	var date = a.getDate();
	date = (date < 10) ? "0" + date : date;
	return year + "-" + month + "-" + date;
};
let getDate1 = function (b) {
	if(!b){
		return '';
	}
	// b = b || new Date().getTime();
	var a = new Date(b);
	var year = a.getFullYear();
	var month = parseInt(a.getMonth()) + 1;
	month = (month < 10) ? "0" + month : month;
	var date = a.getDate();
	date = (date < 10) ? "0" + date : date;
	return year + "-" + month + "-" + date;
};


//a :   2012-12-13   2012-12-12 12:12:33  自动补位
let getStamp = function(a){
	if(!a){
		return new Date().getTime();
	}


	var new_str = a.replace(/:/g,'-');
	new_str = new_str.replace(/ /g,'-');
	new_str = new_str.replace(/\//ig,'-');
	var arr = new_str.split("-");
	if(arr.length != 6){
		for(var i= 0,l=6-arr.length;i<l;i++){
			arr.push(0);
		}
	}

	return new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5])).getTime();
};


//a=20110104
let getStamp1 = function(a){
	if(!a){return new Date().getTime();}
	a = a.toString();
	let year = a.substr(0,4),
		month = a.substr(4,2),
		day = a.substr(6,2),
		date = year + '-' + month +'-'+day;

	if(device.isIpad || device.isIphone){
		date = date.replace(/\-/ig,'\/');
	}

	return new Date(date).getTime();
};


//倒计时用
//大于1天只返回天数
//小于1天 返回   时：分：秒
let getDataTime3 = function(stamp){
	let day = 86400000, //1000*60*60*24
		hour = 3600000, //1000*60*60
		minute = 60000; //1000*60

	//大于1天
	if(stamp > day){
		return parseInt(stamp/day);
	}

	let s,f,m;
	s = parseInt(stamp/hour);
	stamp = stamp - hour*s;
	f = parseInt(stamp/minute);
	stamp = stamp - minute*f;
	m = parseInt(stamp/1000);

	f = (f<10)? '0'+f : f;
	m = (m<10)? '0'+m : m;

	return s+':'+f+':'+m;
};


let getMonthMaxDay = function(month){
	//获取这个月的最大天数
	let day = 0;
	switch(month){
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			day = 31;
			break;
		case 4:
		case 6:
		case 9:
		case 11:
			day = 30;
			break;
		case 2:
			if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
				day = 29;
			}else{
				day = 28;
			}
			break;
		default:
			day = 31;
	}

	return day;
}

//获取当前月的起始日期
let getNowMonthDay = function(){
	let now = new Date(),
		year = now.getFullYear(),
		month = parseInt(now.getMonth()) + 1,
		maxDay = getMonthMaxDay(month);
	month = (month < 10) ? "0" + month : month;

	let s_day = year+'-'+month+'-01',
		e_day = year+'-'+month+'-'+maxDay;

	return [s_day,e_day];

}


module.exports = {getDateTime,getDateTime1,getDate1,getDateTime2,getDate,getStamp,getStamp1,getDataTime3,getNowMonthDay};