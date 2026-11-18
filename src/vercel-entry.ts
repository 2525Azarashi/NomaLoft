import app from './index'

async function handleWebRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const rewrittenPath = url.searchParams.get('__noma_path')
  if (rewrittenPath !== null) {
    url.pathname = rewrittenPath.startsWith('/') ? rewrittenPath : `/${rewrittenPath}`
    url.searchParams.delete('__noma_path')
    return app.fetch(new Request(url.toString(), req))
  }
  return app.fetch(req)
}

export default async function handler(req: any, res?: any): Promise<any> {
  // 1. Web Standard Request (Edge / Fetch runtime)
  if (typeof Request !== 'undefined' && req instanceof Request) {
    return handleWebRequest(req)
  }

  // 2. Vercel Node.js Serverless (IncomingMessage, ServerResponse)
  const proto = req.headers?.['x-forwarded-proto'] || 'https'
  const host = req.headers?.['x-forwarded-host'] || req.headers?.host || 'localhost'
  const fullUrl = new URL(req.url || '/', `${proto}://${host}`)

  const rewrittenPath = fullUrl.searchParams.get('__noma_path')
  if (rewrittenPath !== null) {
    fullUrl.pathname = rewrittenPath.startsWith('/') ? rewrittenPath : `/${rewrittenPath}`
    fullUrl.searchParams.delete('__noma_path')
  }

  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers || {})) {
    if (Array.isArray(v)) v.forEach((item) => headers.append(k, String(item)))
    else if (v !== undefined) headers.set(k, String(v))
  }

  const method = req.method || 'GET'
  const init: RequestInit = { method, headers }
  if (method !== 'GET' && method !== 'HEAD' && req.body) {
    init.body =
      typeof req.body === 'string' || Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body)
  }

  const webRes = await app.fetch(new Request(fullUrl.toString(), init))
  res.statusCode = webRes.status
  webRes.headers.forEach((val, key) => {
    res.setHeader(key, val)
  })
  const buf = Buffer.from(await webRes.arrayBuffer())
  res.end(buf)
}
