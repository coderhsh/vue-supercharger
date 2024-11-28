import type { VueSupportType } from './types'
import { join } from 'path'
// TODO 当前没用上
export const enabledLanguages = ['typescript', 'javascript', 'vue'] as const
export const rootPath = join(__dirname, '..', '..') // 根路径
export default {
  /** 默认语法高亮语言 */
  defaultHighlightsLanguage: 'typescript',
  /** 选择需要支持的vue版本配置项名字 */
  vueSelectionConfigName: 'vueSelection',
}
/** 代码片段路径映射 */
export const snippetPaths: Record<VueSupportType, string[]> = {
  vue2: [join(rootPath, 'snippets', 'vue2.code-snippets')],
  vue3: [join(rootPath, 'snippets', 'vue3.code-snippets')],
  both: [join(rootPath, 'snippets', 'vue2.code-snippets'), join(rootPath, 'snippets', 'vue3.code-snippets')],
  none: [],
}
