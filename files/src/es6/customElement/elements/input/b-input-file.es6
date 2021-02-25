

//同 b-input-text

//@param:    fileType='all'
//@param:    fileMaxSize='2'
//@param:    uploadFileKey='file_'

//@get   bInputFile.value    return []; //上传前会返回文件对象，上传后返回网址
//@set   bInputFile.value = ['',''];  //input type=file中的file对象 或 字符串网址
//@set   bInputFile.disabled =  true/false

//@fn    bInputFile.upload();     //异步函数  上传  没有file对象也会正常返回


//下面的可以在  ./_input-setting.es6 中  inputFileStyle对象中配置
//也可以单个对象单独配置覆盖
//@param:    uploadServerUrl='http://127.0.0.1/upload'
//@set   bInputFile.uploadOnLoad = function(e,success,error){}
//@set   bInputFile.uploadOnError = function(e,error){}




let publishInput = require('./_input-all'),
	getImageFitSize = require('../../../lib/fn/getImageFitSize'),
	showBigImage = require('../../../lib/ui/showBigPicture');

//允许的文件类型   fileType使用，只能用一个
let allowFileType = {
	word:['doc','docx','wbk','xls','xlsx','xlt','xltx','xltm','ppt','pdf'],
	//不能加入非图片类的后缀
	image:['png','jpeg','jpg'],
	all:['doc','docx','wbk','xls','xlsx','xlt','xltx','xltm','ppt','pdf','png','jpeg','jpg']
};


class bInputFile extends publishInput{
	constructor() {
		super();

		this.divWidth = this.setting.inputFileStyle.fileWidth;
		this.divHeight = this.setting.inputFileStyle.fileHeight;
		//已经存在的文件对象
		this.showFiles = [];
		//是否可编辑
		this.canMdf = true;

		//文件上传时的服务器地址
		this.uploadServerUrl = $(this).attr('uploadServerUrl') || '';
		//文件上传时 服务器接受的key
		this.uploadFileKey = $(this).attr('uploadFileKey') || 'file';
		//自定义处理上传成功事件
		this.uploadOnLoadFn = null;
		//自定义处理上传失败事件
		this.uploadOnErrorFn = null;

		this.mdfStyle();
		this.createInput();
		this.addFileBtnFn();
	}

	//修改原始样式
	mdfStyle(){
		this.inputBodyDom.css({
			border:'none',
			padding:0,
			'min-height':this.divHeight+10+'px'
		}).addClass('box_lines');
	}
	//创建dom
	createInput(){
		let div = $('<div class="box_scc hover"><span class="boxflex1 box_hcc">＋</span></div>'),
			input = $('<input type="file" multiple="multiple"/>');

		div.css({
			width:this.divWidth+'px',
			height:this.divHeight+'px',
			margin:'0 10px 10px 0',
			border:'1px solid #aaa',
			fontSize:'55px',
			position:'relative',
			overflow:'hidden',
			color:'#ddd'
		});

		input.css({
			width:'200%',
			height:this.divHeight+'px',
			opacity:0,
			position:'absolute',
			left:0,
			top:0,
			cursor:'pointer'
		});


		this.btn = div;
		this.inputDom = input;
	}
	//生成
	addFileBtnFn(){
		if(this.fileBtn){
			this.fileBtn.unbind('change');
			this.fileBtn.remove();
		}

		let div = this.btn.clone(),
			input = this.inputDom.clone();
		div.append(input);

		if(this.unit){
			this.unitDom.removeClass('hidden');
			div.append(this.unitDom);
			div.css({fontSize:'42px'});
			this.unitDom.css({
				padding:0,width:'100%',height:'20px'
			}).addClass('box_hcc');
		}

		this.fileBtn = div;

		this.inputBodyDom.append(div);
		this.addEvent(input);
	}
	//添加事件
	addEvent(input){
		let _this = this;
		input.change(function(){
			_this.errDom.css({display:'none'});

			let {checkPassFiles,checkErrFiles} = _this.checkFile(this);

			//通过的
			if(checkPassFiles.length !=0 ){
				_this.showUpdateFileFn(checkPassFiles);
			}

			//未通过
			if(checkErrFiles.length !=0 ){
				_this.errDom.css({display:'block'});
			}


			//重置上传按钮
			_this.addFileBtnFn();
		});
	}
	//检查上传的文件
	checkFile(input){
		let type = $(this).attr('fileType'),
			size = $(this).attr('fileMaxSize')*1 || false;
		type = allowFileType[type] || false;

		let passed = [],
			erred = [];

		for(let i=0,l=input.files.length;i<l;i++){
			let fileObj = input.files[i],
				fileName = fileObj.name || '',
				fileSize = fileObj.size || 100,
				fileType = fileName.split('.');
			fileType = fileType[fileType.length-1];

			if(!type && !size){
				passed.push(fileObj);
			}

			if(type && !size){
				if(type.indexOf(fileType) > -1){
					passed.push(fileObj);
				}else{
					erred.push(fileObj);
				}
			}

			if(!type && size){
				if(size*1024*1024 >= fileSize){
					passed.push(fileObj);
				}else{
					erred.push(fileObj);
				}
			}

			if(type && size){
				if(type.indexOf(fileType) > -1 && size*1024*1024 >= fileSize){
					passed.push(fileObj);
				}else{
					erred.push(fileObj);
				}
			}
		}

		return {
			checkPassFiles:passed,
			checkErrFiles:erred
		}
	}
	//生成要上传的文件dom样式
	showUpdateFileFn(files){
		files.map(file=>{
			let fileName = file.name || '',
				fileType = fileName.split('.');
			fileType = fileType[fileType.length-1];

			if(allowFileType.image.indexOf(fileType) > -1){
				//是图片
				this.addImageFile(file);
			}else{
				//是文件
				this.addOtherFile(file);
			}
		})
	}

	//设置value时生成dom
	setValueCreateDom(arr){
		arr.map(file=>{
			let fileType = file.split('.');
			fileType = fileType[fileType.length-1];

			if(allowFileType.image.indexOf(fileType) > -1){
				//是图片
				this.addImageFile(file);
			}else{
				//是文件
				this.addOtherFile(file);
			}
		})
	}

	//显示图片
	addImageFile(file){
		let imgSrc = ($.isString(file))? file : URL.createObjectURL(file),
			_this = this,
			img = new Image();

		let div = this.createShowDiv();

		img.onload = function(){
			let imgW = this.width,
				imgH = this.height,
				size = getImageFitSize(imgW,imgH,_this.divWidth,_this.divHeight);

			$(img).css({
				width:size.width-2+'px',
				height:size.height-2+'px',
				cursor:'pointer'
			});

			div.append(img);
		};
		$(img).click(function(){
			let a = new showBigImage({
				imgs:[imgSrc]
			})
			a.showImg(0);
		});
		img.src = imgSrc;

		this.showFiles.push(file);
		this.inputBodyDom.append(div);
	}
	//显示其它文件
	addOtherFile(file){
		let div = this.createShowDiv(),
			typeDom = $('<div class="diandian"></div>'),
			nameDom = $('<div class="diandian2"></div>'),
			fileUrl = ($.isString(file))? file : URL.createObjectURL(file),
			fileName = ($.isString(file))? file.substr(file.lastIndexOf('/')+1) : file.name,
			fileType = fileName.split('.');
		fileType = fileType[fileType.length-1];
		div.removeClass('box_scc').addClass('box_slt');
		nameDom.addClass('hover');

		typeDom.css({
			padding:'0 5px',
			width:'100%',
			height:'20px',
			fontSize:'16px',
			color:'blue'
		}).text(fileType);
		nameDom.css({
			padding:'0 10px',
			width:'100%',
			height:'40px',
			color:'#333',
			fontSize:'12px',
			lineHeight:'20px',
			overflow:'hidden'
		}).text(fileName);

		div.append(typeDom).append(nameDom);

		nameDom.click(function(){
			window.open(fileUrl);
		});

		this.showFiles.push(file);
		this.inputBodyDom.append(div);
	}
	//创建显示文件的dom
	createShowDiv(){
		let div = $('<div class="__input_file__ box_scc"></div>'),
			_this = this,
			del = $('<div class="box_scc hover __input_del_btn__">删除</div>');

		div.css({
			width:this.divWidth+'px',
			height:this.divHeight+'px',
			border:'1px solid #aaa',
			margin:'0 10px 10px 0',
			position:'relative'
		});
		del.css({
			width:'100%',
			height:'20px',
			background:'rgba(0,0,0,0.5)',
			color:'#fff',
			fontSize:'12px',
			position:'absolute',
			left:0,bottom:0,
			'z-index':10,
			cursor:'pointer'
		});


		del.click(function(){
			let all = _this.inputBodyDom.find('.__input_file__'),
				n = null,
				thisObj = $(this).parent().get(0);
			all.each(function(i){
				if(this == thisObj){
					n = i;
				}
			});
			_this.showFiles.splice(n,1);

			del.unbind('click');
			div.remove();
		});

		div.append(del);

		return div;
	}

	//删除添加的文件
	clearCreateFile(){
		this.inputBodyDom.find('.__input_file__').remove();
		this.showFiles = [];
	}

	get value(){
		return this.showFiles;
	}

	set value(arr){
		//清空
		this.clearCreateFile();
		//添加
		this.setValueCreateDom(arr);
		//重置上传按钮使其在最后面
		this.addFileBtnFn();
		this.disabled = !this.canMdf;
	}

	set disabled(state){
		if(state){
			this.canMdf = false;
			if(!this.fileBtn){
				return;
			}
			this.fileBtn.addClass('hidden');
			this.inputBodyDom.find('.__input_file__').find('.__input_del_btn__').addClass('hidden');
		}else{
			this.canMdf = true;
			this.fileBtn.removeClass('hidden');
			this.inputBodyDom.find('.__input_file__').find('.__input_del_btn__').removeClass('hidden');
		}
	}

	//表单验证 重写
	checkPass(){
		return new Promise((success,error)=>{
			this.errDom.css({display:'none'});
			if($(this).attr('rule') == 'must'){
				if(this.value.length != 0){
					success(this.value);
				}else{
					this.errDom.css({display:'block'});
					error({
						msg:$(this).attr('err'),
						dom:this
					});
				}
			}else{
				success(this.value);
			}
		})
	}

	//上传所有文件
	async upload(){
		let backData = [];
		for(let i=0,l=this.showFiles.length;i<l;i++){
			let fileName = await this.uploadFn(this.showFiles[i]);
			backData.push(fileName);
		}

		this.showFiles = backData;
		return backData;
	}

	//ajax
	uploadFn(file){
		let serverUrl = this.uploadServerUrl || this.setting.inputFileStyle.uploadServerUrl;
		return new Promise(async (success,error)=>{
			if($.isString(file)){
				success(file);
				return;
			}

			let form = new FormData(),
				xhr = new XMLHttpRequest();
			form.append(this.uploadFileKey,file);

			let succFn = this.uploadOnLoadFn || this.setting.inputFileStyle.uploadOnload,
				errFn = this.uploadOnErrorFn || this.setting.inputFileStyle.uploadOnerror;

			xhr.onload = function(e){
				succFn(e,success,error)
			}
			xhr.onerror = function(e){
				errFn(e,error)
			}

			// xhr.upload.onprogress =  uploadProgress; //上传进度调用方法实现

			xhr.open("post", serverUrl, true);
			// xhr.setRequestHeader('Authorization',window.token); //post方式提交，url为服务器请求地址，true该参数规定请求是否异步处理
			xhr.send(form); //开始上传，发送form数据
		});
	}

	//ajax onload fn
	//fn 带参数  e,success,error
	set uploadOnLoad(fn){
		this.uploadOnLoadFn = fn;
	}
	//fn 带参数 e,error
	set uploadOnError(fn){
		this.uploadOnErrorFn = fn;
	}

}


if(!customElements.get('b-input-file')){
	customElements.define('b-input-file', bInputFile );
}
