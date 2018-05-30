//scale 使用画布缩放



module.exports = function(opt={xScale:1,yScale:1,scale:null}){
	//处理参数
	let {xScale,yScale,scale} = opt;
	if(scale){
		xScale = scale;
		yScale = scale;
	}
	xScale = xScale || 1;
	yScale = yScale || 1;

	let oldRgbaData = this.data,
		oldWidth = this.width,
		oldHeight = this.height,
		newWidth  = Math.round(oldWidth*xScale),
		newHeight = Math.round(oldHeight*yScale);

	let canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');
	canvas.width = oldWidth;
	canvas.height = oldHeight;
	ctx.putImageData(oldRgbaData,0,0);


	let src = canvas.toDataURL();
	canvas.width = newWidth;
	canvas.height = newHeight;

	let img = new Image();

	return new Promise((success,error)=>{
		img.onload = function(){
			ctx.drawImage(this,0,0,oldWidth,oldHeight,0,0,newWidth,newHeight);
			success(canvas.toDataURL());
		};
		img.onerror = function(){
			error('加载失败')
		};
		img.src = src;
	});


};