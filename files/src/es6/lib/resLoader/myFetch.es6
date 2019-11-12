

let readTextStream = Symbol(),
	myFetch = Symbol();



module.exports = {
	[myFetch](url){
		return new Promise(success=>{
			fetch(url).then(async rs=>{
				if(rs.ok){
					success(rs);
				}else{
					throw '网络错误';
				}
			}).catch(e=>{
				console.log(e);
				throw '读取失败';
			})
		})
	},
	async catchFile(url){
		let rs = await this[myFetch](url),
			myBlob = await rs.blob(),
			fileUrl = URL.createObjectURL(myBlob);

		return fileUrl;
	},
	async getText(url){
		let rs = await this[myFetch](url),
			reader = rs.body.getReader(),
			fileText = await this[readTextStream](reader);

		return fileText;
	},
	async getBodyHtml(url){
		let html = await this.getText(url),
			reg1 = new RegExp(/<body[^>]*?>(.*\s*?)<\/body>/,'is'),
			reg2 = new RegExp(/<head[^>]*?>(.*\s*?)<\/head>/,'is');

		let body = reg1.exec(html),
			head = reg2.exec(html);

		return {
			body:(body.length == 2)? body[1] : '',
			head:(head.length == 2)? head[1] : ''
		};

	},
	//读取utf8的二进制数据流
	[readTextStream](reader){
		return new Promise(success=>{
			let values = '';
			let re = function(){
				reader.read().then(rs=>{
					const utf8Decoder = new TextDecoder("utf-8");
					values += rs.value ? utf8Decoder.decode(rs.value) : '';
					if(rs.done){
						success(values);
						return;
					}
					re();
				});
			};
			re();
		});
	},


};


