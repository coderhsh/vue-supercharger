import { env } from 'vscode'
/** 用户的语言 */
const userLanguage = env.language
/** 扩展内部的配置 */
export const extensionConfig: { [key: string]: string } & { extensionLanguage: 'en' | 'zh' } = {
  /** 扩展名称 */
  extensionName: 'Vue Supercharger',
  /** 扩展id */
  extensionId: 'vue-supercharger',
  /** 扩展显示的语言(目前只支持中英文 zh|en) */
  extensionLanguage: userLanguage.startsWith('zh') ? 'zh' : 'en',
}
/** 是否是英文 */
export const isEn = extensionConfig.extensionLanguage === 'en'
export default extensionConfig
