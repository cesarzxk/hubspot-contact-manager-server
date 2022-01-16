import express, { json } from 'express';
import cors from 'cors';
import routes from './routes';
import http from 'http';

const app = express()
const server = http.createServer(app);

app.use(cors())
app.use(json())
app.use(routes)

server.listen(3333, () => {
    console.log('Servidor iniciado com sucesso! 🚀 http://localhost:3333')
})

