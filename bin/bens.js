#!/usr/bin/env node

//当前运行的地址
var path = require("path"),
	runPath = process.cwd(),
	program = require('commander'),
	json = require("../package.json"),
	exec = require("../lib/exec"),
	isRun = false;


program
	.version(json.version);


program
	.command('install')
	.action(function () {
		isRun = true;
		var url = path.join(__dirname,"../files");


		var platform = process.platform.toString();
		if(platform.substring(0,3) == "win"){
		// ﻿xcopy aaa  c:\Users\bens\Desktop\bbb\ /E/Q/H/C/Y
			console.log("xcopy  "+url+" " + runPath+"\\ \/E\/Q\/H\/C\/Y")
			exec("xcopy  "+url+" " + runPath+"\\ \/E\/Q\/H\/C\/Y",function(){
				console.log("success");
			},function(rs){
				console.log("err");
				console.log(rs);
			});
		}else{
			exec("cp -r "+url+"\/ " + runPath,function(){
				console.log("success");
			},function(rs){
				console.log("err");
				console.log(rs);
			});
		}
	});



program
	.parse(process.argv);



if(!isRun){
	program.help();
}