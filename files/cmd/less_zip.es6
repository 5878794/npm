// lessc --modify-var="isWxApp=true"  ./src/less/index.less ./index.css

// lessc --functions --modify-var="isWxApp=false"   ./src/less/index.less ./index.css



let fs = require('fs'),
	path = require('path'),
	glob = require("glob"),
	less = require("less"),
	exec = require('child_process').exec;



let lessDir = path.join(__dirname,'../src/less/'),
	wxDir = path.join(__dirname,'../trunk/css/');


let runExec = function(cmdText){
	return new Promise(success=>{
		exec(cmdText,function(err,stdout,stderr){
			if(err) {
				console.log(err.toString())
			} else {
				success();
			}
		})
	})
};


let renderFn = function(tt){

	console.log('编译 less');
	console.log('------------------------------------------------------------------------');


	let entryFiles = glob.sync(lessDir+"*.less");

	entryFiles.map(async filePath=>{
		let fileName = filePath.replace(lessDir,"").split('.')[0],
			outPath = path.join(wxDir,fileName+'.css'),
			//压缩css
			// cmdText = 'lessc -x '+filePath+' ' +outPath;
			//不压缩
			cmdText = 'lessc -x  --global-var="tt='+tt+'" '+filePath+' ' +outPath;

		await runExec(cmdText);

		console.log('ok  ' +filePath);
	});


};



//获取连接参数
var arguments = process.argv.splice(2);
arguments = arguments[0];
renderFn(arguments);

