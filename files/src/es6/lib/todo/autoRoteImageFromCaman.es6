
//未实现model输出,只记录的过程。。。。。。。

//JEPG 及 EXIF 的格式
//照片自动翻转到正常位置 通过
//TIFF header 之后的是 IFD0 即 Image File Directory
//手机转一圈拍出来的是 1 6 3 8 四个值。


//图片旋转信息,有专门的库
//https://github.com/exif-js/exif-js


//详见:  https://juejin.im/post/5bfbab9ee51d45491b015492



//图片读成buffer
const reader = new FileReader()
reader.onload = async function () {
	const buffer  = reader.result
	const orientation = getOrientation(buffer)
	const image = await rotateImage(buffer, orientation)
}
reader.readAsArrayBuffer(file)



//获取旋转方向
function getOrientation(buffer) {
	// 建立一个 DataView
	const dv = new DataView(buffer)
	// 设置一个位置指针
	let idx = 0
	// 设置一个默认结果
	let value = 1
	// 检测是否是 JPEG
	if (buffer.length < 2 || dv.getUint16(idx) !== 0xFFD8 {
		return false
	}
	idx += 2
	let maxBytes = dv.byteLength
	// 遍历文件内容，找到 APP1, 即 EXIF 所在的标识
	while (idx < maxBytes - 2) {
		const uint16 = dv.getUint16(idx)
		idx += 2
		switch (uint16) {
			case 0xFFE1:
				// 找到 EXIF 后，在 EXIF 数据内遍历，寻找 Orientation 标识
				const exifLength = dv.getUint16(idx)
				maxBytes = exifLength - 2
				idx += 2
				break
			case 0x0112:
				// 找到 Orientation 标识后，读取 DDDDDDDD 部分的内容，并把 maxBytes 设为 0, 结束循环。
				value = dv.getUint16(idx + 6, false)
				maxBytes = 0
				break
		}
	}
	return value
}



//图片旋转
function rotateImage (buffer, orientation) {
	// 利用 canvas 来旋转
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	// 利用 image 对象来把图片画到 canvas 上
	const image = new Image()
	// 根据 arrayBuffer 生成图片的 base64 url
	const url = arrayBufferToBase64Url(buffer)
	return new Promise((resolve, reject) => {
		image.onload = function () {
			const w = image.naturalWidth
			const h = image.naturalHeight
			switch (orientation) {
				case 8:
					canvas.width = h
					canvas.height = w
					ctx.translate(h / 2, w / 2)
					ctx.rotate(270 * Math.PI / 180)
					ctx.drawImage(image, -w / 2, -h / 2)
					break
				case 3:
					canvas.width = w
					canvas.height = h
					ctx.translate(w / 2, h / 2)
					ctx.rotate(180 * Math.PI / 180)
					ctx.drawImage(image, -w / 2, -h / 2)
					break
				case 6:
					canvas.width = h
					canvas.height = w
					ctx.translate(h / 2, w / 2)
					ctx.rotate(90 * Math.PI / 180)
					ctx.drawImage(image, -w / 2, -h / 2)
					break
				default:
					canvas.width = w
					canvas.height = h
					ctx.drawImage(image, 0, 0)
					break
			}
			// 也可以使用其他 API 导出 canvas
			const data = canvas.toDataURL('image/jpeg', 1)
			resolve(data)

		}
		image.src = url
	})
}



//arrayBufferToBase64Url 的实现：
function arrayBufferToBase64 (buffer) {
	let binary = ''
	// 这里用到了 TypedArray
	const bytes = new Uint8Array(buffer)
	const len = bytes.byteLength
	for (let i = 0; i < len; i++) {
		// fromCharCode 方法从指定的 Unicode 值序列创建字符串
		binary += String.fromCharCode(bytes[ i ])
	}
	// 使用 btoa 方法从 String 对象创建 base-64 编码的 ASCII 字符串
	return window.btoa(binary)
}

