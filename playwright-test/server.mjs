import { createServer } from 'node:http'

const html = `<!doctype html>
<meta charset="utf-8" />
<button>copy</button>
<script>
  document.querySelector('button').onclick = () =>
    navigator.clipboard.writeText('hello')
</script>`

createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  response.end(html)
}).listen(3100)
