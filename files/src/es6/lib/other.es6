
//中文排序
// 先中文在英文  zh-en
// 先英文在中文  en-zh

// let array = ['啊','啊额','啊人','啊的','a'],
// 	collator =new Intl.Collator('zh-en');
//
// array.sort(collator.compare);




//==================================================


//数组连接 生产新数组
//
// let a = [1,2,3],
// 	b = [4,5,6];
//
// let c = a.concat(b);        //[1,2,3,4,5,6]




//==================================================
//时间格式化
// weekday, year, month, day, hour, minute, second
// weekday, year, month, day
// year, month, day
// year, month
// month, day
// hour, minute, second
// hour, minute

// weekday
// The representation of the weekday. Possible values are "narrow", "short", "long".
// 	era
// The representation of the era. Possible values are "narrow", "short", "long".
// 	year
// The representation of the year. Possible values are "numeric", "2-digit".
// 	month
// The representation of the month. Possible values are "numeric", "2-digit", "narrow", "short", "long".
// 	day
// The representation of the day. Possible values are "numeric", "2-digit".
// 	hour
// The representation of the hour. Possible values are "numeric", "2-digit".
// 	minute
// The representation of the minute. Possible values are "numeric", "2-digit".
// 	second
// The representation of the second. Possible values are "numeric", "2-digit".
// 	timeZoneName
// The representation of the time zone name. Possible values are "short", "long".


//配置咯参数就会显示
// let options = {
// 	year: 'numeric', month: '2-digit', day: '2-digit',
// 	hour: '2-digit', minute: '2-digit', second: '2-digit',
// 	hour12: false
// 	// weekday:'long'
// };
// //zh / en 等  分隔符'/'
// console.log(new Intl.DateTimeFormat('zh', options).format(new Date()));
//



//==================================================
//数字格式化
// let number = 1234561.789;
// console.log(new Intl.NumberFormat('zh').format(number));

//货币格式化
// let number = 1234561.789;
// console.log(new Intl.NumberFormat('zh', { style: 'currency', currency: 'CNY'}).format(number));

//数字转中文  有逗号分割，不要自己 replace
// let number = 1234561.789;
// console.log(new Intl.NumberFormat('zh-u-nu-hanidec').format(number));
