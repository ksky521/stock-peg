var cheerio = require('cheerio');

var parser = function(data, map) {
    var $ = data;
    if (typeof data === 'string') {
        $ = cheerio.load(data || '', {
            decodeEntities: false
        });
    }
    switch (typeof map) {
        case 'object':
            return getData(map, $, $);
        case 'function':
            return map($);
        default:
            return $;
    }
};

function getData(map, $, $$) {
    var data = {};
    for (var i in map) {
        var curMap = map[i];
        if (typeof curMap === 'string') {
            //处理非对象情况
            curMap = {
                selector: curMap,
                handler: 'html'
            };
        }
        var selector = curMap.selector;
        var handler = curMap.handler;
        var filter = curMap.filter;
        if (typeof filter !== 'function') {
            filter = (n) => {
                return n;
            };
        }
        //选择器，生成dom节点对象
        var $nodes = [];
        if ($.find) {
            //按照数组格式
            $nodes = filter($.find(selector), $$);
        } else {
            $nodes = filter($(selector), $$);
        }

        //开始处理数据和递归
        switch (typeof handler) {
            case 'string':
            case 'function':
                //获取属性值
                data[i] = _get(handler, $nodes, $$);
                break;
            case 'object':
                //继续递归
                var tArray = [];
                $nodes.each(function(j, e) {
                    var $node = $$(e);
                    tArray.push(getData(handler, $node, $$));
                });

                data[i] = tArray;
                break;
            default:
                data[i] = _get('html', $nodes, $$);
                break;
        }
    }
    return data;
}

function _get(handler, $node, $) {
    if (typeof handler !== 'function') {
        var h = handler.split(':'); //attr:xxx

        handler = function($n, $) {
            var str = $n[h[0]](h[1]);
            if (str) return str.trim();
            else return '';
        };
    }

    if ($node.length > 1) {
        var t = [];
        if (!$node.each) {
            $node = $($node);
        }
        $node.each(function(k, e) {
            // console.log($$(e));
            t.push(handler($(e), $));
        });
        return t;
    } else {
        return handler($node, $);
    }
}

module.exports = parser;
