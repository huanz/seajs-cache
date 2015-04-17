# seajs-cache

	seajs.config({
    	base: './js/sea-modules/',
    	alias : {
        	"jquery": "jquery/2.1.3/jquery",
        	'_' : 'underscore/1.6.0/underscore',
        	'backbone' : 'backbone/1.1.2/backbone'
    	},
    	'map' : [ [ /^(.*\.(?:css|js))(.*)$/i, '$1?v=20150417' ] ],
    	// 调试模式
    	debug : false
	});
	
debug为`true`不执行`localstorage`缓存，通过修改`v`来更新版本。

