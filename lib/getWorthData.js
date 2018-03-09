const spiderMan = require('./spiderMan');

function getWorthData(id, name) {
    const url = `http://basic.10jqka.com.cn/${id}/worth.html`;
    let rs = {id, name};
    return new Promise((resolve, reject) => {
        let p = spiderMan(url, {
            item: {
                selector: '#yjycData',
                handler: 'text'
            }
        });
        p.then(
            (data) => {
                try {
                    let yjyc = JSON.parse(data);
                    if (yjyc && yjyc.length) {
                        let wd = yjyc;
                        let len = wd.length;
                        let last = 0;
                        let ycYears = 0;
                        let start = 0;
                        for (let i = len - 1; i >= 0; i--) {
                            let w = wd[i];
                            if (w[3] === 'YC') {
                                ycYears++;
                                if (!last) {
                                    last = w[2] * 1;
                                }
                            } else if (!start && w[3] === 'SJ') {
                                start = w[2];
                            }
                        }
                        if (start && ycYears && last) {
                            rs.G = (Math.pow(last / start, 1 / ycYears) - 1) * 100;
                        }
                    }

                    rs.yjyc = yjyc;
                } catch (e) {
                    console.log(e);
                }

                resolve(rs);
            },
            (err, data) => {
                console.log(err);
                //这里为了跳过错误的文件，继续向下处理
                resolve(null);
            }
        );
    });
}
module.exports = getWorthData;
