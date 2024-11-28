import { type ExtensionContext } from 'vscode'
import type { vscodeApi } from '../types/global'
import config from '../config/index'
import createCommandList from './commandList'
const { extensionId } = config
// 初始化所有命令
export default function initCommand(this: any, vscode: vscodeApi, context: ExtensionContext) {
  const commandList = createCommandList(vscode)
  Object.entries(commandList).forEach(([commandName, callback]) => {
    // 注册命令
    const command = vscode.commands.registerCommand(`${extensionId}.${commandName}`, callback)
    // 添加命令
    context.subscriptions.push(command)
  })
}
