//获取vue组件的参数
import {
    ComponentOptions,
    ComponentPublicInstanceConstructor,
    createApp,
    FunctionalComponent
} from "vue";

const fn = {
    init(obj: any) {
        const com = this.getComponent(obj);
        const prop = this.getProp(com);
        const api = com.api;
        const emits = com.emits;
        return {
            props: prop,
            api: api,
            emits: emits
        }
    },
    getComponent(obj: any) {
        if (typeof obj === 'function') {
            //由defineCustomElement创建
            const app = createApp(obj);
            const com: any = app._component;
            return com.def;
        } else {
            //由defineComponent创建
            return obj;
        }
    },
    getProp(com: any) {
        const backData: any[] = [];
        const prop = com.props;

        for (const [key, obj] of Object.entries(prop)) {
            const objs = obj as any;
            const required = objs.required ?? false;
            const defaultVal = objs.default ?
                typeof objs.default === 'function' ?
                    objs.default() :
                    objs.default :
                undefined;
            const types = objs.type ? objs.type.name : objs.name;

            backData.push({
                type: types,
                key: key,
                required: required,
                default: defaultVal,
                selects: objs.selects,
                desc: objs.desc
            })
        }
        return backData;
    }
}


/**
 * @description 获取vue组件的参数
 * @example
 *   //新增字段只用于组件功能读取
 *   //组件内增加参数 api 介绍组件对外的接口
 *   //组件props中参数增加  selects：可选值的范围
 *   //                   des：参数的中文说明
 *   defineComponent({
 *      props:{
 *          name:{
 *              type:String,
 *              selects:['a','b'],  //新增用于组件设别能输入的字符串（可选）
 *              desc:'名字选择'      //新增用于组件设别 说明文字
 *          },...
 *      },
 *      api:{
 *          test: '获取才能书'       //新增 用于识别组件输出的接口及说明
 *      },
 *      ...
 *   })
 * */
export default function (com: ComponentOptions | FunctionalComponent | ComponentPublicInstanceConstructor) {
    return fn.init(com);
}
