import {getHighlighter} from 'shiki'

export const codeToHtml = async ({
  code,
  language,
}: {
  code: string
  language: string
}) => {
  const highlighter = await getHighlighter({
    themes: ['dark-plus'],
    langs: ['ts'],
  })

  await highlighter.loadLanguage('typescript')
  await highlighter.loadLanguage('javascript')
  await highlighter.loadLanguage('tsx')
  await highlighter.loadLanguage('json')
  await highlighter.loadLanguage('bash')
  await highlighter.loadLanguage('yaml')
  await highlighter.loadLanguage('markdown')
  await highlighter.loadLanguage('html')

  return highlighter.codeToHtml(code, {
    lang: language,
    theme: 'dark-plus',
  })
}
