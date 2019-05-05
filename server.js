const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const port = 3000;
var app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(express.static(__dirname));


const user = require('./controllers/userController');
const todo = require('./controllers/todoController');

app.use('/todo',todo);
app.use('/user',user);

app.get('/',function(req,res){
  res.send('Hello from server')
})

app.listen(port,()=>{
  console.log(`Started on port ${port}`);
});
