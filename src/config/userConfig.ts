import { workspace } from 'vscode'
import type { ExtensionContext } from 'vscode'
import extensionConfig from './index'
const { extensionId } = extensionConfig
export let userConfig = workspace.getConfiguration(extensionId) // 用户配置
// 开始初始化用户配置
export function initUserConfig(context: ExtensionContext) {
  // 监听用户修改配置
  let disposable = workspace.onDidChangeConfiguration(event => {
    if (!event.affectsConfiguration(extensionId)) return // 如果修改的不是当前插件的配置则不做处理
    userConfig = workspace.getConfiguration(extensionId) // 给用户配置重新赋值
  })
  context.subscriptions.push(disposable)
}

export default userConfig
