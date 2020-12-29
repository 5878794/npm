

let textPx2Rem = function(str){
	return str.replace(/(\d+)px/g,function(val,group){
		return group / 100 + 'rem'
	});
};

let jsonPx2Rem = function(data){
	let backData = {};
	for(let [key,val] of Object.entries(data)){
		backData[key] = textPx2Rem(val);
	}
	return backData;
};



module.exports = {textPx2Rem,jsonPx2Rem}