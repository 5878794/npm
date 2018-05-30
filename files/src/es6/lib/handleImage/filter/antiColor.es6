//antiColor 反色
//原理: 自身 = 255 - 自身


module.exports = function(){
	let newImage = new ImageData(this.width,this.height),
		newWidth  = newImage.width,
		// newHeight = newImage.height,
		oldRgbaData = this.rgbaData;
	// oldWidth = this.width,
	// oldHeight = this.height;


	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		let n = (y*newWidth+x)*4;

		return {
			r:255-oldRgbaData[n],
			g:255-oldRgbaData[n+1],
			b:255-oldRgbaData[n+2],
			a:oldRgbaData[n+3]
		}
	};




	return {
		filterFn:fn,
		newImage:newImage
	};
};