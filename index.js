const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/oauth');
const projectQuickBookRoutes = require('./routes/project');

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'project.html'));
});

app.use('/api/auth', authRoutes);

app.use('/api/quickbook/project', projectQuickBookRoutes);

app.listen(PORT, () => {
    console.log('server up on PORT ', PORT);
});