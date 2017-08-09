

let session = require("./h5/sessionData"),
	getUrlParam = require("./fn/getParamFromUrl"),
	info = require("./ui/info"),
	getImageBase64 = require("./fn/getImageBase64"),
	device = require("./device");


let JkAndWeChat = {
	isDebug:SETTING.isDebug || false,
	readyed:0,
	needReady:(SETTING.isAPP)? 2 : 1,
	readyFn:[],
	isApp:SETTING.isAPP,
	//页面准备好
	isReady:function(fn){
		this.readyFn.push(fn);
	},
	runed:false,
	run:function(){
		if(this.runed){return;}

		this.readyed++;
		if(this.readyed == this.needReady){
			this.runed = true;
			this.closePullRefresh();
			for(var i =0,l=this.readyFn.length;i<l;i++){
				this.readyFn[i]();
			}
		}

	},
	alert:function(text,callback){
		callback = callback || function() {};

		// info.show(text);
		// callback();

		if(this.isApp){
			YJH.H5Dialogs.alert(text.toString(), callback, "系统提示");
		}else{
			alert(text);
			callback();
		}
	},
	confirm: function(msg, success,error) {
		msg = msg || "";
		success = success || function(){};
		error = error || function(){};
		if(this.isApp){
			YJH.H5Dialogs.confirm(
				msg,
				function(aa) {
					aa = aa.buttonIndex;
					if(aa == 1) {
						error();
					} else {
						success();
					}
				},
				"系统提示",
				["取消", "确定"]
			)
		}else{
			if(confirm(msg)){
				success();
			}else{
				error();
			}
		}
	},
	//打开新页面
	openUrl: function(url,type) {
		url = this.urlCache.getUrl(url);

		if(this.isApp){
			if(type=="self"){
				window.location.href=url;
			}else{
				YJH.H5ModuleManager.openWebInApp(url);
			}
		}else{
			window.location.href=url;
		}
	},
	//后退
	goBack: function() {
		// n = n || -1;
		// window.history.go(n);
		if(this.isApp){
			YJH.H5ModuleManager.closeH5App({url:window.location.href})
		}else{
			window.history.go(-1);
		}
	},
	//获取用户token
	getUserToken:function(){
		return new Promise((success,error)=>{
			if(this.isApp){
				YJH.AppUserInfoManager.fetchUserInfo(
					function(rs){
						rs = rs.result || {};
						success(rs.token);
					}
				)
			}else{
				let userToken = session.get("userToken");

				if(userToken){
					success(userToken);
				}else{
					error("还未登陆");
				}
			}
		});
	},
	//保存用户id
	saveUserToken:function(){
		if(!this.isApp){
			let param =getUrlParam(),
				userToken = param.userToken || "";

			if(userToken){
				session.save("userToken",userToken);
			}
		}

	},
	//关闭下拉刷新
	closePullRefresh(){
		if(window.YJH && YJH.H5NativeUIManager && YJH.H5NativeUIManager.closeDownLoad){
			YJH.H5NativeUIManager.closeDownLoad();
		}
	},
	//设置标题
	setTitle(text){
		if(this.isApp){
			YJH.H5NativeAppInfo.setNavBarTitle(text);
		}else{
			document.title = text;
			if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
				var i = document.createElement('iframe');
				i.src = '/favicon.ico';
				i.style.display = 'none';
				i.onload = function() {
					setTimeout(function(){
						i.remove();
					}, 9)
				};
				document.body.appendChild(i);
			}
		}
	},
	//主页点击返回  关闭app
	backClose:function(){
		let _this = this;
		window.addEventListener("popstate",function(e){
			if(e.state && e.state.close){
				console.log("close");
				if(_this.isApp){
					if(window.YJH && YJH.H5NativeAppInfo && YJH.H5NativeAppInfo.goToRootPage){
						YJH.H5NativeAppInfo.goToRootPage();
					}
				}else{
					if(window.wx && wx.closeWindow){
						wx.closeWindow();
					}
				}
			}
		},false);
		history.replaceState({close:true},"",window.location.href);
		history.pushState("", "", window.location.href);
	},
	//预约挂号
	goReservation:function(data){
		let baseUrl = (this.isApp)? SETTING.appointmentRegistrationPageUrl : SETTING.wxAppointmentRegistrationPageUrl;
		let	param = {
				hosName:data.orgName,
				doctorSn:data.doctorSn,
				hosDoctCode:data.doctCode,
				hosOrgCode:data.hosCode,
				hosDeptCode:data.deptCode,
				doctIcon:data.doctIcon,
				doctSkill:data.doctSkill,
				doctName:data.doctName,
				doctTile:data.doctTile,
				deptName:data.deptName,
			},
			newUrl = "";

		if(!this.isApp){
			param.userId =  session.get("userId");
			param.openId = session.get("openId");
			param.phone = session.get("myPhoness");
		}

		for(let [key,val] of Object.entries(param)){
			newUrl += "&" + key + "=" + val;
		}

		newUrl = baseUrl + "?" + newUrl.substr(1);

		this.openUrl(newUrl);
	},
	//初始化微信
	initWX:function(callback){
		callback = callback || function(){};
		if(!this.isApp){
			$.getScript("//res.wx.qq.com/open/js/jweixin-1.2.0.js",function(){
				$.ajax({
					type : 'POST',
					url : SETTING.wxCertificationAppServer+"/getJsapi.do",
					dataType : "json",
					data : {url : window.location.href},
					success : function(data) {
						if(data.stateCode == 'success'){
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: data.appId, // 必填，公众号的唯一标识
								timestamp: data.timestamp, // 必填，生成签名的时间戳
								nonceStr: data.nonceStr, // 必填，生成签名的随机串
								signature: data.signature,// 必填，签名，见附录1
								jsApiList: [
									'closeWindow',
									'onMenuShareTimeline',
									'onMenuShareAppMessage',
									'showAllNonBaseMenuItem',
									'scanQRCode'
									// 'chooseImage',
									// 'uploadImage'
								]
							});
							callback();
						}
					}
				});
			})
		}
	},
	//微信设置分享
	wxSetShare:function(opt){
		let {title="",link,imgUrl="",desc="",type="link",dataUrl=""} = opt;

		wx.showAllNonBaseMenuItem();

		wx.onMenuShareTimeline({
			title: title, // 分享标题
			link: link, // 分享链接
			imgUrl: imgUrl, // 分享图标
			success: function () {

			},
			cancel: function () {

			}
		});

		wx.onMenuShareAppMessage({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: link, // 分享链接
			imgUrl: imgUrl, // 分享图标
			type: type, // 分享类型,music、video或link，不填默认为link
			dataUrl: dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
			success: function () {
				//alert('确认分享');
			},
			cancel: function () {
				//alert('取消分享');
			}
		});
	},
	//微信不分享
	wxNotShowShare:function(){
		wx.hideMenuItems({
			// 发送给朋友: "menuItem:share:appMessage"
			// 分享到朋友圈: "menuItem:share:timeline"
			// 分享到QQ: "menuItem:share:qq"
			// 分享到Weibo: "menuItem:share:weiboApp"
			// 收藏: "menuItem:favorite"
			// 分享到FB: "menuItem:share:facebook"
			// 分享到 QQ 空间/menuItem:share:QZone
			menuList: [
				"menuItem:share:appMessage",
				"menuItem:share:timeline",
				"menuItem:share:qq",
				"menuItem:share:weiboApp",
				"menuItem:share:facebook",
				"menuItem:share:QZone"
			] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
		});
	},
	//照相或从相册获取图片base64
	getImageSrc:function(){
		return new Promise((success,error)=>{
			if(this.isApp){
				YJH.Cameramethod.getThePicture(
					function(aa){
						let state = aa.status;
						if(state == 0){
							let base64 = aa.result.result;
							success({
								src:base64,
								id:base64
							})
						}else{
							error("获取失败");
						}
					}
				)
			}else{
				if(!wx){
					error("不支持浏览器直接调用");
					return;
				}
				wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // original原图   compressed压缩
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function (res) {
						let localIds = res.localIds,
							src= localIds[0];

						if(wx.getLocalImgData && (device.isIphone || device.isIpad)){
							wx.getLocalImgData({
								localId: src, // 图片的localID
								success: function (res) {
									var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
									success({
										src:localData,
										id:localData
									})
								}
							});
						}else{
							wx.uploadImage({
								localId: src, // 需要上传的图片的本地ID，由chooseImage接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function (res) {
									let serverId = res.serverId; // 返回图片的服务器端ID
									success({
										src:src,
										id:serverId
									})
								}
							});
						}
					}
				});
			}
		})
	},
	//清除当前页的历史记录
	clearPageHistory:function(){
		window.history.replaceState("","",window.location.href);
	},
	//报错提示并关闭
	error:function(text){
		var _this = this;
		if(this.isDebug){
			text = text || "系统错误，请稍后在试";
		}else{
			text = "系统错误，请稍后在试";
		}
		this.alert(text,function(){
			if(_this.isApp && !this.isDebug){
				YJH.H5NativeAppInfo.goToRootPage(0);
			}
		});
	},
	//生成条形码
	createBarCode:function(code){
		return new Promise(function(success,error){
			YJH.H5QRCodeManager.generateQRCode(rs=>{
				success(rs)
			},function(){
				success("")
			},{
				content:code,
				type:1
			})
		})
	},
	//生成二维码
	create2Code:function(code){
		return new Promise(function(success,error){
			YJH.H5QRCodeManager.generateQRCode(rs=>{
				success(rs)
			},function(){
				success("")
			},{
				content:code,
				type:0
			})
		})
	},
	//获取模版
	getTemplate:function(templateName){
		return new Promise((success,error)=>{
			$.ajax({
				type: "get",
				cache: false,
				url: "template/"+templateName+".js",
				//contentType:"application/json",
				dataType: "script",
				timeout: 60000,
				success: function() {
					success({state:1});
				},
				error: function() {
					success({state:0,msg:"数据加载错误"})
				}
			});

		})
	},
	//url链接加参数缓存。自动传到每个页面  需要openUrl 打开
	urlCache:{
		data:{},
		save:function(key,val){
			this.data["__c__"+key] = val;
		},
		get:function(key){
			return this.data["__c__"+key];
		},
		del:function(key){
			delete this.data["__c__"+key];
		},
		getUrl:function(url){
			let str = (url.indexOf("?")>-1)? "&" : "?";
			for(let [key,val] of Object.entries(this.data)){
				str += key+"="+val+"&"
			}
			str = str.substr(0,str.length-1);
			return url+str;
		},
		_autoSave:function(){
			var data = getUrlParam();
			for(let [key,val] of Object.entries(data)){
				if(key.substr(0,5) == "__c__"){
					let _key = key.substr(5);
					this.save(_key,val);
				}
			}
		}
	},
	//页面在次显示时执行
	backRefresh:(function(){
		var isHiddened = false,
			fn = [];

		if(SETTING.isAPP && device.isAndroid){
			//原生提供
			window.addEventListener('view_visibilitychange', function(e) {
				for(var i= 0,l=fn.length;i<l;i++){
					fn[i]();
				}
			}, false);
		}else{
			document.addEventListener('visibilitychange', function(e) {
				if(document.hidden){
					isHiddened = true;
				}else{
					if(isHiddened){
						for(var i= 0,l=fn.length;i<l;i++){
							fn[i]();
						}
					}
				}
			}, false);
		}


		return function(callback){
			callback = callback || function(){};
			fn.push(callback);
		};
	})(),
	//检查参数是否带 __close==yes  的自动执行后退关闭app
	autoBackClose(){
		let _this = this;

		if(getUrlParam().__close__ == "yes"){
			this.backClose();
			this.backRefresh(function(){
				_this.backClose();
			})
		}
	},
	//打开第三方应用
	openOtherApp(id,page){
		page = page || "";
		id = id || "";
		if(this.isApp){
			if(id){
				YJH.H5ModuleManager.openApp(
					rs=>console.log(rs),
					rs=>console.log(rs),
					{h5Id:id,page:page,notUseCfg:true})
			}else{
				YJH.H5ModuleManager.openApp(
					rs=>console.log(rs),
					rs=>console.log(rs),
					{page:page,notUseCfg:true})
			}
		}
	},
	//设置app 顶部右上角按钮
	setRightBtn(opt){
		if(!this.isApp){return;}

		let name = opt.name || "",
			color = opt.color || "#000000",
			callback = opt.callback || function(){};

		YJH.H5NativeAppInfo.setNavBarRightBtn(callback,{
			btnTitle:name,
			btnTitleColor:color,
			enable:true,
			url:window.location.pathname
		});
	},
	//后退提示表单有变动
	inputChangeBackAlert(){
		let _this = this;
		window.addEventListener("popstate",function(e){
			if(e.state && e.state.input_change){
				_this.confirm("确定放弃保存？",function(){
					_this.goBack();
				},function(){
					_this.inputChangeBackAlert();
				});
			}
		},false);
		history.replaceState({input_change:true},"",window.location.href);
		history.pushState("", "", window.location.href);
	},
	delHtmlTag(str){
		return str.replace(/<[^>]+>/g,"");    //去掉所有的html标记
	},
	//页面缓存
	pageCatch : {
		async get(key){
			return new Promise((success,error)=>{
				if(SETTING.isAPP){
					YJH.H5ModuleManager.getValue(
						function(aa){
							aa = aa.result || "";
							//统一android和ios统一返回字符串
							if(typeof aa != "string"){
								aa = JSON.stringify(aa);
							}
							success(aa);
						},function(bb){
							success("");
						},
						key
					);
				}else{
					let val = localStorage.getItem(key) || "";
					success(val);
				}
			})
		},
		async save(key,val){
			return new Promise((success,error)=>{
				if(SETTING.isAPP){
					YJH.H5ModuleManager.setValueForKey(
						function(){
							success();
						},function(bb){
							error("app内部错误");
						},
						key,
						val
					)
				}else{
					localStorage.setItem(key,val);
					success();
				}
			});
		},
		async del(key){
			return new Promise((success,error)=>{
				if(SETTING.isAPP){
					YJH.H5ModuleManager.setValueForKey(
						function(){
							success();
						},function(bb){
							error("app内部错误");
						},
						key,
						""
					)
				}else{
					localStorage.removeItem(key);
					success();
				}
			})
		}
	}
};


$(document).ready(function(){
	// JkAndWeChat.initWX(function(){
		// JkAndWeChat.wxSetShare({
		// 	title:"",  //分享标题
		// 	link:"",   //分享链接
		// 	imgUrl:"",  //分享图标
		// 	desc:""   //分享描述
		// });
	// });

	//微信自动保存userToken
	// JkAndWeChat.saveUserToken();

	//自动检测链接地址带__close__参数等于yes的，点后退关闭app
	// JkAndWeChat.autoBackClose();

	//处理链接传过来的缓存参数
	// JkAndWeChat.urlCache._autoSave();

	JkAndWeChat.run();
});

document.addEventListener("deviceready", function() {
	YJH.H5ModuleManager.getValue(function(rs){
		rs = rs.result;
		rs = rs.substr(0,rs.length-1);
		rs = rs.substr(0,rs.lastIndexOf("\/")+1);
		SETTING.serverUrl = rs;
		JkAndWeChat.run();
	},function(){
		JkAndWeChat.alert("无法获取服务器地址");
	},"AppNetWorkBaseUrl");
}, false);




module.exports = JkAndWeChat;