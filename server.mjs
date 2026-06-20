import { createServer } from 'node:http'

// Clipboard APIs require a secure context. http://localhost counts as one,
// so a tiny static server serving these pages is enough to mirror
// Playwright's own `server.EMPTY_PAGE`.

// A page with a copy button. Clicking it writes to the clipboard from inside a
// real user gesture, exactly like meowdown's code-block copy button.
const copyPage = (extraBody = '') => `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"><title>clipboard</title></head>
  <body>
    <button id="copy">copy</button>
    ${extraBody}
    <script>
      document.getElementById('copy').addEventListener('click', async () => {
        await navigator.clipboard.writeText('test content')
        document.body.setAttribute('data-copied', '')
      })
    </script>
  </body>
</html>`

// "/"      -> top page that also embeds the same copy page in a same-origin iframe
// "/frame" -> the copy page on its own (used as the iframe source)
const topPage = copyPage('<iframe id="frame" src="/frame"></iframe>')
const framePage = copyPage()

const port = Number(process.env.PORT) || 3000

const server = createServer((request, response) => {
  const body = request.url === '/frame' ? framePage : topPage
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  response.end(body)
})

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
