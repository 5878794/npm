//下载图片到本地

//  src：图片地址   file：保存本地文件名（不要带后缀）
// fn.init([{src:'http://wdff/aa.png',file:'aa'}])

window.URL = window.URL || window.webkitURL;

let fn = {
	async init(urls){
		for(let i=0,l=urls.length;i<l;i++){
			await this.download(urls[i].src,urls[i].file);
		}
	},
	download(imgUrl,fileName){
		let _this = this,
			fileType = imgUrl.substr(imgUrl.lastIndexOf('.')+1);
		fileName = fileName+'.'+fileType;

		return new Promise((success,error)=>{
			let xhr = new XMLHttpRequest();
			xhr.open("get", imgUrl, true);
			// 至关重要
			xhr.responseType = "blob";
			xhr.onload = function () {
				if (this.status == 200) {
					//得到一个blob对象
					let blob = this.response;
					_this.autoDown(blob,fileName);
					success();
				}else{
					error('下载失败');
				}
			};
			xhr.onerror = function(){
				error('下载失败');
			};
			xhr.send();
		})
	},
	autoDown(blob,filename){
		const eleLink = document.createElement('a');
		eleLink.download = filename;
		eleLink.style.display = 'none';
		// 字符内容转变成blob地址
		eleLink.href = URL.createObjectURL(blob);
		// 触发点击
		document.body.appendChild(eleLink);
		eleLink.click();
		// 然后移除
		document.body.removeChild(eleLink);
	}
};


module.exports = function(urls){
	fn.init(urls).then(rs=>{
		console.log('complete')
	}).catch(e=>{
		console.log(e)
	});
};