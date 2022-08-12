import { CompletionItemKind } from 'vscode-html-languageservice'
import type { HTMLPlugin } from '../types'
import { Events, Directives } from './meta'

export const vueHTMLPlugin: HTMLPlugin = {
  completions({ document, position }) {
    const text = document.getText({
      start: { line: 0, character: 0 },
      end: position,
    })

    if (text.match(/(<\w+\s*)[^>]*$/) !== null) {
      if (!text.match(/\S+(?=\s*=\s*["']?[^"']*$)/) || text.match(/<\w+\s+$/)) {
        return [
          ...Directives.map(e => ({
            label: `v-${e.name}`,
            insertText: `v-${e.name}=""`,
            kind: CompletionItemKind.Function,
            ...e.extra,
          })),
          ...Events.map(e => ({
            label: `@${e}`,
            insertText: `@${e}=""`,
            kind: CompletionItemKind.Event,
          })),
        ]
      }
    }

    return []
  },
}
