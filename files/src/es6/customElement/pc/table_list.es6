




//==========================================================
//表格类型  列表显示
//==========================================================


// html:
// 	b-table-list

//js:
//获取元素对象
	//  let table = $('b-table-list').get(0);

//设置表单样式等
	// table.setting = {
	// 	titleRowHeight:30,       //标题行 高度    默认：30
	// 	titleRowStyle:null,      //标题行附加样式   {background:red;}
	// 	titleCelStyle:null,      //标题列附加样式
	//
	// 	rowHeight:30,           //列表行 高度   默认：30
	// 	rowStyle:null,          //行附加样式
	// 	celStyle:null,          //列附加样式
	//
	// 	rowHoverStyle:null,         //行hover附加样式    2个必须一起设置
	// 	rowNotHoverStyle:null       //
	// };


//设置表单绑定参数等
	// table.data = [
	// 	{
	// 		name:'客户',          //must,标题行名称
	// 		width:'25%',         //must,cel宽度
	// 		color:'#ccc',        //must,字体颜色
								// key 或 children字段必须出现一个
	// 		cursor:'pointer',      //是否显示可点击鼠标样式
	// 		icon:'icon',            //该列是否有图标
	// 		children:[
	// 			{color:'red',key:'a1',cursor:'pointer'},//该列内显示的子数据，竖向排列
	// 			{color: 'green', key: 'a2'},
	// 			{color: 'yellow', key: 'a3'}
	// 		]
	// 	},
	// 	{
	// 		name:'操作',
	// 		width:'25%',
	// 		color:'#ccc',
	// 		key:'d',                //数据对应的key
	// 		cursor:'pointer'
	// 	}
	// ];

//绑定数据
	// let data = [
	// 	{
	// 		id:1,
	// 		icon:'http://172.16.21.17:8930//image/apiDoc/jiekouwendang_36.png',
	// 		a1:'阿道夫就啊看风景阿克索德减肥了卡时间的反馈啦就是打开了飞机阿法快速的反馈及拉萨打飞机拉屎的空间',
// 	    	a2:'a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2',
// 	    	a3:'a3',
// 	    	b1:'b1',
// 	    	b2:'b2',
// 	    	c:'c',
// 	    	d:'d'
	// 	},
	//  ........
	// ];
	// table.show(data);




let addStyleFile = require('../fn/addStyleFile');

let createTitleRow = Symbol(),
	getTitleRowStyle = Symbol(),
	createRowList = Symbol(),
	getRowListStyle = Symbol();


class bTableList extends HTMLElement{
	//元素加入页面回调
	connectedCallback() {
		//挂载css
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);

	}

	constructor() {
		super();

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		this.body = $('<div></div>');
		this.shadow.appendChild(this.body.get(0));


		//表格数据
		this.tableData = [];

		//配置参数
		this.titleRowHeight = 30;
		this.titleRowStyle = null;      //{color:#ccc;}
		this.titleCelStyle = null;

		this.rowHeight = 30;
		this.rowStyle = null;
		this.celStyle = null;

		this.rowHoverStyle = null;
		this.rowNotHoverStyle = null;

	}

	set setting(opt){
		for(let [key,val] of Object.entries(opt)){
			this[key] = val;
		}
	}

	set data(data){
		this.tableData = data;
	}

	show(data){
		let _this = this;
		if(this.rowHoverStyle && this.rowNotHoverStyle){
			this.body.find('.__row__').unbind('hover');
		}
		this.body.html('');

		this.body.css({display:'none'});

		this[createTitleRow]();
		this[createRowList](data);

		if(this.rowHoverStyle && this.rowNotHoverStyle){
			this.body.find('.__row__').hover(function(){
				$(this).css(_this.rowHoverStyle);
			},function(){
				$(this).css(_this.rowNotHoverStyle);
			});
		}

		this.body.css({display:'block'});

	}

	//创建表头
	[createTitleRow](){
		let {rowCss,celCss} = this[getTitleRowStyle]();

		let row = $('<div class="box_hcc"></div>');
		row.css(rowCss);

		this.tableData.map(rs=>{
			let cel = $('<div></div>');
			cel.css(celCss);
			cel.css({width:rs.width}).text(rs.name);

			row.append(cel);
		});

		this.body.append(row);
	}
	//创建列表
	[createRowList](data){
		let {rowCss,celCss} = this[getRowListStyle]();

		data.map(rowData=>{
			let row = $('<div class="box_hcc __row__"></div>');
			row.css(rowCss);

			this.tableData.map(rs=>{
				//创建列
				let cel = $('<div class="box_scc diandian"></div>'),
					celBody = null;
				cel.css(celCss);
				cel.css({width:rs.width});

				//判断该列是否有图标
				if(rs.icon){
					cel.removeClass('box_scc').addClass('box_hcc');
					let img = new Image();
					img.src = rowData[rs.icon];
					$(img).addClass('__'+rs.icon+'__');
					cel.append(img);
					celBody = $('<div class="boxflex1 diandian box_slc" style="text-align:left;padding-left:10px;"></div>');
					cel.append(celBody);
				}

				//处理该列是否有子集
				let insertBody = (celBody)? celBody : cel;
				if(rs.children && rs.children.length != 0){
					//插入子元素
					rs.children.map(children=>{
						let childrenDom = $('<div class="diandian"></div>');
						childrenDom.text(rowData[children.key]).css({
							color:children.color,
							width:'100%'
						}).addClass('__'+children.key+'__');
						if(children.cursor){
							childrenDom.addClass('hover');
						}

						insertBody.append(childrenDom);
					});
				}else{
					//无子元素
					insertBody.append('<div class="diandian" style="width:100%;">'+rowData[rs.key]+'</div>').addClass('__'+rs.key+'__');
					if(rs.cursor){
						cel.addClass('hover');
					}
				}
				row.append(cel);
			});

			this.body.append(row);
		});
	}


	//获取标题行的css
	[getTitleRowStyle](){
		//行=================
		let row = {
			width:'100%',
			height:this.titleRowHeight+'px',
			'text-align':'center',
			'line-height':this.titleRowHeight+'px'
		};

		//应用传入的样式
		if(this.titleRowStyle && typeof this.titleRowStyle == 'object'){
			for(let [key,val] of Object.entries(this.titleRowStyle)){
				row[key] = val;
			}
		}


		//列=================
		let cel = {
			height:this.titleRowHeight+'px'
		};
		if(this.titleCelStyle && typeof this.titleCelStyle == 'object'){
			for(let [key,val] of Object.entries(this.titleCelStyle)){
				cel[key] = val;
			}
		}


		return {rowCss:row,celCss:cel};
	}
	//获取列表行的css
	[getRowListStyle](){
		//行=================
		let row = {
			width:'100%',
			height:this.rowHeight+'px',
			'text-align':'center'
		};

		//应用传入的样式
		if(this.rowStyle && typeof this.rowStyle == 'object'){
			for(let [key,val] of Object.entries(this.rowStyle)){
				row[key] = val;
			}
		}


		//列=================
		let cel = {
			height:this.rowHeight+'px',
			padding:'0 0.5%'
		};
		if(this.celStyle && typeof this.celStyle == 'object'){
			for(let [key,val] of Object.entries(this.celStyle)){
				cel[key] = val;
			}
		}


		return {rowCss:row,celCss:cel};
	}





}



if(!customElements.get('b-table-list')){
	customElements.define('b-table-list', bTableList );
}


