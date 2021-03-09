let fn = require('./fn.es6');

let renderFn = function(){
	let stamp = new Date().getTime();
	fn.runExec('webpack --mode production',true);

	fn.runExec('node ./cmd/pug.es6 '+stamp);

	fn.runExec('node ./cmd/less.es6 '+stamp);
	fn.runExec('node ./cmd/ver.es6 '+stamp);
};


renderFn();