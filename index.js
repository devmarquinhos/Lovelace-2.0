import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express()
const port = 3000

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configurando o body parser para coleta de dados via HTTP
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Configurando o Express para usar os arquivos 
app.use(express.static('public'))

// Configurando o banco de dados
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "users",
    password: "admin",
    port: "5432"
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

// Rota para criar usuário
app.post('/register', (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = 'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3)';
    const values = [nome, email, senha];
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao criar usuário');
      } else {
        res.status(201).send('Usuário criado com sucesso');
      }
    });
});

app.listen(port, (error) => {
    if (error) {
        console.log("Deu erro")
        return
    }
    console.log("App subiu | localhost:3000")
})
