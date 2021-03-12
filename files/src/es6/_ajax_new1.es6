

let all = require('./all');


let ajax = {
	uploadFile(files){
		let serverUrl = SETTING.serverUrl1 + '/externalModel/uploadModelData';
		return new Promise(async (success,error)=>{
			if(!files || files.length == 0){
				success([]);
				return;
			}

			let form = new FormData(),
				xhr = new XMLHttpRequest();

			for(let i=0,l=files.length;i<l;i++){
				let file = files[i];
				form.append('file',file);
			}

			xhr.onload =  function(e){
				let body = e.target.responseText;
				body = JSON.parse(body);
				let code = body.code;
				// {"code":200,"msg":null,"data":[{"fileName":"files","fileSize":39359,"fileUrl":"328618dd-e368-4e7a-9b86-f5a6c63d6345"}]}

				if(code == 200){
					let data = body.data;
					success(data);
				}else{
					error(body);
				}
			};
			xhr.onerror = function(e){
				error(e);
			};

			// xhr.upload.onprogress =  uploadProgress; //上传进度调用方法实现

			xhr.open("post", serverUrl, true);
			// xhr.setRequestHeader('Authorization',window.token); //post方式提交，url为服务器请求地址，true该参数规定请求是否异步处理
			xhr.send(form); //开始上传，发送form数据
		});
	},


	//请求函数主体
	run(url, data, type, success, error){
		url = SETTING.serverUrl1 + url;


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
	//获取默认数据
	getDefaultDate:{url:'/builtInModel/getBuiltInModelData',type:'post'},
	//获取execl下载地址
	// getDownloadFileUrl:{url:'/externalModel/downloadTemplate',type:'get'},


	//获取运算结果1、2
	getRunRes1:{url:'/auditResult/getResultOne',type:'post'},
	getRunRes2:{url:'/auditResult/getResultTwo',type:'post'},

//最终结果
	getRunRes3:{url:'/auditResult/getResultSummary',type:'post'},
	//获取档位分布统计图数据
	getChart1:{url:'/statistics/getLevelDistri',type:'post'},
	//获取分数分布统计图数据
	getChart2:{url:'/statistics/getScoreDistri',type:'post'},
	//获取年龄分布统计图数据
	getChart3:{url:'/statistics/getAgeDistri',type:'post'},
	//获取性别分布统计图数据
	getChart4:{url:'/statistics/getSexDistri',type:'post'},
	//获取省份分布统计图数据
	getChart5:{url:'/statistics/getProvinceDistri',type:'post'},
	//获取TOP10省份放款情况
	getChart6:{url:'/statistics/getTop10ProvDistri',type:'post'},
	//获取放款金额区间分布
	getChart7:{url:'/statistics/getLoanAmtRangeDistri',type:'post'},
	//获取运行时间
	getRunTime:{url:'/modelCalc/getAuditCommitTime',type:'post'}

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




module.exports = {ajax1:ajax,api1:api};