import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { json } from 'body-parser';
// Routes
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
// Worker
import './worker/emailWorker';
import { startRedisServer } from './config/initRedis';

dotenv.config();

const app = express();
app.set('trust proxy', 1); // Required for Render/Heroku
const PORT = process.env.PORT || 5000;

// Start Redis and then App
startRedisServer().then(() => {
    // We can't easily wait for this in the top-level exports of other files, 
    // but configuring the server here ensures the process is ready.
});

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(json());

// Session config
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod' || !!process.env.RENDER,
        sameSite: (process.env.NODE_ENV === 'production' || !!process.env.RENDER) ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Email Scheduler API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
