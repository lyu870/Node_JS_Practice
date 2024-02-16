const express = require('express');
const app = express();
const { MongoClient} = require('mongodb');
const { ObjectId } = require('mongodb');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


let db;
const url = 'mongodb+srv://admin:qqqq1111@cluster0.nzbpycy.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum');

  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중');
  })

}).catch((err) => {
  console.log(err);
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/news', (req, res) => {
    res.send('오늘은 비가와요');
})

app.get('/time', (req, res) => {
  res.render('time.ejs', { time : new Date() });
})

// await은 다음줄이 실행되기 전에 기다리라는 명령
// await을 쓰지않는다면 아래코드의 첫번째줄이 실행 다 되기도 전에
// 밑의 코드들이 실행되려고 할것임.
// response 응답은 코드내에서 1번만 가능.
app.get('/list', async(req, res) => {
  let result = await db.collection('post').find().toArray();
  res.render('list.ejs', { posts : result});
})

app.get('/write', (req, res) => {
res.render('write.ejs');
})

// write.ejs안의 form태그에서 action='/add'로 받아와 post를 날림
// post는 req로 받는다
app.post('/add', async (req, res)=>{
  try {
    if(req.body.title == '') {
      res.send('제목입력안함');
    } else {
      await db.collection('post').insertOne({ title : req.body.title, content : req.body.content });
      res.redirect('/list');
    }
  } catch(e) {
    // console.log()로 변수e를 출력하면 어떤 에러가 나는지 파악가능
    console.log(e);
    res.status(500).send('server error');
  }
})

app.get('/detail/:id', async (req, res) => {
  // findOne으로 post콜렉션에 있는 id를 참조하여 req.params.id와 동일한 콜렉션 행의 데이터(게시글타이틀, 내용)를 result에 저장시켜줌
  let result = await db.collection('post').findOne({ _id : new ObjectId(req.params.id) });

  // 저장한 result값을 detail.ejs에 보내줌
  res.render('detail.ejs', { result : result });
})