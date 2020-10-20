
//dom树变化监听,包含子对象


let MutationObserver =  window.MutationObserver ||
						window.WebKitMutationObserver ||
						window.MozMutationObserver;


let watcher = function(dom,callback){
	// 该构造函数用来实例化一个新的 Mutation 观察者对象
	// Mutation 观察者对象能监听在某个范围内的 DOM 树变化
	// callback 返回 MutationRecord 对象
	let observer = new MutationObserver(callback);


	// 传入目标节点和观察选项
	// 如果 target 为 document 或者 document.documentElement
	// 则当前文档中所有的节点添加与删除操作都会被观察到
	observer.observe(dom, {
		'childList': true, //该元素的子元素新增或者删除
		'subtree': true, //该元素的所有子元素新增或者删除
		// 'attributes' : true, //监听属性变化
		// 'characterData' : true, // 监听text或者comment变化
		// 'attributeOldValue' : true, //属性原始值
		// 'characterDataOldValue' : true
	});

	//停止观察目标节点的属性和节点变化， 直到下次重新调用observe方法；
	// observer.disconnect();
	//清空观察者对象的记录队列,并返回一个数组， 数组中包含Mutation事件对象;
	// observer.takeRecords();
};


export default watcher;


