;(function () {
	var doc = document,
		h = doc.head,
		store = window.localStorage;
    function globalEval(data) {
        if (data && /\S/.test(data)) {
            var script = doc.createElement('script'),
            	code = '!function(){' + data + '\n}();';
			script.appendChild(doc.createTextNode(code));
			h.appendChild(script);
        }
    }
    function cacheJs(){
        var exec = seajs.Module.prototype.exec,
        	slice = Array.prototype.slice;
        seajs.Module.prototype.exec = function () {
            if(this.uri && this.factory && !/\.css(?:\?|$)/i.test(this.uri)) {
                store.setItem('jscache<' + this.uri + '>', 'define('+this.factory.toString()+');');
            }
            return exec.apply(this, slice.call(arguments));
        };
        seajs.on('request', function (request) {
            var url = request.requestUri;
            if(/\.css(?:\?|$)/i.test(url)) {
                return
            }
            var jsCode = store.getItem('jscache<' + url + '>');
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
        store.removeItem(e.key);
    }

    if(!store || seajs.data.debug){
        console.log('浏览器不支持localStorage或开启了seajs debug模式，不缓存');
    }else{
        cacheJs();
        window.addEventListener ? window.addEventListener('storage', storageHandler, false) : window.attachEvent('storage', storageHandler);
    }
    

})();