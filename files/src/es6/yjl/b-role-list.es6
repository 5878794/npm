
//角色列表

//html:
//  b-role-list(id='list' name='角色')

//js:
// let list = $('#list').get(0);
// list.data = [
//     {name:'业务员1',id:1},
//     {name:'业务员2',id:2},
//     {name:'业务员3',id:3}
// ];
// list.del = function(data){
//     console.log(del);
// };
// list.add({name:'ffff',id:4});
// list.click(fn);



require('../customElement/pc/input_search');
require('../customElement/phone/b_switch');



let addStyleFile = require('../customElement/fn/addStyleFile'),
    addStyleText = require('../customElement/fn/addStyleText');



class bRoleList extends HTMLElement{
    //元素加入页面回调
    connectedCallback() {

    }

    constructor() {
        super();

        this.body = null;

        //创建shadow容器
        this.shadow = this.attachShadow({mode: 'open'});
        this.noDataHtml = '<div class="box_hcc" style="width:100%;height:100px;font-size:14px;color:#333;">暂无数据</div>';

        //挂载css
        let all = addStyleFile('../res/css/all.css');
        this.shadow.appendChild(all);

        this.createStyle();
        let style = addStyleText(this.cssText);
        this.shadow.appendChild(style);

        this.name = $(this).attr('name') || '';
        this.userClick = function(){};
        this.userRowClick = function(){};
        //创建dom
        this.createElement();


        this.shadow.appendChild(this.body.get(0));


    }

    createElement(){
        let body = $('<div class="body box_sct"></div>'),
            border = $('<div class="border"></div>'),
            title = $('<div class="title box_hlc">'+this.name+'</div>'),
            list = $('<div class="box_slt list"></div>'),
            item = $('<div class="item box_hlc hover"></div>'),
            name = $('<div class="name boxflex1"></div>'),
            btn = $('<div class="btn box_hcc hover">删除</div>');



        item.append(name).append(btn);
        border.append(title).append(list);
        body.append(border);
        this.listBody = list;
        this.item = item;
        this.body = body;
    }
    createStyle(){
        let css = [
            '.body{width:100%; padding:20px; box-sizing:border-box;}',
            '.border{border:1px solid rgb(234,243,251);; width:100%;}',
            '.title{width:100%;height:34px;padding-left:20px;font-weight:bold;font-size:14px;background:rgb(234,243,251);}',
            '.list{width:100%;}',
            '.item{width:100%; height:40px;padding:10px 20px;border-top:1px solid rgb(234,243,251);font-size:14px;color:#333;}',
            '.btn{width:50px;height:24px;background:red;color:#fff;border-radius:5px;}'
        ];

        this.cssText = css.join('');
    }

    set data(data){
        data = data || [];

        if(data.length == 0){
            this.listBody.html(this.noDataHtml);
            return;
        }

        data.map(rs=>{
           this.add(rs);
        });
    }

    set del(fn){
        fn = fn || function(){};
        this.userClick = fn;
    }

    set click(fn){
        fn = fn || function(){};
        this.userRowClick = fn;

    }

    triggerClick(rowNumber){
        let allItem = this.body.find('.item');
        let item = allItem.eq(rowNumber);
        let data = item.data('data');
        this.userRowClick(data);

        allItem.css({background:'#fff'});
        item.css({background:'#eee'})
    }

    add(data){
        let body = this.listBody,
            item = this.item.clone(),
            _this = this;

        item.data({data:data});
        item.find('.name').text(data.name);

        item.find('.btn').click(function(e){
            e.stopPropagation();
            let data = $(this).parent().data('data');
            _this.userClick(data);
        });
        item.click(function(){
            let data = $(this).data('data');
            _this.userRowClick(data);

            let allRow = body.find('.item');
            allRow.css({background:'#fff'});
            $(this).css({background:'#eee'})

        });

        body.append(item);
    }


}



if(!customElements.get('b-role-list')){
    customElements.define('b-role-list', bRoleList);
}

