require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const path = require('path');

const blogsRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');
const commentsRouter = require('./routes/commentRoutes');
const loginRoutes = require('./frontendRoutes/loginRoutes');
const homeRoutes = require('./frontendRoutes/homeRoutes');
const profileRoutes = require('./frontendRoutes/profileRoutes');
//Connect to Database

const connectDB = require('./config/db');
connectDB();

const app = express();
//Middleware

app.use(cookieParser());
app.use((req, res, next) => {
    console.log('Cookies:', req.cookies); // Log all cookies to verify
    next();
});

app.use(cors({
    origin:'http://localhost:5000',
    credentials:true,
    // allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret:'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/blog-platform' }),
    cookie: { secure:process.env.NODE_ENV==='production',httpOnly:true,sameSite:'lax' } // Set to true in production
}));

// app.get('/test-cookie', (req, res) => {
//     res.cookie('test', 'cookie_value', { path: '/', httpOnly: true });
//     res.json({ message: 'Cookie set' });
// });

// app.get('/check-cookie', (req, res) => {
//     res.json({ cookies: req.cookies });
// });
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

//Routes
app.use('/api/blogs',blogsRouter);
app.use('/api/users',userRouter);
app.use('/api/comments',commentsRouter);

//Frontend Routes
app.use('/',homeRoutes);
app.use('/',loginRoutes);
app.use('/',profileRoutes);

const PORT=process.env.PORT||5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT} `));
