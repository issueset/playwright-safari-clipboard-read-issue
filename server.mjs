import { createServer } from 'node:http'

// Clipboard APIs require a secure context. http://localhost counts as one,
// so a tiny static server serving an empty page is enough to mirror
// Playwright's own `server.EMPTY_PAGE`.
const html =
  '<!DOCTYPE html><html><head><meta charset="utf-8"><title>empty</title></head><body></body></html>'

const port = Number(process.env.PORT) || 3000

const server = createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  response.end(html)
})

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
