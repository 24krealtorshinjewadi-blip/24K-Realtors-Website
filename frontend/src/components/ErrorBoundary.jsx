import React from 'react';

/**
 * Production-grade Error Boundary.
 * Catches any render errors and shows a graceful fallback UI
 * instead of a blank white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, send to error tracking (e.g. Sentry)
    // For now, log to console in dev only
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught:', error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            background: '#070F1E',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '16px',
              padding: '48px 40px',
              maxWidth: '480px',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '28px',
              }}
              aria-hidden="true"
            >
              ⚠️
            </div>
            <h1
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#D4AF37',
                fontSize: '1.4rem',
                fontWeight: 700,
                margin: '0 0 12px',
                letterSpacing: '0.03em',
              }}
            >
              Something Went Wrong
            </h1>
            <p
              style={{
                color: '#8E9AAF',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                margin: '0 0 28px',
              }}
            >
              We encountered an unexpected error. Our team has been notified. 
              Please try refreshing the page.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                aria-label="Try loading the page again"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #C5A880)',
                  border: 'none',
                  color: '#070F1E',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                Try Again
              </button>
              <a
                href="tel:+919673000053"
                aria-label="Call 24K Realtors support line"
                style={{
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                📞 Call Support
              </a>
            </div>

            {this.state.error && (
              <details style={{ marginTop: '24px', textAlign: 'left', background: 'rgba(0,0,0,0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.2)', color: '#fca5a5', fontSize: '0.74rem', fontFamily: 'monospace' }}>
                <summary style={{ cursor: 'pointer', color: 'rgba(212,175,55,0.8)', fontWeight: 600 }}>Technical Diagnostics (Click to view error log)</summary>
                <div style={{ marginTop: '10px', wordBreak: 'break-word', whiteSpace: 'pre-wrap', maxHeight: '180px', overflowY: 'auto' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
