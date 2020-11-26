


let loading = require('./ui/loading_css'),
	page = require('./page');


let fn = {
	showLoadingRun(obj,fn,notNeedLoading,param){
		if(!notNeedLoading){
			loading.show();
		}
		obj[fn].call(obj,param).then(()=>{
			if(notNeedLoading){
				// loading.hide();
			}
		}).catch(e=>{
			if(notNeedLoading){
				loading.hide();
			}
			page.alert(e);
		})
	},
};




module.exports = fn;