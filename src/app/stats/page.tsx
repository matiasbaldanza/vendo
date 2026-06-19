import { notFound } from 'next/navigation'
import { aggregateEvents, getEvents } from '@/lib/analytics'
import { siteConfig } from '../../../site.config'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function StatsPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!siteConfig.statsSecret || token !== siteConfig.statsSecret) {
    notFound()
  }

  const events = await getEvents()
  const stats = aggregateEvents(events)
  const sortedDays = Object.entries(stats.byDay).sort(([a], [b]) => b.localeCompare(a))

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Estadísticas</h1>
      <p className={styles.subtitle}>{stats.totalEvents} eventos registrados</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Por tipo</h2>
        <ul className={styles.statList}>
          {Object.entries(stats.byType).map(([type, count]) => (
            <li key={type}><strong>{type}</strong>: {count}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Por dispositivo</h2>
        <ul className={styles.statList}>
          {Object.entries(stats.byDevice).map(([device, count]) => (
            <li key={device}><strong>{device}</strong>: {count}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Clicks WhatsApp</h2>
        <p className={styles.bigNumber}>{stats.whatsappClicks}</p>
      </section>

      {Object.keys(stats.copyCrosspost).length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Copias cross-post</h2>
          <ul className={styles.statList}>
            {Object.entries(stats.copyCrosspost).map(([platform, count]) => (
              <li key={platform}><strong>{platform}</strong>: {count}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vistas por día</h2>
        <ul className={styles.statList}>
          {sortedDays.map(([day, count]) => (
            <li key={day}><strong>{day}</strong>: {count}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Eventos recientes</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Ruta</th>
                <th>Dispositivo</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((event, i) => (
                <tr key={`${event.ts}-${i}`}>
                  <td>{new Date(event.ts).toLocaleString('es-AR')}</td>
                  <td>{event.type}</td>
                  <td>{event.path}{event.slug ? ` (${event.slug})` : ''}</td>
                  <td>{event.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
