import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Application Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px',
          margin: '50px auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h1 style={{ color: '#d73527', marginBottom: '20px' }}>
            ⚠️ Application Error
          </h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Something went wrong with the Science Festival Exam Platform.
          </p>
          <details style={{
            textAlign: 'left',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Error Details (Click to expand)
            </summary>
            <pre style={{
              fontSize: '12px',
              color: '#d73527',
              overflow: 'auto',
              marginTop: '10px'
            }}>
              {this.state.error?.stack || this.state.error?.message || 'Unknown error'}
            </pre>
          </details>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Reload Page
            </button>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
          <p style={{
            fontSize: '12px',
            color: '#999',
            marginTop: '30px',
            borderTop: '1px solid #ddd',
            paddingTop: '15px'
          }}>
            If this problem persists, please contact the administrator.
            <br />
            <strong>Possible causes:</strong> Missing environment variables, network issues, or configuration problems.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary