## install

npm i cli-item

> npm package: https://www.npmjs.com/package/cli-item

## description

cli: 本地项目(文件)管理工具

## play-time

```
安装：
    >npm i cli-item

测试：
    >it
or  >it -h
添加项目:
    >cd your-folder && it add <alisa>
    >it your-alisa(defaule: code open your-alisa-path)
查看项目:
    >it view your-alisa
编辑项目:
    >it set your-alisa [-n,-a,-d,-t,-h]
or  >it edit data(defaule: code open your-all-item-data)
删除项目:
    >it del your-alisa

默认说明：
1、打开项目[it alisa]或编辑所有项目[it edit data]时，默认使用vscode编辑器,也可设置idea或其他编辑器：it conf -e [idea|webstore|other-edit-cmd]
2、系统文件管理器打开项目[it open alisa]时，默认执行[open alisa-path]命令,如果是Windows或想使用其他方式打开项目可设置：it conf -o [start|other-open-way]

```

## publish-time

cli-item:【https://registry.npmjs.org】
