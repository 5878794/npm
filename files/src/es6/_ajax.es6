// let md5 = require("./lib/fn/md5"),
// 	app = require("./lib/JkAndWeChat");


let ajax = {
	//请求函数主体
	run(url, data, success, error){
		url = SETTING.serverUrl + url;

		//预约挂号特有
		// data.token = this.token;
		// data.userToken = this.userToken;
		// data.sign = this.sign(data);


		$.ajax({
			type: "get",
			cache: false,
			url: url,
			data: data,
			//contentType:"application/json",
			dataType: "json",
			timeout: 20000,     //20秒
			success: function(rs) {
				if(rs.state != 1){
					error(rs.msg);
				}

				success(rs.data);

			},
			error: function(e) {
				if(e.status == 0 && e.statusText == "timeout"){
					error('请求超时');
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
	//场馆列表
	// data={
	//      date  :"",        yy-mm-dd
	// }
	"getList":function(data={}){
		return new Promise((success,error)=>{
			ajax.run("api/getTableInfo",data,success,error);
		})
	}
};





module.exports = {ajax,api};