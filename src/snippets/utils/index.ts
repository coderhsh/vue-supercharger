import type { VueSupportType, CustomCompletionItem } from '../types'
import type { TextDocument, StatusBarItem, CompletionItem as CompletionItemType, Disposable } from 'vscode'
import { workspace, window, ConfigurationTarget, StatusBarAlignment, CompletionItem, CompletionItemKind, SnippetString, languages, MarkdownString } from 'vscode'
import { readFileSync } from 'fs'
import { join } from 'path'
import config, { snippetPaths } from '../config'
import { userConfig } from '../../config/userConfig'
import { userCommandList, extensionConfig, isEn } from '../../config/index'
import { updateUserWorkspaceConfig, findFilesFromWorkspace } from '../../utils'
const { extensionId, extensionLanguage, extensionName } = extensionConfig
const { vueSelectionConfigName, defaultHighlightsLanguage } = config

/** 注册代码片段 */
export function registerSnippets(selection: VueSupportType): Disposable[] {
  if (!selection || selection == 'none') return []
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
/** 获取需要支持的vue版本 */
export async function getVueVersion(): Promise<VueSupportType> {
  let { vueSelection } = userConfig // 当前工作区的vue版本
  if (vueSelection !== 'auto') return vueSelection // 用户选择的不是auto直接返回用户选择的
  const packageJsonPathList = await findFilesFromWorkspace('package.json') // 检查用户工作区最外层是否存在package.json
  if (!packageJsonPathList.length) return (vueSelection = 'none') // 如果没有package.json文件，直接返回none
  // 如果是 auto，并且有package.json , 尝试从 package.json 中读取 Vue 版本
  vueSelection = getVueVersionFromPackageJson()
  // 如果没有从PackageJson读取到Vue版本默认为当前工作区没有使用vue
  if (!vueSelection) return (vueSelection = 'none')
  return vueSelection
}
/* 询问用户是否要更新到工作区版本 */
export async function askUserToSetVueVersionInWorkspace(vueSelection: VueSupportType) {
  vueSelection = vueSelection || (await getVueVersion())
  const { message, yes } = {
    en: {
      message: `is ${vueSelection} set to the current workspace vue version?`,
      yes: 'yes',
    },
    zh: {
      message: `是否设置${vueSelection}为当前工作区vue版本？`,
      yes: '是',
    },
  }[extensionLanguage]
  // 更新到工作区设置
  const selection = await window.showInformationMessage(
    message,
    { modal: true }, // 设置为模态对话框
    yes
  )
  // 如果用户选择是，则更新到工作区设置
  if (selection === yes) updateVueVersionInWorkspace(vueSelection)
}
/** 从 JSON 文件中加载代码片段 */
export function loadSnippetsFromFile(filePath: string): CustomCompletionItem[] {
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
/**
 * 根据 package.json 中的 vue 版本来判断使用 vue2 还是 vue3
 */
export function getVueVersionFromPackageJson(): 'vue2' | 'vue3' | undefined {
  // 获取当前工作区的根路径
  const workspaceFolder = workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!workspaceFolder) return
  // 构建 package.json 的路径
  const packageJsonPath = join(workspaceFolder, 'package.json')
  const packageJsonFile = readFileSync(packageJsonPath, 'utf-8')
  if (!packageJsonFile) return
  try {
    // 读取并解析 package.json 文件
    const packageJson = JSON.parse(packageJsonFile)
    // 获取 vue 版本
    const vueVersion = packageJson.dependencies?.vue || packageJson.devDependencies?.vue
    if (!vueVersion) {
      // window.showWarningMessage('未在 package.json 中找到 vue 依赖')
      return
    }
    // 使用正则表达式匹配主版本号
    const versionMatch = vueVersion.match(/^(\^|~|>=|<=|<|>|\*|\d+)\.?(\d+)/)
    if (versionMatch) {
      const majorVersion = parseInt(versionMatch[2], 10) // 提取主版本号
      if (majorVersion === 2) return 'vue2'
      else if (majorVersion === 3) return 'vue3'
    }
    // 如果版本号不匹配 vue2 或 vue3
    window.showWarningMessage(isEn ? 'the Vue version used by the project is not Vue 2 or Vue 3' : '项目使用的 Vue 版本不是 Vue 2 或 Vue 3')
    return
  } catch (error: any) {
    // 捕获读取和解析错误
    window.showErrorMessage(isEn ? `unable to parse package.json: ${error.message}` : `无法解析 package.json: ${error.message}`)
    return
  }
}
/**
 * 显示一个选择 Vue 版本的快速选择菜单
 * @returns 返回选中的 Vue 版本
 */
export async function selectVueVersionToWorkspace(ignoreFocusOut = true): Promise<VueSupportType | undefined> {
  // 定义选项列表，每个选项包含标签和描述
  const options = [
    {
      label: 'Vue2',
      description: isEn ? `for Vue 2.x projects` : `适用于 Vue 2.x 项目`,
      value: 'vue2',
    },
    {
      label: 'Vue3',
      description: isEn ? `for Vue 3.x projects` : `适用于 Vue 3.x 项目`,
      value: 'vue3',
    },
    {
      label: 'Both',
      description: isEn ? `support for mixed Vue 2 and Vue 3 projects` : `支持 Vue 2 和 Vue 3 的混合项目`,
      value: 'both',
    },
    {
      label: 'None',
      description: isEn ? `the current project does not use Vue` : `当前项目未使用 Vue`,
      value: 'none',
    },
  ] as const
  const selected = await window.showQuickPick(options, {
    placeHolder: isEn ? `select the Vue version used by the current workspace` : `选择当前工作区使用的 Vue 版本`,
    ignoreFocusOut, // 忽略失去焦点后自动关闭
  })
  return selected?.value
}
/**
 * 更新当前工作区的 Vue 版本配置
 * @param vueVersion 用户选择的 Vue 版本
 */
export function updateVueVersionInWorkspace(vueVersion: VueSupportType): VueSupportType {
  const workspaceConfig = workspace.getConfiguration(extensionId) // 获取工作区的配置
  // 更新工作区设置
  workspaceConfig.update(vueSelectionConfigName, vueVersion, ConfigurationTarget.Workspace)
  window.showInformationMessage(isEn ? `the Vue version of the current workspace is set to:${vueVersion}` : `当前工作区的 Vue 版本已设置为:${vueVersion}`)
  return vueVersion
}
/** 检测用户的vue版本是否和package.json中的vue版本一致 */
export async function detectVueVersionMismatch() {
  const ignoreMismatch = userConfig.ignoreVueVersionMismatch // 检查用户是否选择了"不再提示"
  if (ignoreMismatch) return // 如果已经选择了"不再提示"，直接返回
  const workspaceVersion = userConfig[vueSelectionConfigName] // 获取用户配置的vue版本
  if (!['vue2', 'vue3'].includes(workspaceVersion)) return // 如果配置中不是vue2或者vue3就不做检测
  const packageJsonVersion = getVueVersionFromPackageJson() // 获取package.json中的vue版本
  if (workspaceVersion && packageJsonVersion && workspaceVersion !== packageJsonVersion) {
    const { message, update, theCurrentWorkspaceNoLongerPrompts } = {
      en: {
        message: `a mismatch was detected between the Vue version of the workspace setting (${workspaceVersion}) and the version in package.json (${packageJsonVersion}). Is it updated?`,
        update: 'update Settings',
        theCurrentWorkspaceNoLongerPrompts: 'workspace ignore',
      },
      zh: {
        message: `检测到工作区设置的 Vue 版本(${workspaceVersion}) 与 package.json 中的版本 (${packageJsonVersion}) 不匹配。是否更新？`,
        update: '更新设置',
        theCurrentWorkspaceNoLongerPrompts: '当前工作区不再提示',
      },
    }[extensionLanguage]
    const action = await window.showWarningMessage(message, update, theCurrentWorkspaceNoLongerPrompts)
    if (action === update) updateVueVersionInWorkspace(packageJsonVersion) // 更新当前工作区的 Vue 版本配置
    if (action === theCurrentWorkspaceNoLongerPrompts) updateUserWorkspaceConfig('ignoreVueVersionMismatch', true) // 在用户配置中记录忽略提示的标志
  }
}
/** 状态栏实例 */
let vueStatusBarItem: StatusBarItem | undefined
/**
 * 初始化状态栏
 */
export function initializeStatusBar() {
  if (vueStatusBarItem) return // 如果状态栏项已存在，则直接返回
  vueStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)
  vueStatusBarItem.tooltip = isEn ? `change the Vue version` : `切换 Vue 版本`
  vueStatusBarItem.command = userCommandList.selectVueVersion
  updateStatusBar() // 初始化状态栏内容
  vueStatusBarItem.show()
}
/**
 * 更新状态栏内容
 */
export const updateStatusBar = async (vueVersion?: string) => {
  if (!vueStatusBarItem) return // 如果状态栏实例不存在，则直接返回
  vueVersion = vueVersion || (await getVueVersion()) // 获取当前工作区的 Vue 版本
  vueStatusBarItem.text = `Vue: ${vueVersion || ''}`
}
