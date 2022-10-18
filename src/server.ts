import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import compression from 'compression';
import path from 'path';
import minifyHTML from 'express-minify-html-terser';
import passport from 'passport';
import fs from 'fs-extra'
import {googlePassport} from './config/passport'
import dotenv from 'dotenv';
dotenv.config();

declare module 'express-session' {
  interface SessionData {
    isLogged: boolean;
    studentId: string;
    fullname: string
    email: string
    schoolId: string
    eventIdParam: string | null | undefined
  }
}

// Checking if .env file is available
if (fs.existsSync('.env')) {
  dotenv.config();
} else {
  console.error('.env file not found.');
}

import { sessionStore } from './config/sessionStore';
import route from './routes';
import { connectDB } from './config/mongodb';
import { clearCache } from './middleware/clearCache';

const app = express();
const port = process.env.PORT || 8080;

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Caching disabled for every route
app.use(clearCache);

// Secure
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data: blob:']
    }
  })
);

// Session
app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 60000 * 60, //? Session expire in 1 hours
      httpOnly: process.env.NODE_ENV === 'production' ? true : false
    },
    store: sessionStore
  })
);

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

// Minify HTML output
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport
googlePassport(passport);

// Route Init
route(app);

// Connect db
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
