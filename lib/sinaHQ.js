hqParser = new function() {
    function a(a, b) {
        var c, d, e;
        if (!a) {
            c = {};
            c.enName = c.name = c.open = c.preClose = c.low = c.high = c.now = c.change = c.changeP = c.buy = c.sell = c.volume = c.amount = c.pe = c.income = c.high52 = c.low52 = c.low52 = c.date = c.time = c.swing =
                '--';
            return c;
        }
        d = a.split(',');
        e = {};
        if (b)
            if (b.indexOf('hk') > -1) {
                e.symbol = b;
                e.sym = b.replace('hk', '');
            } else {
                e.symbol = 'hk' + b;
                e.sym = b;
            }
        e.enName = d[0];
        e.name = d[1];
        e.open = 1 * d[2];
        e.preClose = 1 * d[3];
        e.high = 1 * d[4];
        e.low = 1 * d[5];
        e.now = 1 * d[6];
        e.change = 1 * d[7];
        e.changeP = 1 * d[8];
        e.buy = 1 * d[9];
        e.sell = 1 * d[10];
        e.volume = 1 * d[12];
        e.amount = 1 * d[11];
        e.pe = 1 * d[13];
        e.pe = e.pe || '--';
        e.income = 1 * d[14];
        e.income = e.income || '--';
        e.high52 = 1 * d[15];
        e.low52 = 1 * d[16];
        e.date = d[17];
        e.time = d[18];
        if (!e.open) {
            e.open = '--';
            if (!e.now) {
                e.high = '--';
                e.low = '--';
            }
        }
        if (!e.now) {
            e.change = '--';
            e.changeP = '--';
        }
        if (e.preClose) {
            e.swing = 100 * ((e.high - e.low) / e.preClose);
            e.swing = isNaN(e.swing) ? '--' : e.swing;
        } else {
            e.preClose = '--';
            e.swing = '--';
        }
        return e;
    }
    function b(a, b) {
        var c, d, e, f;
        if (!a) {
            c = {};
            c.enName = c.name = c.open = c.preClose = c.low = c.high = c.now = c.change = c.changeP = c.buy = c.sell = c.volume = c.amount = c.pe = c.income = c.high52 = c.low52 = c.low52 = c.date = c.time = c.swing =
                '--';
            return c;
        }
        d = a.split(',');
        e = {};
        b && (e.sym = b);
        e.name = d[0];
        e.now = 1 * d[1];
        e.changeP = 1 * d[2];
        e.updateTime = d[3];
        e.change = 1 * d[4];
        e.open = 1 * d[5];
        e.high = 1 * d[6];
        e.low = 1 * d[7];
        e.high52 = 1 * d[8];
        e.low52 = 1 * d[9];
        e.volume = 1 * d[10];
        e.averageVolume = 1 * d[11];
        e.totalShare = 1 * d[12];
        e.eps = 1 * d[13];
        e.pe = 1 * d[14];
        e.pe = e.pe || '--';
        e.beta = 1 * d[16];
        e.dividend = 1 * d[17];
        e.dividend = e.dividend || '--';
        e.income = 1 * d[18];
        e.income = e.income || '--';
        e.shares = 1 * d[19];
        e.hourTradingPrice = 1 * d[21];
        e.hourTradingChangeP = 1 * d[22];
        e.hourTradingChange = 1 * d[23];
        e.hourTradingDateTime = d[24];
        f = d[24].split(' ');
        e.hourTradingDate = f[0] + ' ' + f[1];
        e.hourTradingTime = f[2] || '';
        e.dateTime = d[25];
        f = d[25].split(' ');
        e.date = f[0] + ' ' + f[1];
        e.time = f[2];
        e.preClose = 1 * d[26];
        e.hourTradingVolume = 1 * d[27];
        if (!e.open) {
            e.open = '--';
            e.high = '--';
            e.low = '--';
        }
        if (!((e.now && '--' != e.open) || e.change)) {
            e.change = '--';
            e.changeP = '--';
        }
        if (e.preClose) {
            e.swing = 100 * ((e.high - e.low) / e.preClose);
            e.swing = isNaN(e.swing) ? '--' : e.swing;
        } else {
            e.preClose = '--';
            e.swing = '--';
        }
        return e;
    }
    function c(a, b) {
        var c, d, e, f, g;
        if (!a) {
            c = {};
            c.enName = c.name = c.open = c.preClose = c.low = c.high = c.now = c.change = c.changeP = c.buy = c.sell = c.volume = c.amount = c.pe = c.income = c.high52 = c.low52 = c.low52 = c.date = c.time = c.swing =
                '--';
            return c;
        }
        d = a.split(',');
        e = {};
        if (b)
            if (b.indexOf('s') > -1) {
                e.symbol = b;
                e.sym = b.replace(/s[hz]/, '');
            } else {
                e.sym = b;
                f = b.charAt(0);
                '69'.indexOf(f) > -1 && (e.symbol = 'sh' + b);
                '023'.indexOf(f) > -1 && (e.symbol = 'sz' + b);
            }
        e.name = d[0];
        e.open = 1 * d[1];
        e.preClose = 1 * d[2];
        e.now = 1 * d[3];
        e.high = 1 * d[4];
        e.low = 1 * d[5];
        e.buy = 1 * d[6];
        e.sell = 1 * d[7];
        e.volume = 1 * d[8];
        e.symbol && /^(sh000|sh580)\d*/.test(e.symbol) && (e.volume *= 100);
        e.amount = 1 * d[9];
        e.date = d[30];
        e.time = d[31];
        e.status = d[32];
        g = {
            '00': '',
            '01': '临停1H',
            '02': '停牌',
            '03': '停牌',
            '04': '临停',
            '05': '停1/2',
            '07': '暂停',
            '-1': '无记录',
            '-2': '未上市',
            '-3': '退市'
        };
        e.statusWord = '00' == e.status || e.buy || e.sell ? '' : g[e.status];
        ('02' != e.status && '03' != e.status) || e.buy || e.sell || (e.stopDay = !0);
        e.change = e.now - e.preClose;
        e.changeP = 100 * (e.change / e.preClose);
        if (!e.open) {
            e.open = '--';
            e.high = '--';
            e.low = '--';
        }
        if (!e.now || '--' == e.open) {
            e.change = '--';
            e.changeP = '--';
        }
        if (e.preClose) {
            e.swing = 100 * ((e.high - e.low || 0) / e.preClose);
            e.swing = isNaN(e.swing) ? '--' : e.swing;
        } else {
            e.preClose = '--';
            e.swing = '--';
        }
        e.now = e.now || e.preClose;
        return e;
    }
    function d(a) {
        var c, d, e;
        if (!a) {
            c = {};
            c.enName = c.name = c.open = c.preClose = c.low = c.high = c.now = c.change = c.changeP = c.buy = c.sell = c.volume = c.amount = c.pe = c.income = c.high52 = c.low52 = c.low52 = c.date = c.time = c.swing =
                '--';
            return c;
        }
        d = a.split(',');
        e = {};
        e.name = d[0];
        e.now = 1 * d[1];
        e.change = 1 * d[2];
        e.changeP = 1 * d[3];
        e.time = d[4];
        if (!e.now) {
            e.change = '--';
            e.changeP = '--';
        }
        return e;
    }
    function e(a) {
        var c, d, e;
        if (!a) {
            c = {};
            c.enName = c.name = c.open = c.preClose = c.low = c.high = c.now = c.change = c.changeP = c.buy = c.sell = c.volume = c.amount = c.pe = c.income = c.high52 = c.low52 = c.low52 = c.date = c.time = c.swing =
                '--';
            return c;
        }
        d = a.split(',');
        e = {};
        e.now = 1 * d[0];
        e.change = e.now - d[7];
        e.changeP = 1 * d[1];
        if (!e.now) {
            e.change = '--';
            e.changeP = '--';
        }
        return e;
    }
    function f(a, b, c) {
        var d = arguments.callee[a];
        return d ? d(a, b, c) : {};
    }
    f.a = c;
    f.b = d;
    f.hk = a;
    f.us = b;
    f.hf = e;
    return f;
}();

const self = (data, data_i, profit = 0) => {
    var _data = hqParser.a(data);
    var _price = _data.now * 1 || _data.preClose;
    var _data_i = data_i.split(',');
    var totalcapital = _data_i[7];
    var totalShare = _price * totalcapital * 10000;
    var profit_four = profit || _data_i[13];
    let pe = 0;
    if (profit_four > 0) {
        pe = totalShare / profit_four / 100000000;
    }
    return pe * 1;
};
module.exports = self;

// var hq_str_sz002597 =
//     '金禾实业,26.250,26.270,26.830,27.100,26.150,26.830,26.840,9478156,254288754.560,42700,26.830,13200,26.820,11600,26.810,24500,26.800,21300,26.790,4000,26.840,500,26.850,22200,26.860,22900,26.870,43600,26.880,2018-02-23,15:12:03,00';
// var hq_str_sz002597_i =
//     'A,jhsy,0.9700,1.0857,1.2400,5.2577,404.7623,56423.6186,55951.062,55951.062,0,CNY,5.5146,8.9612,21.5000,1,25.9900,33.0063,6.9962';
// console.log(self(hq_str_sz002597, hq_str_sz002597_i))
