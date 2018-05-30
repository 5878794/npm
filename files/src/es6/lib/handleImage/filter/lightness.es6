//lightness 亮度调整

//number为增加亮度的数值 (负值变暗,正值变亮)  范围 0-255
//原理:
//图像的rgb同时增加number的值



module.exports = function(number){
	let newImage = new ImageData(this.width,this.height),
		newWidth  = newImage.width,
		// newHeight = newImage.height,
		oldRgbaData = this.rgbaData;
	// oldWidth = this.width,
	// oldHeight = this.height;


	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		let n = (y*newWidth+x)*4,
			r = oldRgbaData[n],
			g = oldRgbaData[n+1],
			b = oldRgbaData[n+2];

		r = (r+number>255)? 255 : (r+number<0)? 0 : r+number;
		g = (g+number>255)? 255 : (g+number<0)? 0 : g+number;
		b = (b+number>255)? 255 : (b+number<0)? 0 : b+number;

		return {
			r:r,
			g:g,
			b:b,
			a:oldRgbaData[n+3]
		}
	};




	return {
		filterFn:fn,
		newImage:newImage
	};
};