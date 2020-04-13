


//插入html时的过滤函数


module.exports = function(str){
	return ('' + str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')     // DEC=> &#60; HEX=> &#x3c; Entity=> &lt;
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')   // &apos; 不推荐，因为它不在HTML规范中
		.replace(/\//g, '&#x2F;');
};