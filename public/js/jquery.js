function Jquery() { 
    this.url = 'http://route.showapi.com/109-35'
    this.queryUrl = 'http://route.showapi.com/109-34'
    this.appId = 73733
    this.signature = 'fd4cee616b564631a718acff3bf983c0'
    this.time_stamp = Date.parse(new Date())
    this.configVal()
}
Jquery.prototype = {
    config: null,
    get2Unicode: function (num) {
        return '\\u' + num.charCodeAt(0)
    },
    configVal: function () { 
        this.config = {
            showapi_appid: this.appId,
            showapi_sign: this.signature,
            showapi_timestamp: this.time_stamp,
        }
    },
    applyAjax: function (method, url, config, callback, asyn) {
        var xhr = new XMLHttpRequest()
        asyn = asyn === false ? asyn : true
        var arr = []
        for (var key in config) { 
            arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(config[key]))
        }
        config = arr.join('&')
        switch (method) { 
            case 'get':
                xhr.open('get', url + '?' + config, asyn)
                xhr.send(null)
                break
            case 'post':
                xhr.open('post', url, asyn)
                xhr.setRequestHeader('Content-Type', 'application-x-www-form-urlencoded')
                xhr.send(config)
                break
            default:
                throw new Error('method is not a mode')
        }
        xhr.onreadystatechange = function () { 
            if (xhr.status === 200 && xhr.readyState === 4) { 
                callback(JSON.parse(xhr.responseText))
            }
        }
    },
}