import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: '#667eea' }}>404</h1>
      <p style={{ fontSize: '1.5rem', color: '#666', margin: '0.5rem 0 1.5rem' }}>Page Not Found</p>
      <Link to="/" style={btnStyle}>Go Home</Link>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '70vh',
  textAlign: 'center',
  padding: '2rem',
};
const btnStyle = {
  padding: '0.75rem 2rem',
  background: '#667eea',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
};
