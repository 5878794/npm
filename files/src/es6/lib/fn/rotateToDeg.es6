//无限旋转 最终停在指定的角度

//  360／rotateSpd 必须是整数     eg:10,20,30,18



var device = require("./../device"),
	nextFrame = device.nextFrame,
	cancelFrame = device.cancelFrame;


// var nextFrame = window.requestAnimationFrame,
// 	cancelFrame = window.cancelAnimationFrame;


class rotateToDeg{
	constructor(opt){
		//初始角度
		this.startDeg = opt.startDeg || 0;
		//旋转速度  每帧多少度    一秒60帧
		this.rotateSpd = opt.rotateSpd || 10;
		//每一帧的 角度返回给回调
		this.stepFn = opt.stepFn || function(){};
		this.callback = null;


		this.nowDeg = this.startDeg;
		this.startLessDeg = null;
		this.animateFn = null;
		this.isStartLess = false;

		this.startRotate();

	}
	//开始无限循环旋转
	startRotate(){
		let _this = this;

		var __step__ = function(){
			let deg;

			if(_this.startLessDeg != null && !_this.isStartLess){
				if(_this.nowDeg == _this.startLessDeg){
					_this.isStartLess = true;
					_this.nowDeg += _this.rotateSpd/2;
				}
			}


			if(_this.isStartLess){
				_this.rotateSpd -= _this.lessSpd;
				deg =_this.nowDeg + _this.rotateSpd;

			}else{
				deg =_this.nowDeg + _this.rotateSpd;
			}

			deg = (deg >= 360)? deg - 360 : deg;
			_this.nowDeg = deg;

			_this.stepFn(_this.nowDeg);

			if(_this.rotateSpd<=0){
				_this.stepFn(_this.endDeg);
				_this.callback();
				cancelFrame(_this.animateFn);
			}else{
				_this.animateFn = nextFrame(__step__);
			}
		};

		__step__();
	}

	stopRotate(deg=0,callback){
		this.callback = callback || function(){};

		let //到停止需要走多少度
			allDeg = 360*3+deg,
			//时间
			time = allDeg/(this.rotateSpd/2),
			lessSpd = this.rotateSpd/time,

			//开始添加减速度度角度
			startLessDeg = 0;

		this.lessSpd = lessSpd;
		this.startLessDeg = startLessDeg;
		this.endDeg = deg;
	}




}


module.exports = rotateToDeg;