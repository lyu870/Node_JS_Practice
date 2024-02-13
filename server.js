const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true})) 


const { MongoClient } = require('mongodb')
// const ObjectId = require('mongodb').ObjectId;

let db;
const url = 'mongodb+srv://admin:qqqq1111@cluster0.nzbpycy.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')

  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중');
  })

}).catch((err)=>{
  console.log(err)
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/about.html');
})

app.get('/news', (req, res) => {
  res.send('오늘은 비가와요');
})

// await은 다음줄이 실행되기 전에 기다리라는 명령
// await을 쓰지않는다면 아래코드의 첫번째줄이 실행 다 되기도 전에
// 밑의 코드들이 실행되려고 할것임.
// response 응답은 코드내에서 1번만 가능.
app.get('/list', async(req, res) => {
  let result = await db.collection('post').find().toArray();
  res.render('list.ejs', { posts : result});
})

app.get('/write', async(req, res) => {
  res.render('write.ejs');
})

app.get('/time', (req, res) => {
  res.render('time.ejs', { time : new Date() });
})

app.post('/add', (req, res) => {
  console.log(res.body);
})

