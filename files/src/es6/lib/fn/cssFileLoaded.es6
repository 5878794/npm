//加载css文件

function loadCss(src) {
	return new Promise(success=>{
		//添加css对象到dom
		let node = document.createElement('link');
		node.rel = 'stylesheet';
		node.href = src;
		document.head.insertBefore(node, document.head.firstChild);

		//轮询检查css是否已加载完成
		function poll(node) {
			var isLoaded = false;
			if (/webkit/i.test(navigator.userAgent)) {//webkit
				if (node['sheet']) {
					isLoaded = true;
				}
			} else if (node['sheet']) {// for Firefox
				try {
					if (node['sheet'].cssRules) {
						isLoaded = true;
					}
				} catch (ex) {
					// NS_ERROR_DOM_SECURITY_ERR
					if (ex.code === 1000) {
						isLoaded = true;
					}
				}
			}
			if (isLoaded) {
				success();
			} else {
				setTimeout(function () {
					poll(node);
				}, 10);
			}
		}

		setTimeout(function () {
			poll(node);
		}, 10);
	});
}


module.exports = loadCss;