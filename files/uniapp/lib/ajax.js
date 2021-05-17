

let serverUrl = 'http://42.194.164.201/';

let ajax = function(url, data, method, success, error){
	url = serverUrl+url;
	uni.request({
		url: url,
		data: data,
		method: method,
		header:{
			Authorization:getApp().globalData.token
		},
		success:function(res){
			if (res.statusCode != 200) {
				error('network error : ' + res.data);
				// uni.showToast({
				// 	title: 'network error : ' + res.data,
				// 	icon: 'none'
				// });
				return;
			}
			if (res.data.code != 0) {
				// uni.showToast({
				// 	title: res.data.msg,
				// 	icon: 'none'
				// });
				error(res.data.msg);
			} else {
				success(res.data.data || {});
			}
		},
		fail:function(err){
			// uni.showToast({
			// 	title: 'network error : ' + err,
			// 	icon: 'none'
			// });
			error('network error : ' + err)
		}
	})
};

let uploadFile = function(imgPath, name) {
	url = serverUrl + 'api_upload?id='+name
	return new Promise((success, error) => {
		uni.uploadFile({
			url: url,
			header:{
				Authorization:getApp().globalData.token
			},
			method: 'POST',
			name: 'file',
			filePath: imgPath,
			success:function(res){
				if (res.statusCode != 200) {
					error('network error : ' + res.data);
					// uni.showToast({
					// 	title: 'network error : ' + res.data,
					// 	icon: 'none'
					// });
					return;
				}
				let data = JSON.parse(res.data);
				if (data.code != 0) {
					// uni.showToast({
					// 	title: data.msg,
					// 	icon: 'none'
					// });
					error(data.msg);
					return;
				}
				if (data.data.upload_files[0].code != 0) {
					// uni.showToast({
					// 	title: data.data.upload_files[0].msg,
					// 	icon: 'none'
					// });
					error(data.data.upload_files[0].msg);
				} else {
					success(data.data.upload_files[0].data);
				}
			},
			fail:function(err){
				// uni.showToast({
				// 	title: 'network error : ' + err,
				// 	icon: 'none'
				// });
				error('network error : ' + err);
				// e(err)
			}
		});
	})
}


let ajaxIsSend = false;
let send = async function(arr){
	return new Promise((success,error)=>{
		Promise.all(arr).then(rs=>{
			success(rs)
		}).catch(rs=>{
			error(rs);
			throw "ajax error";
		})
	})
}




let api = {
	login:{url:'login/app',type:'post'},
	
	//一键申请资源包中的资源
	addAllResToOrder:{url:'/console/data-group/applyDataGroup/{id}',type:'post'}

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

				ajax(url, data, type, success, error);
			})
		}
	}
});




module.exports = {ajax:send,api,uploadFile};



