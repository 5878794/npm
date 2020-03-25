let app = require('./lib/page'),
    device = require('./lib/device'),
    getParamFromUrl = require('./lib/fn/getParamFromUrl'),
    loadFn = require('./lib/ui/loading_old'),
    $$ = require('./lib/event/$$'),
    info = require('./lib/ui/info'),
    s2t = require('./lib/fn/timeAndStamp'),
    areaData = require('./lib/code/areaCode'),
    {ajax,api} = require('./_ajax'),
    err = require('./lib/fn/errorHandler');


require('./lib/jq/check_from');
require('./customElement/phone/b_select');
require('./customElement/phone/b_select_date');
require('./customElement/phone/b_select_cascade');
require('./customElement/phone/b_select_number');



let loading;
let Page = {
    init(){
        loading = new loadFn();
        loading.show('急速加载中');
        this.run().then(rs=>{
            loading.hide();
        }).catch(rs=>{
            err.error(rs);
            loading.hide();
            app.alert(rs);
            throw rs;
        });
    },
    async run(){


    }
};


app.run(Page);