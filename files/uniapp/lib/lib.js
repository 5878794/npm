let lib = {
	//调用父页面方法
	runParentPageFn(fnName,param){
		let pages = getCurrentPages(), //当前页面栈
			l = pages.length;
		if (l > 1) {  
		    var beforePage = pages[l - 2]; //获取上一个页面实例对象  
		    beforePage.$vm[fnName](param); //触发父页面中的方法change()  
		}
	},
	//设置页面标题
	setTitle(titleName){
		uni.setNavigationBarTitle({
			title:titleName
		});
		
	},
	
	
	//显示大图片 （微信特有）
	showBigImg(src){
		// #ifdef MP-WEIXIN
		wx.previewMedia({
			sources:[{
				url:src,
				type:'image'
			}]
		})
		//#endif
		
		// #ifdef H5
		console.log('暂时只支持微信小程序')
		//#endif
		
	},
	//分享 （微信特有）
	wxShare(title,url){
		const promise = new Promise(resolve => {
		  setTimeout(() => {
			resolve({
			  title: title
			})
		  }, 2000)
		})
		return {
		  title: title,
		  path: url,
		  promise 
		}
	},
	//显示loading 
	loading:{
		show(title,showMask=true){
			uni.showLoading({
				title:title,
				mask:showMask
			})
		},
		hide(){
			uni.hideLoading();
		}
	},
	
	alert(msg,title='系统提示'){
		return new Promise(success=>{
			uni.showModal({
			    title: title,
			    content: msg,
				showCancel:false,
			    success: function (res) {
			        if (res.confirm) {
			            success();
			        }
			    }
			});
		})
	},
	confirm(msg,title='系统提示'){
		return new Promise(success=>{
			uni.showModal({
			    title: title,
			    content: msg,
			    success: function (res) {
			        if (res.confirm) {
			            success();
			        }
			    }
			});
		})
	},
	//@success=true 时会有成功提示
	//@success=false 时只有文字
	//msg 最好不要大于7个字
	info(msg,success,time=2000){
		let icon = (success)? 'success' : 'none';
		uni.showToast({
		    title: msg,
			icon:icon,
		    duration: time
		});
	},
	//底部弹出菜单 选中返回菜单上的文字
	showBottomList(list){
		return new Promise(success=>{
			uni.showActionSheet({
				itemList: list, //['A', 'B', 'C']
				success: function (res) {
					let n = res.tapIndex;
					n = list[n];
					success(n);
				}
			})
		})
	},
	
	
	page:{
		//页面后退 大于页面历史记录长度将返回首页
		back(n=1){
			uni.navigateBack({
				delta: n
			});
		},
		//打开新页面
		open(url){
			uni.navigateTo({
			    url: url
			});
		},
		//关闭当前页面 打开新页面
		closeAndOpen(url){
			uni.redirectTo({
			    url: url
			});
		},
		//关闭所有页面 打开新页面
		closeAllAndOpen(url){
			uni.reLaunch({
			    url: url
			});
		},
		//关闭所有非tab页面 跳转到tab页面
		closeAllAndOpenTab(url){
			uni.switchTab({
			    url: url
			});
		}
	},
	
	
	//本地缓存
	storage:{
		get(key){
			return new Promise(success=>{
				uni.getStorage({
				    key: key,
				    success: function (res) {
				        success(res.data);
				    },
					fail:function(e){
						success('');
					}
				});
			})
		},
		set(key,data){
			return new Promise(success=>{
				uni.setStorage({
				    key: key,
				    data: data,
				    success: function () {
				        success();
				    }
				});
			})
		},
		clearAll(){
			uni.clearStorage();
		},
		del(key){
			return new Promise(success=>{
				uni.removeStorage({
				    key: key,
				    success: function () {
				        success();
				    },
					fail:function(){
						success();
					}
				});
			})
		}
	}
	
	
	
	
	
	
};




module.exports = lib;
