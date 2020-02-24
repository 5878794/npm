let app = require('./lib/page'),
    loadFn = require('./lib/ui/loading_old'),
    $$ = require('./lib/event/$$'),
    s2t = require('./lib/fn/timeAndStamp'),
    {ajax,api} = require('./_ajax'),
    timeSelectFn = require('./lib/input/date');

let loading;

let Page = {
    init(){
        loading = new loadFn();
        loading.show('急速加载中');
        this.run().then(rs=>{
            loading.hide();
        }).catch(rs=>{
            loading.hide();
            app.alert(rs);
            throw rs;
        });
    },
    async run(){

    }
};


app.run(Page);