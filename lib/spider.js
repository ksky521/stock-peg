var request = require('request');
var parser = require('./parser');
var fs = require('fs');
var path = require('path');
var $ = require('cheerio');
const iconv = require('iconv-lite');

/**
 * Spider
 */
var Spider = function(options, callback, handlerMap) {
    if (typeof callback === 'object') {
        handlerMap = callback;
        callback = function() {};
    }
    var opts = handlerOpts(options);
    return request.apply(this, [opts, getHandler(callback, handlerMap, opts)]);
};

Spider.get = function(url, callback, handlerMap) {
    if (typeof callback === 'object') {
        handlerMap = callback;
        callback = function() {};
    }
    var opts = handlerOpts(url);
    return request.get(opts, getHandler(callback, handlerMap, opts));
};

Spider.post = function(url, data, callback, handlerMap) {
    if (typeof callback === 'object') {
        handlerMap = callback;
        callback = function() {};
    }
    var opts = handlerOpts(url);
    return request.post(opts, getHandler(callback, handlerMap, opts));
};

//保存
Spider.save = function(url, output, callback) {
    if (typeof output === 'function') {
        callback = output;
        output = path.basename(url);
    } else {
        output = output || path.basename(url);
    }
    url = handlerOpts(url);
    return request(url).on('error', callback).on('end', callback).pipe(fs.createWriteStream(output));
};

Spider.request = request;

module.exports = Spider;

function getHandler(callback, handlerMap, opts) {
    return function(error, response, body) {
        if (!error) {
            var contentType = '';
            if (!body) {
                body = response.toString();
            } else {
                contentType = response.headers['content-type'];
            }
            if (opts.decode) {
                body = iconv.decode(body, opts.decode || 'gb2312').toString();
            }
            // console.log(body, contentType);
            //处理json
            if (opts.dataType === 'json' || contentType.indexOf('application/json') !== -1) {
                return callback(error, JSON.parse(body));
            } else if (
                opts.dataType === 'xml' ||
                opts.dataType === 'html' ||
                contentType.indexOf('text/html') !== -1 ||
                contentType.indexOf('/xml') !== -1
            ) {
                return callback(error, parser(body, handlerMap), response);
            }
            callback(error, body, response);
        } else {
            callback(error, body, response);
        }
    };
}

/**
 * 统一处理参数，处理cookie机制
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function handlerOpts(url) {
    var options =
        typeof url === 'string'
            ? {
                  url: url
              }
            : url;
    if (options.decode) {
        //使用buffer
        options.encoding = null;
    }
    if (options.cookie) {
        var j = options.jar || request.jar();
        var cookies = options.cookie;
        url = options.url;
        cookies.split(/\s*;\s*/).forEach(function(v) {
            var cookie = request.cookie(v);
            j.setCookie(cookie, url, function(err, cookie) {
                if (err) {
                    console.log('set cookie error:', err, cookie);
                }
            });
        });
        options.jar = j;
    }
    return options;
}
