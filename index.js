import mongoose from 'mongoose'
import notesRoutes from './router/notesRoutes.js'
import usersRoutes from './router/usersRoutes.js'
import cors from "cors"
import express from 'express'
import passport from 'passport'
import passport_local from 'passport-local'
import bcrypt from "bcrypt"
import cookieSession from 'cookie-session'
import { User } from './models/userModel.js'
import dotenv from 'dotenv';
dotenv.config();

const LocalStrategy = passport_local.Strategy

const app = express()
const PORT = process.env.PORT || 5000;


app.use(cookieSession({
    name: 'notes-auth',
    keys: ['secret-new', 'secret-old'],
    maxAge: 60 * 60 * 24 * 7
}))

app.use(
    cors({
        // origin: `${process.env.originURL}`,
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())



passport.serializeUser((user, done) => {
    console.log(`4 serialize user ${JSON.stringify(user.id)}`);
    return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    console.log(`5 deserializing user ${id}`);
    try {
        const user = await User.findOne({ id: id });
        if (user) {
            return done(null, { id: user.id, email: user.email });
        } else {
            return done(new Error('No user with this id is found'));
        }
    } catch (error) {
        return done(error);
    }
});


passport.use('local', new LocalStrategy({ passReqToCallback: true },
    async (req, username, password, done) => {
        console.log('2 local strategy verify', username, password);
        try {
            let res = await User.findOne({ $or: [{ email: username }, { username: username }] })
            if (!res) {
                console.log('no user found');
                return done(null, false)
            }

            async function passwordCompare(enteredPassword, realPassword) {
                let result = await bcrypt.compare(enteredPassword, realPassword)
                return result
            }

            let result = await passwordCompare(password, res.passwordHash)
            if (!result) {
                return done(null, false)
            }
            return done(null, { id: res.id, username: res.username })
        } catch (error) {
            return done(error);
        }
    }
))


app.use('/notes', notesRoutes)
app.use('/users', usersRoutes)


app.get('/', (req, res) => {
    res.json({ body: 'hello' })
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('mongo connected');
        app.listen(PORT, () => {
            console.log('listening on port 5000')
        })
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

start()