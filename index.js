const fs = require('fs-extra');
const cwd = __dirname;
const Path = require('path');
const program = require('commander');
const ora = require('ora');
const chalk = require('chalk');

const spiderMan = require('./lib/spiderMan');
const Queue = require('./lib/queue');
const getWorthData = require('./lib/getWorthData');
const getSinaPE = require('./lib/getSinaPE');
const getMetaData = require('./lib/getMetaData');

const list = require('./list-all.json');
const kv = require('./list.json');

function getPEColor(pe_ttm) {
    if (pe_ttm !== 'NA') {
        if (pe_ttm > 70) {
            pe_ttm = chalk`{redBright ${pe_ttm}}`;
        } else if (pe_ttm > 50) {
            pe_ttm = chalk`{yellowBright ${pe_ttm}}`;
        } else if (pe_ttm > 0 && pe_ttm < 30) {
            pe_ttm = chalk`{greenBright ${pe_ttm}}`;
        }
    } else {
        pe_ttm = chalk`{red ${pe_ttm}}`;
    }
    return pe_ttm;
}
function getPEGColor(peg) {
    if (peg > 1) {
        peg = chalk`{redBright ${peg}}`;
    } else if (peg > 0.7) {
        peg = chalk`{yellowBright ${peg}}`;
    } else if (peg > 0 && peg < 0.7) {
        peg = chalk`{greenBright ${peg}}`;
    }
    return peg;
}
//单股查询
program.command('id <sid>').description('查询个股').option('-o, --output', '输出文件名').action(function(id, cmd) {
    if (id && kv[id]) {
        const spinner = ora('Loading').start();

        getPromise(id, kv[id]).then(
            (data) => {
                spinner.succeed(`获取成功`);
                let pe_ttm = data['动态市盈率'].val ? data['动态市盈率'].val : 'NA';
                pe_ttm = getPEColor(pe_ttm);
                let pe = data['静态市盈率'].val ? data['静态市盈率'].val : 'NA';
                pe = getPEColor(pe);

                let peg = getPEGColor(data.peg ? data.peg.toFixed(2) : 'NA');

                let value = data['总市值']._value;
                let lr = data['净利润']._value;
                let pb = data['市净率'].val;

                console.log(`
股票:  ${data.id} / ${data.name}
PEG:  ${peg}
动态市盈率:  ${pe_ttm ? pe : 'NA'}
静态市盈率:  ${pe ? pe : 'NA'}
市净率:  ${pb ? pb : 'NA'}
净资产收益率:  ${data['净资产收益率']._value}
营业收入:  ${data['营业收入']._value}
市值:  ${data['总市值']._value}
网址:  http://stockpage.10jqka.com.cn/${data.id}/
`);
                // console.log(data);
            },
            (d) => {
                spinner.fail(`fail!`);
            }
        );
    } else {
        console.log('没有找到对应股票');
    }
});

//行业查询
program
    .command('category <category>')
    .description('查询某行业全部股票，category=ths/xxx')
    .option('-o, --output', '输出文件名')
    .option('-c, --concurrency', '并发数')
    .action(function(category, cmd) {
        let c = cmd.concurrency | 0;
        if (c <= 1) {
            c = 1;
        }
        let cate = category.split('/');
        let cateList = list;

        for (let i = 0; i < cate.length; i++) {
            if (cateList[cate[i]]) {
                cateList = cateList[cate[i]];
            }
        }
        const queue = new Queue(getPromise, c);
        // let count = 1;
        cateList.map(({id, name}) => {
            // if (count++ >= 3) {
            //     return;
            // }
            // if (id === '002597')
            queue.add([id, name]);
        });
        const spinner = ora('Loading').start();

        queue.run().then(
            (data) => {
                const result = {};
                if (data && data.length) {
                    data.map((d) => {
                        if (d && d.id) {
                            result[d.id] = d;
                        }
                    });
                }
                if (cmd.output) {
                    output = cmd.output;
                } else {
                    output = `${category.replace('/', '-')}.json`;
                }
                output = Path.join(cwd, `./${output}`);
                fs.writeJson(output, result);
                spinner.succeed(`获取成功，请移步路径：${output}`);
            },
            (e) => {
                spinner.fail(`fail!`);
            }
        );
    });
program
    .command('all')
    .description('获取所有同花顺分类股票数据，较慢，慎用！！')
    .option('-c, --concurrency', '并发数')
    .option('-d, --duration', '间隔时间，方式被封ip')
    .action(function(cmd) {
        let c = cmd.concurrency | 0;
        if (c <= 1) {
            c = 1;
        }
        let keys = Object.keys(list.ths);
        let ths = list.ths;
        let duration = cmd.duration | 30e3;
        let dir = Path.join(cwd, 'data');
        if (!fs.pathExistsSync(dir)) {
            fs.ensureDirSync(dir);
        }
        const spinner = ora('Loading').start();

        function all() {
            const k = keys.pop();
            if (!k) {
                return;
            }
            spinner.text = `开始跑分类：${k}`;

            const queue = new Queue(getPromise, c);

            let cateList = ths[k];
            cateList.map(({id, name}) => {
                queue.add([id, name]);
            });

            queue.run().then(
                (data) => {
                    const result = {};
                    if (data && data.length) {
                        data.map((d) => {
                            if (d && d.id) {
                                result[d.id] = d;
                            }
                        });
                        let filepath = Path.join(dir, `./${k}.json`);
                        fs.writeJsonSync(filepath, result);
                        spinner.succeed(`获取成功，请移步路径：${filepath}`);
                    }
                    spinner.text = `sleep for ${duration / 1000}s`;
                    setTimeout(() => {
                        all();
                    }, duration);
                },
                (e) => {
                    spinner.fail(`fail!`);
                }
            );
        }
        all();
    });

program.parse(process.argv);

function getPromise(id, name) {
    return new Promise((resolve, reject) => {
        Promise.all([getMetaData(id, name), getWorthData(id, name), getSinaPE(id, name)]).then(
            ([metaData, worthData, pe]) => {
                try {
                    let worth;
                    let rs = {id, name};
                    if (metaData) {
                        delete metaData.id;
                        Object.keys(metaData).map((k) => {
                            let _data = metaData[k];
                            if (!pe && k === '动态市盈率' && _data.val) {
                                pe = parseFloat(_data.val);
                                if (isNaN(pe)) {
                                    pe = 0;
                                }
                            }
                            Object.keys(_data).map((k) => {
                                if (_data[k] === '' || _data[k] === null) {
                                    delete _data[k];
                                }
                            });
                            rs[k] = _data;
                        });
                    }
                    if (worthData && worthData.yjyc) {
                        delete worthData.id;
                        rs.yjyc = worthData.yjyc;
                        rs.G = parseFloat(worthData.G);
                    }
                    rs.pe = pe;
                    if (rs.G && !isNaN(rs.G) && pe && !isNaN(pe)) {
                        rs.peg = pe / rs.G;
                    }
                    resolve(rs);
                } catch (e) {
                    console.log(e);
                }
            },
            (err) => {
                resolve();
                console.log(err);
            }
        );
    });
}
