



export default {
	//input输入自动记录函数
	//需要设置id， id和绑定的变量名相同
	//添加 @input=‘inputAutoSave’
	inputAutoSave(e){
		let id = e.target.id,
			val = e.target.value,
			pages = getCurrentPages(), //当前页面栈
			l = pages.length,
			nowPage = pages[l - 1];

		nowPage[id] = val;
	}
}
