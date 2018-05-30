//图片处理类
//包自己设置  不用的就不要引入了

// var aaa = new Date().getTime()
// new fn({src:'123123.jpeg'}).then(async rs=>{
// 	let src = await rs.scaleByDoubleThreeTimes({xScale:0.1,yScale:0.3});
// 	console.log(new Date().getTime()-aaa)
// 	let img = new Image();
// 	img.src = src;
// 	img.onload = function(){
// 		console.log(img.width,img.height)
// 	}
// 	document.body.appendChild(img)
// })


let init = Symbol(),
	getImageData = Symbol(),
	loadImage = Symbol(),
	createCanvas = Symbol(),
	imageDataToBase64 = Symbol(),
	setRGBA = Symbol(),
	getRGBA = Symbol(),
	addFilter = Symbol(),
	addFunction = Symbol();


//下面的包自己设置  不用的就不引入了
//未设置动态值  性能不够
let FILTERS = {
	//转灰图
	gray:require('./filter/gray'),
	//转黑白图
	blackAndWhite:require('./filter/blackAndWhite'),
	//调节亮度
	lightness:require('./filter/lightness'),
	//锐化
	sharpen:require('./filter/sharpen'),
	//柔化
	soften:require('./filter/soften'),
	//扩散
	diffusion:require('./filter/diffusion'),
	//雕刻
	sculpture:require('./filter/sculpture'),
	//反色
	antiColor:require('./filter/antiColor'),
	//模糊
	blurry:require('./filter/blurry'),
	//高斯模糊
	gaussianBlur:require('./filter/gaussianBlur'),
	//缩放（临近插值法，有锯齿，速度快）
	scaleByNear:require('./filter/scaleByNear'),
	//缩放 （双线行插值法，效果一般，速度一般）
	scaleByDoubleLine:require('./filter/scaleByDoubleLine'),
	//缩放 (双三次插值) 速度较慢，效果较好
	scaleByDoubleThreeTimes:require('./filter/scaleByDoubleThreeTimes'),




	test:function(){}
};

let otherFilter = {

};

let addFn = {
	scale:require('./addFn/scale')
};


class handleImage{
	constructor(opt){
		this.src = opt.src;

		this.width = 0;
		this.height = 0;
		this.rgbaData = [];
		this.data = null;



		this[addFilter]();
		this[addFunction]();

		return this[init]();
	}

	async [init](){
		let data = await this[getImageData](this.src);
		this.width = data.width;
		this.height = data.height;
		this.rgbaData = data.data;
		this.data = data;
		return this;
	}


	//创建canvas
	[createCanvas](){
		let canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		return {canvas,ctx}
	}

	//图片加载
	[loadImage](src){
		return new Promise((success,error)=>{
			let img = new Image();

			img.addEventListener('load',rs=>{
				success(rs.target);
			},false);

			img.addEventListener('error',rs=>{
				error('无法加载图片');
			},false);

			img.src = src;
		})
	}

	//获取图片数据
	async [getImageData](src){
		let img = await this[loadImage](src),
			{canvas,ctx} = this[createCanvas]();

		canvas.width = img.width;
		canvas.height = img.height;

		ctx.drawImage(img,0,0,img.width,img.height);
		return ctx.getImageData(0,0,canvas.width,canvas.height);
	}

	//图片数据转base64
	[imageDataToBase64](data){
		let {canvas,ctx} = this[createCanvas]();
		canvas.width = data.width;
		canvas.height = data.height;
		ctx.putImageData(data,0,0);


		return canvas.toDataURL();
	}

	//设置新对象的 x，y的  rgba值
	[setRGBA](data,x,y,rgba){
		let width = data.width,
			n = (y*width+x)*4;

		data.data[n] = rgba.r;
		data.data[n+1] = rgba.g;
		data.data[n+2] = rgba.b;
		data.data[n+3] = rgba.a;
	}

	//获取 x，y的  rgba值
	[getRGBA](data,x,y){
		let width = data.width,
			n = (y*width+x)*4;

		return {
			r:data.data[n],
			g:data.data[n+1],
			b:data.data[n+2],
			a:data.data[n+3]
		}
	}

	//添加滤镜
	[addFilter](){
		for(let [key,filterPlus] of Object.entries(FILTERS)){

			this[key] = async (opt)=>{
				//创建滤镜函数和新的图片数据对象
				let {filterFn,newImage} = filterPlus.call(this,opt);
				//扫描所有点，并执行滤镜
				//并计算出结果放置到新到对象数据上
				for(let y=0,yl=newImage.height;y<yl;y++){
					for(let x=0,xl=newImage.width;x<xl;x++){
						//计算该点的新值
						let rgba = filterFn(x,y);
						//赋值到新对象上
						this[setRGBA](newImage,x,y,rgba);
					}
				}

				this.rgbaData = newImage.data;
				this.width = newImage.width;
				this.height = newImage.height;
				this.data = newImage;

				//src
				return this[imageDataToBase64](newImage);

			};
		}
	}

	//添加其它方法
	[addFunction](){
		for(let [key,filterPlus] of Object.entries(addFn)){

			this[key] = async (opt)=>{
				return await filterPlus.call(this,opt);
			};
		}
	}

	//获取半径内的点   (很慢。。。)
	// 半径1  取3*3 个点
	// 半径2  取5*5 个点
	getPointInRadius(opt){
		let x = opt.x,
			y = opt.y,
			width = opt.width,
			height = opt.height,
			radius = opt.radius;


		//生成x，y点范围
		let xs = [],ys = [];
		for(let i=-radius,l=radius;i<=l;i++){
			let thisX = x+i,
				thisY = y+i;
			// thisX = (thisX < 0)? 0 : (thisX>width)? width : thisX;
			// thisY = (thisY < 0)? 0 : (thisY>height)? height : thisY;

			if(i<0){
				thisX = (thisX<0)? 0 : thisX;
				thisY = (thisY<0)? 0 :  thisY;
			}else{
				thisX = (thisX>width)? width : thisX;
				thisY = (thisY>height)? height : thisY;
			}

			xs.push(thisX);
			ys.push(thisY);
		}

		//输出一维的点   先横向在纵向  计算数据的实际位置
		let backData = [];
		for(let _y=0,_yl=ys.length;_y<_yl;_y++){
			let thisY = ys[_y];
			for(let _x=0,_xl=xs.length;_x<_xl;_x++){
				let thisX = xs[_x];

				backData.push(
					(thisY*width+thisX)*4
				)
			}
		}

		return backData;

	}

	//动态创建获取周围点的函数
	createGetPointsInRadius(r){
		var str = '';
		//x
		for(var i=0,l=r*2+1;i<l;i++){

			var val = i-r;
			str+= 'var x'+i+'=x+\('+val+'\); \r ';

			if(i<r){
				str+= 'x'+i+'=\(x'+i+'<0\)? 0 : x'+i+'; \n ';
			}else if(i>r){
				str+= 'x'+i+'=\(x'+i+'>width\)? width : x'+i+'; \n ';
			}else{
				str+= ' \n ';
			}
		}
		//y

		for(var i=0,l=r*2+1;i<l;i++){

			var val = i-r;
			str+= 'var y'+i+'=y+\('+val+'\); \r ';

			if(i<r){
				str+= 'y'+i+'=\(y'+i+'<0\)? 0 : y'+i+'; \n ';
			}else if(i>r){
				str+= 'y'+i+'=\(y'+i+'>height\)? height : y'+i+'; \n ';
			}else{
				str+= ' \n ';
			}
		}

		str += ' \n ';

		//points
		str += 'var points=[]; \n ';
		for(var y=0,yl=r*2+1;y<yl;y++){
			for(var x=0,xl=r*2+1;x<xl;x++){
				str+= 'points.push\('+
					'\(y'+y+'*width+x'+x+'\)*4'
					+'\);  \n ';
			}
		}

		str += 'return points; \n ';

		return new Function('x','y','width','height',str);
	}
}



module.exports = handleImage;