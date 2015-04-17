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

    function parseUrl(url){
        var urlReg = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/,
            fields = urlReg.exec(url),
            version = /v=\d+/.exec(fields[9]);
        version = version ? version[0].split('=')[1] : 1;
        return [fields[8], version];
    }

    function cacheJs(){
        var exec = seajs.Module.prototype.exec,
        	slice = Array.prototype.slice;
        seajs.Module.prototype.exec = function () {
            if(this.uri && this.factory && !/\.css(?:\?|$)/i.test(this.uri)) {
                store.setItem('cache~' + parseUrl(this.uri)[0], 'define("'+this.id+'", ["'+ this.dependencies.join('","')+'"], '+this.factory.toString()+');');
            }
            return exec.apply(this, slice.call(arguments));
        };
        seajs.on('request', function (request) {
            
            var url = request.requestUri; 
            if(/\.css(?:\?|$)/i.test(url)) {
                return
            }
            var pathVersion = parseUrl(url),
                versionMap = JSON.parse(store.getItem('cache~version')) || {},
                curVersion = pathVersion[1],
                cacheKey = pathVersion[0],
                jsCode = store.getItem('cache~' + cacheKey );
            if(jsCode && jsCode.length && curVersion == versionMap[cacheKey]){
                globalEval(jsCode);
                request.requested = true;
                request.onRequest();
            }else{
                versionMap[cacheKey] = curVersion;
                store.setItem('cache~version', JSON.stringify(versionMap));
                request.requested = false;
            }
        });
    }
    function storageHandler(e){
        var e = e || window.event;
        store.removeItem(e.key);
    }

    try {
        store.setItem('~', 1);
        store.removeItem('~');
        if(seajs.data.debug){
            console.log('开启了seajs debug模式，不缓存');
        }else{
            cacheJs();
            window.addEventListener ? window.addEventListener('storage', storageHandler, false) : window.attachEvent('storage', storageHandler);
        }
    } catch(err){
        console.log('浏览器不支持localStorage');
    }
    
})();