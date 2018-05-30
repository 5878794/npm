//diffusion 扩散   有点像毛玻璃的效果

//原理:
//图像中的像素点  = 自身周围9个点随机取一个点代替

//number  扩散的半径


module.exports = function(number){
	let newImage = new ImageData(this.width,this.height),
		newWidth  = newImage.width,
		newHeight = newImage.height,
		oldRgbaData = this.rgbaData,
		oldWidth = this.width,
		oldHeight = this.height,
		_this = this,
		diffRadius = number || 1;

	// let getVal = function(p00,p10,p20,p01,p11,p21,p02,p12,p22){
	// 	let n = parseInt(Math.random()*9),
	// 		nowP = arguments[n];
	//
	//
	// 	let r = oldRgbaData[nowP],
	// 		g = oldRgbaData[nowP+1],
	// 		b = oldRgbaData[nowP+2],
	// 		a = oldRgbaData[nowP+3];
	//
	//
	// 	return {r,g,b,a};
	// };

	let getVal1 = function(points){
		let n = parseInt(Math.random()*points.length),
			nowP = points[n];

		let r = oldRgbaData[nowP],
			g = oldRgbaData[nowP+1],
			b = oldRgbaData[nowP+2],
			a = oldRgbaData[nowP+3];

		return {r,g,b,a};
	};


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
		let points = _this.getPointInRadius({
			x:x,
			y:y,
			width:oldWidth,
			height:oldHeight,
			radius:diffRadius
		});
		let rgba = getVal1(points);

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