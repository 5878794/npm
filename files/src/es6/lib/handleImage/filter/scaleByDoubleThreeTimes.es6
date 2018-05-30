//图片缩放  （速度超慢，效果较好）
//双三次插值
//https://zh.wikipedia.org/wiki/%E5%8F%8C%E4%B8%89%E6%AC%A1%E6%8F%92%E5%80%BC


module.exports = function(opt={xScale:1,yScale:1,scale:null}){
	//处理参数
	let {xScale,yScale,scale} = opt;
	if(scale){
		xScale = scale;
		yScale = scale;
	}
	xScale = xScale || 1;
	yScale = yScale || 1;

	let oldRgbaData = this.rgbaData,
		oldWidth = this.width,
		oldHeight = this.height,
		newWidth  = Math.round(oldWidth*xScale),
		newHeight = Math.round(oldHeight*yScale),
		newImage = new ImageData(newWidth,newHeight);

	//权重函数
	let lengthWeights = function(l){
		let a = -0.5;
		l = Math.abs(l);

		if(l<=1){
			return (a+2)*l*l*l - (a+3)*l*l + 1;
		}else if(l>1 && l<2){
			return a*l*l*l - 5*a*l*l + 8*a*l - 4*a;
		}else{
			return 0;
		}
	};


	let getCacheLengthWeights = function(xPer,yPer){
		let x0 = lengthWeights(-1-xPer),
			x1 = lengthWeights(-xPer),
			x2 = lengthWeights(1-xPer),
			x3 = lengthWeights(2-xPer),
			y0 = lengthWeights(-1-yPer),
			y1 = lengthWeights(-yPer),
			y2 = lengthWeights(1-yPer),
			y3 = lengthWeights(2-yPer);

		return {
			p00:x0*y0,
			p10:x1*y0,
			p20:x2*y0,
			p30:x3*y0,
			p01:x0*y1,
			p11:x1*y1,
			p21:x2*y1,
			p31:x3*y1,
			p02:x0*y2,
			p12:x1*y2,
			p22:x2*y2,
			p32:x3*y2,
			p03:x0*y3,
			p13:x1*y3,
			p23:x2*y3,
			p33:x3*y3
		}

	};


	//取值计算函数
	let getVal = function(p00,p10,p20,p30,p01,p11,p21,p31,p02,p12,p22,p32,p03,p13,p23,p33,xPer,yPer){
		let weights = getCacheLengthWeights(xPer,yPer);

		let r = oldRgbaData[p00] * weights.p00 +
				oldRgbaData[p10] * weights.p10 +
				oldRgbaData[p20] * weights.p20 +
				oldRgbaData[p30] * weights.p30 +
				oldRgbaData[p01] * weights.p01 +
				oldRgbaData[p11] * weights.p11 +
				oldRgbaData[p21] * weights.p21 +
				oldRgbaData[p31] * weights.p31 +
				oldRgbaData[p02] * weights.p02 +
				oldRgbaData[p12] * weights.p12 +
				oldRgbaData[p22] * weights.p22 +
				oldRgbaData[p32] * weights.p32 +
				oldRgbaData[p03] * weights.p03 +
				oldRgbaData[p13] * weights.p13 +
				oldRgbaData[p23] * weights.p23 +
				oldRgbaData[p33] * weights.p33 ;

		let g = oldRgbaData[p00+1] * weights.p00 +
				oldRgbaData[p10+1] * weights.p10 +
				oldRgbaData[p20+1] * weights.p20 +
				oldRgbaData[p30+1] * weights.p30 +
				oldRgbaData[p01+1] * weights.p01 +
				oldRgbaData[p11+1] * weights.p11 +
				oldRgbaData[p21+1] * weights.p21 +
				oldRgbaData[p31+1] * weights.p31 +
				oldRgbaData[p02+1] * weights.p02 +
				oldRgbaData[p12+1] * weights.p12 +
				oldRgbaData[p22+1] * weights.p22 +
				oldRgbaData[p32+1] * weights.p32 +
				oldRgbaData[p03+1] * weights.p03 +
				oldRgbaData[p13+1] * weights.p13 +
				oldRgbaData[p23+1] * weights.p23 +
				oldRgbaData[p33+1] * weights.p33 ;

		let b = oldRgbaData[p00+2] * weights.p00 +
				oldRgbaData[p10+2] * weights.p10 +
				oldRgbaData[p20+2] * weights.p20 +
				oldRgbaData[p30+2] * weights.p30 +
				oldRgbaData[p01+2] * weights.p01 +
				oldRgbaData[p11+2] * weights.p11 +
				oldRgbaData[p21+2] * weights.p21 +
				oldRgbaData[p31+2] * weights.p31 +
				oldRgbaData[p02+2] * weights.p02 +
				oldRgbaData[p12+2] * weights.p12 +
				oldRgbaData[p22+2] * weights.p22 +
				oldRgbaData[p32+2] * weights.p32 +
				oldRgbaData[p03+2] * weights.p03 +
				oldRgbaData[p13+2] * weights.p13 +
				oldRgbaData[p23+2] * weights.p23 +
				oldRgbaData[p33+2] * weights.p33 ;

		let a = oldRgbaData[p00+3] * weights.p00 +
				oldRgbaData[p10+3] * weights.p10 +
				oldRgbaData[p20+3] * weights.p20 +
				oldRgbaData[p30+3] * weights.p30 +
				oldRgbaData[p01+3] * weights.p01 +
				oldRgbaData[p11+3] * weights.p11 +
				oldRgbaData[p21+3] * weights.p21 +
				oldRgbaData[p31+3] * weights.p31 +
				oldRgbaData[p02+3] * weights.p02 +
				oldRgbaData[p12+3] * weights.p12 +
				oldRgbaData[p22+3] * weights.p22 +
				oldRgbaData[p32+3] * weights.p32 +
				oldRgbaData[p03+3] * weights.p03 +
				oldRgbaData[p13+3] * weights.p13 +
				oldRgbaData[p23+3] * weights.p23 +
				oldRgbaData[p33+3] * weights.p33 ;

		return {r,g,b,a};
	};




	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		let _x = parseFloat(x/xScale),
			_y = parseFloat(y/yScale),
			_x1 = parseInt(_x),
			_y1 = parseInt(_y),
			_x0 = _x1 - 1,
			_y0 = _y1 - 1,
			_x2 = _x1 + 1,
			_y2 = _y1 + 1,
			_x3 = _x1 + 2,
			_y3 = _y1 + 2,
			_yPer = _y - _y1,
			_xPer = _x - _x1;

		//获取周边16个点
		_x0 = (_x0 < 0 )? 0 : _x0;
		_y0 = (_y0 < 0 )? 0 : _y0;
		_x2 = (_x2 > oldWidth)? oldWidth : _x2;
		_x3 = (_x3 > oldWidth)? oldWidth : _x3;
		_y2 = (_y2 > oldHeight)? oldHeight : _y2;
		_y3 = (_y3 > oldHeight)? oldHeight : _y3;

		let p00 = (_y0*oldWidth+_x0)*4,
			p10 = (_y0*oldWidth+_x1)*4,
			p20 = (_y0*oldWidth+_x2)*4,
			p30 = (_y0*oldWidth+_x3)*4,
			p01 = (_y1*oldWidth+_x0)*4,
			p11 = (_y1*oldWidth+_x1)*4,
			p21 = (_y1*oldWidth+_x2)*4,
			p31 = (_y1*oldWidth+_x3)*4,
			p02 = (_y2*oldWidth+_x0)*4,
			p12 = (_y2*oldWidth+_x1)*4,
			p22 = (_y2*oldWidth+_x2)*4,
			p32 = (_y2*oldWidth+_x3)*4,
			p03 = (_y3*oldWidth+_x0)*4,
			p13 = (_y3*oldWidth+_x1)*4,
			p23 = (_y3*oldWidth+_x2)*4,
			p33 = (_y3*oldWidth+_x3)*4;

		let rgba = getVal(p00,p10,p20,p30,p01,p11,p21,p31,p02,p12,p22,p32,p03,p13,p23,p33,_xPer,_yPer);

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