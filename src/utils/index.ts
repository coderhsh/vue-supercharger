import { workspace, ConfigurationTarget, window, RelativePattern, type Uri } from 'vscode'
import type { ExtensionConfig } from '../types/global'
import { extensionConfig, isEn } from '../config/index'
const { extensionId } = extensionConfig
/** 更新用户工作区配置 */
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
/**
 * 查找当前工作区的某个文件路径,支持递归查找
 * @param fileName 要查找的文件名
 * @param maxDepth 控制递归深度，如果是 true 则递归所有层级，如果是数字，则为最大递归深度(默认为1,查找最外层)
 * @returns 返回一个 Promise，包含找到的文件路径相关信息数组，如果没有找到则返回空数组
 */
export async function findFilesFromWorkspace(fileName: string, maxDepth: boolean | number = 1): Promise<Uri[]> {
  // 获取当前工作区的所有文件夹
  const workspaceFolders = workspace.workspaceFolders
  if (!workspaceFolders || workspaceFolders.length === 0) {
    console.log('没有工作区文件夹')
    return [] // 如果没有工作区，直接返回空数组
  }
  const foundFiles: Uri[] = [] // 存储找到的文件路径
  // 遍历工作区中的文件夹，查找目标文件
  for (const folder of workspaceFolders) {
    const folderPath = folder.uri.fsPath
    try {
      // 生成搜索模式
      let pattern: RelativePattern
      if (maxDepth === 1) {
        // 如果 maxDepth 为 1，只查找最外层的文件
        pattern = new RelativePattern(folderPath, `${fileName}`)
      } else if (typeof maxDepth === 'number' && maxDepth > 1) {
        // 如果 maxDepth 为数字大于 1，递归查找每一层
        const depthPattern = '**/'.repeat(Math.max(0, typeof maxDepth === 'number' ? maxDepth - 1 : 0))
        pattern = new RelativePattern(folderPath, `${depthPattern}${fileName}`)
      } else if (maxDepth === true) {
        // 如果 maxDepth 为 true，则递归查找所有层级
        pattern = new RelativePattern(folderPath, `**/${fileName}`)
      } else {
        // 如果 maxDepth 为其他无效值，则只查找当前目录
        pattern = new RelativePattern(folderPath, `${fileName}`)
      }
      // 查找目标文件
      const files = await workspace.findFiles(pattern)
      // 如果找到文件，添加到结果数组
      if (files.length > 0) {
        foundFiles.push(...files) // 将找到的文件路径推入数组
      }
    } catch (error) {
      console.error(`查找文件时出错: ${error}`)
    }
  }
  // 返回找到的文件路径数组，若没有找到则返回空数组
  return foundFiles
}
