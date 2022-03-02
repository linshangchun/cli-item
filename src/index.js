const fs = require("fs");
const cmd = require("commander");
const dayjs = require("dayjs");
const { exec } = require("shelljs");
const {
  getPackageInfo,
  getItemPackageInfo,
  getItemConf,
  getItemData,
  saveItemConf,
  saveItemData,
  uuid_generate,
  clipWriteS,
  activeItem,
  systemLogo,
  systemPkg,
  itPath,
  itSystem,
} = require("./utils");

// 查找指定项目
const getCurItem = (alias, type = "item") => {
  if (cmd.commands.map((item) => item._name).includes(alias)) {
    console.log(`${alias}: 该别名为项目保留关键字！请重试`);
    return type === "tag" ? [] : null;
  }
  const allData = getItemData();
  if (type === "tag") {
    const curItemList = allData.filter((i) =>
      i?.tag?.split(",").includes(alias)
    );
    if (!curItemList.length && type === "tag")
      console.log(`it: "not found the tag"`);
    return curItemList;
  }
  const curItem = allData.find((i) => i.alias === alias);
  if (!curItem && type === "item") console.log(`it: "not found the item"`);
  if (curItem) activeItem(curItem); // 获取成功即活跃一次项目
  return curItem;
};

cmd
  .command(`add <alias>`)
  .description(`【it add <alias> [-d]】添加项目`)
  .option("-d, --desc <desc>", "添加项目描述,默认为package-description")
  .option("-f, --file <file>", "添加当前项目文件下的具体文件")
  .action((alias, opts) => {
    const allData = getItemData();
    const curItem = getCurItem(alias, "add");
    if (curItem) return console.log(`已存在该项目:${alias}！请重试`);
    let itemCwd = process.cwd();
    if (opts.file) {
      itemCwd =
        itemCwd === "/" ? `${itemCwd}${opts.file}` : `${itemCwd}/${opts.file}`;
      if (!fs.existsSync(`${itemCwd}`))
        return console.log(`${opts.file}文件未找到`);
    }
    if (itemCwd.includes(` `))
      return console.log(
        `${alias}: ${itemCwd}\n项目路径中含有非法特殊字符[空格]！请重试`
      );
    const { name, description } = getItemPackageInfo() || {
      name: `item-${alias}`,
      description: "无",
    };
    const saveData = {
      id: uuid_generate(),
      name,
      alias,
      description: opts.desc || description,
      path: itemCwd,
      createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    allData.unshift(saveData);
    saveItemData(allData);
  });

cmd
  .command(`del <alias>`)
  .description(`【it del <alias>】删除项目`)
  .action((alias) => {
    const allData = getItemData();
    const delItem = getCurItem(alias);
    if (delItem) {
      saveItemData(allData.filter((i) => i.alias !== alias));
    }
  });

cmd
  .command(`set <alias>`)
  .description(`【it set <alias> [-a,-n]】更新项目`)
  .option(`-n, --name <name>`, `更新项目名称`)
  .option(`-a, --alias <alias>`, `更新项目别称`)
  .option(`-d, --description <description>`, `更新项目描述`)
  .option(`-t, --tag <tag>`, `更新项目标签`)
  .action((alias, opts) => {
    const allData = getItemData();
    const curItem = getCurItem(alias, "set");
    if (curItem) {
      saveItemData(
        allData.map((item) => {
          if (item.alias === alias) {
            item.active = (item.active || 0) + 1;
            item.name = opts.name ? opts.name : item.name;
            item.alias = opts.alias ? opts.alias : item.alias;
            item.description = opts.description
              ? opts.description
              : item.description;
            const oldTags = (item.tag || "").split(",");
            const setTags = (opts.tag || "")
              .split(",")
              .filter((i) => Boolean(i) && i !== " ")
              .map((i) => i.trim());
            const isOut = (i) => i.lastIndexOf("-") === i.length - 1;
            const outTags = setTags
              ?.filter((i) => isOut(i))
              .map((i) => i.substring(0, i.length - 1)); // 取出要删除的标签
            const addTags = setTags?.filter((i) => !isOut(i)); // 真正添加的标签
            const newOldTags = oldTags.filter((i) => !outTags.includes(i)); // 去除原数据中要删除的标签
            item.tag = [...new Set([...newOldTags, ...addTags])].join(",");
            item.updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
            console.log(`changed-itemName: ${item.name}`);
            console.log(`changed-itemAlias: ${item.alias}`);
            console.log(`changed-itemDesc: ${item.description}`);
            console.log(`changed-itemTag: ${item.tag}`);
          }
          return item;
        })
      );
      return;
    }
  });
cmd
  .command("view <alias>")
  .description("【it view <alias>】查看项目详情")
  .action((alias) => {
    const viewItem = getCurItem(alias);
    if (viewItem) {
      console.log(`${viewItem.alias} of info:`);
      console.log(viewItem);
    }
  });

cmd
  .command(`list`)
  .alias("ls")
  .description(`【it list】查看项目列表`)
  .option(`-s, --size <size>`, `展示项目数量`, 6)
  .option(`-a, --all [all]`, `展示所有项目`, false)
  .action((opts) => {
    const allData = getItemData();
    allData
      .sort((a, b) => {
        return (b.active || 0) - (a.active || 0);
      })
      .slice(0, opts.all ? allData.length : opts.size)
      .map((item, index) => {
        const indexStr = index >= 9 ? index + 1 : `0${index + 1}`;
        return `${indexStr} ${item.alias}[${item.active || 0}]: ${
          item.path
        } 【${item.description}】`;
      })
      .forEach((item) => {
        console.log(item);
      });
    console.log("* * ".repeat(5));
    console.log(
      `当前项目总数：${allData.length}\n查看所有项目：-a \n指定展示数量：-s n`
    );
  });

cmd
  .command(`edit [name]`)
  .description(`【it edit [data|conf]】查看并编辑数据文件`)
  .action((name) => {
    const { editToolCmd } = getItemConf();
    const namePathList = {
      data: itPath.ITEM_DATA_PATH,
      conf: itPath.ITEM_CONF_PATH,
    };
    if (namePathList[name]) {
      exec(`${editToolCmd} ${namePathList[name]}`, { silent: true });
      return;
    }
    console.log(`当前支持数据查看项: data 或 conf`);
  });

cmd
  .command(`conf`)
  .description(`【it conf】系统设置`)
  .option(`-e, --editToolCmd <editToolCmd>`, `编辑工具命令`)
  .option(`-o, --openToolCmd <openToolCmd>`, `文件管理器工具命令`)
  .action((opts) => {
    const itemInfo = getItemConf();
    if (opts.editToolCmd) {
      itemInfo.editToolCmd = opts.editToolCmd;
    }
    if (opts.openToolCmd) {
      itemInfo.openToolCmd = opts.openToolCmd;
    }
    saveItemConf(itemInfo);
    console.log(itemInfo);
  });

cmd
  .command("open <alias>")
  .description("【it open <alias>】访达系统目录")
  .action((alias) => {
    const { openToolCmd } = getItemConf();
    const curItem = getCurItem(alias);
    if (curItem) {
      exec(`${openToolCmd} ${curItem.path}`);
    }
  });

cmd
  .command("tag <name>")
  .description("【it tag <name>】标签打开相关项目")
  .action((name) => {
    const curItemList = getCurItem(name, "tag");
    if (curItemList.length > 0) {
      const { editToolCmd } = getItemConf();
      curItemList.forEach((item) => {
        exec(`${editToolCmd} ${item.path}`, {
          silent: true,
        });
      });
    }
  });

cmd
  .command("dev [param]")
  .description("【it dev [param]】开发时自测")
  .option(`-o, --option`, "开发时自测参数")
  .action((param, opts) => {
    console.log("first");
    console.log(param, opts);
  });

// 子命令兜底处理
cmd
  .arguments(`[args...]`)
  .option(`-c, --copy [copy]`, "是否复制", false)
  .action((args, opts) => {
    if (args.length === 0) {
      // 显示cli信息
      console.log(systemLogo(itSystem.LOGO));
      console.log(systemPkg(getPackageInfo()));
      return;
    }
    const [alias] = args;
    const curItem = getCurItem(alias);
    if (curItem) {
      const { editToolCmd } = getItemConf();
      opts.copy
        ? clipWriteS(curItem.path)
        : exec(`${editToolCmd} ${curItem.path}`, {
            silent: true,
          });
    }
  });

cmd.parse(process.argv);
