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
    connectionString: 'postgres://admin:DAoIDxIXYz3D0hq9FlvlQkSLxI86kzi0@dpg-cgbp6jpmbg55nqnk6700-a.oregon-postgres.render.com/lovelace'
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/practice', (req, res) => {
  res.sendFile(__dirname + '/public/practice.html')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

// Rota para criar usuário
app.post('/register', (req, res) => {
    const { nome, email, senha } = req.body; 

    // Query para verificar se o email existe
    const selectQuery = 'SELECT * FROM users WHERE email = $1';
    const selectValues = [email];

    pool.query(selectQuery, selectValues, (selectError, selectResult) => {
      if (selectError){
        console.error(err);
        res.status(500).send("Erro ao verificar o email")
      } else if (selectResult.rows.length > 0) {
        // Verifica se há um registro no banco e informa que já existe caso verdadeiro
        res.status(400).send("Este usuário já está cadastrado")
      } else {
        // Cria um usuário no banco de dados
        const insertQuery = 'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3)';
        const insertValues = [nome, email, senha];
        
        pool.query(insertQuery, insertValues, (insertError, insertResult) => {
          if (insertError){
            console.error(insertError)
            res.status(500).send("Erro ao criar o usuário")
          } else {
            console.log(insertResult)
            res.redirect('/login')
          }
        })
      }
    })
})

// Direcionando para página de login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
})

// Rota para fazer login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const client = await pool.connect();

  try {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1 AND senha = $2',
      values: [email, senha],
    };

    const result = await client.query(query);
    if (result.rowCount === 1) {
      res.redirect('/')
    } else {
      res.status(401).send('Email ou senha incorretos.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno do servidor.');
  } finally {
    client.release();
  }
});


// Inicia o servidor
app.listen(port, (error) => {
    if (error) {
        console.log("Deu erro")
        return
    }
    console.log("App subiu | localhost:3000")
})
