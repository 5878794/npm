//soften 柔化

//原理:
//图像中的像素点  = 自身及周围9个点的平均值

//number：  柔化半径


module.exports = function(number){
	let newImage = new ImageData(this.width,this.height),
		newWidth  = newImage.width,
		newHeight = newImage.height,
		oldRgbaData = this.rgbaData,
		oldWidth = this.width,
		oldHeight = this.height,
		_this = this,
		softenRadius = number || 1;
	// window.oldRgbaData = oldRgbaData;

	let getPointsFn = _this.createGetPointsInRadius(softenRadius);

	// let getVal = function(p00,p10,p20,p01,p11,p21,p02,p12,p22){
	// 	let r = (   oldRgbaData[p00] +
	// 				oldRgbaData[p10] +
	// 				oldRgbaData[p20] +
	// 				oldRgbaData[p01] +
	// 				oldRgbaData[p11] +
	// 				oldRgbaData[p21] +
	// 				oldRgbaData[p02] +
	// 				oldRgbaData[p12] +
	// 				oldRgbaData[p22]
	// 			)/9;
	// 	let g = (   oldRgbaData[p00+1] +
	// 				oldRgbaData[p10+1] +
	// 				oldRgbaData[p20+1] +
	// 				oldRgbaData[p01+1] +
	// 				oldRgbaData[p11+1] +
	// 				oldRgbaData[p21+1] +
	// 				oldRgbaData[p02+1] +
	// 				oldRgbaData[p12+1] +
	// 				oldRgbaData[p22+1]
	// 			)/9;
	// 	let b = (   oldRgbaData[p00+2] +
	// 				oldRgbaData[p10+2] +
	// 				oldRgbaData[p20+2] +
	// 				oldRgbaData[p01+2] +
	// 				oldRgbaData[p11+2] +
	// 				oldRgbaData[p21+2] +
	// 				oldRgbaData[p02+2] +
	// 				oldRgbaData[p12+2] +
	// 				oldRgbaData[p22+2]
	// 			)/9;
	// 	let a = oldRgbaData[p11+3];
	//
	// 	return {r,g,b,a};
	// };

	let getVal1 = function(points){
		let rgba = [],
			length = points.length;
		for(let i=0,l=4;i<l;i++){
			let all = 0;
			points.map(rs=>{
				all+= oldRgbaData[rs+i];
			});
			rgba.push(all/length);
		}

		let [r,g,b,a] = rgba;
		return {r,g,b,a};
	};


	let createGetVal2 = function(r){
		var str = '';
		var length = (r*2+1)*(r*2+1);

		str += 'var r=\(';
		for(var i=0,l=length;i<l;i++){
			str += 'oldRgbaData[point['+i+']]+'
		}
		str = str.substr(0,str.length-1);
		str += '\)\/'+length+'; \n ';


		str += 'var g=\(';
		for(var i=0,l=length;i<l;i++){
			str += 'oldRgbaData[point['+i+']+1]+'
		}
		str = str.substr(0,str.length-1);
		str += '\)\/'+length+'; \n ';

		str += 'var b=\(';
		for(var i=0,l=length;i<l;i++){
			str += 'oldRgbaData[point['+i+']+2]+'
		}
		str = str.substr(0,str.length-1);
		str += '\)\/'+length+'; \n ';


		str+= 'var a=oldRgbaData[point[('+length+'-1)/2]+3];';

		str+='return {r:r,g:g,b:b,a:a};';

		return new Function('point','oldRgbaData',str);
	};
	let getVal2 = createGetVal2(softenRadius);

	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		//获取周边9个点
		// let x0 = x-1,
		// 	x1 = x,
		// 	x2 = x+1,
		// 	y0 = y-1,
		// 	y1 = y,
		// 	y2 = y+1;
		//
		// x0 = (x0<0)? 0 : x0;
		// x2 = (x2>oldWidth)? oldWidth : x2;
		// y0 = (y0<0)? 0 : y0;
		// y2 = (y2>oldHeight)? oldHeight : y2;
		//
		// let p00 = (y0*oldWidth+x0)*4,
		// 	p10 = (y0*oldWidth+x1)*4,
		// 	p20 = (y0*oldWidth+x2)*4,
		// 	p01 = (y1*oldWidth+x0)*4,
		// 	p11 = (y1*oldWidth+x1)*4,
		// 	p21 = (y1*oldWidth+x2)*4,
		// 	p02 = (y2*oldWidth+x0)*4,
		// 	p12 = (y2*oldWidth+x1)*4,
		// 	p22 = (y2*oldWidth+x2)*4;
		//
		// let rgba = getVal(p00,p10,p20,p01,p11,p21,p02,p12,p22);

		// let points = _this.getPointInRadius({
		// 	x:x,
		// 	y:y,
		// 	width:oldWidth,
		// 	height:oldHeight,
		// 	radius:softenRadius
		// });
		let points = getPointsFn(x,y,oldWidth,oldHeight);
		// let rgba = getVal1(points);
		let rgba = getVal2(points,oldRgbaData);

		return {
			r:rgba.r,
			g:rgba.g,
			b:rgba.b,
			a:rgba.a
		}
	};




	return {
		filterFn:fn,
		newImage:newImage
	};
};