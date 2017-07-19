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

		exec("cp -r "+url+"\/ " + runPath,function(){
			console.log("success");
		},function(rs){console.log(rs)});
	});



program
	.parse(process.argv);



if(!isRun){
	program.help();
}