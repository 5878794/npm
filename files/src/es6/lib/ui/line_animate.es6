

//指定容器画path线条，并带光点延路径移动

//初始化
// let fn = new lineAnimate(id);       //传入容器id

//增加一个线段 点的坐标相对容器左上位置开始
// opt = {
//      points:points       //路径点的坐标  2纬数组
//      infinite:true       //是否重复显示    默认true
//              无bgLineColor背景色，就不会画线
//      bgLineColor:{'0':'#fff','100':'#000'}      //背景线的颜色 渐变线
//      pointColor:{'0':'#fff','2':'#eee','100':'#000'}   //移动点点颜色 渐变线
//      spd:100             //每秒的移动速度
//      animateClass:'Linear'   //动画方式  参数详见tween.es6
//      animateType:'easeIn'    //动画类别 Linear无此属性
//      lineWidth:10,           //线的长度 单位px
//      lineHeight:3            //线的宽度  单位px
//      fade:false          //是否渐隐，默认false
//      fadePre:0.8         //运行80%后开始渐隐
// }
// fn.addLine(opt);

//points@参数 传入的路径
// [
//  [x,y]
//  [x,y]
//  [x,y]
// ]



require('../jq/extend');

let device = require('../device'),
	tween = require('../fn/tween'),
	createCanvas = Symbol(),
	run = Symbol(),
	draw = Symbol(),
	stop = Symbol(),
	runner = Symbol(),
	delNotUseLine = Symbol(),
	drawLine = Symbol(),
	setColor = Symbol(),
	setColor1 = Symbol(),
	canvasDraw = Symbol(),
	drawBgLine = Symbol();


class lineAnimate{
	constructor(id){
		//容器id
		this.body = $('#'+id);


		this.linePath = [];
		this.canvas = null;
		this.ctx = null;


		this[createCanvas]();
		this[run]();

	}

	//增加一个线段 点的坐标相对容器左上位置开始
	// opt = {
	//      points:points       //路径点的坐标  2纬数组
	//      infinite:true       //是否重复显示    默认true
//              无bgLineColor背景色，就不会画线
	//      bgLineColor:{'0':'#fff','100':'#000'}      //背景线的颜色 渐变线
	//      pointColor:{'0':'#fff','2':'#eee','100':'#000'}   //移动点点颜色 渐变线
	//      spd:100             //每秒的移动速度
	//      animateClass:'Linear'   //动画方式  参数详见tween.es6
	//      animateType:'easeIn'    //动画类别 Linear无此属性
	//      lineWidth:10,           //线的长度 单位px
	//      lineHeight:3            //线的宽度  单位px
	//      fade:false          //是否渐隐，默认false
	//      fadePre:0.8         //运行80%后开始渐隐
	// }
	addLine(opt){
		let points = opt.points || [];

		//屏幕坐标点生成path
		let path = [];
		points.map((rs,i)=>{
			if(i==0){
				path.push('M'+rs[0]+' '+rs[1]+' ');
			}else{
				path.push('L'+rs[0]+' '+rs[1]+' ');
			}
		});
		path = path.join('');

		//生成svg路径，方便获取运动时的x，y坐标
		let pathElement = document.createElementNS('http://www.w3.org/2000/svg',"path");
		pathElement.setAttributeNS(null, 'd', path);

		//速度转化为33毫秒的运动距离
		//requestAnimationFrame的运行间隔时间大概是33毫秒
		let spd = opt.spd || 100;
		spd = spd*33/1000;

		//增加到动画队列
		this.linePath.push({
			path:pathElement,
			infinite:$.isBoolean(opt.infinite)? opt.infinite : true,
			totalLength:pathElement.getTotalLength(),
			runLength:0,
			isDel:false,
			bgLineColor:opt.bgLineColor || null,
			pointColor:opt.pointColor || {},
			spd:spd,
			points:points,
			lineWidth:opt.lineWidth || 10,
			lineHeight:opt.lineHeight || 3,
			animateClass:opt.animateClass || 'Linear',
			animateType:opt.animateType || 'easeIn',
			fade:$.isBoolean(opt.fade)? opt.fade : false,
			fadePre:0.8
		});
	}

	//容器内创建canvas
	[createCanvas](){
		let canvas = document.createElement('canvas');

		//判断容器是否有定位属性
		if(!device.checkDomHasPosition(this.body)){
			this.body.css({
				position:'relative'
			})
		}

		canvas.width = parseInt(this.body.width());
		canvas.height = parseInt(this.body.height());

		$(canvas).css({
			width:'100%',height:'100%',
			position:'absolute',left:0,top:0
		});

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		$(this.body).append(canvas);
	}

	//删除无用的数据
	[delNotUseLine](){
		let data = [];
		this.linePath.map(rs=>{
			if(!rs.isDel){
				data.push(rs);
			}
		});

		this.linePath = data;
	}

	//清除所有线条
	clearLine(){
		this[stop]();
		this.linePath = [];
		this[run]();
	}

	//暂停动画
	[stop](){
		cancelAnimationFrame(this[runner]);
	}

	//画布开始渲染
	[run](){
		let fn = ()=> {
			this[draw]();
			this[runner] = requestAnimationFrame(fn);
		};

		fn();
	}


	//开始画 处理数据
	[draw](){
		this[delNotUseLine]();

		let newPP = [];

		//遍历线条，标示以完成的线，处理循环的线条
		this.linePath.map(rs=>{
			rs.runLength += rs.spd;
			if(rs.runLength >= rs.totalLength){
				rs.runLength = rs.totalLength;
				//如果运行完成，设置成删除状态
				rs.isDel = true;
				//如果是循环执行的，重新加入队列
				if(rs.infinite){
					let newOpt = JSON.parse(JSON.stringify(rs));
					newOpt.path = rs.path;
					newOpt.isDel = false;
					newOpt.runLength = 0;
					newPP.push(newOpt);
				}
			}
		});

		this[canvasDraw]();

		//添加要循环的线条
		newPP.map(rs=>{
			this.linePath.push(rs);
		})
	}


	//画
	[canvasDraw](){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.linePath.map(rs=>{
			//画背景线条
			//有颜色才画
			if(rs.bgLineColor){
				this.ctx.beginPath();
				this[drawBgLine](rs);
				this.ctx.closePath();
			}

			//画移动的点
			this.ctx.beginPath();
			this[drawLine](rs);
			this.ctx.closePath();
		});
	}

	//画运动的点
	[drawLine](rs){
		let a = -1,
			px,py,p1x,p1y,
			l,
			fn;

		//根据线行运动计算实际的点
		//获取运动函数
		if(rs.animateClass == 'Linear'){
			fn = tween[rs.animateClass];
			if(!fn){throw '无Linear动画方法，清查询tween.es6'}
		}else{
			fn = tween[rs.animateClass] || {};
			fn = fn[rs.animateType];
			if(!fn){throw '无'+rs.animateClass+'下的'+rs.animateType+'动画方法，清查询tween.es6'}
		}
		//参数见tween.es6
		let pre = rs.runLength/rs.totalLength;
		l = fn(pre,0,rs.totalLength,1);
		l = parseInt(l);

		for(let i=l;i>0;i--){
			a++;
			let p = rs.path.getPointAtLength(i);

			if(a==0){
				this.ctx.moveTo(p.x,p.y);
				px = parseInt(p.x);
				py = parseInt(p.y);
			}else{
				this.ctx.lineTo(p.x,p.y);
			}


			p1x = parseInt(p.x);
			p1y = parseInt(p.y);
			if(a==rs.lineWidth-1){
				break;
			}
		}


		if(rs.fade){
			//超出50%后开始渐隐
			if(pre>=rs.fadePre){
				this.ctx.globalAlpha = 1- (pre-rs.fadePre)/(1-rs.fadePre);
			}else{
				this.ctx.globalAlpha = 1;
			}
		}else{
			this.ctx.globalAlpha = 1;
		}

		this.ctx.lineWidth = rs.lineHeight; //线的宽度
		this.ctx.strokeStyle = this[setColor](px,py,p1x,p1y,rs.pointColor); //线的颜色
		this.ctx.lineCap='round'; //线的两头圆滑
		this.ctx.stroke();
	}


	[drawBgLine](rs){
		let px,py,p1x,p1y,
		    p1 = rs.points[0],
			pl = rs.points.length,
			p2 = rs.points[pl-1];

		px = p1[0];
		py = p1[1];
		p1x = p2[0];
		p1y = p2[1];

		rs.points.map((rs,i)=>{
			if(i==0){
				this.ctx.moveTo(rs[0],rs[1]);
			}else{
				this.ctx.lineTo(rs[0],rs[1]);
			}
		});

		this.ctx.globalAlpha = 1;
		this.ctx.lineWidth = rs.lineHeight; //线的宽度
		this.ctx.strokeStyle = this[setColor](px,py,p1x,p1y,rs.bgLineColor); //线的颜色
		this.ctx.lineCap='round'; //线的两头圆滑
		this.ctx.stroke();

	}

	//返回渐变色对象
	[setColor](px=0,py=0,p1x=0,p1y=0,colorObj){
		px = parseInt(px);
		py = parseInt(py);
		p1x = parseInt(p1x);
		p1y = parseInt(p1y);
		var linearGradient1 = this.ctx.createLinearGradient(px,py,p1x,p1y);

		for(let [key,val] of Object.entries(colorObj)){
			linearGradient1.addColorStop(key,val);
		}
		return linearGradient1;
	}






}



module.exports = lineAnimate;