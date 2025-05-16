var express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 3000
const bodyParser = require('body-parser')
const { register } = require('./controllers/register-controller')
const { login } = require('./controllers/login-controller')
const { profile } = require('./controllers/user-controller')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.post('/register', register)
app.get('/login', login)
app.get('/user/profile', profile)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});