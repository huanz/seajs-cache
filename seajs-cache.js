;(function () {
    function globalEval(data) {
        if (data && /\S/.test(data)) {
            (window.execScript || function (data) {
                window['eval'].call(window, data)
            })(data)
        }
    }
    function cacheJs(){
        var exec = seajs.Module.prototype.exec;
        seajs.Module.prototype.exec = function () {
            if(this.uri && this.factory && !/\.css(?:\?|$)/i.test(this.uri)) {
                localStorage.setItem('jscache<' + this.uri + '>', 'define('+this.factory.toString()+');');
            }
            return exec.apply(this, Array.prototype.slice.call(arguments));
        };
        seajs.on('request', function (request) {
            var url = request.requestUri;
            if(/\.css(?:\?|$)/i.test(url)) {
                return
            }
            var jsCode = localStorage.getItem('jscache<' + url + '>');
            if(jsCode && jsCode.length > 0) {
                globalEval(jsCode);
                request.requested = true;
                request.onRequest();
            }else{
                request.requested = false;
            }
        });
    }
    function storageHandler(e){
        var e = e || window.event;
        localStorage.removeItem(e.key);
    }

    if(!window.localStorage || seajs.data.debug){
        console.log('浏览器不支持localStorage或开启了seajs debug模式，不缓存');
    }else{
        cacheJs();
        window.addEventListener ? window.addEventListener('storage', storageHandler, false) : window.attachEvent('storage', storageHandler);
    }
    

})();