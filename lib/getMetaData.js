const spiderMan = require('./spiderMan');
const cheerio = require('cheerio');

function getMetaData(id, name) {
    const url = `http://basic.10jqka.com.cn/${id}/`;
    let rs = {id, name};
    return new Promise((resolve, reject) => {
        let p = spiderMan(url, {
            item: {
                selector: '.m_table.m_table_db.mt10',
                handler: 'html'
            }
        });
        p.then(
            (data) => {
                // console.log(data)
                $ = cheerio.load(data || '', {
                    decodeEntities: false
                });
                $('td').each((i, td) => {
                    if (i < 16) {
                        //只取前16个
                        let $td = $(td);
                        let data = null;
                        if ($td.has('.popp_box')) {
                            data = $td.find('.falshData').text().trim();
                            try {
                                data = JSON.parse(data);
                            } catch (e) {
                                data = null;
                            }
                            $td.find('.popp_box').remove();
                        }
                        let title = $td.find('span.f12').eq(0).text().trim();
                        title = title.replace(/[:：]/g, '');
                        if (~title.indexOf('市盈率')) {
                            //市盈率(静态)
                            title = title.replace(/(市盈率)\((.+)\)/, '$2$1');
                        }
                        let value = $td.find('span.f12').eq(1).text().trim();
                        value = value.split(/\s+/);
                        let val = value[0].match(/([\d\.\-]+)/);
                        let unit = '';
                        if (val) {
                            val = val[1];
                            unit = value[0].replace(val, '');
                        } else {
                            val = value[0];
                        }
                        // let unit = value[0].match(/([^\d\.]+)/)[1];
                        // console.log(val, value[0])
                        let rate = '';
                        let rateStr = '';
                        if (value.length === 2) {
                            rate = value[1].match(/([\d\.\-%]+)/);
                            if (rate) {
                                rate = rate[1];
                                rateStr = value[1].replace(rate, '');
                            }
                        }

                        rs[title] = {
                            val,
                            unit,
                            data,
                            rate,
                            rateStr,
                            _value: value.join(';')
                        };
                    }
                });
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
module.exports = getMetaData;
