// lessc --modify-var="isWxApp=true"  ./src/less/index.less ./index.css

// lessc --functions --modify-var="isWxApp=false"   ./src/less/index.less ./index.css



let fs = require('fs'),
	path = require('path'),
	glob = require("glob"),
	less = require("less"),
	md5 = require('md5'),
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


let renderFn = function(){

	console.log('编译 less');
	console.log('------------------------------------------------------------------------');


	let entryFiles = glob.sync(lessDir+"*.less");
	let preveMd5 = null;
	console.log(`正在监听 ${lessDir}`);
	//fs.watch 监听的是文件夹
	fs.watch(lessDir,async (event,filename)=>{
		//判断是否是监听的文件,而不是临时生成的文件
		let thisFileName = path.join(lessDir,filename);
		if(entryFiles.indexOf(thisFileName) == -1){return;}

		//判断文件是否有变化
		let currentMd5 = md5(fs.readFileSync(thisFileName));
		if (currentMd5 == preveMd5) {
			return
		}
		preveMd5 = currentMd5;


		//处理文件
		let _filename = filename.split('.')[0],
			outPath = path.join(wxDir,_filename+'.css'),
			cmdText = 'lessc  --global-var="tt='+new Date().getTime()+'" '+thisFileName+' ' +outPath;
		await runExec(cmdText);

		//还原console.log字体颜色
		console.log("\x1b[0m",`${filename} 文件发生更新`);
		//设置字体颜色绿色
		console.log("\x1b[32m",'生成:'+outPath);
	})


};

//console.log 颜色参考------------------------

// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"
//
// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
//
// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"





// let renderFn = function(){
//
// 	console.log('编译 less');
// 	console.log('------------------------------------------------------------------------');
//
//
// 	let entryFiles = glob.sync(lessDir+"*.less");
//
// 	entryFiles.map(async filePath=>{
// 		let fileName = filePath.replace(lessDir,"").split('.')[0],
// 			outPath = path.join(wxDir,fileName+'.css'),
// 			//压缩css
// 			// cmdText = 'lessc -x '+filePath+' ' +outPath;
// 			//不压缩
// 			cmdText = ' watcher-lessc  -i '+filePath+' -o ' +outPath;
//
// 		console.log(cmdText)
// 		await runExec(cmdText);
//
// 		console.log('ok  ' +filePath);
// 	});
//
//
// };

renderFn();

