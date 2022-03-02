"use strict";function n(n,t){return function(n){if(Array.isArray(n))return n}(n)||function(n,t){var o=null==n?null:"undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(null==o)return;var e,a,i=[],c=!0,r=!1;try{for(o=o.call(n);!(c=(e=o.next()).done)&&(i.push(e.value),!t||i.length!==t);c=!0);}catch(n){r=!0,a=n}finally{try{c||null==o.return||o.return()}finally{if(r)throw a}}return i}(n,t)||o(n,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function t(n){return function(n){if(Array.isArray(n))return e(n)}(n)||function(n){if("undefined"!=typeof Symbol&&null!=n[Symbol.iterator]||null!=n["@@iterator"])return Array.from(n)}(n)||o(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(n,t){if(n){if("string"==typeof n)return e(n,t);var o=Object.prototype.toString.call(n).slice(8,-1);return"Object"===o&&n.constructor&&(o=n.constructor.name),"Map"===o||"Set"===o?Array.from(n):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?e(n,t):void 0}}function e(n,t){(null==t||t>n.length)&&(t=n.length);for(var o=0,e=new Array(t);o<t;o++)e[o]=n[o];return e}var a=require("fs"),i=require("commander"),c=require("dayjs"),r=require("shelljs").exec,l=require("./utils"),s=l.getPackageInfo,d=l.getItemPackageInfo,u=l.getItemConf,m=l.getItemData,f=l.saveItemConf,p=l.saveItemData,g=l.uuid_generate,v=l.clipWriteS,h=l.activeItem,y=l.systemLogo,T=l.systemPkg,C=l.itPath,b=l.itSystem,I=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"item";if(i.commands.map((function(n){return n._name})).includes(n))return console.log("".concat(n,": 该别名为项目保留关键字！请重试")),"tag"===t?[]:null;var o=m();if("tag"===t){var e=o.filter((function(t){var o;return null==t||null===(o=t.tag)||void 0===o?void 0:o.split(",").includes(n)}));return e.length||"tag"!==t||console.log('it: "not found the tag"'),e}var a=o.find((function(t){return t.alias===n}));return a||"item"!==t||console.log('it: "not found the item"'),a&&h(a),a};i.command("add <alias>").description("【it add <alias> [-d]】添加项目").option("-d, --desc <desc>","添加项目描述,默认为package-description").option("-f, --file <file>","添加当前项目文件下的具体文件").action((function(n,t){var o=m();if(I(n,"add"))return console.log("已存在该项目:".concat(n,"！请重试"));var e=process.cwd();if(t.file&&(e="/"===e?"".concat(e).concat(t.file):"".concat(e,"/").concat(t.file),!a.existsSync("".concat(e))))return console.log("".concat(t.file,"文件未找到"));if(e.includes(" "))return console.log("".concat(n,": ").concat(e,"\n项目路径中含有非法特殊字符[空格]！请重试"));var i=d()||{name:"item-".concat(n),description:"无"},r=i.name,l=i.description,s={id:g(),name:r,alias:n,description:t.desc||l,path:e,createTime:c().format("YYYY-MM-DD HH:mm:ss")};o.unshift(s),p(o)})),i.command("del <alias>").description("【it del <alias>】删除项目").action((function(n){var t=m();I(n)&&p(t.filter((function(t){return t.alias!==n})))})),i.command("set <alias>").description("【it set <alias> [-a,-n]】更新项目").option("-n, --name <name>","更新项目名称").option("-a, --alias <alias>","更新项目别称").option("-d, --description <description>","更新项目描述").option("-t, --tag <tag>","更新项目标签").action((function(n,o){var e=m();I(n,"set")&&p(e.map((function(e){if(e.alias===n){e.active=(e.active||0)+1,e.name=o.name?o.name:e.name,e.alias=o.alias?o.alias:e.alias,e.description=o.description?o.description:e.description;var a=(e.tag||"").split(","),i=(o.tag||"").split(",").filter((function(n){return Boolean(n)&&" "!==n})).map((function(n){return n.trim()})),r=function(n){return n.lastIndexOf("-")===n.length-1},l=null==i?void 0:i.filter((function(n){return r(n)})).map((function(n){return n.substring(0,n.length-1)})),s=null==i?void 0:i.filter((function(n){return!r(n)})),d=a.filter((function(n){return!l.includes(n)}));e.tag=t(new Set([].concat(t(d),t(s)))).join(","),e.updateTime=c().format("YYYY-MM-DD HH:mm:ss"),console.log("changed-itemName: ".concat(e.name)),console.log("changed-itemAlias: ".concat(e.alias)),console.log("changed-itemDesc: ".concat(e.description)),console.log("changed-itemTag: ".concat(e.tag))}return e})))})),i.command("view <alias>").alias("v").description("【it view <alias>】查看项目详情").action((function(n){var t=I(n);t&&(console.log("".concat(t.alias," of info:")),console.log(t))})),i.command("list").alias("l").description("【it list】查看项目列表").option("-s, --size <size>","展示项目数量",6).option("-a, --all [all]","展示所有项目",!1).action((function(n){var t=m();t.sort((function(n,t){return(t.active||0)-(n.active||0)})).slice(0,n.all?t.length:n.size).map((function(n,t){var o=t>=9?t+1:"0".concat(t+1);return"".concat(o," ").concat(n.alias,"[").concat(n.active||0,"]: ").concat(n.path," 【").concat(n.description,"】")})).forEach((function(n){console.log(n)})),console.log("* * ".repeat(5)),console.log("当前项目总数：".concat(t.length,"\n查看所有项目：-a \n指定展示数量：-s n"))})),i.command("edit [name]").alias("e").description("【it edit [data|conf]】查看并编辑数据文件").action((function(n){var t=u().editToolCmd,o={data:C.ITEM_DATA_PATH,conf:C.ITEM_CONF_PATH};o[n]?r("".concat(t," ").concat(o[n]),{silent:!0}):console.log("当前支持数据查看项: data 或 conf")})),i.command("conf").alias("c").description("【it conf】系统设置").option("-e, --editToolCmd <editToolCmd>","编辑工具命令").option("-o, --openToolCmd <openToolCmd>","文件管理器工具命令").action((function(n){var t=u();n.editToolCmd&&(t.editToolCmd=n.editToolCmd),n.openToolCmd&&(t.openToolCmd=n.openToolCmd),f(t),console.log(t)})),i.command("open <alias>").alias("o").description("【it open <alias>】访达系统目录").action((function(n){var t=u().openToolCmd,o=I(n);o&&r("".concat(t," ").concat(o.path))})),i.command("tag <name>").description("【it tag <name>】标签打开相关项目").action((function(n){var t=I(n,"tag");if(t.length>0){var o=u().editToolCmd;t.forEach((function(n){r("".concat(o," ").concat(n.path),{silent:!0})}))}})),i.command("dev [param]").description("【it dev [param]】开发时自测").option("-o, --option","开发时自测参数").action((function(n,t){console.log("first"),console.log(n,t)})),i.arguments("[args...]").option("-c, --copy [copy]","是否复制",!1).action((function(t,o){if(0===t.length)return console.log(y(b.LOGO)),void console.log(T(s()));var e=n(t,1)[0],a=I(e);if(a){var i=u().editToolCmd;o.copy?v(a.path):r("".concat(i," ").concat(a.path),{silent:!0})}})),i.parse(process.argv);