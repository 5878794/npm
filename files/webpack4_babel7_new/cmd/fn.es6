let fs = require('fs'),
	pug = require('pug'),
	path = require('path'),
	exec = require('child_process').execSync;


module.exports = {
	runExec(cmdText){
		exec(cmdText);
	},
	readFile(filePath){
		return fs.readFileSync(filePath,'utf-8');
	},
	writeFile(filePath,text){
		fs.writeFileSync(filePath,text);
	},
	readLessFileAndCompile(filePath,tt){
		let cmd = 'lessc --plugin=less-plugin-clean-css  --global-var="tt='+tt+'" '+filePath,
			text = exec(cmd);
		text = text.toString();
		return text;
	},
	readPugFileAndCompile(filePath,tt){
		return pug.renderFile(
			filePath,
			{
				pretty:false,	//压缩代码
				tt:tt			//传入的参数
			}
		);
	},
	dirIsExistOrCreate(filePath){
		if(!fs.existsSync(filePath)){
			fs.mkdirSync(filePath, '0777');
		}
	},
	//递归获取文件夹中所有文件
	getDirFile(dirPath,fileType){
		function readFileList(dir, filesList = []) {
			const files = fs.readdirSync(dir);
			files.forEach((item, index) => {
				var fullPath = path.join(dir, item);
				const stat = fs.statSync(fullPath);
				if (stat.isDirectory()) {
					readFileList(path.join(dir, item), filesList);  //递归读取文件
				} else {
					let type = fullPath.split('.');
					type = type[type.length-1];
					if(type == fileType){
						filesList.push(fullPath);
					}
				}
			});
		}

		var filesList = [];
		readFileList(dirPath,filesList);

		return filesList;
	},
	//获取目录下的一级文件夹
	getAllDir(dirPath){
		let back = [],
			nowDir = fs.readdirSync(dirPath);

		nowDir.map(rs=>{
			var fullPath = path.join(dirPath, rs);
			const stat = fs.statSync(fullPath);
			if (stat.isDirectory()) {
				back.push(fullPath);
			}
		});

		return back;
	}
};