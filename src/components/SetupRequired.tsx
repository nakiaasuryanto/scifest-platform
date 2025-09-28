const SetupRequired = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚙️</div>

        <h1 style={{
          color: '#333',
          marginBottom: '16px',
          fontSize: '28px'
        }}>
          Setup Required
        </h1>

        <p style={{
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          The Science Festival Exam Platform needs to be configured with Supabase credentials.
        </p>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{ marginTop: '0', color: '#495057' }}>Required Environment Variables:</h3>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#6c757d' }}>
            <li><code>VITE_SUPABASE_URL</code> - Your Supabase project URL (format: https://xxxxx.supabase.co)</li>
            <li><code>VITE_SUPABASE_ANON_KEY</code> - Your Supabase anonymous key (starts with eyJ...)</li>
          </ul>
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
            <strong>⚠️ Common Issues:</strong>
            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '14px' }}>
              <li>URL must start with <code>https://</code> and end with <code>.supabase.co</code></li>
              <li>Key must be the full anonymous key (not the service key)</li>
              <li>Variable names must be exact: <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code></li>
            </ul>
          </div>
        </div>

        <div style={{
          backgroundColor: '#e7f3ff',
          border: '1px solid #b8daff',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h4 style={{ marginTop: '0', color: '#004085' }}>For Vercel Deployment:</h4>
          <ol style={{ margin: '0', paddingLeft: '20px', color: '#004085' }}>
            <li>Go to your Vercel project dashboard</li>
            <li>Navigate to Settings → Environment Variables</li>
            <li>Add both variables listed above</li>
            <li>Redeploy the application</li>
          </ol>
        </div>

        <div style={{
          borderTop: '1px solid #dee2e6',
          paddingTop: '20px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <p style={{ margin: '0' }}>
            Once configured, the platform will provide:
            <br />
            • Student exam interface with IRT scoring
            • Admin dashboard for question management
            • Real-time progress tracking
            • Automated calibration system
          </p>
        </div>
      </div>
    </div>
  )
}

export default SetupRequired