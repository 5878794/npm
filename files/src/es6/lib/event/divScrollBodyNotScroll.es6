//弹出层fixed定位滚动时阻止body滚动
////注意：canScrollDom 不要设置padding或margin

//初始化
// let aa = new divScrollBodyNotScroll({
// 	canScrollDom:main,                  //可以滚动的div部分   jqobj
// 	notScrollDom:zz                     //不可以滚动的div部分  jqobj
// });

//注销
// aa.destroy();


let basTouch = require('../event/baseTouch');


class divScrollBodyNotScroll extends basTouch{
	constructor(opt){
		super(opt);

		this.canScrollDom = $(opt.canScrollDom).get(0);   //jq dom
		this.notScrollDom = $(opt.notScrollDom).get(0);   //jq dom

		this.findTargetParent = null;
		this.scrollState = null;

	}



	startFn(e){
		super.startFn(e);

		this.findTargetParent = null;
		this.scrollState = null;


		let target = this.target;

		while(
			target &&
			target != this.canScrollDom &&
			target != this.notScrollDom
		){
			target = target.parentElement;
		}

		this.findTargetParent =
			(target == this.canScrollDom || target == this.notScrollDom)?
			target :
			null;


		if(target == this.canScrollDom){
			let height = Math.ceil($(this.canScrollDom).height()),
				scrollHeight = this.canScrollDom.scrollHeight;

			let domScrollMaxTop = scrollHeight - height,
				scrollTop = this.canScrollDom.scrollTop;

			if(scrollTop <= 0){
				this.scrollState = 'top';
			}
			if(scrollTop>= domScrollMaxTop){
				this.scrollState = 'bottom';
			}
		}
	}



	moveFn(e){
		super.moveFn(e);

		if(this.findTargetParent == this.notScrollDom){
			e.preventDefault();
		}
		//滑动时在div上 并且滚动条在2端
		if(this.findTargetParent == this.canScrollDom && this.scrollState){
			//获取滚动的方向 只判断上下方向   不考虑横向滑动
			let startPoint = this.points[0].y,
				l = this.points.length,
				endPoint = this.points[l-1].y;

			//滚动条在顶端且下滑 阻止
			if(this.scrollState == 'top' && endPoint > startPoint){
				e.preventDefault();
			}
			//滚动条在顶端且上滑 阻止
			if(this.scrollState == 'bottom' && startPoint > endPoint){
				e.preventDefault();
			}
		}
	}

}



module.exports = divScrollBodyNotScroll;

