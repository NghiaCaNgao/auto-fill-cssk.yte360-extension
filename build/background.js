!function(){var t={7757:function(t,e,r){t.exports=r(9727)},9727:function(t){var e=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,o="function"===typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(C){u=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var o=e&&e.prototype instanceof y?e:y,a=Object.create(o.prototype),i=new O(n||[]);return a._invoke=function(t,e,r){var n=l;return function(o,a){if(n===p)throw new Error("Generator is already running");if(n===m){if("throw"===o)throw a;return A()}for(r.method=o,r.arg=a;;){var i=r.delegate;if(i){var c=E(i,r);if(c){if(c===d)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===l)throw n=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=p;var u=f(t,e,r);if("normal"===u.type){if(n=r.done?m:h,u.arg===d)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=m,r.method="throw",r.arg=u.arg)}}}(t,r,i),a}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(C){return{type:"throw",arg:C}}}t.wrap=s;var l="suspendedStart",h="suspendedYield",p="executing",m="completed",d={};function y(){}function v(){}function g(){}var w={};u(w,a,(function(){return this}));var x=Object.getPrototypeOf,b=x&&x(x(j([])));b&&b!==r&&n.call(b,a)&&(w=b);var k=g.prototype=y.prototype=Object.create(w);function L(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function _(t,e){function r(o,a,i,c){var u=f(t[o],t,a);if("throw"!==u.type){var s=u.arg,l=s.value;return l&&"object"===typeof l&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(l).then((function(t){s.value=t,i(s)}),(function(t){return r("throw",t,i,c)}))}c(u.arg)}var o;this._invoke=function(t,n){function a(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(a,a):a()}}function E(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,E(t,r),"throw"===r.method))return d;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var o=f(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,d;var a=o.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function N(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function j(t){if(t){var r=t[a];if(r)return r.call(t);if("function"===typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}return{next:A}}function A(){return{value:e,done:!0}}return v.prototype=g,u(k,"constructor",g),u(g,"constructor",v),v.displayName=u(g,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"===typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,u(t,c,"GeneratorFunction")),t.prototype=Object.create(k),t},t.awrap=function(t){return{__await:t}},L(_.prototype),u(_.prototype,i,(function(){return this})),t.AsyncIterator=_,t.async=function(e,r,n,o,a){void 0===a&&(a=Promise);var i=new _(s(e,r,n,o),a);return t.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},L(k),u(k,c,"Generator"),u(k,a,(function(){return this})),u(k,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=j,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(N),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,d):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),N(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;N(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:j(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},t}(t.exports);try{regeneratorRuntime=e}catch(r){"object"===typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e)}}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var a=e[n]={exports:{}};return t[n](a,a.exports,r),a.exports}r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,{a:e}),e},r.d=function(t,e){for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},function(){"use strict";function t(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(s){return void r(s)}c.done?e(u):Promise.resolve(u).then(n,o)}function e(e){return function(){var r=this,n=arguments;return new Promise((function(o,a){var i=e.apply(r,n);function c(e){t(i,o,a,c,u,"next",e)}function u(e){t(i,o,a,c,u,"throw",e)}c(void 0)}))}}var n=r(7757),o=r.n(n);function a(){return(a=e(o().mark((function t(e){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,r){e.length>0&&Array.isArray(e),chrome.storage.sync.get(e,(function(e){t(e)}))})));case 1:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function i(t){return c.apply(this,arguments)}function c(){return(c=e(o().mark((function t(e){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,r){chrome.storage.sync.set(e,(function(){t()}))})));case 1:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function u(){return(u=e(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,e){chrome.storage.sync.clear((function(){t()}))})));case 1:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function s(){return(s=e(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i({username:"",auto_check:!1,token:"",user:{name:""},medical_station:{name:"",address:"",wardsID:"",stationID:""}});case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var f={getDataFromChromeStorage:function(t){return a.apply(this,arguments)},setDataToChromeStorage:i,clearChromeStorage:function(){return u.apply(this,arguments)},createDefaultData:function(){return s.apply(this,arguments)}},l=f;function h(){return p.apply(this,arguments)}function p(){return(p=e(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,e){chrome.notifications.getAll((function(e){t(Object.keys(e))}))})));case 1:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function m(t){return d.apply(this,arguments)}function d(){return d=e(o().mark((function t(r){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise(function(){var t=e(o().mark((function t(n,a){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!r){t.next=22;break}if("string"!=typeof r){t.next=5;break}chrome.notifications.clear(r,(function(t){t?n("Cleared "+r):a("Can't not clear notification "+r)})),t.next=20;break;case 5:if(!Array.isArray(r)){t.next=19;break}return t.prev=6,t.t0=n,t.next=10,Promise.all(r.map((function(t){return m(t)})));case 10:t.t1=t.sent,(0,t.t0)(t.t1),t.next=17;break;case 14:t.prev=14,t.t2=t.catch(6),a(t.t2);case 17:t.next=20;break;case 19:a("Notification_id must be string or array");case 20:t.next=23;break;case 22:h().then(function(){var t=e(o().mark((function t(e){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.t0=n,t.next=4,m(e);case 4:t.t1=t.sent,(0,t.t0)(t.t1),t.next=11;break;case 8:t.prev=8,t.t2=t.catch(0),a(t.t2);case 11:case"end":return t.stop()}}),t,null,[[0,8]])})));return function(e){return t.apply(this,arguments)}}());case 23:case"end":return t.stop()}}),t,null,[[6,14]])})));return function(e,r){return t.apply(this,arguments)}}()));case 1:case"end":return t.stop()}}),t)}))),d.apply(this,arguments)}function y(){return(y=e(o().mark((function t(e){var r,n,a,i,c,u;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.title,n=void 0===r?"Auto Fill":r,a=e.message,i=void 0===a?"Happy day!":a,c=e.id,u=e.buttons,t.abrupt("return",new Promise((function(t,e){chrome.notifications.create(c,{type:"basic",iconUrl:"assets/logo/logo_48.png",title:n,message:i,buttons:u},(function(e){t(e)}))})));case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var v={createBasicNotification:function(t){return y.apply(this,arguments)},clearNotifications:m,getAllNotificationIDs:h},g=v,w=chrome.runtime.getURL("index.html");function x(t){chrome.tabs.create({active:!0,url:t})}function b(t,e){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];chrome.contextMenus.create({contexts:["all"],type:r?"checkbox":"normal",documentUrlPatterns:["https://chamsocsuckhoe.yte360.com/"],checked:r,id:t,title:e})}function k(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];console.log("autoCheck",t),chrome.contextMenus.update("auto_check",{checked:t}),chrome.storage.sync.set({auto_check:t})}chrome.runtime.onInstalled.addListener(function(){var t=e(o().mark((function t(e){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.t0=console,t.next=4,g.clearNotifications();case 4:t.t1=t.sent,t.t0.log.call(t.t0,t.t1),t.next=11;break;case 8:t.prev=8,t.t2=t.catch(0),console.log(t.t2);case 11:if(e.reason!==chrome.runtime.OnInstalledReason.INSTALL){t.next=18;break}return t.next=14,l.createDefaultData();case 14:return t.next=16,g.createBasicNotification({title:"Welcome to Auto Fill",message:"Boost your work right now!",id:"af_installed"});case 16:t.next=21;break;case 18:if(e.reason!==chrome.runtime.OnInstalledReason.UPDATE){t.next=21;break}return t.next=21,g.createBasicNotification({title:"Autofill",message:"Update successfully",id:"af_updated",buttons:[{title:"View changelog"}]});case 21:case"end":return t.stop()}}),t,null,[[0,8]])})));return function(e){return t.apply(this,arguments)}}()),chrome.notifications.onButtonClicked.addListener((function(t,e){"af_updated"===t&&0===e&&x("https://github.com/NghiaCaNgao/auto-fill-cssk.yte360-extension")})),chrome.action.onClicked.addListener((function(){x(w)})),chrome.commands.onCommand.addListener((function(t){"open_app"===t&&chrome.tabs.create({active:!0,url:w})})),chrome.contextMenus.onClicked.addListener(function(){var t=e(o().mark((function t(e,r){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:t.t0=e.menuItemId,t.next="auto_check"===t.t0?3:"save_token"===t.t0?6:8;break;case 3:return console.log(e.checked),k(e.checked),t.abrupt("break",8);case 6:return chrome.tabs.query({active:!0,currentWindow:!0},(function(t){console.log(t),chrome.tabs.sendMessage(t[0].id,{command:"get_token"},(function(t){console.log(t),t.success?l.setDataToChromeStorage({token:t.token}):console.log(t.message)}))})),t.abrupt("break",8);case 8:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()),chrome.contextMenus.removeAll(),b("auto_check","T\u1ef1 \u0111\u1ed9ng ki\u1ec3m tra",!0),b("save_token","L\u01b0u token"),l.getDataFromChromeStorage(["auto_check"]).then((function(t){k(t.auto_check||!1)}))}()}();
//# sourceMappingURL=background.js.map