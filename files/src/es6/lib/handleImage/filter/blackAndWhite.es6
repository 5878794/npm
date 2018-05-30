//blackAndWhite 图片转黑白
//原理:
//先转  gray = (r+g+b)/3
//取0-255的中间值127来比较   大于转255  下于等于转0


module.exports = function(){
	let newImage = new ImageData(this.width,this.height),
		newWidth  = newImage.width,
		// newHeight = newImage.height,
		oldRgbaData = this.rgbaData;
	// oldWidth = this.width,
	// oldHeight = this.height;


	//获取最小最大 灰度值 ，并求出中间灰度值
	let minGray,maxGray,centerGray;
	for(let i=0,l=oldRgbaData.length/4;i<l;i++){
		let gray = (oldRgbaData[i]+oldRgbaData[i+1]+oldRgbaData[i+2])/3;
		if(!minGray){
			minGray = gray;
		}else{
			minGray = (minGray>gray)? gray : minGray;
		}
		if(!maxGray){
			maxGray = gray;
		}else{
			maxGray = (maxGray>gray)? maxGray : gray;
		}
	}
	centerGray = (maxGray - minGray)/2 + minGray;


	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		let n = (y*newWidth+x)*4,
			all = (oldRgbaData[n]+oldRgbaData[n+1]+oldRgbaData[n+2])/3,
			nowVal = (all>centerGray)? 255 : 0;

		return {
			r:nowVal,
			g:nowVal,
			b:nowVal,
			a:255
		}
	};




	return {
		filterFn:fn,
		newImage:newImage
	};
};