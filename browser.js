(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fidem = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Client=require("./lib/client");exports.createClient=function(e){return new Client(e)};
},{"./lib/client":2}],2:[function(require,module,exports){
function Client(e){e=e||{},this.config=assign({hostname:e.hostname||"services.fidemapps.com",port:"https"===e.protocol?443:80,protocol:"http"},e)}function formatUrl(e){return e.protocol+"://"+e.hostname+":"+e.port+e.path}var Promise=require("promise"),assign=require("lodash.assign"),RequestError=require("./request-error"),request,methods=[];request=require("browser-request"),methods={assignMemberToSession:require("./methods/assignMemberToSession"),logAction:require("./methods/logAction"),startSession:require("./methods/startSession")},module.exports=Client,Client.prototype.request=function(e,s){var o=this;return new Promise(function(s,t){if(e=assign({token:null,sign:!1,method:"GET",body:null,headers:{},requestOptions:{}},e),!e.path)throw new Error("You must provide a path.");var r=assign({method:e.method,hostname:o.config.hostname,path:e.path,url:formatUrl(assign({},e,o.config)),headers:{accept:"application/json"}},e.requestOptions);-1!==["put","post"].indexOf(e.method.toLowerCase())&&(e.body=e.body||{}),e.body&&(r.headers["content-type"]="application/json",r.body=JSON.stringify(e.body)),e.qs&&(r.qs=e.qs),e.token&&(r.headers["X-Fidem-SessionToken"]=e.token),e.sign||(r.headers["X-Fidem-Access-Key"]=o.config.key),assign(r.headers,e.headers),request(r,function(e,o,r){return e?t(e):o.statusCode>=299?t(new RequestError(r,o.statusCode)):void s(JSON.parse(r))})}).nodeify(s)},assign(Client.prototype,methods);


},{"./methods/assignMemberToSession":3,"./methods/logAction":4,"./methods/startSession":5,"./request-error":6,"browser-request":7,"lodash.assign":9,"promise":19}],3:[function(require,module,exports){
module.exports=function(e,s,t){return this.request({method:"PUT",path:"/api/sessions/"+s+"/member/"+e},t)};


},{}],4:[function(require,module,exports){
module.exports=function(t,i){return this.request({method:"POST",body:t,path:"/api/gamification/actions"},i)};


},{}],5:[function(require,module,exports){
module.exports=function(e,s){return this.request({method:"POST",body:e?{member_id:e}:{},path:"/api/sessions"},s)};


},{}],6:[function(require,module,exports){
function RequestError(r,t){try{r=JSON.parse(r)}catch(e){}this.statusCode=t,this.body=r,Error.call(this,r.error)}module.exports=RequestError,RequestError.prototype=new Error;


},{}],7:[function(require,module,exports){
!function(e,r){"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?module.exports=r():e.returnExports=r()}(this,function(){function e(n,i){if("function"!=typeof i)throw new Error("Bad callback given: "+i);if(!n)throw new Error("No options given");var s=n.onResponse;if(n="string"==typeof n?{uri:n}:JSON.parse(JSON.stringify(n)),n.onResponse=s,n.verbose&&(e.log=o()),n.url&&(n.uri=n.url,delete n.url),!n.uri&&""!==n.uri)throw new Error("options.uri is a required argument");if("string"!=typeof n.uri)throw new Error("options.uri must be a string");for(var d=["proxy","_redirectsFollowed","maxRedirects","followRedirect"],u=0;u<d.length;u++)if(n[d[u]])throw new Error("options."+d[u]+" is not supported");if(n.callback=i,n.method=n.method||"GET",n.headers=n.headers||{},n.body=n.body||null,n.timeout=n.timeout||e.DEFAULT_TIMEOUT,n.headers.host)throw new Error("Options.headers.host is not supported");n.json&&(n.headers.accept=n.headers.accept||"application/json","GET"!==n.method&&(n.headers["content-type"]="application/json"),"boolean"!=typeof n.json?n.body=JSON.stringify(n.json):"string"!=typeof n.body&&(n.body=JSON.stringify(n.body)));var c=function(e){var r=[];for(var t in e)e.hasOwnProperty(t)&&r.push(encodeURIComponent(t)+"="+encodeURIComponent(e[t]));return r.join("&")};if(n.qs){var f="string"==typeof n.qs?n.qs:c(n.qs);n.uri=-1!==n.uri.indexOf("?")?n.uri+"&"+f:n.uri+"?"+f}var p=function(e){var r={};r.boundry="-------------------------------"+Math.floor(1e9*Math.random());var t=[];for(var o in e)e.hasOwnProperty(o)&&t.push("--"+r.boundry+'\nContent-Disposition: form-data; name="'+o+'"\n\n'+e[o]+"\n");return t.push("--"+r.boundry+"--"),r.body=t.join(""),r.length=r.body.length,r.type="multipart/form-data; boundary="+r.boundry,r};if(n.form){if("string"==typeof n.form)throw"form name unsupported";if("POST"===n.method){var l=(n.encoding||"application/x-www-form-urlencoded").toLowerCase();switch(n.headers["content-type"]=l,l){case"application/x-www-form-urlencoded":n.body=c(n.form).replace(/%20/g,"+");break;case"multipart/form-data":var h=p(n.form);n.body=h.body,n.headers["content-type"]=h.type;break;default:throw new Error("unsupported encoding:"+l)}}}return n.onResponse=n.onResponse||t,n.onResponse===!0&&(n.onResponse=i,n.callback=t),!n.headers.authorization&&n.auth&&(n.headers.authorization="Basic "+a(n.auth.username+":"+n.auth.password)),r(n)}function r(r){function t(){f=!0;var t=new Error("ETIMEDOUT");return t.code="ETIMEDOUT",t.duration=r.timeout,e.log.error("Timeout",{id:c._id,milliseconds:r.timeout}),r.callback(t,c)}function o(t){if(f)return e.log.debug("Ignoring timed out state change",{state:c.readyState,id:c.id});if(e.log.debug("State change",{state:c.readyState,id:c.id,timed_out:f}),c.readyState===s.OPENED){e.log.debug("Request started",{id:c.id});for(var o in r.headers)c.setRequestHeader(o,r.headers[o])}else c.readyState===s.HEADERS_RECEIVED?n():c.readyState===s.LOADING?(n(),a()):c.readyState===s.DONE&&(n(),a(),d())}function n(){if(!y.response){if(y.response=!0,e.log.debug("Got response",{id:c.id,status:c.status}),clearTimeout(c.timeoutTimer),c.statusCode=c.status,p&&0==c.statusCode){var t=new Error("CORS request rejected: "+r.uri);return t.cors="rejected",y.loading=!0,y.end=!0,r.callback(t,c)}r.onResponse(null,c)}}function a(){y.loading||(y.loading=!0,e.log.debug("Response body loading",{id:c.id}))}function d(){if(!y.end){if(y.end=!0,e.log.debug("Request done",{id:c.id}),c.body=c.responseText,r.json)try{c.body=JSON.parse(c.responseText)}catch(t){return r.callback(t,c)}r.callback(null,c,c.body)}}var c=new s,f=!1,p=i(r.uri),l="withCredentials"in c;if(u+=1,c.seq_id=u,c.id=u+": "+r.method+" "+r.uri,c._id=c.id,p&&!l){var h=new Error("Browser does not support cross-origin request: "+r.uri);return h.cors="unsupported",r.callback(h,c)}c.timeoutTimer=setTimeout(t,r.timeout);var y={response:!1,loading:!1,end:!1};return c.onreadystatechange=o,c.open(r.method,r.uri,!0),p&&(c.withCredentials=!!r.withCredentials),c.send(r.body),c}function t(){}function o(){var e,r,o={},i=["trace","debug","info","warn","error"];for(r=0;r<i.length;r++)e=i[r],o[e]=t,"undefined"!=typeof console&&console&&console[e]&&(o[e]=n(console,e));return o}function n(e,r){function t(t,o){return"object"==typeof o&&(t+=" "+JSON.stringify(o)),e[r].call(e,t)}return t}function i(e){var r,t=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/;try{r=location.href}catch(o){r=document.createElement("a"),r.href="",r=r.href}var n=t.exec(r.toLowerCase())||[],i=t.exec(e.toLowerCase()),a=!(!i||i[1]==n[1]&&i[2]==n[2]&&(i[3]||("http:"===i[1]?80:443))==(n[3]||("http:"===n[1]?80:443)));return a}function a(e){var r,t,o,n,i,a,s,d,u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c=0,f=0,p="",l=[];if(!e)return e;do r=e.charCodeAt(c++),t=e.charCodeAt(c++),o=e.charCodeAt(c++),d=r<<16|t<<8|o,n=d>>18&63,i=d>>12&63,a=d>>6&63,s=63&d,l[f++]=u.charAt(n)+u.charAt(i)+u.charAt(a)+u.charAt(s);while(c<e.length);switch(p=l.join(""),e.length%3){case 1:p=p.slice(0,-2)+"==";break;case 2:p=p.slice(0,-1)+"="}return p}var s=XMLHttpRequest;if(!s)throw new Error("missing XMLHttpRequest");e.log={trace:t,debug:t,info:t,warn:t,error:t};var d=18e4,u=0;e.withCredentials=!1,e.DEFAULT_TIMEOUT=d,e.defaults=function(r,t){var o=function(e){var t=function(t,o){t="string"==typeof t?{uri:t}:JSON.parse(JSON.stringify(t));for(var n in r)void 0===t[n]&&(t[n]=r[n]);return e(t,o)};return t},n=o(e);return n.get=o(e.get),n.post=o(e.post),n.put=o(e.put),n.head=o(e.head),n};var c=["get","put","post","head"];return c.forEach(function(r){var t=r.toUpperCase(),o=r.toLowerCase();e[o]=function(r){"string"==typeof r?r={method:t,uri:r}:(r=JSON.parse(JSON.stringify(r)),r.method=t);var o=[r].concat(Array.prototype.slice.apply(arguments,[1]));return e.apply(this,o)}}),e.couch=function(r,o){function n(e,r,t){if(e)return o(e,r,t);if((r.statusCode<200||r.statusCode>299)&&t.error){e=new Error("CouchDB error: "+(t.error.reason||t.error.error));for(var n in t)e[n]=t[n];return o(e,r,t)}return o(e,r,t)}"string"==typeof r&&(r={uri:r}),r.json=!0,r.body&&(r.json=r.body),delete r.body,o=o||t;var i=e(r,n);return i},e});


},{}],8:[function(require,module,exports){
function drainQueue(){if(!draining){draining=!0;for(var e,o=queue.length;o;){e=queue,queue=[];for(var r=-1;++r<o;)e[r]();o=queue.length}draining=!1}}function noop(){}var process=module.exports={},queue=[],draining=!1;process.nextTick=function(e){queue.push(e),draining||setTimeout(drainQueue,0)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.binding=function(e){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(e){throw new Error("process.chdir is not supported")},process.umask=function(){return 0};


},{}],9:[function(require,module,exports){
var baseAssign=require("lodash._baseassign"),createAssigner=require("lodash._createassigner"),assign=createAssigner(baseAssign);module.exports=assign;


},{"lodash._baseassign":10,"lodash._createassigner":16}],10:[function(require,module,exports){
function baseAssign(e,s,r){var a=keys(s);if(!r)return baseCopy(s,e,a);for(var n=-1,o=a.length;++n<o;){var i=a[n],u=e[i],y=r(u,s[i],i,e,s);(y===y?y===u:u!==u)&&("undefined"!=typeof u||i in e)||(e[i]=y)}return e}var baseCopy=require("lodash._basecopy"),keys=require("lodash.keys");module.exports=baseAssign;


},{"lodash._basecopy":11,"lodash.keys":12}],11:[function(require,module,exports){
function baseCopy(e,o,r){r||(r=o,o={});for(var a=-1,n=r.length;++a<n;){var t=r[a];o[t]=e[t]}return o}module.exports=baseCopy;


},{}],12:[function(require,module,exports){
function isIndex(r,t){return r=+r,t=null==t?MAX_SAFE_INTEGER:t,r>-1&&r%1==0&&t>r}function isLength(r){return"number"==typeof r&&r>-1&&r%1==0&&MAX_SAFE_INTEGER>=r}function shimKeys(r){for(var t=keysIn(r),e=t.length,n=e&&r.length,s=n&&isLength(n)&&(isArray(r)||support.nonEnumArgs&&isArguments(r)),o=-1,i=[];++o<e;){var u=t[o];(s&&isIndex(u,n)||hasOwnProperty.call(r,u))&&i.push(u)}return i}function isObject(r){var t=typeof r;return"function"==t||!!r&&"object"==t}function keysIn(r){if(null==r)return[];isObject(r)||(r=Object(r));var t=r.length;t=t&&isLength(t)&&(isArray(r)||support.nonEnumArgs&&isArguments(r))&&t||0;for(var e=r.constructor,n=-1,s="function"==typeof e&&e.prototype===r,o=Array(t),i=t>0;++n<t;)o[n]=n+"";for(var u in r)i&&isIndex(u,t)||"constructor"==u&&(s||!hasOwnProperty.call(r,u))||o.push(u);return o}var isArguments=require("lodash.isarguments"),isArray=require("lodash.isarray"),isNative=require("lodash.isnative"),objectProto=Object.prototype,hasOwnProperty=objectProto.hasOwnProperty,propertyIsEnumerable=objectProto.propertyIsEnumerable,nativeKeys=isNative(nativeKeys=Object.keys)&&nativeKeys,MAX_SAFE_INTEGER=Math.pow(2,53)-1,support={};!function(r){try{support.nonEnumArgs=!propertyIsEnumerable.call(arguments,1)}catch(t){support.nonEnumArgs=!0}}(0,0);var keys=nativeKeys?function(r){if(r)var t=r.constructor,e=r.length;return"function"==typeof t&&t.prototype===r||"function"!=typeof r&&e&&isLength(e)?shimKeys(r):isObject(r)?nativeKeys(r):[]}:shimKeys;module.exports=keys;


},{"lodash.isarguments":13,"lodash.isarray":14,"lodash.isnative":15}],13:[function(require,module,exports){
function isObjectLike(t){return!!t&&"object"==typeof t}function isLength(t){return"number"==typeof t&&t>-1&&t%1==0&&MAX_SAFE_INTEGER>=t}function isArguments(t){var e=isObjectLike(t)?t.length:void 0;return isLength(e)&&objToString.call(t)==argsTag}var argsTag="[object Arguments]",objectProto=Object.prototype,objToString=objectProto.toString,MAX_SAFE_INTEGER=Math.pow(2,53)-1;module.exports=isArguments;


},{}],14:[function(require,module,exports){
function baseToString(r){return"string"==typeof r?r:null==r?"":r+""}function isObjectLike(r){return!!r&&"object"==typeof r}function isLength(r){return"number"==typeof r&&r>-1&&r%1==0&&MAX_SAFE_INTEGER>=r}function isNative(r){return null==r?!1:objToString.call(r)==funcTag?reNative.test(fnToString.call(r)):isObjectLike(r)&&reHostCtor.test(r)}function escapeRegExp(r){return r=baseToString(r),r&&reHasRegExpChars.test(r)?r.replace(reRegExpChars,"\\$&"):r}var arrayTag="[object Array]",funcTag="[object Function]",reHostCtor=/^\[object .+?Constructor\]$/,reRegExpChars=/[.*+?^${}()|[\]\/\\]/g,reHasRegExpChars=RegExp(reRegExpChars.source),objectProto=Object.prototype,fnToString=Function.prototype.toString,objToString=objectProto.toString,reNative=RegExp("^"+escapeRegExp(objToString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),nativeIsArray=isNative(nativeIsArray=Array.isArray)&&nativeIsArray,MAX_SAFE_INTEGER=Math.pow(2,53)-1,isArray=nativeIsArray||function(r){return isObjectLike(r)&&isLength(r.length)&&objToString.call(r)==arrayTag};module.exports=isArray;


},{}],15:[function(require,module,exports){
function baseToString(t){return"string"==typeof t?t:null==t?"":t+""}function isObjectLike(t){return!!t&&"object"==typeof t}function isNative(t){return null==t?!1:objToString.call(t)==funcTag?reNative.test(fnToString.call(t)):isObjectLike(t)&&reHostCtor.test(t)}function escapeRegExp(t){return t=baseToString(t),t&&reHasRegExpChars.test(t)?t.replace(reRegExpChars,"\\$&"):t}var funcTag="[object Function]",reHostCtor=/^\[object .+?Constructor\]$/,reRegExpChars=/[.*+?^${}()|[\]\/\\]/g,reHasRegExpChars=RegExp(reRegExpChars.source),objectProto=Object.prototype,fnToString=Function.prototype.toString,objToString=objectProto.toString,reNative=RegExp("^"+escapeRegExp(objToString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");module.exports=isNative;


},{}],16:[function(require,module,exports){
function createAssigner(e){return function(){var r=arguments,a=r.length,l=r[0];if(2>a||null==l)return l;var n=r[a-2],t=r[a-1],i=r[3];a>3&&"function"==typeof n?(n=bindCallback(n,t,5),a-=2):(n=a>2&&"function"==typeof t?t:null,a-=n?1:0),i&&isIterateeCall(r[1],r[2],i)&&(n=3==a?null:n,a=2);for(var u=0;++u<a;){var c=r[u];c&&e(l,c,n)}return l}}var bindCallback=require("lodash._bindcallback"),isIterateeCall=require("lodash._isiterateecall");module.exports=createAssigner;


},{"lodash._bindcallback":17,"lodash._isiterateecall":18}],17:[function(require,module,exports){
function bindCallback(n,t,r){if("function"!=typeof n)return identity;if("undefined"==typeof t)return n;switch(r){case 1:return function(r){return n.call(t,r)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,c){return n.call(t,r,e,u,c)};case 5:return function(r,e,u,c,i){return n.call(t,r,e,u,c,i)}}return function(){return n.apply(t,arguments)}}function identity(n){return n}module.exports=bindCallback;


},{}],18:[function(require,module,exports){
function isIndex(e,t){return e=+e,t=null==t?MAX_SAFE_INTEGER:t,e>-1&&e%1==0&&t>e}function isIterateeCall(e,t,n){if(!isObject(n))return!1;var r=typeof t;if("number"==r)var i=n.length,u=isLength(i)&&isIndex(t,i);else u="string"==r&&t in n;if(u){var o=n[t];return e===e?e===o:o!==o}return!1}function isLength(e){return"number"==typeof e&&e>-1&&e%1==0&&MAX_SAFE_INTEGER>=e}function isObject(e){var t=typeof e;return"function"==t||!!e&&"object"==t}var MAX_SAFE_INTEGER=Math.pow(2,53)-1;module.exports=isIterateeCall;


},{}],19:[function(require,module,exports){
"use strict";module.exports=require("./lib/core.js"),require("./lib/done.js"),require("./lib/es6-extensions.js"),require("./lib/node-extensions.js");


},{"./lib/core.js":20,"./lib/done.js":21,"./lib/es6-extensions.js":22,"./lib/node-extensions.js":23}],20:[function(require,module,exports){
"use strict";function Promise(e){function n(e){return null===i?void c.push(e):void asap(function(){var n=i?e.onFulfilled:e.onRejected;if(null===n)return void(i?e.resolve:e.reject)(u);var t;try{t=n(u)}catch(o){return void e.reject(o)}e.resolve(t)})}function t(e){try{if(e===f)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var n=e.then;if("function"==typeof n)return void doResolve(n.bind(e),t,o)}i=!0,u=e,r()}catch(c){o(c)}}function o(e){i=!1,u=e,r()}function r(){for(var e=0,t=c.length;t>e;e++)n(c[e]);c=null}if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");var i=null,u=null,c=[],f=this;this.then=function(e,t){return new f.constructor(function(o,r){n(new Handler(e,t,o,r))})},doResolve(e,t,o)}function Handler(e,n,t,o){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.resolve=t,this.reject=o}function doResolve(e,n,t){var o=!1;try{e(function(e){o||(o=!0,n(e))},function(e){o||(o=!0,t(e))})}catch(r){if(o)return;o=!0,t(r)}}var asap=require("asap");module.exports=Promise;


},{"asap":24}],21:[function(require,module,exports){
"use strict";var Promise=require("./core.js"),asap=require("asap");module.exports=Promise,Promise.prototype.done=function(e,t){var r=arguments.length?this.then.apply(this,arguments):this;r.then(null,function(e){asap(function(){throw e})})};


},{"./core.js":20,"asap":24}],22:[function(require,module,exports){
"use strict";function ValuePromise(e){this.then=function(r){return"function"!=typeof r?this:new Promise(function(n,t){asap(function(){try{n(r(e))}catch(o){t(o)}})})}}var Promise=require("./core.js"),asap=require("asap");module.exports=Promise,ValuePromise.prototype=Promise.prototype;var TRUE=new ValuePromise(!0),FALSE=new ValuePromise(!1),NULL=new ValuePromise(null),UNDEFINED=new ValuePromise(void 0),ZERO=new ValuePromise(0),EMPTYSTRING=new ValuePromise("");Promise.resolve=function(e){if(e instanceof Promise)return e;if(null===e)return NULL;if(void 0===e)return UNDEFINED;if(e===!0)return TRUE;if(e===!1)return FALSE;if(0===e)return ZERO;if(""===e)return EMPTYSTRING;if("object"==typeof e||"function"==typeof e)try{var r=e.then;if("function"==typeof r)return new Promise(r.bind(e))}catch(n){return new Promise(function(e,r){r(n)})}return new ValuePromise(e)},Promise.all=function(e){var r=Array.prototype.slice.call(e);return new Promise(function(e,n){function t(i,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(e){t(i,e)},n)}r[i]=u,0===--o&&e(r)}catch(c){n(c)}}if(0===r.length)return e([]);for(var o=r.length,i=0;i<r.length;i++)t(i,r[i])})},Promise.reject=function(e){return new Promise(function(r,n){n(e)})},Promise.race=function(e){return new Promise(function(r,n){e.forEach(function(e){Promise.resolve(e).then(r,n)})})},Promise.prototype["catch"]=function(e){return this.then(null,e)};


},{"./core.js":20,"asap":24}],23:[function(require,module,exports){
"use strict";var Promise=require("./core.js"),asap=require("asap");module.exports=Promise,Promise.denodeify=function(n,t){return t=t||1/0,function(){var e=this,o=Array.prototype.slice.call(arguments);return new Promise(function(r,i){for(;o.length&&o.length>t;)o.pop();o.push(function(n,t){n?i(n):r(t)});var u=n.apply(e,o);!u||"object"!=typeof u&&"function"!=typeof u||"function"!=typeof u.then||r(u)})}},Promise.nodeify=function(n){return function(){var t=Array.prototype.slice.call(arguments),e="function"==typeof t[t.length-1]?t.pop():null,o=this;try{return n.apply(this,arguments).nodeify(e,o)}catch(r){if(null===e||"undefined"==typeof e)return new Promise(function(n,t){t(r)});asap(function(){e.call(o,r)})}}},Promise.prototype.nodeify=function(n,t){return"function"!=typeof n?this:void this.then(function(e){asap(function(){n.call(t,null,e)})},function(e){asap(function(){n.call(t,e)})})};


},{"./core.js":20,"asap":24}],24:[function(require,module,exports){
(function (process){
function flush(){for(;head.next;){head=head.next;var e=head.task;head.task=void 0;var s=head.domain;s&&(head.domain=void 0,s.enter());try{e()}catch(n){if(isNodeJS)throw s&&s.exit(),setTimeout(flush,0),s&&s.enter(),n;setTimeout(function(){throw n},0)}s&&s.exit()}flushing=!1}function asap(e){tail=tail.next={task:e,domain:isNodeJS&&process.domain,next:null},flushing||(flushing=!0,requestFlush())}var head={task:void 0,next:null},tail=head,flushing=!1,requestFlush=void 0,isNodeJS=!1;if("undefined"!=typeof process&&process.nextTick)isNodeJS=!0,requestFlush=function(){process.nextTick(flush)};else if("function"==typeof setImmediate)requestFlush="undefined"!=typeof window?setImmediate.bind(window,flush):function(){setImmediate(flush)};else if("undefined"!=typeof MessageChannel){var channel=new MessageChannel;channel.port1.onmessage=flush,requestFlush=function(){channel.port2.postMessage(0)}}else requestFlush=function(){setTimeout(flush,0)};module.exports=asap;


}).call(this,require('_process'))
},{"_process":8}]},{},[1])(1)
});