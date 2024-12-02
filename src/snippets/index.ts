import type { ExtensionContext, Disposable } from 'vscode'
import { workspace } from 'vscode'
import { extensionConfig } from '../config/index'
import config from './config'
import { detectVueVersionMismatch, initializeStatusBar, updateStatusBar, getVueVersion, registerSnippets } from './method'
import type { VueSupportType } from './types'
const { vueSelectionConfigName } = config
const { extensionId } = extensionConfig
let disposables: Disposable[] = []
let extensionContext: ExtensionContext // 上下文
let currentVueVersion: VueSupportType | undefined // 当前vue版本
export default async function initSnippets(context: ExtensionContext) {
  extensionContext = context
  currentVueVersion = await getVueVersion()
  initializeStatusBar() // 初始化状态栏
  detectVueVersionMismatch() // 检测用户的vue版本是否和package.json中的vue版本一致,如果不一致则提示用户修改vue版本
  /** 注册代码片段 */
  disposables = registerSnippets(currentVueVersion)
  context.subscriptions.push(...disposables)
  // 监听用户修改vue版本配置
  workspace.onDidChangeConfiguration(async e => {
    if (!e.affectsConfiguration(`${extensionId}.${vueSelectionConfigName}`)) return
  })
}
/** 更新vue版本
 * @param vueVersion 要更新的vue版本
 */
export const updateVueVersion = async (vueVersion?: VueSupportType) => {
  if (vueVersion === currentVueVersion) return // 如果要更新的vue版本和当前的vue版本相同就不做处理
  vueVersion = vueVersion || (await getVueVersion()) // 如果没有传入vue版本则根据当前配置文件获取vue版本
  currentVueVersion = vueVersion // 保存当前vue版本
  updateStatusBar(vueVersion) // 更新状态栏vue版本
  disposables.forEach(disposable => disposable.dispose()) // 清理旧的码片段
  disposables = registerSnippets(vueVersion) // 注册新的代码片段
  extensionContext.subscriptions.push(...disposables) // 添加到vscode上下文中
}
