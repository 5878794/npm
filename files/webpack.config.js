var webpack = require('webpack');
var path = require('path');
var glob = require("glob");

var getEs6List1 = require('./cmd/es6.es6');

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');



//生成要编译的文件列表
// var getEs6List = function(){
// 	//获取es6文件夹的绝对地址
// 	var es6Src = __dirname+"/src/es6/";
// 	//获取es6文件夹下第2层目录中的所有es6文件  并返回数组
// 	var entryFiles = glob.sync(es6Src+"*.es6");
// 	var map = {};
//
// 	for(var i=0,l=entryFiles.length;i<l;i++){
// 		var this_file = entryFiles[i];
// 		//获取相对es6文件夹下的相对路径
// 		this_file = this_file.replace(es6Src,"");
//
// 		//获取es6下第一层文件夹的名字 和文件名不带后缀
// 		var paths = this_file.split("/"),
// 			dirName = "",fileName = "";
//
// 		if(paths.length == 2){
// 			dirName = paths[0]+"/";
// 			fileName = paths[1].split(".")[0];
// 		}else{
// 			fileName = paths[0].split(".")[0];
// 		}
//
// 		//排除lib文件夹
// 		if(dirName == "lib/"){continue;}
// 		//排除文件名中有"_"符号的文件
// 		if(fileName.indexOf("_")>-1){continue;}
//
// 		//生成需要存放编译后的相对trunk文件夹的路径
// 		var key = dirName+"js/"+fileName;
// 		//生成Json
// 		map[key] = entryFiles[i];
// 	}
//
// 	return map;
// };
// // console.log(getEs6List());
//
// var getEs6List1 = function(){
// 	//获取es6文件夹的绝对地址
// 	var es6Src = __dirname+"/src/es6/";
// 	es6Src = es6Src.replace(/\\/ig,"/");
// 	//获取es6文件夹下第2层目录中的所有es6文件  并返回数组
// 	var entryFiles = glob.sync(es6Src+"*.es6");
// 	var map = {};
//
// 	for(var i=0,l=entryFiles.length;i<l;i++){
// 		var this_file = entryFiles[i];
// 		//获取相对es6文件夹下的相对路径
// 		this_file = this_file.replace(es6Src,"");
//
// 		//获取es6下第一层文件夹的名字 和文件名不带后缀
// 		var fileName = "";
// 		fileName = this_file.split(".")[0];
//
// 		//排除文件名中有"_"符号的文件
// 		if(fileName.indexOf("_") == 0){continue;}
//
// 		//生成需要存放编译后的相对trunk文件夹的路径
// 		var key = "js/dist/"+fileName;
// 		//生成Json
// 		map[key] = entryFiles[i];
// 	}
//
// 	//单独输出单页面使用的入口文件
// 	map['js/dist/sign_page_init'] = glob.sync(es6Src+"lib/signPage/__sign_page_init.es6")[0];
//
// 	return map;
// };
//
//
// var getTime = function(b){
// 	b = b || new Date().getTime();
// 	var a = new Date(parseInt(b));
// 	var year=a.getFullYear();
// 	var month=parseInt(a.getMonth())+1;
// 	month= (month<10)? "0"+month : month;
// 	var date=a.getDate();
// 	date= (date<10)? "0"+date : date;
// 	var hours=a.getHours();
// 	hours= (hours<10)? "0"+hours : hours;
// 	var minutes=a.getMinutes();
// 	minutes= (minutes<10)? "0"+minutes : minutes;
// 	var seconds=a.getSeconds();
// 	seconds= (seconds<10)? "0"+seconds : seconds;
//
// 	return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
// };


// new webpack.BannerPlugin('create by bens '+ getTime());



module.exports = {
	//页面入口文件配置
	entry:getEs6List1(),
	devtool:false,
	//入口文件输出配置
	output: {
		path: __dirname+"/trunk/",
		filename: "[name].min.js",
		publicPath:"/"
	},
	// watch:true,
	module:{
		rules: [
			//加载器配置
			{
				test: /\.es6?$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						// cacheDirectory: true,
						presets: [
							[
								"@babel/env",
								{
									// targets: {
									// 	browsers: ['> 1%', 'last 2 versions'],
									// 	// chrome: '52' // 一些新语法浏览器直接支持 不会被转换
									// },

									"useBuiltIns": "entry",  //entry   usage
									corejs:3
								}
							]
						],
						plugins: [
							//解决commonjs问题
							'@babel/plugin-transform-modules-commonjs',
							//引入polyfill
							'@babel/plugin-transform-runtime',


							//类的装饰器  需要带参数 {legacy:true}
							//使用咯带参数的配置  后面2个也要配置参数   {loose:true} 使用松散模式
							["@babel/plugin-proposal-decorators",{legacy:true}],


							//类私有变量
							["@babel/plugin-proposal-class-properties",{loose:true}],
							['@babel/plugin-proposal-private-methods',{loose:true}]

						]
					}
				}
			}

		]
	},
	//其它解决方案配置
	resolve: {
		//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
		extensions: ['.es6','.js'],
		//自己的库地址
		modules: [
			path.resolve(__dirname, "src/es6"),
			"node_modules"
		]
	},
	optimization:{
		//公共文件提取
		splitChunks:{
			name: 'common',  //这公共代码的chunk名为'commons'
			chunks:'all',
			minChunks:3,        // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码
			filename: 'res/js/[name].min.js'  //生成的文件名
		}
		// minimizer: [
			// 代码压缩
			// new UglifyJsPlugin(),

		// ]
	},
	devServer: {
		contentBase: path.join(__dirname, './trunk'),
		// compress: true,
		port: 9000
	}


};

