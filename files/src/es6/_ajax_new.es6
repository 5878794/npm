// let md5 = require("./lib/fn/md5"),
// 	app = require("./lib/JkAndWeChat");

// let errorHandler = require('./lib/fn/errorHandler');


let all = require('./all');


let ajax = {
	//请求函数主体
	run(url, data, type, success, error){
		url = SETTING.serverUrl + url;


		// if(type=='post'){
		// 	data = JSON.stringify(data);
		// 	// console.log(data)
		// }


		$.ajax({
			type: type,
			cache: false,
			url: url,
			data: data,
			contentType: "application/x-www-form-urlencoded;",
			// contentType:"application/json",
			dataType: "json",
			timeout: 20000,     //20秒
			headers: {
				token: window.token
			},
			success: async function(rs) {
				if(rs.code == 200){
					success(rs.data);
				}else{
					if(rs.code == 700){
						// 关闭所有窗口或进入登录页
						all.clearToken('您还未登录或登录已过期');
					}else{
						error(rs.msg);
					}
				}
			},
			error: function(e) {
				// errorHandler.ajaxError(type,url,data,e);
				if(e.status == 500){
					error('服务器内部错误！');
					return;
				}


				if(e.status == 0 && e.statusText == 'timeout'){
					error('访问人数过多，请稍后访问');
					return;
				}

				if(e.status == 0 && e.statusText != 'error'){
					return;
				}

				error("网络错误,无法连接服务器。");
			}
		});
	},
	//发送一堆请求
	async send(arr){
		//预约挂号特有
		// this.token = await this.getToken();
		// this.userToken = await app.getUserToken();

		return new Promise((success,error)=>{
			Promise.all(arr).then(rs=>{
				success(rs)
			}).catch(rs=>{
				error(rs);
				throw "ajax error";
			})
		})
	}

};

let api = {
	indexCount:{url:'/index/indexCount',type:'get'},
	index:{url:'/index/index',type:'get'},
	news:{url:'/news/list',type:'get'},
	newsInfo:{url:'/news/detail',type:'get'},

	//目录
	dir_tags:{url:'/data-catalog/direction',type:'post'},
	dir_nav:{url:'/data-catalog/type',type:'post'},
	dir_list:{url:'/data-catalog/list',type:'post'},

	//资源
	res_tags:{url:'/index/resource/direction',type:'post'},
	res_nav:{url:'/index/resource/category',type:'post'},
	res_list:{url:'/index/resource/list',type:'post'},

	//资源集 标签
	resDir_tags:{url:'/index-group/queryCondition',type:'post'},


	//获取目录、资源 获取数量
	apply_list:{url:'/console/apply/findApplyCart',type:'post'},


	//申请 取消申请
	add_apply:{url:'/console/apply/addApplyCart/{id}',type:'post'},
	cancel_apply:{url:'/console/apply/cancelApplyCart/{id}',type:'post'},

	//详情
	//目录
	dir_info:{url:'/console/catalog/detail/{id}',type:'post'},
	//资源
	res_info:{url:'/console/interface/detail/{id}',type:'post'},


	//收藏 取消收藏
	add_favorites:{url:'/console/interface/collectResource/{id}',type:'post'},
	cancel_favorites:{url:'/console/interface/cancelCollectResource/{id}',type:'post'},

	//目录收藏 取消收藏
	dir_add_favorites:{url:'/console/catalog/collect/{id}',type:'post'},
	dir_cancel_favorites:{url:'/console/catalog/cancel/{id}',type:'post'},

	//获取目录的2级目录
	getLv2Nav:{url:'/console/interface/listByCatalogId',type:'post'},


	//保存工单
	saveOrder:{url:'/console/apply/saveResource',type:'post'},
	//提交申请
	submitOrder:{url:'/console/apply/applyResource',type:'post'},
	//取消申请
	cancelOrder:{url:'/console/apply/cancelApplyResource/{id}',type:'post'},


	//首页 应用场景
	indexDirList:{url:'/data-catalog/index',type:'post'},

	//首页 金融大数据带搜索
	indexNewList:{url:'/index/list',type:'post'},

	//首页 金融大数据 工具、增值服务
	index11Res:{url:'/index-group/productList',type:'post'},

	//首页 金融增值数据列表
	indexAddResList:{url:'/index-group/indexList',type:'post'},
	//我的数据集列表
	myResList:{url:'/console/data-group/list',type:'post'},


	//数据集 -- 添加到我的数据集
	addRes:{url:'/console/data-group/collect/{id}',type:'post'},
	delRes:{url:'/console/data-group/cancelCollect/{id}',type:'post'},

	//资源集详情
	resDirInfo:{url:'/index-group/detail/{id}',type:'post'},
	//我的资源集详情
	myResDirInfo:{url:'/console/data-group/detail/{id}',type:'post'},

	//一键申请资源包中的资源
	addAllResToOrder:{url:'/console/data-group/applyDataGroup/{id}',type:'post'},
	//我的资源包中移除资源
	removeResFromDir:{url:'/console/data-group/removeResource',type:'post'},
	//添加资源到资源包
	addResToDir:{url:'/console/data-group/addResource',type:'post'},

	//企业图谱
	resMap:{url:'/index/resource/map',type:'get'}

};






api = new Proxy(api, {
	get(target, key, receiver) {
		return function (data) {
			data = data || {};
			return new Promise((success, error) => {
				let url = target[key].url,
					type = target[key].type || 'post';

				//判断是否含有一堆大括号,大括号内为参数
				let delArray = [];
				url = url.replace(/{(.+?)}/g,function(key){
					key = key.substr(1,key.length-2);
					delArray.push(key);
					return data[key];
				});

				//删除data中的对象
				delArray.map(rs=>{
					delete data[rs];
				});

				ajax.run(url, data, type, success, error);
			})
		}
	}
});




module.exports = {ajax,api};