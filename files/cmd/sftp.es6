
// api：   https://www.npmjs.com/package/ssh2-sftp-client#sec-5-2-8


const Client = require('ssh2-sftp-client'),
		fn = require('./fn.es6');


let sftp = new Client('example-client');

(async function(){
	let remotePath = '/root/bigdata/applications/www2/';
	//链接
	await sftp.connect({
		host: '172.16.12.41',
		port:'22',
		username: 'root',
		password: 'Bigdata_care4u'
	});
	console.log('链接成功')

	//获取当前路径
	// let dir = await sftp.cwd();



	//判断远端目录是否存在
	let dirIsExist = await sftp.exists(remotePath);

	if(dirIsExist){
		//删除现有的目录
		await sftp.rmdir(remotePath,true);
		console.log('清空目录');
	}

	//创建目录
	await sftp.mkdir(remotePath,true);
	console.log('创建目录');


	//获取本地要上传的文件
	let allFiles = fn.getDirFile('./trunk/');
	//处理
	let files = [];
	allFiles.map(rs=>{
		let thisRemotePath = remotePath + rs.replace('trunk/','');
		files.push({
			localPath:rs,
			remotePath:thisRemotePath
		})
	});

	//上传
	for(let i=0,l=files.length;i<l;i++){
		let thisObj = files[i],
			localPath = thisObj.localPath,
			remotePath = thisObj.remotePath,
			remoteDir = remotePath.substr(0,remotePath.lastIndexOf('\/')+1);

		if(! await sftp.exists(remoteDir)){
			await sftp.mkdir(remoteDir,true);
		}
		//上传
		await sftp.put(thisObj.localPath,thisObj.remotePath);
		console.log(localPath+'  -->  '+remotePath);
	}

	console.log('----------------');
	console.log('upload ok');

})().catch(e=>{console.log(e)});












