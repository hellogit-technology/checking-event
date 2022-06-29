import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import compression from 'compression';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

import {sessionStore} from './config/sessionStore'
import route from './routes'
import {connectDB} from './config/mongodb'

const app = express();
const port = process.env.PORT || 8080;

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Secure
app.use(helmet());

// Session
// app.use(
//   session({
//     name: 'access-token',
//     secret: process.env.SECRET_KEY || uuidv4(),
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: true,
//       maxAge: 60000 * 60 //? Session expire in 1 hours
//     },
//     store: sessionStore
//   })
// );

// Gzip
app.use(
  compression({
    level: 6,
    threshold: 10 * 1000,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      } else {
        return compression.filter(req, res);
      }
    }
  })
);

// Public
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template Engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Route Init
route(app);

// Connect db
// connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
