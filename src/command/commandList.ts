import type { vscodeApi } from '../types/global'
import { selectVueVersionToWorkspace, askUserToSetVueVersionInWorkspace } from '../snippets/utils/index'
import { updateVueVersion } from '../snippets'
import { getUserConfig } from '../utils'
// 创建命令列表
export default function createCommandList({ window, commands, env }: vscodeApi) {
  const commandList = {
    /** 选择Vue版本 */
    selectVueVersion: async () => {
      const vueVersion = await selectVueVersionToWorkspace(false) // 选择版本
      if (!vueVersion) return // 如果用户没有选择版本，则返回
      updateVueVersion(vueVersion) // 更新状态栏vue版本和代码片段的vue版本
      const configVueVersion = getUserConfig('vueSelection') // 获取用户配置的vue版本
      // 如果用户选择的vue版本和当前工作区中的vue版本不一致，询问用户是否设置为工作区版本
      if (configVueVersion !== vueVersion) askUserToSetVueVersionInWorkspace(vueVersion)
    },
  }
  return commandList
}
