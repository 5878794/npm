



export default {
	//输入
	inputAutoSave(e){
		let id = e.target.id,
			val = e.target.value,
			pages = getCurrentPages(), //当前页面栈
			l = pages.length,
			nowPage = pages[l - 1];

		nowPage[id] = val;
	}
}
