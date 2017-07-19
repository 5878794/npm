var exec = require('child_process').exec;

module.exports = function(cmdText,success,error){
		exec(cmdText,function(err,stdout,stderr){
			if(err) {
				error(stderr);
			} else {
				success(stdout.toString());
			}
		})
};