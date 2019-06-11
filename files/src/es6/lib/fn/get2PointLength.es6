


//获取2个经纬度之间的直线距离

//参数  经度1，纬度1，经度2，纬度2
module.exports = function(longitude1, latitude1, longitude2, latitude2){
	let lat1 = latitude1*Math.PI/180,
		lat2 = latitude2 * Math.PI / 180,
		lon1 = longitude1 * Math.PI / 180,
		lon2 = longitude2 * Math.PI / 180,
		a = lat1 - lat2,
		b = lon1 - lon2,
		s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(b / 2), 2)));

	s = s * 6378137.0; //弧长乘地球半径（半径为米）
	//精确距离的数值 米
	s = Math.round(s);


	return s;
};