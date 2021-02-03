

let fn = require('./fn.es6');
let path = require('path');

let dirSrc = path.join(__dirname,'../src/pages/');


var getEs6List1 = function(){
    //获取es6文件夹的绝对地址
    let files = fn.getDirFile(dirSrc,'es6');
    let map = {};

    files.map(fileSrc=>{
        let newFileSrc = fileSrc.replace(dirSrc,'');
        //去后缀
        newFileSrc = newFileSrc.substr(0,newFileSrc.lastIndexOf('.'));

        map[newFileSrc] = fileSrc;
    });
    map['res/js/sign_page_init'] = path.join(__dirname,"../src/es6/lib/signPage/__sign_page_init.es6");

    return map;
};


module.exports = getEs6List1;