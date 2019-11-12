

//获取地理位置
//需要https




module.exports = function(){
	return new Promise((success,error)=>{
		navigator.geolocation.getCurrentPosition(function(rs){
			success({
				lng:rs.coords.longitude,   //经度
				lat:rs.coords.latitude      //纬度
			});
		},function(e){
			//1: 用户未授权
			//2: 获取失败 可能不是https
			//3: 超时
			error(e.code);
		},{
			enableHighAcuracy : true,// 指示浏览器获取高精度的位置，默认为false
			timeout : 5000,// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
			maximumAge : 2000 // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
		});
	});
};