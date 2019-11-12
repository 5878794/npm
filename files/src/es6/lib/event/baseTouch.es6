
//触摸事件基础类

//eventParam 改成  DEVICE.eventParam1 可以加e.stopPropagation() 阻止dom元素上的onclick事件


// eventParam1 = {passive:true,capture:true}
// passive:true   忽略默认事件的阻止
// capture:true   使用事件的捕获，事件中的执行优先级最高
//                阻止冒泡可以使dom及其的子元素接收不到事件



let device = require("../device"),
	eventParam = device.eventParam,
	addEvent = Symbol(),
	startEventFn = Symbol(),
	moveEventFn = Symbol(),
	endEventFn = Symbol(),
	cancelEventFn = Symbol(),
	savePoint = Symbol(),
	getPoint = Symbol(),
	refresh = Symbol();


class BaseTouch{
	constructor(opt = {}){
		//该类不能直接使用,必须继承使用
		// if(new.target.name == "BaseTouch"){
		// 	console.log("this class can not to use!!!!!  must extends");
		// 	return;
		// }


		//监听的对象
		this.dom = opt.dom || $(document);
		//点击开始的时间
		this.touchStartTime = 0;
		//点击对象
		this.target = null;
		//每次点击到放开时的点坐标 集合
		this.points = [];



		this[startEventFn] = null;
		this[moveEventFn] = null;
		this[endEventFn] = null;
		this[cancelEventFn] = null;



		this[addEvent]();
	}

	//添加事件
	[addEvent](){
		this.dom.get(0).addEventListener(device.START_EV,this[startEventFn] = (e)=>{
			this.startFn(e);
		},eventParam);
		this.dom.get(0).addEventListener(device.MOVE_EV,this[moveEventFn] = (e)=>{
			this.moveFn(e);
		},eventParam);
		this.dom.get(0).addEventListener(device.END_EV,this[endEventFn] = (e)=>{
			this.endFn(e);
		},eventParam);
		this.dom.get(0).addEventListener(device.CANCEL_EV,this[cancelEventFn] = (e)=>{

			this.endFn(e);
		},eventParam);
	}

	//保存点
	[savePoint](x,y){
		if(x && y){
			this.points.push({x,y});
		}
	}

	//获取x,y坐标
	[getPoint](e){
		// let touch;
		// if(device.isPhone){
		// 	touch=e.touches[0] || {};
		// }else{
		// 	touch=e;
		// }

		let x = e.clientX,
			y = e.clientY;

		if(e.touches && e.touches[0]){
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		}

		return {x,y}
	}

	//刷新参数
	[refresh](){
		this.points = [];
	}

	startFn(e){
		this[refresh]();
		let {x,y} = this[getPoint](e);
		this[savePoint](x,y);
		this.touchStartTime = e.timestamp;
		this.target = e.target;
	}

	moveFn(e){
		let {x,y} = this[getPoint](e);
		this[savePoint](x,y);
	}

	endFn(e){
		let {x,y} = this[getPoint](e);
		this[savePoint](x,y);
	}

	destroy(){
		this.dom.get(0).removeEventListener(device.START_EV,this[startEventFn],false);
		this.dom.get(0).removeEventListener(device.MOVE_EV,this[moveEventFn],false);
		this.dom.get(0).removeEventListener(device.END_EV,this[endEventFn],false);
		this.dom.get(0).removeEventListener(device.CANCEL_EV,this[cancelEventFn],false);
	}
}



module.exports = BaseTouch;