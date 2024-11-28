import { workspace, ConfigurationTarget, window } from 'vscode'
import type { ExtensionConfig } from '../types/global'
import { extensionConfig } from '../config/index'
const { extensionId } = extensionConfig
/** 更新用户工作区配置 */
export const updateUserWorkspaceConfig = async <K extends keyof ExtensionConfig>(key: K, value: ExtensionConfig[K]) => {
  try {
    // 获取插件的配置命名空间
    const config = workspace.getConfiguration(extensionId)
    // 更新工作区配置
    await config.update(key, value, ConfigurationTarget.Workspace)
    window.showInformationMessage(`已更新工作区配置: ${key} = ${value}`)
  } catch (error: any) {
    window.showErrorMessage(`更新配置失败: ${error.message}`)
  }
}
