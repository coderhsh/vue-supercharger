import type { CompletionItem } from 'vscode'
/** 用户选择的vue支持 */
export type SelectionType = 'vue2' | 'vue3' | 'both' | 'auto' | 'none'
/** 需要实现的vue支持 */
export type VueSupportType = Exclude<SelectionType, 'auto'>

/** 自定义的代码片段项 */
export interface CustomCompletionItem extends CompletionItem {
  /** scope字符串 */
  scope?: string
  /** scope转换的数组 */
  scopeList?: string[]
  description?: string
}
