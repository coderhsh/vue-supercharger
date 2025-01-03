import { initUserConfig } from './config/userConfig'
import initCommand from './command'
// import initHoverProvider from './hoverProvider'
import initSnippets from './snippets'
import initWordCompletion from './wordCompletion'
import * as vscode from 'vscode'
export function activate(this: any, context: vscode.ExtensionContext) {
  // 获取当前工作区的根目录（通常是项目根目录）
  const workspaceFolders = vscode.workspace.workspaceFolders
  // 如果没有工作区根目录，直接返回
  if (!workspaceFolders || workspaceFolders.length === 0) return
  ;(async () => {
    initUserConfig(context) // 初始化用户配置
    initCommand.call(this, vscode, context) // 初始化所有命令
    // initHoverProvider(context) // 初始化所有悬浮提示
    initSnippets(context) // 初始化代码片段
    initWordCompletion(context) // 初始化单词补全
  })()
}
export function deactivate() {}
