export default async function handler(req, res) {
  const segments = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || ''
  const query = { ...req.query }
  delete query.path

  const search = new URLSearchParams(query).toString()
  const target = `https://ecommerce-backend-mddx.onrender.com/api/${segments}${search ? `?${search}` : ''}`

  const headers = { ...req.headers }
  delete headers.origin
  delete headers.host

  const method = (req.method || 'GET').toUpperCase()
  const body =
    method === 'GET' || method === 'HEAD' ? undefined : await readBody(req)

  const resp = await fetch(target, { method, headers, body })
  const text = await resp.text()

  resp.headers.forEach((value, key) => {
    if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      res.setHeader(key, value)
    }
  })
  res.status(resp.status)
  res.send(text)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}
