

let fs = require('fs'),
	path = require('path'),
	fn = require('./fn.es6');

//生出输出js文件地址
let verJsPath = '../trunk/res/js/ver.js';
verJsPath = path.join(__dirname,verJsPath);

//获取连接参数
var arguments = process.argv.splice(2);
arguments = arguments[0];

//生成js版本文件
var text = 'window.__ver__ = '+arguments+';';

fn.writeFile(verJsPath,text);

console.log('ver js ok=='+arguments);



