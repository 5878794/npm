//scaleByNear 临近插值法
//图片缩放  (速度快,有锯齿)
//原理：取点点时候四舍五入取最近点点颜色值


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


	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		let _x = Math.round(x/xScale),
			_y = Math.round(y/yScale),
			n = (_y*oldWidth+_x)*4;

		return {
			r:oldRgbaData[n],
			g:oldRgbaData[n+1],
			b:oldRgbaData[n+2],
			a:oldRgbaData[n+3]
		}
	};


	return {
		filterFn:fn,
		newImage:newImage
	};
};