import { useState } from 'react'

export default function PasswordInput({ value, onChange, label, required, placeholder, name, ...rest }) {
  const [show, setShow] = useState(false)

  return (
    <div style={fieldStyle}>
      {label && <label>{label}</label>}
      <div style={wrapperStyle}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          name={name}
          style={inputStyle}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={toggleStyle}
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

const fieldStyle = { marginBottom: '1rem' }
const wrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' }
const inputStyle = {
  width: '100%', padding: '0.6rem 2.5rem 0.6rem 1rem', border: '1px solid #ccc',
  borderRadius: '6px', fontSize: '1rem', marginTop: '0.25rem', boxSizing: 'border-box'
}
const toggleStyle = {
  position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem',
  display: 'flex', alignItems: 'center', marginTop: '0.125rem'
}
