


let fn = require('./fn.es6'),
    path = require('path');


let src = path.join(__dirname,'../src/pages/'),
    trunk = path.join(__dirname,'../trunk/'),
    files = fn.getDirFile(src,'less');


let renderFn = function(tt){
    fn.dirIsExistOrCreate(trunk);

    files.map(rs=>{
        let newFileSrc = rs.replace(src,'');
        newFileSrc = path.join(trunk,newFileSrc);
        newFileSrc = newFileSrc.substr(0,newFileSrc.lastIndexOf('.'))+'.css';


        let dir = newFileSrc.substr(0,newFileSrc.lastIndexOf('/'));
        fn.dirIsExistOrCreate(dir);

        let pugCode = fn.readLessFileAndCompile(rs,tt);
        fn.writeFile(newFileSrc,pugCode);
    });


    //处理common.less
    let commonSrc = path.join(__dirname,'../src/less/'),
        commonNewSrc = path.join(__dirname,'../trunk/res/css/common.css');
    commonSrc = path.join(commonSrc,'./common.less');
    let lessCode = fn.readLessFileAndCompile(commonSrc,tt);
    fn.writeFile(commonNewSrc,lessCode);

};


var arguments = process.argv.splice(2);
arguments = arguments[0] || 123;

renderFn(arguments);