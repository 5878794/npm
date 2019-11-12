//获取customElement 中 slot 元素中的指定标签对象并返回

//@param  shadow :  shadow root
//@param  nodeName  tag标签名


module.exports = function(shadow,nodeName){
	let slot = $(shadow).find('slot').get(0).assignedNodes();
	nodeName = nodeName.toUpperCase();

	let find = '';
	slot.map(dom=>{
		if(dom.nodeName == nodeName){
			find = $(dom);
		}
	});

	return find;
};