

//分页

//  pagination(10,20);
// 返回  [obj...]
//  [
// 0: {type: "pre", page: 9, select: false, use: true}      //上一页
// 1: {type: "page", page: 1, select: false, use: true}     //第一页
// 2: {type: "text", page: "...", select: false, use: true}
// 3: {type: "page", page: 9, select: false, use: true}
// 4: {type: "page", page: 10, select: true, use: true}
// 5: {type: "page", page: 11, select: false, use: true}
// 6: {type: "text", page: "...", select: false, use: true}
// 7: {type: "page", page: 20, select: false, use: true}        //最后一页
// 8: {type: "next", page: 11, select: false, use: true}      //下一页
// ]


let returnData=  Symbol(),
	countPage = Symbol();


let pagination = {
	create(nowPage,totalPage){
		nowPage = parseInt(nowPage);
		totalPage = parseInt(totalPage);

		let pre = (nowPage-1>0)? nowPage-1 : 1,
			next = (nowPage+1<totalPage)? nowPage+1 : totalPage,
			backData;

		if(totalPage<=7){
			backData = [];
			for(let i=1,l=totalPage;i<=l;i++){
				backData.push(i);
			}
			backData.push(next);
			backData.unshift(pre);
			// backData = [pre,1,2,3,4,5,6,7,next];
		}else{
			backData = this[countPage](pre,next,nowPage,totalPage);
		}

		return this[returnData](backData,nowPage,totalPage);
	},
	[countPage](pre,next,nowPage,totalPage){
		//设置初始
		let data = [pre,1];

		//判断前面是否需要显示。。。
		if(nowPage-1>3){
			data.push('...');
		}else{
			data.push(2);
		}

		//补充中间
		if(nowPage-1<=3){
			data.push(3);
			data.push(4);
			data.push(5);
		}else if(totalPage-nowPage<=3){
			data.push(totalPage-4);
			data.push(totalPage-3);
			data.push(totalPage-2);
		}else{
			data.push(nowPage-1);
			data.push(nowPage);
			data.push(nowPage+1);
		}


		//判断后面是否需要显示。。。
		if(totalPage-nowPage>3){
			data.push('...');
		}else{
			data.push(totalPage-1);
		}
		//补充完
		data.push(totalPage,next);

		return data;
	},
	[returnData](data,nowPage,totalPage){
		let l = data.length-1,
			back = [];

		data.map((rs,i)=>{
			if(i==0){
				back.push({type:'pre',page:rs,select:false,use:(nowPage!=1)});
			}else if(i==l){
				back.push({type:'next',page:rs,select:false,use:(nowPage!=totalPage)});
			}else{
				let type = (rs=='...')? 'text' : 'page';
				back.push({type:type,page:rs,select:(nowPage==rs),use:true})
			}
		})

		return back;
	}

};




export default function(nowPage,totalPage){
	return pagination.create(nowPage,totalPage);
};