import { VueSupportType } from '../types'
import { CommandList } from '../types/enum'
import { workspace, window, ConfigurationTarget, StatusBarAlignment, type StatusBarItem } from 'vscode'
import { readFileSync } from 'fs'
import { join } from 'path'
import config from '../config'
import { userConfig } from '../../config/userConfig'
import { extensionConfig } from '../../config/index'
import { updateUserWorkspaceConfig } from '../../utils'
const { extensionId } = extensionConfig
const { vueSelectionConfigName } = config
/**
 * 根据 package.json 中的 vue 版本来判断使用 vue2 还是 vue3
 */
export function getVueVersionFromPackageJson(): 'vue2' | 'vue3' | undefined {
  // 获取当前工作区的根路径
  const workspaceFolder = workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!workspaceFolder) {
    window.showErrorMessage('无法获取工作区的根目录')
    return
  }
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
    window.showWarningMessage('项目使用的 Vue 版本不是 Vue 2 或 Vue 3')
    return
  } catch (error: any) {
    // 捕获读取和解析错误
    window.showErrorMessage(`无法解析 package.json: ${error.message}`)
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
      description: '适用于 Vue 2.x 项目',
      value: 'vue2',
    },
    {
      label: 'Vue3',
      description: '适用于 Vue 3.x 项目',
      value: 'vue3',
    },
    {
      label: 'Both',
      description: '支持 Vue 2 和 Vue 3 的混合项目',
      value: 'both',
    },
    {
      label: 'None',
      description: '当前项目未使用 Vue',
      value: 'none',
    },
  ] as const
  const selected = await window.showQuickPick(options, {
    title: '选择当前工作区使用的 Vue 版本',
    placeHolder: '未在 package.json 中找到 vue 依赖,请选择选择当前工作区使用的 Vue 版本',
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
  window.showInformationMessage(`当前工作区的 Vue 版本已设置为: ${vueVersion}`)
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
    const action = await window.showWarningMessage(`检测到工作区设置的 Vue 版本 (${workspaceVersion}) 与 package.json 中的版本 (${packageJsonVersion}) 不匹配。是否更新？`, '更新设置', '忽略', '当前工作区不再提示')
    if (action === '更新设置') {
      updateVueVersionInWorkspace(packageJsonVersion)
    } else if (action === '当前工作区不再提示') {
      // 在用户配置中记录忽略提示的标志
      updateUserWorkspaceConfig('ignoreVueVersionMismatch', true)
    }
  }
}
/** 创建状态栏项 */
let vueStatusBarItem: StatusBarItem | undefined
/**
 * 初始化状态栏
 */
export function initializeStatusBar() {
  if (!vueStatusBarItem) {
    vueStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    vueStatusBarItem.tooltip = '点击切换 Vue 版本'
    vueStatusBarItem.command = CommandList.selectVueVersion
    vueStatusBarItem.show()
  }
  updateStatusBar() // 初始化状态栏内容
}
/**
 * 更新状态栏内容
 */
export function updateStatusBar() {
  const vueVersion = userConfig.get(vueSelectionConfigName, '')
  if (vueStatusBarItem) {
    vueStatusBarItem.text = `Vue版本: ${vueVersion || '未设置'}`
  }
}
