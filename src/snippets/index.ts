import type { ExtensionContext } from 'vscode'
import { workspace } from 'vscode'
import { extensionConfig } from '../config/index'
import config from './config'
import { detectVueVersionMismatch, initializeStatusBar, updateStatusBar, getVueVersion, registerSnippets } from './utils'
const { vueSelectionConfigName } = config
const { extensionId } = extensionConfig
export default async function initSnippets(context: ExtensionContext) {
  initializeStatusBar() // 初始化状态栏
  detectVueVersionMismatch() // 检测用户的vue版本是否和package.json中的vue版本一致,如果不一致则提示用户修改vue版本
  let vueVersion = await getVueVersion(false)
  /** 注册代码片段 */
  let disposables = registerSnippets(vueVersion)
  context.subscriptions.push(...disposables)
  // 监听用户配置变更
  workspace.onDidChangeConfiguration(async e => {
    if (!e.affectsConfiguration(`${extensionId}.${vueSelectionConfigName}`)) return
    vueVersion = await getVueVersion()
    disposables.forEach(disposable => disposable.dispose()) // 清理旧的注册
    disposables = registerSnippets(vueVersion)
    updateStatusBar() // 更新状态栏
    context.subscriptions.push(...disposables)
  })
}
