
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/title');
require('echarts/lib/component/toolbox');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/grid');
require('echarts/lib/component/legend');
require('echarts/lib/component/dataZoom');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
require('echarts/lib/component/markLine');
require('echarts/lib/component/markPoint');


class bEchart extends HTMLElement{
	constructor() {
		super();

		let body = this.attachShadow({mode: 'open'});
		this.body = $(body);

		let div = $('<div></div>');
		this.body.append(div);
		div.css({
			width:'100%',
			height:'100%'
		});


		this.myChart = echarts.init(div.get(0));
	}

	//柱状图和线性图在一起的
// {
// 	title:'档位分布',
// 	dataType:['人数','占比'],
// 	//x轴下面的名字
// 	xBottomName:[1,2,3,4,5,6,7],
// 	//x轴在上面的名字
// 	xTopName:[1,2,3,4,5,6,7],
// 	//y轴左边名字
// 	yLeftName:'人数',
// 	//y轴右边名字
// 	yRightName:'占比',
// 	//柱状图名字和数据
// 	barDataName:'数量',
// 	barData:[1,2,3,4,5,6,7],
// 	//线性图名字和数据
// 	lineDataName:'占比',
// 	lineData:[7,6,5,4,3,2,1]
//
// }


	set type1(data){
		let option = {
			title: {
				text: data.title,
				subtext: data.subTitle,
				top:10,
				left:10
			},
			grid:{
				top:80
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#283b56'
					}
				}
			},
			legend: {
				data:[data.barDataName, data.lineDataName],
				bottom:10
			},
			toolbox: {
				show: false,
				feature: {
					dataView: {readOnly: false},
					restore: {},
					saveAsImage: {}
				}
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: true,
					data: data.xBottomName || []
				},
				{
					type: 'category',
					boundaryGap: true,
					data: data.xTopName || []
				}
			],
			yAxis: [
				{
					type: 'value',
					scale: true,
					name: data.yLeftName,
					// max: 30,
					min: 0,
					boundaryGap: [0.2, 0.2]
				},
				{
					type: 'value',
					scale: true,
					name: data.yRightName,
					// max: 1200,
					min: 0,
					boundaryGap: [0.2, 0.2]
				}
			],
			series: [
				{
					name: data.barDataName,
					type: 'bar',
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: data.barData
				},
				{
					name: data.lineDataName,
					type: 'line',
					data: data.lineData
				}
			]
		};

		this.myChart.setOption(option);
	}

	//柱状图
// {
// 	title:'档位分布',
// 	dataType:['人数'],
// 	//x轴下面的名字
// 	xBottomName:[1,2,3,4,5,6,7],
// 	//y轴左边名字
// 	yLeftName:'人数',
// 	//柱状图名字和数据
// 	barDataName:'数量',
// 	barData:[1,2,3,4,5,6,7]
// }
	set type2(data){
		let option = {
			title: {
				text: data.title,
				subtext: data.subTitle,
				top:10,
				left:10
			},
			grid:{
				top:80
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#283b56'
					}
				}
			},
			legend: {
				data:[data.barDataName],
				bottom:10
			},
			toolbox: {
				show: false,
				feature: {
					dataView: {readOnly: false},
					restore: {},
					saveAsImage: {}
				}
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: true,
					data: data.xBottomName || [],
					// axisLabel: {
					// 	interval: 0,
					// 	formatter:function(value)
					// 	{
					// 		return value.split("").join("\n");
					// 	}
					// }
				}
			],
			yAxis: [
				{
					type: 'value',
					scale: true,
					name: data.yLeftName,
					// max: 30,
					min: 0,
					boundaryGap: [0.2, 0.2]
				}
			],
			series: [
				{
					name: data.barDataName,
					type: 'bar',
					data: data.barData
				}
			]
		};

		this.myChart.setOption(option);
	}

	//饼图
	set type3(data){
		let option = {
			title: {
				text: data.title,
				subtext: '',
				left: 'center',
				bottom:30
			},

			series: [
				{
					name: '',
					type: 'pie',
					radius: '50%',
					top:-40,
					data: data.data,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};

		this.myChart.setOption(option);
	}


	set type4(data){
		let option = {
			title: {
				text: data.title,top:10,
				left:10
			},
			grid:{
				top:80
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: data.dataName,
				bottom:10
			},
			toolbox: {
				show: false,
				feature: {
					dataView: {show: true, readOnly: false},
					magicType: {show: true, type: ['line', 'bar']},
					restore: {show: true},
					saveAsImage: {show: true}
				}
			},
			calculable: true,
			xAxis: [
				{
					type: 'category',
					data: data.xNameData,
					//纵向显示x轴
					axisLabel: {
						interval: 0,
						formatter:function(value)
						{
							return value.split("").join("\n");
						}
					}
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					name: data.dataName[0],
					type: 'bar',
					data: data.data1,
					markPoint: {
						data: [
							{type: 'max', name: '最大值'},
							{type: 'min', name: '最小值'}
						]
					},
					markLine: {
						data: [
							{type: 'average', name: '平均值'}
						]
					}
				},
				{
					name: data.dataName[1],
					type: 'bar',
					data: data.data2,
					markPoint: {
						data: [
							{type: 'max', name: '最大值'},
							{type: 'min', name: '最小值'}
						]
					},
					markLine: {
						data: [
							{type: 'average', name: '平均值'}
						]
					}
				}
			]
		};
		this.myChart.setOption(option);
	}

}



if(!customElements.get('b-echart')){
	customElements.define('b-echart', bEchart );
}



