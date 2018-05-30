//gaussianBlur 高斯模糊

//原理:
//http://blog.csdn.net/u012992171/article/details/51023768

//number:模糊半径

module.exports = function(number){
	let newImage = new ImageData(this.width,this.height),
		newWidth  = newImage.width,
		newHeight = newImage.height,
		oldRgbaData = this.rgbaData,
		oldWidth = this.width,
		oldHeight = this.height,
		_this = this,
		radius = number || 3;

	//计算权重
	//x,y到中心点的距离
	let getWeight = function(x,y){
		let sigma = (radius*2+1)/2;

		let weight = (1/(2*Math.PI*sigma*sigma))*Math.pow(Math.E,((-(x*x+y*y))/((2*sigma)*(2*sigma))));

		return weight;
	};

	//计算滤镜矩阵
	let getFilterFn = function(){
		let filter = [];

		//计算每个点的权重
		for(let y=0,yl=radius*2+1;y<yl;y++){
			for(let x=0,xl=radius*2+1;x<xl;x++){
				filter.push(
					getWeight(x-radius,radius-y)
				)
			}
		}

		//计算权重的和
		let all = 0;
		filter.map(rs=>{
			all += rs;
		});

		//让权重和为1
		filter = filter.map(rs=>{
			return rs/all;
		});

		return filter;

	};

	let filter = getFilterFn();

	// let getVal = function(p00,p10,p20,p01,p11,p21,p02,p12,p22){
	// 	let r = oldRgbaData[p00]*filter[0] +
	// 			oldRgbaData[p10]*filter[1] +
	// 			oldRgbaData[p20]*filter[2] +
	// 			oldRgbaData[p01]*filter[3] +
	// 			oldRgbaData[p11]*filter[4] +
	// 			oldRgbaData[p21]*filter[5] +
	// 			oldRgbaData[p02]*filter[6] +
	// 			oldRgbaData[p12]*filter[7] +
	// 			oldRgbaData[p22]*filter[8],
	// 		g = oldRgbaData[p00+1]*filter[0] +
	// 			oldRgbaData[p10+1]*filter[1] +
	// 			oldRgbaData[p20+1]*filter[2] +
	// 			oldRgbaData[p01+1]*filter[3] +
	// 			oldRgbaData[p11+1]*filter[4] +
	// 			oldRgbaData[p21+1]*filter[5] +
	// 			oldRgbaData[p02+1]*filter[6] +
	// 			oldRgbaData[p12+1]*filter[7] +
	// 			oldRgbaData[p22+1]*filter[8],
	// 		b = oldRgbaData[p00+2]*filter[0] +
	// 			oldRgbaData[p10+2]*filter[1] +
	// 			oldRgbaData[p20+2]*filter[2] +
	// 			oldRgbaData[p01+2]*filter[3] +
	// 			oldRgbaData[p11+2]*filter[4] +
	// 			oldRgbaData[p21+2]*filter[5] +
	// 			oldRgbaData[p02+2]*filter[6] +
	// 			oldRgbaData[p12+2]*filter[7] +
	// 			oldRgbaData[p22+2]*filter[8],
	// 		a = oldRgbaData[p00+3];
	//
	//
	//
	// 	return {r,g,b,a};
	// };

	let getVal1 = function(points){
		let rgba = [];
		for(let i=0,l=3;i<l;i++){
			//加权分别求rgb的和
			let all = 0;
			points.map((val,n)=>{
				all += oldRgbaData[val+i]*filter[n];
			});
			rgba.push(all);
		}

		//获取当前点的a
		let center = points[(points.length-1)/2];
		let a = oldRgbaData[center+3];

		let [r,g,b] = rgba;
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
			radius:radius
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