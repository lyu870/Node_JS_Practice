const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));


const { MongoClient } = require('mongodb')

let db;
const url = 'mongodb+srv://admin:qqqq1111@cluster0.nzbpycy.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')

}).catch((err)=>{
  console.log(err)
})

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중');
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/about.html');
})

app.get('/news', (req, res) => {
    res.send('오늘은 비가옵니다');
})