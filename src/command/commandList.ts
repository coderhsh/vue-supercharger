import type { vscodeApi } from '../types/global'
import { selectVueVersionToWorkspace, updateVueVersionInWorkspace } from '../snippets/utils/index'
// 创建命令列表
export default function createCommandList({ window, commands, env }: vscodeApi) {
  const commandList = {
    /** 选择Vue版本 */
    selectVueVersion: async () => {
      const vueVersion = await selectVueVersionToWorkspace(false) // 选择版本
      if (vueVersion) updateVueVersionInWorkspace(vueVersion)
    },
  }
  return commandList
}
