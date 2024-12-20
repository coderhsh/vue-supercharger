import type * as vscode from 'vscode'
/** vscodeApi */
type vscodeApi = typeof vscode
/** 当前插件支持的用户配置 */
type ExtensionConfig = {
  /** 是否忽略vue版本不匹配的警告 */
  ignoreVueVersionMismatch: boolean
  /** 选择需要支持的vue版本 */
  vueSelection: string
}
export interface ILanguagePack {
  [key: string]: string
}
