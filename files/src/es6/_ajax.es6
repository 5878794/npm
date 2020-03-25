// let md5 = require("./lib/fn/md5"),
// 	app = require("./lib/JkAndWeChat");

let errorHandler = require('./lib/fn/errorHandler');

let ajax = {
	//请求函数主体
	run(url, data, success, error){
		url = SETTING.serverUrl + url;

		//预约挂号特有
		// data.token = this.token;
		// data.userToken = this.userToken;
		// data.sign = this.sign(data);
		data.ver = SETTING.apiVer;

		let type = 'post';

		$.ajax({
			type: type,
			cache: false,
			url: url,
			data: data,
			//contentType:"application/json",
			dataType: "json",
			timeout: 20000,     //20秒
			headers: {
				token: window.token
			},
			success: function(rs) {
				if(rs.state != 1){
					error(rs.msg);
				}

				success(rs.data);

			},
			error: function(e) {
				errorHandler.ajaxError(type,url,data,e);

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
	//获取班级信息
	// data={
	//      urlCode  :"",
	// }
	getClassInfo:function(data={}){
		return new Promise((success,error)=>{
			ajax.run("report/getClassInfo",data,success,error);
		})
	},
	//登录
	// data={
	// 	classId:'',     //班级id
	// 	code:''         //验证码或者名字
	// }
	login:function(data={}){
		return new Promise((success,error)=>{
			ajax.run("report/checkVerify",data,success,error);
		})
	},
	//添加学生信息
	// data={
	// 	classId:'',     //班级id
	// 	name:''         //学生姓名
	// }
	addStudent:function(data={}){
		return new Promise((success,error)=>{
			ajax.run("report/addStudent",data,success,error);
		})
	},
	//删除学生信息
	// data={
	// 	id:'',     //学生id
	// }
	delStudent:function(data={}){
		return new Promise((success,error)=>{
			ajax.run("report/delStudent",data,success,error);
		})
	},
	//日常填报
	// data={
	// 	studId:'',     //学生id
	//  classId:'',     //班级id
	//  temperature：''  //温度
	//  phycondition：'' //症状  str ','分割
	//  contact：''      //接触病例  str  ','分割
	//  type:' '        //学生状态
	// }
	report:function(data={}){
		return new Promise((success,error)=>{
			ajax.run("report/dailyReport",data,success,error);
		})
	},
	//完善信息
	// 1	list	监护人和接触人信息	是	[array]
		// 2	 name	监护人或者接触人名字	是	[string]
		// 3	 id	ID	是	[string]		查看
		// 	4	 relation	关系	是	[string]
		// 5	 phycondition	身体状况	是	[string]
		// 6	 situation	与其接触情况	是	[string]
	// 7	student	学生对象key	是	[object]
		// 8	 name	学生名字	是	[string]
		// 9	 id	学生ID	是	[string]		查看
		// 	10	 classid	班级ID	是	[string]		查看
		// 	11	 sex	性别	是	[string]
		// 12	 age	年龄	是	[string]		查看
		// 	13	 hrcity	户籍城市	是	[string]
		// 14	 prcity	常住城市	是	[string]
		// 15	 contact	联系电话	是	[string]
		// 16	 prarea	常住区县	是	[string]
		// 17	 prprovince	常住省份	是	[string]
		// 18	 idcard	身份证	是	[string]
		// 19	 hrprovince	户籍省份	是	[string]
		// 20	 hrarea	户籍区县	是	[string]
		// 21	 hrstreet	户籍街道	是	[string]
		// 22	 prstreet	常住街道	是	[string]

	// 21	studentSreport1	特殊来蓉接触上报	是	[object]
		// 22	 id	ID	是	[string]		查看
		// 	23	 hstatus	处置情况	是	[string]
		// 24	 cdate	接触时间	是	[string]
		// 25	 rstatus	报道情况	是	[string]
		// 26	 phycondition	接触人员体征	是	[string]
	// 27	studentSreport2	特殊疫区返蓉上报	是	[object]
		// 28	 id	ID	是	[string]		查看
		// 	29	 backdate	返回时间	是	[string]
		// 30	 rstatus	报道情况	是	[string]
		// 31	 arrivedate	到达时间	是	[string]
		// 32	 vehicle	交通工具	是	[string]
	basicInfoSubmit:function(data={}){
		return new Promise((success,error)=>{
			ajax.run("report/submitBasicInfo",data,success,error);
		})
	},
	//查看日报
	// data={
	// 	token:'',
	// 	classId:'',
	// 	id:''
	// }
	getReportInfo:function(data={}){
		return new Promise((success,error)=>{
			ajax.run("report/getDailyReport",data,success,error);
		})
	},
	//获取首次填报信息
	// data={
	// id:''        //学生id
	// }
	getFirstInfo:function(data={}){
		return new Promise((success,error)=>{
			ajax.run("report/getGuardianList",data,success,error);
		})
	}
};





module.exports = {ajax,api};