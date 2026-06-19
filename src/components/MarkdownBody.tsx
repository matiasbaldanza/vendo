import styles from './MarkdownBody.module.css'

export default function MarkdownBody({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean)

  return (
    <div className={styles.body}>
      {paragraphs.map((para, i) => {
        if (para.startsWith('- ')) {
          const items = para.split('\n').map(line => line.replace(/^-\s*/, ''))
          return (
            <ul key={i} className={styles.list}>
              {items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          )
        }
        return <p key={i}>{para}</p>
      })}
    </div>
  )
}
