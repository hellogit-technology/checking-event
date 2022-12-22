import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import compression from 'compression';
import path from 'path';
import flash from 'connect-flash'
import minifyHTML from 'express-minify-html-terser';
import passport from 'passport';
import fs from 'fs-extra';
import { googlePassport } from './config/passport';
import { redirectHTTPS } from './middleware/forceHTTPS';
import dotenv from 'dotenv';
dotenv.config();

declare module 'express-session' {
  interface SessionData {
    eventName: string;
    studentName: string;
    showInfo: string;
    poster: string
    redirectUrl: string | null;
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


// Force using https (only for deployment)
app.use(redirectHTTPS);

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

// Use proxy for express server
app.set('trust proxy', true);

// Session
app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 60000 * 60, //? Session expire in 1 hours
      httpOnly: true,
      sameSite: 'lax'
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

// Flash
app.use(flash());

// Passport
googlePassport(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Route Init
route(app);

// Connect db
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
