


let fn = require('./fn.es6'),
    path = require('path');


let src = path.join(__dirname,'../src/pages/'),
    trunk = path.join(__dirname,'../trunk/'),
    files = fn.getDirFile(src,'pug');


let renderFn = function(tt){
    fn.dirIsExistOrCreate(trunk);

    files.map(rs=>{
        let newFileSrc = rs.replace(src,'');
        newFileSrc = path.join(trunk,newFileSrc);
        newFileSrc = newFileSrc.substr(0,newFileSrc.lastIndexOf('.'))+'.html';


        let dir = newFileSrc.substr(0,newFileSrc.lastIndexOf('/'));
        fn.dirIsExistOrCreate(dir);

        let pugCode = fn.readPugFileAndCompile(rs,tt);
        fn.writeFile(newFileSrc,pugCode);
    });
};


var arguments = process.argv.splice(2);
arguments = arguments[0] || new Date().getTime();

renderFn(arguments);
