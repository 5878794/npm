

//页面录制屏幕

//原理:通过canvas录制


//定期通过 html2canvas抓取页面截图   需要25帧
//然后启动录制,见下面的步骤




//通过canvas创建视频流
// const stream2 = canvas.captureStream(60); // 60 FPS recording

//创建recorder对象
// const recorder = new MediaRecorder(stream2, {
// 	mimeType: 'video/webm;codecs=vp9'
// });

//开始录制
// recorder.start(10);

//停止录制
// recorder.stop();


//录制过程
//  allChunks = [];
// recorder.ondataavailable = e => {
// 	//console.log("TCL: e", e)
// 	allChunks.push(
// 		e.data
// 	);
// }


//转blob
// const fullBlob = new Blob(allChunks);
// const downloadUrl = window.URL.createObjectURL(fullBlob);