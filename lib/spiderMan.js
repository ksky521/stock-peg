const spider = require('./spider');

const spiderMan = function(url, map, proxy, timeout = 5e3) {
    return new Promise((resolve, reject) => {
        var opt = {
            uri: url,
            timeout: timeout,
            decode: 'gb2312',
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
            }
        };

        if (proxy) {
            if (proxy.indexOf('http://') !== 0) {
                proxy = 'http://' + proxy;
            }
            opt.proxy = proxy;
        }
        spider(
            opt,
            function(error, data) {
                // console.log(data.item, !(data.item && data.item.length))
                if (error || !data || !(data.item && data.item.length)) {
                    reject(error, data);
                } else {
                    resolve(data.item);
                }
            },
            map
        );
    });
};
module.exports = spiderMan;
