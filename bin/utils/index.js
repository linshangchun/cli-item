"use strict";function e(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function t(t){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?e(Object(i),!0).forEach((function(e){r(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):e(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function r(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var n=require("path"),i=require("fs"),o=require("os"),a=require("../share/utils"),c=a.getRootStoreFileFullPath(".cli-item","item.json"),u=a.getRootStoreFileFullPath(".cli-item","item.yml"),f=n.join(process.cwd(),"package.json"),l=n.join(__dirname,"../..","package.json"),s=function(e){if("ENOENT"===e.code){if(e.path.indexOf("item.json")>-1){var t=[];return a.fileWriteS(e.path,t),t}if(e.path.indexOf("item.yml")>-1){var r={developerName:o.userInfo().username||"item",editToolCmd:"code",openToolCmd:"open"};return a.fileWriteS(e.path,r),r}}return null},p=function(e){return a.fileReadS(e,{onError:s})},m=function(){return p(c)},O=function(e){return a.fileWriteS(c,e)};module.exports=t(t({},a),{},{getItemConf:function(){return p(u)},saveItemConf:function(e){return a.fileWriteS(u,e)},getItemData:m,saveItemData:O,getItemPackageInfo:function(){return i.existsSync(f)?p(f):null},getPackageInfo:function(){return i.existsSync(l)?p(l):null},activeItem:function(e){var t=e.alias,r=m();O(r.map((function(e){return e.alias===t&&(e.active=(e.active||0)+1),e})))},itPath:{ITEM_DATA_PATH:c,ITEM_CONF_PATH:u},itSystem:{LOGO:"/*\n        \n:'####:'########:'********:'**::::'**::\n:. ##::... ##..:: **.....:: ***::'***::\n:: ##::::: ##:::: **::::::: ****'****::\n:: ##::::: ##:::: ******::: ** *** **::\n:: ##::::: ##:::: **...:::: **. *: **::\n:: ##::::: ##:::: **::::::: **:.:: **::\n:'####:::: ##:::: ********: **:::: **::\n:....:::::..:::::........::..:::::..:::\n*/"}});
