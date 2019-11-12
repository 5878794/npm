

let pushLoading = require("../lib/ui/pushLoading"),
	{ajax,api} = require('../ajax/ajax'),
	device = require('../lib/device'),
	alertFn = require('../lib/ui/alert');


let loadDom = function(viewport){
	let dom = $("<div><span>上拉加载</span></div>"),
		height = device.rem2Px(viewport,1.5);


	dom.css({
		width:"100%",height:height+"px",
		"text-align":"center",
		"font-size":"0.24rem",
		"line-height":height+"px"
	});

	return dom;
};



//callback 不要使用异步函数会导致位置计算错误
module.exports = function(apiName,param={},callback,index=0,pageSize=10,viewport=750){
	let isRun = false,
		pushLoadFn = null;

	let getData = function(){
		param.index = ++index;
		param.pageSize = pageSize;
		ajax.send([
			api[apiName](param)
		]).then(rs=>{
			rs = rs[0] || [];
			console.log(rs);
			let backRs = JSON.parse(JSON.stringify(rs));
			callback(backRs,index);
			//通知控件加载完成
			if(pushLoadFn){
				pushLoadFn.loadingEnd();
			}

			//返回数据小于 分页数  注销下拉加载
			if(rs.length < pageSize){
				if(pushLoadFn){
					pushLoadFn.destroy();
				}
			}

			//第一次加载数据时 生成控件
			if(!isRun){
				isRun = true;
				//判断返回的条数等于分页数才初始化控件
				if(rs.length >= pageSize){
					addPushLoad();
				}
			}
		}).catch(rs=>{
			alertFn(rs);
		});
	};


	let addPushLoad = function(){
		pushLoadFn = new pushLoading({
			loadingDom:loadDom(viewport),
			canLoadingFn:function(){            //拖动到能下载加载时触发到函数
				$(this).find("span").text("释放加载");
			},
			notCanLoadingFn:function(){         //拖动到不能下载加载时触发到函数
				$(this).find("span").text("上拉加载");
			},
			loadingFn:function(){               //加载函数
				$(this).find("span").text("正在加载");

				getData();
			},
			viewport:viewport,                       //psd大小   使用rem布局
			bottomFixedDivHeight:0              //底部如果有fixed定位的dom的高度  单位rem
		});
	};

	getData();
};