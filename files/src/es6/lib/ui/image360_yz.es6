//360度全景图  球形模型贴图
// 需要自己加载THREE.js
// THREE.WebGLRenderer 96

// new fn({
// 	body:document.getElementById('aaa'),
// 	image:'./1.png'
// })



let createWorld = Symbol(),
	createSphere = Symbol(),
	addEvent = Symbol(),
	touchStart = Symbol(),
	touchStartFn = Symbol(),
	touchMove = Symbol(),
	touchMoveFn = Symbol(),
	touchEnd = Symbol(),
	touchEndFn = Symbol(),
	run = Symbol(),
	getRadian = Symbol(),
	setParam = Symbol();

let device = require('../device');

class image360{
	constructor(opt){
		//图片地址
		this.image = opt.image;
		//容器
		this.body = opt.body || document.body;
		this.bodyWidth = parseInt($(this.body).width());
		this.bodyHeight = parseInt($(this.body).height());

		//球体半径
		this.r = (this.bodyWidth > this.bodyHeight)? this.bodyWidth/2 : this.bodyHeight/2;
		//加载器
		this.loader = null;
		//场景
		this.scene = null;
		//相机
		this.camera = null;
		//渲染器
		this.renderer = null;
		//球体对象
		this.sphere = null;

		this.radianX = 0;
		this.radianY = 0;
		this.isTouch = false;
		this.point = [];


		//创建世界
		this[createWorld]();
		//参数设置
		this[setParam]();
		//创建球体
		this[createSphere]();
		//添加事件监听
		this[addEvent]();

		this[run]();
	}

	//创建世界
	[createWorld](){
		//创建场景
		this.scene = new THREE.Scene();
		//创建相机
		this.camera = new THREE.PerspectiveCamera( 75, this.bodyWidth/this.bodyHeight, 1, 2000 );
		// this.camera.position.z = 1000;
		//创建渲染器
		this.renderer = new THREE.WebGLRenderer();

		this.body.appendChild( this.renderer.domElement );
	}

	//创建球体
	[createSphere](){
		var geometry = new THREE.BoxGeometry( this.r,this.r,this.r);
		geometry.scale( - 1, 1, 1 );
		var jpg = new THREE.MeshBasicMaterial({
			color:0xffffff
		});
		var mesh = new THREE.Mesh( geometry, jpg );

		var loader = new THREE.CubeTextureLoader()
					.setPath( 'image3d/' )

					// px = left
					// nx = right
					// py = top
					// ny = bottom
					// pz = back
					// nz = front
					.load([
						'panorama.back.jpg',
						'panorama.back.jpg',
						'panorama.back.jpg',
						'panorama.back.jpg',
						'panorama.back.jpg',
						'panorama.back.jpg'
					], function (texture) {
						// texture.image.width = 400;
						// texture.image.height = 300;
						mesh.material = new THREE.MeshBasicMaterial({
							envMap: texture
							// fog:false
							// minFilter:THREE.NearestFilter
						});
					});

		this.sphere = mesh;
		this.scene.add(mesh);
	}

	//参数设置
	[setParam](){
		this.renderer.setSize( this.bodyWidth, this.bodyHeight );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setClearColor( 0x000000, 1 );

		// this.renderer.domElement.width = $(this.body).width();
		// this.renderer.domElement.height = $(this.body).height();
		// $(this.renderer.domElement).css({
		// 	width:$(this.body).width()+'px',
		// 	height:$(this.body).height()+'px'
		// })
	}

	//运行
	[run](){
		var _this = this;
		var animate = function () {
			requestAnimationFrame( animate );

			_this.renderer.render( _this.scene, _this.camera );
		};
		animate();
	}

	//添加事件监听
	[addEvent](){
		let _this = this;

		this.body.addEventListener(device.START_EV,this[touchStartFn] = function(e){
			e.preventDefault();
			_this[touchStart](e);
		},device.eventParam);
		this.body.addEventListener(device.MOVE_EV,this[touchMoveFn] = function(e){
			e.preventDefault();
			_this[touchMove](e);
		},device.eventParam);
		this.body.addEventListener(device.END_EV,this[touchEndFn] = function(e){
			e.preventDefault();
			_this[touchEnd](e);
		},device.eventParam);
	}

	[touchStart](e){
		this.isTouch = true;
		this.point = [];
		let point = (e.touches)? e.touches[0] : e;
		if(point){
			this.point.push({
				x:point.clientX,
				y:point.clientY
			})
		}
	}
	[touchMove](e) {
		if (!this.isTouch) { return; }
		let point = (e.touches) ? e.touches[0] : e;
		if(point){
			this.point.push({
				x:point.clientX,
				y:point.clientY
			});
			this[getRadian](point.clientX, point.clientY);
		}


	}
	[touchEnd](e){
		if (!this.isTouch) { return; }
		this.isTouch = false;
		let point = this.point[this.point.length-1];

		let {radianX, radianY} = this[getRadian](point.x, point.y);
		this.radianX += radianX;
		this.radianY += radianY;
	}

	//计算弧度并旋转
	[getRadian](x,y){
		// console.log(x,y)
		// Math.asin(_mx/r)
		let startPoint = this.point[0],
			s_x = startPoint.x,
			s_y = startPoint.y,
			//*2 增加横向移动速度
			m_x = (x - s_x)*2,
			m_y = y - s_y;

		m_x = (m_x > this.r)? this.r : m_x;
		m_x = (m_x < -this.r)? -this.r : m_x;
		m_y = (m_y > this.r)? this.r : m_y;
		m_y = (m_y < -this.r)? -this.r : m_y;

		let radianX = Math.sin(Math.asin(m_x/this.r)),
			radianY = Math.sin(Math.asin(m_y/this.r));

		// console.log(radianX,radianY);
		this.sphere.rotation.x = this.radianY+radianY;
		this.sphere.rotation.y = this.radianX+radianX;

		// Math.sin(80*Math.PI/180)
		// 50度的幅度约0.75   上下增加移动的弧度
		if(this.radianY+radianY > 0.75){
			radianY = 0.75-this.radianY;
			this.sphere.rotation.x = 0.75;
		}
		if(this.radianY+radianY < -0.75){
			radianY = -0.75-this.radianY;
			this.sphere.rotation.x = -0.75;
		}

		return {radianX, radianY};
	}
}


module.exports = image360;