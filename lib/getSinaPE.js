const request = require('request');
const sinaPe = require('./sinaHQ');
function getSinaPE(id, name) {
    let sid = id.slice(0, 2);
    if (sid === '00' || sid === '30') {
        sid = `sz${id}`;
    } else if (sid === '60') {
        sid = `sh${id}`;
    } else {
        return Promise.resolve();
    }

    const url = `http://hq.sinajs.cn/rn=12121&list=${sid},${sid}_i`;
    return new Promise((resolve, reject) => {
        request.get(url, (err, res, body) => {
            if (!err && body) {
                body = body.split(/\n/);
                if (body.length >= 2) {
                    try {
                        let data = body[0].match(/"(.+)"/)[1];
                        let data_i = body[1].match(/"(.+)"/)[1];
                        let pe = sinaPe(data, data_i);
                        resolve(pe);
                    } catch (e) {
                        resolve(0);
                    }
                } else {
                    resolve(0);
                }
            } else {
                resolve(0);
            }
        });
    });
}

module.exports = getSinaPE;
