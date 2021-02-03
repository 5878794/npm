




let fn = require('./fn.es6'),
    fs = require('fs'),
    md5 = require('md5'),
    path = require('path');


let src = path.join(__dirname,'../src/pages/'),
    trunk = path.join(__dirname,'../trunk/'),
    lessFiles = fn.getDirFile(src,'less'),
    pugFiles = fn.getDirFile(src,'pug'),
    allFiles = lessFiles.concat(pugFiles);

let commonLessDir = path.join(__dirname,'../src/less/'),
    outCommonLess = path.join(__dirname,'../trunk/res/css/common.css'),
	outAllLess = path.join(__dirname,'../trunk/res/css/all.css'),
	outAllPcLess = path.join(__dirname,'../trunk/res/css/all_pc.css');


let renderFn = function(){
    fn.dirIsExistOrCreate(trunk);
    let allDir = fn.getAllDir(src);

    let catchMd5 = '';

    allDir.map(rs=>{
        fs.watch(rs,async (event,filename)=>{
            let nowFile = path.join(rs,filename),
                type = nowFile.substr(nowFile.lastIndexOf('.')+1),
                newFile = nowFile.replace(src,trunk),
                tt = new Date().getTime();

            if(allFiles.indexOf(nowFile) == -1){return;}

            let currentMd5 = md5(fs.readFileSync(nowFile));
            if(catchMd5 == currentMd5){
                return;
            }else{
                catchMd5 = currentMd5;
            }

            let dir = newFile.substr(0,newFile.lastIndexOf('/'));
            fn.dirIsExistOrCreate(dir);

            if(type == 'pug'){
                newFile = newFile.substr(0,newFile.lastIndexOf('.'))+'.html';
                let pugCode = fn.readPugFileAndCompile(nowFile,tt);
                fn.writeFile(newFile,pugCode);


                //设置字体颜色绿色
                console.log("\x1b[32m",newFile);
            }else if(type=='less'){
                newFile = newFile.substr(0,newFile.lastIndexOf('.'))+'.css';
                let lessCode = fn.readLessFileAndCompile(nowFile,tt);
                fn.writeFile(newFile,lessCode);
                console.log("\x1b[34m",newFile);

                //同时更新html
                nowFile = nowFile.substr(0,nowFile.lastIndexOf('.'))+'.pug';
                if(fs.existsSync(nowFile)){
                    let newPugFile = newFile.substr(0,newFile.lastIndexOf('.'))+'.html';
                    let pugCode = fn.readPugFileAndCompile(nowFile,tt);
                    fn.writeFile(newPugFile,pugCode);
                    console.log("\x1b[32m",newPugFile);
                }
            }
        });
    });


    let commonMd5 = '';
    fs.watch(commonLessDir,async (event,filename)=>{
        if(!(
        	filename == 'common.less' ||
	        filename == 'all.less' ||
	        filename == 'all_pc.less'
        )){return;}

        let nowFile = path.join(commonLessDir,'common.less'),
	        nowFile1 = path.join(commonLessDir,'all.less'),
	        nowFile2 = path.join(commonLessDir,'all_pc.less'),
            newFile = outCommonLess,
	        newFile1 = outAllLess,
	        newFile2 = outAllPcLess,
            tt = new Date().getTime();

        let lessCode = fn.readLessFileAndCompile(nowFile,tt),
	        lessCode1 = fn.readLessFileAndCompile(nowFile1,tt),
	        lessCode2 = fn.readLessFileAndCompile(nowFile2,tt);

        fn.writeFile(newFile,lessCode);
	    fn.writeFile(newFile1,lessCode1);
	    fn.writeFile(newFile2,lessCode2);

        console.log("\x1b[34m",newFile);
	    console.log("\x1b[34m",newFile1);
	    console.log("\x1b[34m",newFile2);

        //同时更新所有html
        let cmd = 'node ./cmd/pug.es6'
        fn.runExec(cmd);
    });




    // allFiles.map(rs=>{
    //
    //     let newFileSrc = rs.replace(src,'');
    //     newFileSrc = path.join(trunk,newFileSrc);
    //     newFileSrc = newFileSrc.substr(0,newFileSrc.lastIndexOf('.'))+'.css';
    //
    //
    //     let dir = newFileSrc.substr(0,newFileSrc.lastIndexOf('/'));
    //     fn.dirIsExistOrCreate(dir);
    //
    //     let pugCode = fn.readLessFileAndCompile(rs,tt);
    //     fn.writeFile(newFileSrc,pugCode);
    // });
};




renderFn();