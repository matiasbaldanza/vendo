export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>404</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>Página no encontrada</p>
      <a href="/" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Volver al inicio</a>
    </div>
  )
}
