export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>The page you are looking for does not exist.</p>
      <a href="/" style={{ 
        padding: '10px 20px', 
        backgroundColor: '#0070f3', 
        color: 'white', 
        textDecoration: 'none',
        borderRadius: '4px'
      }}>
        Go back home
      </a>
    </div>
  )
}
