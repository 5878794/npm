let md5 = require("./lib/fn/md5"),
	app = require("./lib/JkAndWeChat");


let ajax = {
	//请求函数主体
	run(url, data, success, error){
		url = SETTING.serverUrl + url;

		//预约挂号特有
		data.token = this.token;
		data.userToken = this.userToken;
		data.sign = this.sign(data);


		$.ajax({
			type: "post",
			cache: false,
			url: url,
			data: data,
			//contentType:"application/json",
			dataType: "json",
			timeout: 20000,     //20秒
			success: function(rs) {
				success(rs);
				//TODO 处理token过期，等等问题
			},
			error: function() {
				error("网络错误");
			}
		});
	},
	//发送一堆请求
	async send(arr){
		//预约挂号特有
		this.token = await this.getToken();
		this.userToken = await app.getUserToken();

		return new Promise((success,error)=>{
			Promise.all(arr).then(rs=>{
				success(rs)
			}).catch(rs=>{
				error(rs);
				throw "ajax error";
			})
		})
	},

	//签名
	sign(data){
		let array = [];
		for(let [key,val] of Object.entries(data)){
			array.push(key+"="+val);
		}

		array.sort();
		let str = array.join("&");

		return md5(str);
	},
	//获取参数  TODO
	getToken(){
		let localToken = window.localStorage.getItem("__token__") || "{}",
			timestamp = new Date().getTime(),
			canUseStamp = 10800000,   //3小时
			token = "";

		localToken = JSON.parse(localToken);
		let localTime = localToken.time;


		return new Promise((success,error)=>{
			if(timestamp-localTime > canUseStamp){
				//获取新的token


			}else{
				token = localToken.token || "";
				success(token);
			}
		});
	}

};

let api = {
	//医院列表   data={}
	"getHospitalList":"register/getHospitalService.do",


	//获取指定医院的科室列表信息
	// data={
	//     hosOrgCode:"",       //医院代码
	//     hosDeptCode:""       //医院科室代码  为空查询所有
	// }
	"getDepartmentList":"register/getDepartmentService.do",


	//医生信息获取  ？？
	//data={
	//      hosCode:"",         //医院code
	//      hosDeptCode:"",     //科室code
	//      hosDoctCode:""      //医生code  如果为空，则查询科室下所有医生信息，不为空，查询指定医生
	// }
	"getDoctorList":"register/getDoctorService.do",


	//获取医生排班信息
	//data={            //开始时间到结束时间不能超过7天
	//      startTime:"",       //开始时间  格式：yyyy-MM-dd 开始时间从次日起，否则报错
	//      endTime:"",         //结束时间  格式：yyyy-MM-dd
	//      hosOrgCode:"",      //医院代码
	//      hosDeptCode:"",     //科室代码
	//      hosDoctCode:""      //医生代码
	// }
	"getOrderNumInfo":"register/getOrderNumService.do",


	//挂号
	//data={
	//      scheduleId:"",              //排班Id
	//      mediCardId:"",              //诊疗卡卡号   注：就诊卡id不是卡号
	//      hosOrgCode:"",              //医院代码
	//      hosName:"",                 //医院名称
	//      hosDeptCode:"",             //科室编码
	//      deptName:"",                //科室名称
	//      hosDoctCode:"",             //医生代码
	//      doctName:"",                //医生名称
	//      orderTime:"",               //预约时间     医生坐诊时间；格式： YYYY-MM-DD HH24:MI:SS
	//      patientId:"",               //就诊人ID
	//      numSourceId:"",             //号源ID
	//      frontProviderOrderId:"",    //第三方预约编码
	//      visitLevelCode:"",          //出诊级别编码
	//      visitLevel:"",              //出诊级别
	//      visitCost:"",               //出诊费用
	//      timeRange:"",               //出诊时段     1:上午，2:下午，3:晚上
	//      visitNo:"",                 //就诊序号
	//      takePassword:""             //取号密码
	// }
	"lockOrderNum":"register/getLockOrderNumService.do",


	//退号
	//data={
	//      orderId:"",                 //系统预约单Id   注：取挂号锁定接口的id字段，不是orderId字段值
	//      cancelReason:"",            //退号原因       0其它  1患者主动退号
	//      cancelDesc:""               //备注          只有退号原因为0是才有用
	// }
	"orderCancel":"register/getOrderCancelService.do",



	//历史预约列表查询
	//data={}
	"getOrderList":"register/getOrderListService.do",


	//预约详情查询
	//data={
	//      id:""           //预约Id
	// }
	"getOrderDetail":"register/getOrderDetailService.do",


	//就诊人员列表



};


let api_clone = Object.assign({},api);
api = new Proxy(api,{
	get:function(target,key,receiver){
		if(!api_clone.hasOwnProperty(key)){
			return function(){
				return new Promise((success,error)=>{
					setTimeout(function(){
						error("api not fond!");
					},0)
				})
			}

		}

		return function(data={}){
			return new Promise((success,error)=>{
				ajax.run(api_clone[key],data,success,error);
			})
		}
	}
});




module.exports = {ajax,api};