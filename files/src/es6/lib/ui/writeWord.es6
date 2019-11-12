
//手写板


let device = require('../device');


class writeWord{
	constructor(opt){
		this.domId = opt.domId;


		this.lineWidth = opt.lineWidth || 2;
		this.lineColor = opt.lineColor || '#000';
		this.bgColor = opt.bgColor || '#fff';
		this.canvas = null;
		this.ctx = null;
		this.sfn = null;
		this.mfn = null;
		this.efn = null;
		this.hasTouch = false;
		this.offset = null;

		this.setStyle();
		this.addEvent();
	}
	setStyle(){
		let canvas = document.createElement('canvas'),
			dom = $('#'+this.domId),
			width = parseInt(dom.width()),
			height = parseInt(dom.height());

		this.offset = dom.offset();
		this.offset.top = this.offset.top - window.scrollY;

		dom.append($(canvas));

		$(canvas).css({
			width:width+'px',
			height:height+'px'
		});
		canvas.width = width;
		canvas.height =height;

		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');

		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, width, height);
		this.ctx.strokeStyle = this.lineColor;
		this.ctx.lineWidth = this.lineWidth;
	}

	addEvent(){
		let _this = this;
		this.canvas.addEventListener(device.START_EV,this.sfn = function(e){
			e.preventDefault();
			e.stopPropagation();
			_this.sDraw(e);
		},device.eventParam);
		this.canvas.addEventListener(device.MOVE_EV,this.mfn = function(e){
			e.preventDefault();
			e.stopPropagation();
			_this.mDraw(e);
		},device.eventParam);
		this.canvas.addEventListener(device.END_EV,this.efn = function(e){
			e.preventDefault();
			e.stopPropagation();
			_this.eDraw(e);
		},device.eventParam);
	}

	getPointXY(e){
		e = (e.touches)? e.touches[0] : e;
		return {
			x:e.clientX - this.offset.left,
			y:e.clientY - this.offset.top
		}
	}

	sDraw(e){
		this.hasTouch = true;

		let p = this.getPointXY(e);
		this.ctx.beginPath();
		this.ctx.moveTo(p.x, p.y);
	}
	mDraw(e){
		if(!this.hasTouch){return;}

		let p = this.getPointXY(e),
			x = p.x,
			y = p.y;

		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	}
	eDraw(){
		if(!this.hasTouch){return;}
		this.hasTouch = false;
		this.ctx.closePath();
	}

	saveToImg(){
		var imgBase64 = this.canvas.toDataURL();

		return imgBase64;
	}

	emptyCanvas(){
		let width = this.canvas.width,
			height = this.canvas.height;
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, width, height);
	}


	destroy(){
		this.canvas.removeEventListener(device.START_EV,this.sfn,device.eventParam);
		this.canvas.removeEventListener(device.MOVE_EV,this.mfn,device.eventParam);
		this.canvas.removeEventListener(device.END_EV,this.efn,device.eventParam);
		$('#'+this.domId).html('');
	}

}



module.exports = writeWord;