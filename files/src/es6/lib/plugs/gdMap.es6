
//高德地图
// 需要设置key
// 初始调用   gdMap.create(); 才能调用其它接口


let gdMap = {
	map:null,
	src:'https://webapi.amap.com/maps?v=1.4.15&key=',
	key:'5132abe3e5888308adc582087db372de',
	loadSdk(){
		return new Promise((success,error)=>{
			let url = this.src+this.key;
			$.getScript(url,function(){
				success();
			});
		});

	},
	loadUi(){
		return new Promise((success,error)=>{
			let url = 'https://webapi.amap.com/ui/1.0/main.js?v=1.0.11';
			$.getScript(url,function(){
				success();
			});
		});
	},
	async create(id){
		let dom = document.getElementsByTagName('b-page')[0];
		if(dom){
			dom = dom.shadowRoot.getElementById(id);
		}else{
			dom = document.getElementById(id);
		}

		await this.loadSdk();
		this.map = new AMap.Map(dom, {
			resizeEnable: true,
			// zooms:[10,15],
			//地图样式
			mapStyle: "amap://styles/light"
		});

		return this.map;
	},
	//创建可以选点的地图
	async createChoosePointMap(id,success,error){
		await this.loadSdk();
		await this.loadUi();

		let _this = this;

		AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
			_this.map = new AMap.Map(id, {
				resizeEnable: true,
				// zooms:[10,15],
				//地图样式
				mapStyle: "amap://styles/light"
			});
			var positionPicker = new PositionPicker({
				mode: 'dragMap',
				map: _this.map
			});

			positionPicker.on('success', function(positionResult) {
				// console.log(positionResult.position)
				success(positionResult);


				// document.getElementById('lnglat').innerHTML = positionResult.position;
				// document.getElementById('address').innerHTML = positionResult.address;
				// document.getElementById('nearestJunction').innerHTML = positionResult.nearestJunction;
				// document.getElementById('nearestRoad').innerHTML = positionResult.nearestRoad;
				// document.getElementById('nearestPOI').innerHTML = positionResult.nearestPOI;
			});
			positionPicker.on('fail', function(positionResult) {
				// console.log(positionResult)
				error(positionResult)
				// document.getElementById('lnglat').innerHTML = ' ';
				// document.getElementById('address').innerHTML = ' ';
				// document.getElementById('nearestJunction').innerHTML = ' ';
				// document.getElementById('nearestRoad').innerHTML = ' ';
				// document.getElementById('nearestPOI').innerHTML = ' ';
			});
			// var onModeChange = function(e) {
			// 	positionPicker.setMode(e.target.value)
			// }
			// var startButton = document.getElementById('start');
			// var stopButton = document.getElementById('stop');
			// var dragMapMode = document.getElementsByName('mode')[0];
			// var dragMarkerMode = document.getElementsByName('mode')[1];
			// AMap.event.addDomListener(startButton, 'click', function() {
			// 	positionPicker.start(map.getBounds().getSouthWest())
			// })
			// AMap.event.addDomListener(stopButton, 'click', function() {
			// 	positionPicker.stop();
			// })
			// AMap.event.addDomListener(dragMapMode, 'change', onModeChange)
			// AMap.event.addDomListener(dragMarkerMode, 'change', onModeChange);
			positionPicker.start();
			_this.map.panBy(0, 1);


			_this.geolocationByH5();


			// _this.map.addControl(new AMap.ToolBar({
			// 	liteStyle: true
			// }))
		});


		return this.map;
	},
	//定位 貌似wifi不准
	geolocation(){
		let _this = this;

		return  new Promise((success,error)=>{
			_this.map.plugin('AMap.Geolocation', function() {
				let geolocation = new AMap.Geolocation({
					// 是否使用高精度定位，默认：true
					enableHighAccuracy: true,
					// 设置定位超时时间，默认：无穷大
					timeout: 5000,
					// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
					buttonOffset: new AMap.Pixel(10, 20),
					//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					zoomToAccuracy: true,
					//定位成功后将定位到的位置作为地图中心点，默认：true
					panToLocation: true,
					//  定位按钮的排放位置,  RB表示右下
					buttonPosition: 'RB'
				});

				_this.map.addControl(geolocation);

				//定位的语句
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', function(rs){
					console.log(rs)
					// let lat = rs.position.lat,
					// 	lng = rs.position.lng;
					// var gps = [lng, lat];
					// AMap.convertFrom(gps, 'gps', function (status, result) {
					// 	console.log(result);
					// 	if (result.info === 'ok') {
					// 		var lnglats = result.locations; // Array.<LngLat>
					// 		console.log('--------------')
					// 		console.log(lnglats)
					// 	}
					// });

					success(rs);
				});
				AMap.event.addListener(geolocation, 'error', function(e){
					error(e);
				});
			})
		})
	},


	addPoints(className,rs,icon){
		// let markers = [];
		// data.map(rs=> {
			var marker = new AMap.Marker({
				position: new AMap.LngLat(rs.lng, rs.lat),
				// animation: 'AMAP_ANIMATION_DROP',
				anchor: 'bottom-center',
				icon: icon,
				offset: new AMap.Pixel(0, 0),
				map: this.map,
				label: {
					offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
					content: "<div data-id='" + rs.id + "' class='" + className + "' style='font-size:0.3rem;'>" + rs.text + "</div>", //设置文本标注内容
					direction: 'top' //设置文本标注方位
				}
			});
		return marker;
			// markers.push(marker);
		// });
		// return markers;
	},


	geolocationByH5(){
		let _this = this;

		return new Promise((success,error)=>{
			navigator.geolocation.getCurrentPosition(function(rs){
				var gps = [rs.coords.longitude, rs.coords.latitude];
				//gps坐标转高德坐标
				AMap.convertFrom(gps, 'gps', function (status, result) {
					if (result.info === 'ok') {
						var lnglats = result.locations[0]; // Array.<LngLat>

						//定位后地图移动到定位点
						lnglats = new AMap.LngLat(lnglats.lng,lnglats.lat);
						_this.map.panTo(lnglats);
						_this.map.setZoom(16);
					}else{
						error('地址转换失败');
					}
				});


			},function(e){
				error(e.code)
			},{
				enableHighAcuracy : true,// 指示浏览器获取高精度的位置，默认为false
				timeout : 5000,// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
				maximumAge : 2000 // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
			});
		})
	}



};



module.exports = gdMap;



