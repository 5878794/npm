let path = require('path'),
	fn = require('./fn.es6'),
	files = require('./es6.es6');



// let typescriptFiles = files('ts');

let fileObj = {};


//包含文件列表 手动指定
// let thisFile = [];
// for(let [key,file] of Object.entries(typescriptFiles)){
// 	thisFile.push(file);
// }
// fileObj.files = thisFile;





// 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
fileObj.include = ["src/**/*"];
// 指定一个排除列表（include的反向操作）
fileObj.exclude = [];

fileObj.compilerOptions = {
	lib:["es5","es2015","es2016","es2017","es2018","dom"],       //引入库定义文件
	module: "es2015",     //指定模块生成方式，["commonjs", "amd", "umd", "system", "es6", "es2015", "esnext", "none"]
	allowJs:true,           //编译时，允许有 js 文件
	alwaysStrict:true,      //严格模式，为每个文件添加 "use strict"
	charset:'utf8',         //输入文件的编码类型
	checkJs:true,           //验证 js 文件，与 allowJs 一同使用
	// isolatedModules:true,   //将每个文件作为单独的模块
	listFiles:true,         //显示编译输出文件名
	noImplicitAny:true,     //不允许隐式 any，如果true，函数的形参必须带类型，如果叫不出class名的js对象，那就得any，比如（d:any）=>{}  如果false，函数的样子更像js  （d）=>{}
	outDir:'',              //定义输出文件的文件夹
	removeComments:true,    //去除注释
	sourceMap: true,
	target:'es5',           //输出代码 ES 版本，可以是 ["es3", "es5", "es2015", "es2016", "es2017", "esnext"]
	preserveConstEnums: true //不去除枚举声明
};


let outPath = path.join(__dirname,'../tsconfig.json');
fn.writeFile(outPath,JSON.stringify(fileObj));
