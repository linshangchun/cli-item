const path = require("path");
const fs = require("fs");
const os = require("os");
const shareUtils = require("../share/utils");

const STORE_ROOT_DIR = "@lshch-cli/item";
const STORE_DATA_FILENAME = "item.json";
const STORE_CONF_FILENAME = "item.yml";
const ITEM_PACKAGE_FILENAME = "package.json";

// http://patorjk.com/software/taag/#p=display&h=0&f=Banner3-D&t=item
const LOGO = `/*
        
:'####:'########:'********:'**::::'**::
:. ##::... ##..:: **.....:: ***::'***::
:: ##::::: ##:::: **::::::: ****'****::
:: ##::::: ##:::: ******::: ** *** **::
:: ##::::: ##:::: **...:::: **. *: **::
:: ##::::: ##:::: **::::::: **:.:: **::
:'####:::: ##:::: ********: **:::: **::
:....:::::..:::::........::..:::::..:::
*/`;

// 项目数据文件路径
const ITEM_DATA_PATH = shareUtils.getRootStoreFileFullPath(
  STORE_ROOT_DIR,
  STORE_DATA_FILENAME
);
// 项目配置文件路径
const ITEM_CONF_PATH = shareUtils.getRootStoreFileFullPath(
  STORE_ROOT_DIR,
  STORE_CONF_FILENAME
);
// 命令执行路径下的项目配置文件路径
const ITEM_PACKAGE_PATH = path.join(process.cwd(), ITEM_PACKAGE_FILENAME);
// 配置文件路径
const PACKAGE_PATH = path.join(__dirname, "../..", ITEM_PACKAGE_FILENAME);

const handleFlieReadError = (error) => {
  if (error.code === "ENOENT") {
    // 无项目数据文件时
    if (error.path.indexOf(STORE_DATA_FILENAME) > -1) {
      const initJson = [];
      shareUtils.fileWriteS(error.path, initJson);
      return initJson;
    }
    // 无系统配置文件时
    if (error.path.indexOf(STORE_CONF_FILENAME) > -1) {
      const initYml = {
        developerName: os.userInfo().username || "item",
        editToolCmd: "code",
        openToolCmd: "open",
      };
      shareUtils.fileWriteS(error.path, initYml);
      return initYml;
    }
  }
  return null;
};
const fileReadS = (path) =>
  shareUtils.fileReadS(path, { onError: handleFlieReadError });
// 所有项目-配置信息
const getItemConf = () => {
  return fileReadS(ITEM_CONF_PATH);
};
// 保存项目-配置信息
const saveItemConf = (data) => {
  return shareUtils.fileWriteS(ITEM_CONF_PATH, data);
};
// 所有项目信息
const getItemData = () => {
  return fileReadS(ITEM_DATA_PATH);
};
// 保存项目信息
const saveItemData = (data) => {
  return shareUtils.fileWriteS(ITEM_DATA_PATH, data);
};

// 获取项目package配置信息，非前端项目可能会没有信息
const getItemPackageInfo = () => {
  if (fs.existsSync(ITEM_PACKAGE_PATH)) {
    return fileReadS(ITEM_PACKAGE_PATH);
  }
  return null;
};
// 获取package配置信息
const getPackageInfo = () => {
  if (fs.existsSync(PACKAGE_PATH)) {
    return fileReadS(PACKAGE_PATH);
  }
  return null;
};
// 激活项目活跃度
const activeItem = ({ alias }) => {
  const allData = getItemData();
  saveItemData(
    allData.map((item) => {
      if (item.alias === alias) {
        item.active = (item.active || 0) + 1;
      }
      return item;
    })
  );
};

module.exports = {
  ...shareUtils,
  getItemConf,
  saveItemConf,
  getItemData,
  saveItemData,
  getItemPackageInfo,
  getPackageInfo,
  activeItem,
  itPath: {
    ITEM_DATA_PATH,
    ITEM_CONF_PATH,
  },
  itSystem: {
    LOGO,
  },
};
