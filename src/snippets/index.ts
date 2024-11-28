import type { ExtensionContext, CompletionItem as CompletionItemType, Disposable, TextDocument } from 'vscode'
import type { VueSupportType, CustomCompletionItem } from './types'
import { workspace, window, CompletionItem, CompletionItemKind, languages, SnippetString, MarkdownString } from 'vscode'
import { readFileSync } from 'fs'
import { userConfig } from '../config/userConfig'
import { extensionConfig } from '../config/index'
import config, { snippetPaths } from './config'
import { getVueVersionFromPackageJson, selectVueVersionToWorkspace, updateVueVersionInWorkspace, detectVueVersionMismatch, initializeStatusBar, updateStatusBar } from './utils'
const { defaultHighlightsLanguage, vueSelectionConfigName } = config
const { extensionId, extensionName } = extensionConfig
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
/** 获取需要支持的vue版本,如果用户选择的是auto提示用户是否配置为当前工作区 */
export async function getVueVersion(confirm = true) {
  // 获取配置的 vueSelection
  let { vueSelection } = userConfig
  if (vueSelection !== 'auto') return vueSelection
  // 如果是 auto，尝试从 package.json 中读取 Vue 版本
  vueSelection = getVueVersionFromPackageJson()
  // 如果没有读取到，则提示用户选择
  if (!vueSelection) vueSelection = await selectVueVersionToWorkspace()
  if (!vueSelection) return vueSelection
  // 如果不需要确认弹窗则直接更新工作区配置
  if (!confirm) return updateVueVersionInWorkspace(vueSelection)
  // 更新到工作区设置
  const selection = await window.showInformationMessage(
    `是否设置${vueSelection}为当前工作区vue版本？`, // 提示信息
    { modal: true }, // 设置为模态对话框
    '是'
  )
  // 如果用户选择是，则更新到工作区设置
  if (selection === '是') updateVueVersionInWorkspace(vueSelection)
  return vueSelection
}
/**  从 JSON 文件中加载代码片段 */
function loadSnippetsFromFile(filePath: string): CustomCompletionItem[] {
  const snippets: CompletionItemType[] = []
  try {
    const fileContent = readFileSync(filePath, 'utf-8')
    const jsonContent = JSON.parse(fileContent)
    for (const key in jsonContent) {
      const snippet = jsonContent[key]
      const item = new CompletionItem(snippet.prefix, CompletionItemKind.Snippet) as CustomCompletionItem
      Object.assign(item, snippet)
      item.scopeList = snippet.scope ? snippet.scope.split(',') : []
      item.keepWhitespace = true // 保留缩进
      item.insertText = new SnippetString(snippet.body.join('\n'))
      item.detail = snippet.description || item.insertText
      snippets.push(item)
    }
  } catch (err: any) {
    window.showErrorMessage(`Error loading snippets from ${filePath}: ${err.message}`)
  }
  return snippets
}
/** 注册代码片段 */
export function registerSnippets(selection: VueSupportType): Disposable[] {
  if (!selection) return []
  const disposables: Disposable[] = []
  const selectedPaths = snippetPaths[selection] || [] // 获取用户选中的代码片段路径
  // 加载用户选择的代码片段
  const snippets = selectedPaths.reduce<CustomCompletionItem[]>((result, path) => {
    try {
      return result.concat(loadSnippetsFromFile(path))
    } catch {
      console.error(`Failed to load snippets from ${path}:`)
      return result
    }
  }, [])
  const provider = languages.registerCompletionItemProvider(
    { scheme: 'file' },
    {
      provideCompletionItems(document: TextDocument) {
        // 筛选生效的代码片段
        const language = document.languageId // 获取当前文件语言
        /** 筛选命中当前文件的代码片段 */
        const filteredSnippets = snippets.filter(({ scopeList = [] }) => !scopeList.length || scopeList.includes(language))
        /** 添加右侧代码提示 */
        filteredSnippets.forEach(snippet => {
          const { scopeList, insertText, description } = snippet
          const [highlightsLanguage] = scopeList || [defaultHighlightsLanguage] // 获取需要高亮的语法(优先使用代码片段中scope的第一项作为高亮的语法,如果没有则使用默认的)
          const snippetBody = typeof insertText === 'string' ? insertText : insertText?.value || insertText?.toString()
          // 设置 Markdown 格式的补全说明
          const markdown = new MarkdownString()
          markdown.appendCodeblock(snippetBody || '', highlightsLanguage) //  第二个参数表示代码片段的语言高亮
          snippet.documentation = markdown
          snippet.detail = `${extensionName}: ${description || ''}` // 简短的右侧上面提示
        })
        return filteredSnippets
      },
    }
  )
  disposables.push(provider)
  return disposables
}
