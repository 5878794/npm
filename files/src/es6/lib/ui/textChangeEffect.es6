// 文字变换效果 (如:发送短信后倒计时效果)

//初始化
// let a = new fn({
// 	dom:$('#aa'),               //容器dom @param:jqobj
// 	bg:'rgb(255,255,255)',      //背景色  必须rgb  默认:rgb(255,255,255)
// 	fontSize:12,                //字体大小 @param:number  单位px
// 	fontColor:'rgb(0,0,0)',     //字体颜色 @param:rgb    默认:rgb(0,0,0)
// 	textAlign:'center',
//  fontSizeUnit:'rem'          //字体大小使用单位 @param:str  默认:rem
// });

//显示文字
// window.a.show(2);

//销毁
// window.a.destroy();




let createCanvas = Symbol(),
	textToImageData = Symbol(),
	getTextPointArray = Symbol(),
	drawPoint = Symbol(),
	clearCanvas = Symbol(),
	getShowFontColorRGBA = Symbol(),
	animatePoint = Symbol(),
	createMainCanvas = Symbol(),
	handlerAnimatePoints = Symbol(),
	getChangeArray = Symbol();

let animate = require('../fn/jsAnimate');



class textChangeEffect{
	constructor(opt){
		//包裹容器
		this.dom = opt.dom;
		//背景色  必须使用rgb颜色
		this.bg = opt.bg || 'rgb(255,255,255)';
		//文字字体大小
		this.fontSize = opt.fontSize || 12;
		//文字颜色
		this.fontColor = opt.fontColor || 'rgb(0,0,0)';
		//文字水平对齐方向
		this.textAlign = opt.textAlign || 'center';
		//字体使用单位
		this.fontSizeUnit = opt.fontSizeUnit || 'rem';

		//文字颜色的RGB
		this.fontR = '';
		this.fontG = '';
		this.fontB = '';
		//背景颜色的RGB
		this.bgR = '';
		this.bgG = '';
		this.bgB = '';

		//屏幕像素点比例
		this.scale = window.devicePixelRatio;

		//容器、画布宽高
		this.domWidth = parseInt(this.dom.width());
		this.domHeight = parseInt(this.dom.height());
		this.canvasWidth = this.domWidth*this.scale;
		this.canvasHeight = this.domHeight*this.scale;

		//当前显示的文字转成像素点的集合
		this.nowPoints = [];
		this.nowImageData = null;

		this.animate = null;
		this.canvas = null;
		this.ctx = null;

		this[getShowFontColorRGBA]();
		this[createMainCanvas]();

	}

	//拆分rgba为 r、g、b、a
	[getShowFontColorRGBA](){
		let colors = this.fontColor.match(/(\d+)/ig);
		this.fontR = parseInt(colors[0]);
		this.fontG = parseInt(colors[1]);
		this.fontB = parseInt(colors[2]);

		let bg = this.bg.match(/(\d+)/ig);
		this.bgR = parseInt(bg[0]);
		this.bgG = parseInt(bg[1]);
		this.bgB = parseInt(bg[2]);
	}

	//创建主canvas
	[createMainCanvas](){
		let {canvas,ctx} = this[createCanvas]();
		this.canvas = canvas;
		this.ctx = ctx;

		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;

		this.ctx.fillStyle = this.bg;
		this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);

		//以为retina屏 所以之前根据屏蔽点密度进行了放大,现在需要缩小画布
		//主要目的去除锯齿、毛边等
		$(this.canvas).css({
			'transform-origin':'left top',
			'-webkit-transform-origin':'left top',
			transform:'scale('+1/this.scale+')',
			'-webkit-transform':'scale('+1/this.scale+')'
		});

		// console.log(this.dom)
		this.dom.append(this.canvas);
	}

	//创建画布
	[createCanvas](){
		let canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		return {canvas,ctx};
	}

	//显示字符
	show(str){
		// let __t = new Date().getTime();
		//在canvas上写文字,转成图片数据
		let imgData = this[textToImageData](str),
			//获取图片上非背景色的像素点集合
			{imageData,array} = this[getTextPointArray](imgData),
			_this = this;

		//将不需要移动的点对齐
		let	points = this[handlerAnimatePoints](this.nowPoints,array);

		// window.start = JSON.parse(JSON.stringify(this.nowPoints));
		// window.end = JSON.parse(JSON.stringify(array));

		this.nowPoints = JSON.parse(JSON.stringify(array));
		this.nowImageData = imageData;


		//获取变换前后点的位置
		let	{startArray,endArray} = this[getChangeArray](points.startArray,points.endArray);


		//
		// // console.log(startArray,endArray)
		//
		// // console.log(new Date().getTime()-__t);
		//
		// this[drawPoint](endArray);
		//
		// window.start = JSON.parse(JSON.stringify(points.startArray));
		// window.end = JSON.parse(JSON.stringify(points.endArray));
		//
		// //动画变换这些点



		this[animatePoint](startArray,endArray,300,function(){
			// _this.nowPoints = points.endArray;
			// _this.nowImageData = imageData;
		});
	}

	//文字写入画布,在获取画布的imageData
	[textToImageData](str){
		let {canvas,ctx} = this[createCanvas]();

		//画背景
		canvas.width = this.canvasWidth;
		canvas.height = this.canvasHeight;
		ctx.fillStyle = this.bg;
		ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);

		//写入文字
		ctx.fillStyle = this.fontColor;
		let size = this.fontSize * this.scale;
		ctx.font = size+this.fontSizeUnit+' sans-serif';
		ctx.textBaseline = 'middle';

		let type,       //文字对齐方式
			startX;     //文字中心点位置
		//对齐方式参考  http://www.w3school.com.cn/tags/canvas_textalign.asp
		type = (this.textAlign == 'left')? 'left' :
			(this.textAlign == 'right')? 'right' :
				'center';
		startX = (this.textAlign == 'left')? 0 :
			(this.textAlign == 'right')? this.canvasWidth :
			this.canvasWidth/2;

		ctx.textAlign = type;
		ctx.fillText(str,startX,this.canvasHeight/2);

		//返回canvas的图片数据
		return ctx.getImageData(0,0,this.canvasWidth,this.canvasHeight);
	}

	//imageData转成文字的点的数组(非背景色的点的集合)
	[getTextPointArray](data){
		let imgData = data.data,
			width = data.width,
			height = data.height,
			newData = [];

		let imageData = [];

		for(let y=0,yl=height;y<yl;y++){

			let nowRowImageData = new Array(width);
			imageData.push(nowRowImageData);

			for(let x=0,xl=width;x<xl;x++){
				let n = (y*width+x)*4,
					r = imgData[n],
					g = imgData[n+1],
					b = imgData[n+2];

				if(r!=this.bgR || g!=this.bgG || b!=this.bgB){
					newData.push({
						x:x,
						y:y,
						r:r,
						g:g,
						b:b
					});
					nowRowImageData[x] = {
						x:x,
						y:y,
						r:r,
						g:g,
						b:b
					}
				}
			}
		}

		return {imageData,array:newData};
	}

	//获取变换前后点的位置
	[getChangeArray](start,end){
		let endNumber = end.length,
			//初始显示的像素点长度
			startNumber = start.length,
			startArray,
			endArray,
			//画布中心点坐标
			centerX = parseInt(this.canvasWidth/2),
			centerY = parseInt(this.canvasHeight/2);

		//点出现或消失的位置,根据位置对齐方式调整x坐标
		let pX = (this.textAlign == 'left')? 0 :
			(this.textAlign == 'right')? this.canvasWidth :
				centerX;


		//最后显示的像素点与开始显示像素点的多少比较
		//补齐变换前和变换后的像素点数量
		if(endNumber > startNumber){
			//增加新的像素点
			//渐显的初始位置为中心点,初始背景色
			let add = endNumber - startNumber;


			for(let i=0,l=add;i<l;i++){
				start.push({
					x:pX,
					y:centerY,
					r:this.bgR,
					g:this.bgG,
					b:this.bgB
				});
			}

		}else{
			//现在的图形像素点大于之前显示的像素点,渐隐多余的 开始像素点后面的像素点
			//渐隐的位置为中心点
			let cut = startNumber - endNumber;

			for(let i=0,l=cut;i<l;i++){
				// let point = this.nowPoints[startNumber-1-i];
				end.push({
					x:pX,
					y:centerY,
					r:this.bgR,
					g:this.bgG,
					b:this.bgB
				})
			}
		}


		//最终获取到变换前、变换后的非背景色的像素点的集合
		startArray = start;
		endArray = end;

		return {startArray,endArray};
	}

	//显示切换的动画效果
	[animatePoint](startArray,endArray,time,callback){
		let _this = this;
		this.animate = new animate({
			start:0,                  //@param:number   初始位置
			end:1,                    //@param:number   结束位置
			time:time,                 //@param:number   动画执行时间  ms
			type:"Linear",             //@param:str      tween动画类别,默认：Linear 详见函数内tween函数
			class:"",           //@param:str      tween动画方式,默认：easeIn 详见函数内tween函数
			stepFn:function(per){     //@param:fn       每步执行函数,返回当前属性值
				per = per.toFixed(9);
				// console.log(per)

				let newArray = [];
				for(let i=0,l=startArray.length;i<l;i++){
					let SP = startArray[i],
						EP = endArray[i];

					newArray.push({
						x:SP.x+(EP.x-SP.x)*per,
						y:SP.y+(EP.y-SP.y)*per,
						r:SP.r+(EP.r-SP.r)*per,
						g:SP.g+(EP.g-SP.g)*per,
						b:SP.b+(EP.b-SP.b)*per
					});
				}

				_this[drawPoint](newArray);
			},
			endFn:function(){         //@param:fn       动画结束执行
				// console.log('end')
				callback();
				setTimeout(function(){
					_this.animate = null;
				},0)
			},
			alternate:false,          //@param:boolean  动画结束时是否反向运行，默认：false
			infinite:false            //@param:boolean  动画是否循环执行，默认：false
			// 设置该参数endFn将失效
		});

		this.animate.play();
		// a.stop();
	}

	//画布画点
	[drawPoint](array){
		this[clearCanvas]();
		array.map(rs=>{
			this.ctx.fillStyle = 'rgb('+rs.r+','+rs.g+','+rs.b+')';
			this.ctx.fillRect(rs.x,rs.y,1,1);
		});
	}

	//清空canvas
	[clearCanvas](){
		this.ctx.fillStyle = this.bg;
		this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);
	}

	[handlerAnimatePoints](startArray,endArray){
		let startImageData = this.nowImageData;

		//第一次画
		if(!startImageData){
			return {startArray,endArray}
		}

		//非第一次
		let newEndArray = [],
			newStartArray = [],
			notFind = [];


		//查找有相同坐标的点
		endArray.map(rs=>{
			let x = rs.x,
				y = rs.y,
				val = startImageData[y][x];

			if(val){
				newEndArray.push(rs);
				newStartArray.push(val);
				startImageData[y][x] = null;
			}else{
				notFind.push(rs);
			}
		});

		//将初始数组中未匹配的点加入newStartArray的后面
		for(let y=0,yl=startImageData.length;y<yl;y++){
			for(let x=0,xl=startImageData[y].length;x<xl;x++){
				if(startImageData[y][x]){
					newStartArray.push(startImageData[y][x]);
				}
			}
		}


		//将notFind的点加入newEndArray的后面
		notFind.map(rs=>{
			newEndArray.push(rs);
		});


		return {
			startArray:newStartArray,
			endArray:newEndArray
		}
	}

	destroy(){
		if(this.animate){
			this.animate.stop();
			this.animate = null;
		}
		$(this.canvas).remove();
	}
}

module.exports = textChangeEffect;
