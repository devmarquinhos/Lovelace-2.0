import express from "express"
const app = express()
const port = 3000

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, (error) => {
    if (error) {
        console.log("Deu erro")
        return
    }
    console.log("App subiu | localhost:3000")
})
