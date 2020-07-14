


//==========================================================
//input-file控件    继承input
// b-input-file
//==========================================================

// html
// b-input-file(name='名字:'          //输入框前面的标题。 如空不显示标题。
// key='aa'                     //服务器对应的key
// type=file                    //输入框类型
// rule='must'                  //只支持must
// fileType='image'             //上传文件类型 image/word ，为空不判断文件类型
// fileMaxSize='2'              //上传文件大小，单位兆 ，为空不判断文件大小
// err='错。。。'                //验证错误显示提示信息
// icon='./image/aa.jpg'        //输入框前面图标地址，及大小  如空不显示icon
// iconWidth=20
// iconHeight=20
// )


// js
// 	var input = $('b-input').eq(0).get(0);
// 	input.inputStyle = {color:'red'};   //设置样式
// 	input.nameStyle = {color:'red'};
// 	input.inputBodyStyle = {color:'red'};
// 	input.rowStyle = {color:'red'};
// 	input.errStyle ={color:'red'};

//  input.nameWidth = 100;  //获取或设置标题字段的宽度   get、set
//  input.rowHeight = 30;   //获取或设置行高  get、set
//  input.value;            //获取上传的文件对象,返回数组   get
//  input.key;              //获取设置的key的值。
//  input.disabled = true;  //设置input是否可用 true/false


//  input.checkPass();      //input检查 返回 promise对象 。 错误时会显示errDom提示
							//通过返回该控件的value
							//失败返回  {msg:'err',dom:this}



let bInput = require('./input'),
	getImageFitSize = require('../../lib/fn/getImageFitSize'),
	showBigImage = require('../../lib/ui/showBigPicture');

let createInput = Symbol.for('createInput'),
	mdfStyle = Symbol(),
	addFileBtnFn = Symbol(),
	addEvent = Symbol(),
	showUpdateFileFn = Symbol(),
	addImageFile = Symbol(),
	createShowDiv = Symbol(),
	addOtherFile = Symbol(),
	checkFile = Symbol();

let allowFileType = {
	word:['doc','docx','wbk','xls','xlsx','xlt','xltx','xltm','ppt','pdf'],
	image:['png','jpeg','jpg']
}



class bInputFile extends bInput{
	constructor() {
		super();



		this[mdfStyle]();

		this[addFileBtnFn]();

	}

	//样式修正
	[mdfStyle](){
		this.inputBodyDom.css({border:'none'}).addClass('box_lines');


	}

	//上传文件按钮样式
	[createInput](){
		let div = $('<div class="box_scc hover">＋</div>'),
			input = $('<input type="file" />');

		div.css({
			width:'80px',
			height:'80px',
			margin:'0 10px 10px 0',
			border:'1px solid #aaa',
			fontSize:'55px',
			position:'relative',
			overflow:'hidden',
			color:'#ddd'
		});
		input.css({
			width:'200%',
			height:'80px',
			opacity:0,
			position:'absolute',
			left:0,
			top:0,
			cursor:'pointer'
		});


		this.btn = div;
		this.input = input;
	}

	//添加上传文件按钮
	[addFileBtnFn](){
		if(this.fileBtn){
			this.fileBtn.unbind('change');
			this.fileBtn.remove();
		}

		let div = this.btn.clone(),
			input = this.input.clone();
		div.append(input);

		if(this.unit){
			div.append(this.unit);
		}

		this.fileBtn = div;

		this.inputBodyDom.append(div);
		this[addEvent](input);
	}
	//上传文件按钮事件
	[addEvent](input){
		let _this = this;
		input.change(function(){
			_this.errDom.css({display:'none'});
			if(_this[checkFile](this)){
				//通过
				_this[showUpdateFileFn](this);
			}else{
				//未通过
				_this.errDom.css({display:'block'});
			}
			//重置上传按钮
			_this[addFileBtnFn]();
		});
	}
	//上传文件类型检查
	[checkFile](input){
		let type = $(this).attr('fileType'),
			size = $(this).attr('fileMaxSize')*1 || false;
		type = allowFileType[type] || false;

		let fileObj = input.files[0],
			fileName = fileObj.name || '',
			fileSize = fileObj.size || 100,
			fileType = fileName.split('.');
		fileType = fileType[fileType.length-1];

		if(!type && !size){
			return true;
		}

		if(type && !size){
			return (type.indexOf(fileType) > -1);
		}

		if(!type && size){
			return (size*1024*1024 >= fileSize);
		}

		if(type && size){
			return (type.indexOf(fileType) > -1 && size*1024*1024 >= fileSize);
		}
	}
	//显示上传文件
	[showUpdateFileFn](input){
		let fileObj = input.files[0],
			fileName = fileObj.name || '',
			fileType = fileName.split('.');
		fileType = fileType[fileType.length-1];

		if(allowFileType.image.indexOf(fileType) > -1){
			//是图片
			this[addImageFile](input);
		}else{
			//是文件
			this[addOtherFile](input);
		}
	}

	//添加图片文件样式
	[addImageFile](input){
		let divWidth = 80,
			divHeight = 80,
			imgSrc = URL.createObjectURL(input.files[0]),
			img = $(`<img class="hover" src="${imgSrc}">`);

		img.css({
			cursor:'pointer'
		});
		img.get(0).onload = function(){
			let imgW = this.width,
				imgH = this.height,
				size = getImageFitSize(imgW,imgH,divWidth,divHeight);

			img.css({
				width:size.width+'px',
				height:size.height+'px'
			})
		};
		img.click(function(){
			let a = new showBigImage({
				imgs:[imgSrc]
			})
			a.showImg(0);
		});

		let div = this[createShowDiv](input,divWidth,divHeight);
		div.append(img);

		this.inputBodyDom.append(div);
	}
	//添加其它文件样式
	[addOtherFile](input){
		let divWidth = 80,
			divHeight = 80,
			div = this[createShowDiv](input,divWidth,divHeight),
			typeDom = $('<div class="diandian"></div>'),
			nameDom = $('<div class="diandian"></div>'),
			fileUrl = URL.createObjectURL(input.files[0]),
			fileName = input.files[0].name,
			fileType = fileName.split('.');
		fileType = fileType[fileType.length-1];
		div.removeClass('box_scc').addClass('box_slt');
		nameDom.addClass('hover');

		typeDom.css({
			padding:'0 5px',
			width:'100%',
			height:'30px',
			fontSize:'16px',
			color:'blue'
		}).text(fileType);
		nameDom.css({
			padding:'0 10px',
			width:'100%',
			height:'30px',
			color:'#333',
			fontSize:'12px'
		}).text(fileName);

		div.append(typeDom).append(nameDom);

		nameDom.click(function(){
			window.open(fileUrl);
		});


		this.inputBodyDom.append(div);
	}
	//创建添加的容器
	[createShowDiv](input,divWidth,divHeight){
		let div = $('<div class="__input_file__ box_scc"></div>'),
			del = $('<div class="box_scc hover __input_del_btn__">删除</div>');


		div.css({
			width:divWidth+'px',
			height:divHeight+'px',
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
			cursor:'pointer'
		});
		$(input).addClass('hidden');


		del.click(function(){
			del.unbind('click');
			div.remove();
		});

		div.append(del).append(input);

		return div;
	}



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
				return true;
			}
		})
	}

	set value(val){
		console.log('%c 不能设置value,只能获取','color:red;');
	}
	get value(){
		let files = [];
		this.body.find('.__input_file__').find('input').each(function(){
			files.push(this.files[0])
		});

		return files;
	}

	set disabled(state){
		if(state){
			this.fileBtn.addClass('hidden');
			this.inputBodyDom.find('.__input_file__').find('.__input_del_btn__').addClass('hidden');
		}else{
			this.fileBtn.removeClass('hidden');
			this.inputBodyDom.find('.__input_file__').find('.__input_del_btn__').removeClass('hidden');
		}
	}

}



if(!customElements.get('b-input-file')){
	customElements.define('b-input-file', bInputFile );
}
