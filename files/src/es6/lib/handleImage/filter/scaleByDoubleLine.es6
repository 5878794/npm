//图片缩放  （速度中等，效果中等）
//双线行插值法
//https://zh.wikipedia.org/wiki/%E5%8F%8C%E7%BA%BF%E6%80%A7%E6%8F%92%E5%80%BC


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

	//权重计算的公式
	let getVal = function(p00,p10,p01,p11,xPer,yPer){
		return  (p10*xPer+p00*(1-xPer))*(1-yPer) +
				(p11*xPer+p01)*(1-xPer)*yPer
	};


	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		let _x = parseFloat(x/xScale),
			_y = parseFloat(y/yScale),
			_x0 = parseInt(_x),
			_y0 = parseInt(_y),
			_x1 = _x0 + 1,
			_y1 = _y0 + 1,
			_yPer = _y - _y0,
			_xPer = _x - _x0;

		_x1 = (_x1>oldWidth)? oldWidth : _x1;
		_y1 = (_y1>oldHeight)? oldHeight : _y1;

		//获得周围的四个点
		let p00 = (_y0*oldWidth+_x0)*4,
			p10 = (_y0*oldWidth+_x1)*4,
			p01 = (_y1*oldWidth+_x0)*4,
			p11 = (_y1*oldWidth+_x1)*4;


		return {
			r : getVal(
					oldRgbaData[p00],
					oldRgbaData[p10],
					oldRgbaData[p01],
					oldRgbaData[p11],
					_xPer,
					_yPer
				),
			g:  getVal(
					oldRgbaData[p00+1],
					oldRgbaData[p10+1],
					oldRgbaData[p01+1],
					oldRgbaData[p11+1],
					_xPer,
					_yPer
				),
			b:  getVal(
					oldRgbaData[p00+2],
					oldRgbaData[p10+2],
					oldRgbaData[p01+2],
					oldRgbaData[p11+2],
					_xPer,
					_yPer
				),
			a:  getVal(
					oldRgbaData[p00+3],
					oldRgbaData[p10+3],
					oldRgbaData[p01+3],
					oldRgbaData[p11+3],
					_xPer,
					_yPer
				)
		}
	};


	return {
		filterFn:fn,
		newImage:newImage
	};
};