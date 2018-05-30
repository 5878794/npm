//sculpture 雕刻

//原理:
//图像中的像素点  = 旁边的点（周围8个点都可以）-自身 + 127



module.exports = function(opt={}){
	let newImage = new ImageData(this.width,this.height),
		newWidth  = newImage.width,
		newHeight = newImage.height,
		oldRgbaData = this.rgbaData,
		oldWidth = this.width,
		oldHeight = this.height;

	let type = opt.type || 'left',
		number = opt.number || 127;


	let getVal = function(p00,p10,p20,p01,p11,p21,p02,p12,p22){
		let p;
		switch (type){
			case 'left':
				p = p01;
				break;
			case 'top':
				p = p10;
				break;
			case 'right':
				p = p21;
				break;
			case 'down':
				p = p12;
				break;
			case 'leftup':
				p = p00;
				break;
			case 'rightup':
				p = p20;
				break;
			case 'leftdown':
				p = p02;
				break;
			case 'rightdown':
				p = p22;
				break;
			default:
				p = p01;
				break;
		}


		let r = oldRgbaData[p] - oldRgbaData[p11] + number,
			g = oldRgbaData[p+1] - oldRgbaData[p11+1] + number,
			b = oldRgbaData[p+2] - oldRgbaData[p11+2] + number,
			a = oldRgbaData[p11+3];


		return {r,g,b,a};
	};


	//传入点新点图像点坐标点，通过原来点图像点计算新增
	let fn = function(x,y){
		//获取周边9个点
		let x0 = x-1,
			x1 = x,
			x2 = x+1,
			y0 = y-1,
			y1 = y,
			y2 = y+1;

		x0 = (x0<0)? 0 : x0;
		x2 = (x2>oldWidth)? oldWidth : x2;
		y0 = (y0<0)? 0 : y0;
		y2 = (y2>oldHeight)? oldHeight : y2;

		let p00 = (y0*oldWidth+x0)*4,
			p10 = (y0*oldWidth+x1)*4,
			p20 = (y0*oldWidth+x2)*4,
			p01 = (y1*oldWidth+x0)*4,
			p11 = (y1*oldWidth+x1)*4,
			p21 = (y1*oldWidth+x2)*4,
			p02 = (y2*oldWidth+x0)*4,
			p12 = (y2*oldWidth+x1)*4,
			p22 = (y2*oldWidth+x2)*4;

		let rgba = getVal(p00,p10,p20,p01,p11,p21,p02,p12,p22);

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