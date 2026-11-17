export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Could not find requested resource.</p>
      <a href="/" style={{ padding: '10px 20px', backgroundColor: '#1c306d', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
        Return Home
      </a>
    </div>
  );
}
