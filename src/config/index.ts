import { env } from 'vscode'
/** 用户的语言 */
const userLanguage = env.language
/** 扩展内部的配置 */
export const extensionConfig = {
  /** 扩展名称 */
  extensionName: 'Vue Supercharger',
  /** 扩展id */
  extensionId: 'vue-supercharger',
  /** 扩展显示的语言(目前只支持中英文 zh|en) */
  extensionLanguage: userLanguage.startsWith('zh') ? 'zh' : 'en',
} as const
/** 提供给用户的命令列表 */
export const userCommandList = {
  /** 选择要支持的vue版本 */
  selectVueVersion: `vue-supercharger.selectVueVersion`,
} as const
/** 提供给用户的配置列表 */
export const userConfigList = {
  /** 需要支持的vue版本 */
  vueSelection: `vueSelection`,
  /** 忽略vue版本不匹配 */
  ignoreVueVersionMismatch: 'ignoreVueVersionMismatch',
} as const
/** 是否是英文 */
export const isEn = extensionConfig.extensionLanguage === 'en'
export default extensionConfig
