let gsiLoader = null

function loadGsi() {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  if (gsiLoader) return gsiLoader
  gsiLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      gsiLoader = null
      reject(new Error('Failed to load Google sign-in'))
    }
    document.head.appendChild(script)
  })
  return gsiLoader
}

export async function getGoogleProfile() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    throw new Error('Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID in .env')
  }

  await loadGsi()

  const accessToken = await new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (resp) => {
        if (resp.access_token) {
          resolve(resp.access_token)
        } else {
          reject(new Error(resp.error_description || 'Google sign-in failed'))
        }
      },
    })
    client.requestAccessToken()
  })

  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to fetch Google profile')
  const data = await res.json()
  return { email: data.email, name: data.name || 'User' }
}

export function googleAppPassword(email) {
  let h = 0
  const str = 'google:' + email.toLowerCase()
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return 'Ggl' + h.toString(16) + '!' + email.length
}
