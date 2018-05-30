//gray 转灰度滤镜
//原理:
//gray = (r+g+b)/3


module.exports = function(){
	let newImage = new ImageData(this.width,this.height),
		newWidth  = newImage.width,
		// newHeight = newImage.height,
		oldRgbaData = this.rgbaData;
		// oldWidth = this.width,
		// oldHeight = this.height;


	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		let n = (y*newWidth+x)*4,
			all = (oldRgbaData[n]+oldRgbaData[n+1]+oldRgbaData[n+2])/3;

		return {
			r:all,
			g:all,
			b:all,
			a:oldRgbaData[n+3]
		}
	};




	return {
		filterFn:fn,
		newImage:newImage
	};
};