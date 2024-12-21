import { languages, CompletionItem, CompletionItemKind } from 'vscode'
import type { TextDocument, Position, ExtensionContext } from 'vscode'
import { wordConfig } from './config'
export const initWordCompletion = (context: ExtensionContext) => {
  for (const [language, { words }] of Object.entries(wordConfig)) {
    for (const lang of language.split(',')) {
      const completionProvider = languages.registerCompletionItemProvider(lang.trim(), {
        provideCompletionItems(document: TextDocument, position: Position) {
          if (lang !== document.languageId) return []
          // 添加单词提示
          return words.map(word => new CompletionItem(word, CompletionItemKind.Keyword))
        },
      })
      context.subscriptions.push(completionProvider)
    }
  }
}
export default initWordCompletion
