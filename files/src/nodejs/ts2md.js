// 读取文件多行注释（ts2md.js）  转 md文件

// 多行注释格式如下
/**
 * @method  templateFun  方法名称
 * @author  webzhang 作者
 * @description markdown模板 描述
 * @param {array} [arr] 这个例子数组
 * @return {Element}
 * @example
 *  var a = .....;
 */


const fs = require('fs');
const path = require('path');

const ts2md = {
	init(filePath){
		try{
			const outFilePath = this.getOutFilePath(filePath);
			const fullOutFilePath = path.resolve(__dirname, outFilePath);

			const text = fs.readFileSync(filePath);
			const notes = this.getNotes(text.toString());
			const notesObj = this.getNotesObj(notes);
			const markdownText = this.createMarkdownText(notesObj);
			fs.writeFileSync(fullOutFilePath, markdownText, 'utf8');

			console.log(`[ok]文件：${fullOutFilePath}`);
		}catch(e){
			console.log(e.toString());
		}
	},
	//获取输出的md的完整路径
	getOutFilePath(filePath){
		let index = filePath.lastIndexOf('.');
		return filePath.slice(0, index) + '.md';
	},
	//获取所有注释
	getNotes(str){
		//获取多行注释正则
		const getAnnReg = /\/\*\*[^]*?\*\//g;
		const res = str.match(getAnnReg);
		return res ? res : [];
	},
	//注释数组文本转数组对象
	getNotesObj(arr){
		const backData = [];
		arr.map(rs=>{
			//一段注释转成多行数组
			const lineArr = rs.split(/\*\s+@/g);
			lineArr.shift();
			const newLine = [];
			lineArr.map(line=>{
				line = line.replace(/\r/g,'');
				if(line.indexOf('example') === -1){
					line = line.split('\n')[0];
				}else{
					line = line.replace(/\*\//g,'');
					line = line.replace(/\n\s+\*/g,'\n');
				}
				newLine.push(this.jsDocTextToObj('* @'+line))
			})
			backData.push(newLine);
		})
		return backData;
	},
	//jsdoc注释行转对象
	jsDocTextToObj(str){
		// 获取注释类型
		let annotationReg = /\*\s+\@(.*?)\s/
		// 获取参数类型
		let paramTypeReg = /^.+?\{(.+?)\}.*$/
		// 获取参数名称
		let paramNameReg = /^.+?\[(.+?)\].*$/
		// 获取参数文案reg.exec(str)
		let paramTextReg = /\s((\w|[\u4e00-\u9fa5]).*)/

		const regCommonExec = (reg, str) => {
			let res = reg.exec(str);
			reg.lastIndex = 0;
			return res ? res[1] : '';
		}

		const category = regCommonExec(annotationReg, str);
		let name = regCommonExec(paramNameReg, str);
		const type = regCommonExec(paramTypeReg, str);
		let text = regCommonExec(paramTextReg, str);
		let defaultVal = '';
		if(category === 'example'){
			text = str.split('@example')[1];
		}
		if(name.indexOf('=')>-1){
			const temp = name.split('=');
			name = temp[0];
			defaultVal = temp[1];
		}

		return {category,name,type,text,default:defaultVal};
	},
	//生成markdown的文本
	createMarkdownText(arr){
		const arraySortKey = {
			method: 1,
			author: 2,
			description: 3,
			param: 4,
			return: 5,
			example: 6
		}

		let backText = '';

		arr.map(rs=>{
			//块
			const lines = [];
			rs.map(line=>{
				//行
				const text = this.createText(line);
				lines.push({
					type:line.category,
					index:arraySortKey[line.category],
					text:text
				})
			})
			lines.sort((a,b)=>{
				if(a.type === b.type){
					return 1;
				}else{
					return a.index > b.index ? 1 : -1;
				}
			})
			backText += this.createMarkdownStyle(lines)+'<br/><br/>\n';
		})

		return backText;
	},
	//对象转文本
	createText(lineObj){
		const str = lineObj.category;
		let tempObj = {
			'method': `###${lineObj.text||''}\n`,
			'author': `作者：${lineObj.text||''}\n`,
			'description': `功能描述：${lineObj.text||''}\n`,
			'param': `| ${lineObj.name||''} | ${lineObj.text|| ''} | ${lineObj.type||''}  |${lineObj.default || ''}|\n`,
			'return': `| 输出的数据 | ${lineObj.type||''}  |\n`,
			'example': "Example:\n```"+lineObj.text+"```\n"
		}
		return tempObj[str]
	},
	//组装markdown的table等
	createMarkdownStyle(arr){
		const paramTable = '\n| 参数名称 | 说明 | 参数类型 |默认值|\n|------|------|------|------|\n';
		const returnTable = '\n| 说明 | 输出类型 |\n|------|------|\n';
		let hasAddParamTable = false;
		let hasAddReturnTable = false;

		const backText = [];

		arr.map(rs=>{
			if(rs.type === 'param' && !hasAddParamTable){
				hasAddParamTable = true;
				backText.push(paramTable);
			}
			if(rs.type === 'return' && !hasAddReturnTable){
				hasAddReturnTable = true;
				backText.push(returnTable);
			}
			backText.push(rs.text)
		})

		return backText.join('');
	}

};

// 直接执行 node ts2md
// ts2md.init('./src/test/index.ts');


// 通过提示输入执行   node ts2md  会提示输入文件名
// const readline = require('readline').createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// })
//
// readline.question(`请输入要生成md的文件路径： `, name => {
// 	ts2md.init(name);
// 	readline.close()
// })


// 通过命令后面的参数执行   node ts2md ./src/test/index.ts
const fileName = process.argv[2];
ts2md.init(fileName);
