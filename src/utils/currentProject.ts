import { workspace, ConfigurationTarget, window } from 'vscode'
import type { ExtensionConfig } from '../types/global'
import { extensionConfig, isEn, userConfigList } from '../config/index'
import userConfig from '../config/userConfig'
const { extensionId } = extensionConfig
/** 更新用户工作区配置
 * @param key 配置键
 * @param value 配置值
 */
export const updateUserWorkspaceConfig = async <K extends keyof ExtensionConfig>(key: K, value: ExtensionConfig[K]) => {
  try {
    // 获取插件的配置命名空间
    const config = workspace.getConfiguration(extensionId)
    // 更新工作区配置
    await config.update(key, value, ConfigurationTarget.Workspace)
  } catch (error: any) {
    window.showErrorMessage(isEn ? `configuration update failure:${error.message}` : `配置更新失败: ${error.message}`)
  }
}
/** 获取用户的某个配置 */
export const getUserConfig = <K extends keyof typeof userConfigList>(key: K) => {
  return userConfig.get(userConfigList[key])
}
