const IS = require('is');
let util = {
    //formatData 必须为 {key,type}的格式,可以不传type
    formatData(params, valids) {
        let res = true;
        if (!IS.object(params)) return false;
        if (!IS.array(valids)) return false;
        for (let i = 0; i < valids.length; i++) {
            let e = valids[i];
            let {
                key,
                type
            } = e;
            if (!key) {
                res = false;
                break;
            }
            let value = params[key] || '';
            if (type === 'not_empty') {
                if (IS.empty(value)) {
                    res = false;
                    break;
                }
            } else if (type === 'number') {
                value = Number(value);
                if (!IS.number(value) || IS.nan(value)) {
                    res = false;
                    break;
                }
            } else if (type === 'reg') {
                let reg = e['reg'];
                if (!reg || !reg.test(value)) {
                    res = false;
                    break;
                }
            } else {
                if (!IS[type](value)) {
                    res = false;
                    break;
                }
            }
        }
        return res;
    },
    filter(params, filterArr) {
        if (IS.object(params) && IS.array(filterArr)) {
            let data = {};
            filterArr.forEach(e => {
                let val = params[e];
                if (!IS.undefined(val) && !IS.null(val) && !IS.empty(val) || IS.array.empty(val)) {
                    data[e] = val;
                }
            });
            return data;
        } else {
            return params;
        }
    },
    queryData(params, queryArr) { //仅适用于列
        let data = {};
        if (this.type(params) == 'object' && this.type(queryArr) == 'array') {
            queryArr.forEach(e => {
                let val = params[e];
                if (!!val || val == 0) {
                    data[e] = params[e];
                }
            })
        }
        return data;
    }
}
module.exports = util;