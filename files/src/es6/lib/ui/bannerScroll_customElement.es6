//banner横向滚动动画,依赖$$点击事件



// new DEVICE.bannerAnimate({
// 	win: body,                      @param:jqobj    外层窗口
// 	body: $("#story_mains"),        @param:jqobj    滑动层
// 	time: 2000,                     @param:number   滑动间隔时间
// 	animateTime: win_width,         @param:number   滑动动画时间
// 	showPoint:false,                @param:number   是否显示下面的小点
// 	leftBtn:$("#story_right_btn"),  @param:jqobj    左滑动按钮
// 	rightBtn:$("#story_left_btn"),  @param:jqobj    右滑动按钮
//  changeStartFn:function(page){}, @param:fn       滑动开始时执行函数，传递当前要滑动到的页面number
//  changeEndFn:function(page){}    @param:fn       滑动结束时执行函数，传递当前要滑动到的页面number
// });





require("./../jq/extend");
require("./../jq/cssAnimate");
var device = require("./../device"),
	$$ = require("./../event/$$");



var scrollBanner = function (data) {
	this.win = data.win;            //包裹层
	this.body = data.body;          //移动层
	this.customElementShadow = data.pointBody;
	this.imgLength = this.win.children().length;
	this.time = data.time || 5000;      //动画间隔时间
	this.animateTime = data.animateTime || 1000;    //动画时间
	this.showPoint = $.isBoolean(data.showPoint)? data.showPoint : true;
	this.leftBtn = data.rightBtn;
	this.rightBtn = data.leftBtn;
	this.pointBg = data.pointBg || "rgb(70,65,68)";
	this.pointSelectBg = data.pointSelectBg || "#fff";
	this.changeStartFn = data.changeStartFn || function(){};
	this.changeEndFn = data.changeEndFn || function(){};
	this.pointMarginBottom = data.pointMarginBottom || '40px';
	this.dir = data.dir || 'row';


	this.winWidth = parseInt(this.win.width());
	this.winHeight = parseInt(this.win.height());

	this.page = 0;
	this.maxPage = this.imgLength - 1;

	this.intervalFn = null;
	this.points = [];
	this.pointBody = null;

	this.touchStartTime = 0;
	this.touchPoints = [];
	this.leftPx = 0;
	this.init();
};
scrollBanner.prototype = {
	init: function () {
		this.styleSet();
		this.addPoint();
		this.setDiv();
		this.addEvent();


	},
	//设置样式
	styleSet: function () {
		this.win.css({
			position: "relative",
			overflow: "hidden"
		});

		this.body.css({
			position: "absolute",
			left: 0,
			top: 0
		});

		this.win.children().css({
			// display: "block",
			width: this.winWidth + "px",
			height: this.winHeight + "px",
			border: "none",
			overflow: "hidden",
			"position": "relative"
		});

		if(this.dir == 'row'){
			this.win.children().css({
				float: "left",
			});
		}

	},
	//添加指示的点点
	addPoint: function () {
		var _this = this;

		var div = $("<div></div>"),
			width = _this.imgLength * 50,
			display = (this.showPoint)? "block" : "none";
		div.css({
			width: width + "px",
			height: "10px",
			position: "absolute",
			bottom: this.pointMarginBottom,
			left: "50%",
			"margin-left": -width / 2 + "px",
			display:display,
			"z-index":9999
		});


		var span = $("<div></div>");
		span.css({
			width: "40px",
			height: "4px",
			margin: "0 5px",
			background: this.pointBg,
			cursor:'pointer',
			// "border-radius": "5px",
			float: "left",
			// border:"1pt solid transparent",
			'box-sizing':'border-box'
		}).addClass("border_box");

		for (var i = 0, l = this.imgLength; i < l; i++) {
			var this_item = span.clone().attr({ n: i });
			if (i == 0) {
				this_item.css({ background: this.pointSelectBg,"border-color":"#fff" })
			}
			div.append(this_item);
		}
		this.points = div.find("div");
		this.pointBody = div;

		this.customElementShadow.append(div)
	},
	//设置窗口参数等
	setDiv: function () {
		this.body.stop(true, true);

		this.winWidth = parseInt(this.win.width());
		this.winHeight = parseInt(this.win.height());


		let width,height;
		if(this.dir == 'row'){
			width = this.winWidth * this.imgLength;
			width = width + 'px';
			height = '100%';
		}else{
			width = '100%';
			height = this.winHeight * this.imgLength;
			height = height + 'px';
		}

		this.body.css({
			width: width,
			height: height
		});
		this.win.children().css({
			width: this.winWidth + "px",
			height: this.winHeight + 'px'
		})





	},
	//添加事件
	addEvent: function () {
		var _this = this;
		window.addEventListener("resize",_this.resizeFn = function(){
			_this.setDiv();
		},false);

		var temp_fn = function () {
			if (_this.imgLength <= 1) {
				return;
			}
			_this.intervalFn = setInterval(function () {
				_this.page++;
				_this.animate();
			}, _this.time);

			_this.animate();

		};


		if (!device.hasTouch) {
			this.win.hover(function () {
				_this.body.stop(true);
				clearInterval(_this.intervalFn);
				_this.intervalFn = null;
			}, function () {
				if (!_this.intervalFn) {
					temp_fn();
				}
			});


			this.points.mouseover(function () {
				_this.page = $(this).attr("n");
				_this.animate();
			});


			temp_fn();
		} else {
			var win_obj = this.win.get(0);
			win_obj.addEventListener(device.START_EV, _this.startEventFn = function (e) {

				_this.body.stop(true);
				clearInterval(_this.intervalFn);
				_this.leftPx = parseInt(_this.body.css("left"));
				_this.intervalFn = null;
				_this.startEvent(e);
			}, device.eventParam);
			win_obj.addEventListener(device.MOVE_EV, _this.moveEventFn = function (e) {
				_this.savePoint(e);

				var lastpoint = _this.touchPoints[_this.touchPoints.length - 1];
				var lastpointx = lastpoint.x;
				var lastpointy = lastpoint.y;

				var startpoint = _this.touchPoints[0];
				var startpointx = startpoint.x;
				var startpointy = startpoint.y;

				var pointsx = lastpointx - startpointx;
				var pointsy = lastpointy - startpointy;

				if (Math.abs(pointsx) > Math.abs(pointsy)) {
					e.preventDefault();

					if(this.dir == 'row'){
						_this.moveEvent(e, pointsx);
					}else{
						_this.moveEvent(e, pointsy);
					}
				}

			}, device.eventParam);
			win_obj.addEventListener(device.END_EV, _this.endEventFn = function (e) {
				_this.endEvent(e);
				if (!_this.intervalFn) {
					temp_fn();
				}
			}, false);
			temp_fn();
		}


		if(this.leftBtn){
			$$(this.leftBtn).myclickok(function(){
				clearInterval(_this.intervalFn);
				_this.intervalFn = null;
				temp_fn();
				_this.page++;
				_this.animate();
			});
		}

		if(this.rightBtn){
			$$(this.rightBtn).myclickok(function(){
				clearInterval(_this.intervalFn);
				_this.intervalFn = null;
				temp_fn();
				_this.page--;
				_this.animate();
			});
		}



	},
	//动画
	animate: function () {
		this.page = (this.page > this.maxPage) ? 0 : this.page;
		this.page = (this.page < 0)? this.maxPage : this.page;

		this.points.css({ background: this.pointBg });
		this.points.eq(this.page).css({ background: this.pointSelectBg,"border-color":"#fff"  });

		this.body.get(0).style[device._transitionDuration] = "";

		this.changeStartFn(this.page);
		var _this = this;

		let animateCss;
		if(this.dir == 'row'){
			animateCss = {left: -this.page * this.winWidth + "px"};
		}else{
			animateCss = {top: -this.page * this.winHeight + "px"};
		}


		this.body.cssAnimate(animateCss, this.animateTime,function(){
			_this.changeEndFn(_this.page);
		});

	},
	startEvent: function (e) {
		this.touchPoints = [];
		this.touchStartTime = new Date().getTime();
		this.savePoint(e);
	},
	moveEvent: function (e, pointsx) {
		if (this.touchStartTime == 0) {
			return;
		}

		if(this.dir == 'row'){
			let t_left = this.leftPx + pointsx;
			this.body.css({
				left: t_left + "px"
			});
		}else{
			let t_left = this.leftPx + pointsx;
			this.body.css({
				top: t_left + "px"
			});
		}
	},
	endEvent: function () {
		if (this.touchStartTime == 0) {
			this.scrollBack();
			return;
		}
		if (this.touchPoints.length < 2) {
			this.scrollBack();
			return;
		}

		var end_time = new Date().getTime(),
			use_time = end_time - this.touchStartTime,
			_this = this;

		this.touchStartTime = 0;


		var lastpoint = this.touchPoints[this.touchPoints.length - 1];
		var lastpointx = lastpoint.x;
		var lastpointy = lastpoint.y;

		var startpoint = this.touchPoints[0];
		var startpointx = startpoint.x;
		var startpointy = startpoint.y;

		var pointsx = Math.abs(startpointx - lastpointx);
		var pointsy = Math.abs(startpointy - lastpointy);

		let moveDir;
		if(this.dir == 'row'){
			moveDir = (pointsx > pointsy);
		}else{
			moveDir = (pointsy > pointsx);
		}

		if (use_time < 500 && pointsx > 30 && moveDir) {
			if (startpointx > lastpointx) {
				_this.page++;
				_this.page = (_this.page > _this.maxPage) ? _this.maxPage : _this.page;
				_this.animate();
			} else {
				_this.page--;
				_this.page = (_this.page >= 0) ? _this.page : 0;
				_this.animate();
			}
		} else {
			//back roll
			_this.scrollBack();
		}


	},
	savePoint: function (e) {
		var touch;
		if (device.hasTouch) {
			touch = e.touches[0];
		} else {
			touch = e;
		}
		this.touchPoints.push({ x: touch.pageX, y: touch.pageY });
	},
	scrollBack: function () {
		this.animate();
	},
	destroy:function(){





		if(this.intervalFn){
			clearInterval(this.intervalFn);
		}


		window.removeEventListener("resize",this.resizeFn,false);
		if (!device.hasTouch){
			this.win.unbind("hover");
			this.points.unbind("mouseover");
		}else{
			this.win.get(0).removeEventListener(device.START_EV,this.startEventFn,false);
			this.win.get(0).removeEventListener(device.MOVE_EV,this.moveEventFn,false);
			this.win.get(0).removeEventListener(device.END_EV,this.endEventFn,false);
		}

		if(this.leftBtn){
			$$(this.leftBtn).unbind(true);
		}

		if(this.rightBtn){
			$$(this.rightBtn).unbind(true);
		}

		this.body.get(0).style[device._transitionDuration] = "";
		this.body.css({left:0});



		this.pointBody.remove();
	},


	set gotoPage(n){
		var _this = this;

		_this.body.stop(true);
		clearInterval(_this.intervalFn);
		_this.intervalFn = null;

		n = (n>=this.maxPage)? this.maxPage : n;
		this.page = n;
		this.animate();

		this.intervalFn = setInterval(function () {
			_this.page++;
			_this.animate();
		}, _this.time);

	},

	refresh(){
		this.imgLength = this.win.children().length;
		this.page = 0;
		this.maxPage = this.imgLength - 1;

		this.intervalFn = null;
		this.points = [];
		this.pointBody = null;

		this.touchStartTime = 0;
		this.touchPoints = [];
		this.leftPx = 0;
		this.init();
	}

};


module.exports = scrollBanner;
