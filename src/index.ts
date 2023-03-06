import path  from 'path'
import fs  from 'fs'
import { program } from 'commander'
import { josnReadSync, printPKG, execCmd, log } from '@lshch/utils-node'
import { actions, itemConfigPath, itemDataPath, getItemConfig } from '@lshch/utils-item';

const packageInfo = () => {
  const pkgPath = path.resolve(__dirname, '..', 'package.json');
  return josnReadSync(pkgPath);
};

const checkAlias = (alias: string): Promise<boolean> => {
  return new Promise(resolve=> {
    if (program.commands.map((item) => item.name()).includes(alias)) {
      log.info(`${alias}：当前名称保护不可用，请使用用其他名称`)
      resolve(false);
    } else {
      resolve(true);
    }
  })
}

program
  .command('set <alias>')
  .description('添加或修改文件项目')
  .option(`-d, --description <description>`, '软链接描述')
  .option('-f, --file <file>', '指定当前项目文件夹下的具体文件或文件夹作为项目path')
  .option(`-y, --yes [yes]`, `跳过提示`)
  .action(async (alias, opts) => {
    const res = await checkAlias(alias);
    if(!res) return;
    actions.default(alias, opts);
  });

program
  .command('list')
  .description('查看文件项目列表')
  .option(`-a, --all [all]`, `查看所有文件项目`, false)
  .option(`-n, --number <number>`, `查看指定数量文件项目`, '5')
  .action((opts) => {
    actions.default('list', opts);
  });

  program
  .command('edit <alias>')
  .description('编辑文件项目配置|数据')
  .option(`-t, --tool <tool>`, '编辑工具')
  .action(async (alias, opts) => {
    const file_paths = {
      itemrc: fs.existsSync(itemConfigPath) && itemConfigPath,
      item: fs.existsSync(itemDataPath) && itemDataPath,
    };
    if (file_paths[alias]) {
      const { edit_tool } = getItemConfig();
      await execCmd(`${opts.tool || edit_tool} ${file_paths[alias]}`, true);
      return;
    }
    log.info(
      `当前支持以下文件编辑：${Object.keys(file_paths)
        .filter((i) => file_paths[i])
        .join('|')}`
    );
  },);

program
  .command('view <alias>')
  .description('查看文件项目')
  .action((alias) => {
    actions.default(alias, {view: true});
  });

program
  .command('rm <alias>')
  .description('移除文件项目')
  .action((alias) => {
    actions.default(alias, {remove: true});
  });

// 子命令兜底处理
program.arguments(`[args...]`)
  .description('cli-item：本地文件项目管理工具')
  .option(`-c, --copy [copy]`, `复制文件项目path`, false)
  .action((args, opts)=>{
    if (args.length === 0) {
      // 显示版本信息
      const pkg = packageInfo();
      printPKG(pkg);
      return;
    }
    if (args.length === 1) {
      // 打开文件项目
      actions.default(args[0], opts);
      return;
    }
    console.log(args, opts);
  });

program.parse(process.argv);