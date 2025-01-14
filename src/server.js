import http from 'node:http'

const server = http.createServer((req, res) => {

    res.end("Testado")
})

server.listen(9000, 'localhost', () => {
    console.log('Server on')
})