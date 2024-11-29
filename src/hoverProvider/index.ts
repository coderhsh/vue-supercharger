import type { ExtensionContext } from 'vscode'
import { languages, Hover } from 'vscode'
import { keyWordRecord, enabledLanguages } from './config'
import { userConfig } from '../config/userConfig'
import type { HoverProvider, TextDocument, Position, CancellationToken, ProviderResult, Hover as HoverType } from 'vscode'
const keyWords = Object.keys(keyWordRecord)
export default function initHoverProvider(context: ExtensionContext) {
  class MyHoverProvider implements HoverProvider {
    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<HoverType> {
      if (!userConfig.isShowHoverTips) return // 如果用户关闭了鼠标悬浮提示就不再继续执行
      // 通过position获取到鼠标悬浮位置单词的Range
      const wordRange = document.getWordRangeAtPosition(position)
      const word = document.getText(wordRange)
      if (keyWords.includes(word)) {
        return new Hover(keyWordRecord[word])
      }
    }
  }
  context.subscriptions.push(languages.registerHoverProvider(enabledLanguages, new MyHoverProvider()))
}
