import express from 'express'
import passport from 'passport';
import { createUser } from '../controllers/userClass.js'
import { User } from '../models/userModel.js';


const router = express.Router()

export const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('request in require auth');
        return res.status(401).json({
            msg: 'acess deniedd'
        })
    } else {
        next()
    }
}

router.post('/register', async (req, res) => {
    try {
        const { email, username } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: `${existingUser.email === email ? 'Email' : 'Username'} is already in use` });
        }

        let response = await createUser(req.body)
        if (response.errMsg) {
            return res.status(401).json({
                timestamp: Date.now(),
                msg: response.errMsg,
            })
        }
        let response2 = await User.create(response)
        res.status(200).json({
            user: response2,
        })
    } catch (error) {
        console.log(error, 'error');
        return res.status(500).json({
            timestamp: Date.now(),
            msg: 'internal server error',
            error: error
        })
    }
})


router.post('/login', (req, res, next) => {
    console.log('1 login handler');
    passport.authenticate('local', (err, user) => {
        console.log('3 passport authenticate cb', err, user);

        if (err) {
            return res.status(401).json({
                timestamp: Date.now(),
                msg: 'Access denied (some error occurred)'
            });
        }
        if (!user) {
            // 
            return res.status(401).json({
                timestamp: Date.now(),
                msg: 'username or password incorrect'
            })
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                user: user
            });
        });
    })(req, res, next)
})

router.get('/user', requireAuth, async (req, res) => {
    try {
        console.log('request');
        const user = await User.findOne({ id: req.user?.id })

        if (!user) {
            return res.status(404).json({
                msg: 'user not found'
            })
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email
        })
    } catch (error) {
        console.log(error);
        req.status(500).json({
            msg: 'failed to get user, server error'
        })
    }
})

router.post('/logout', async (req, res) => {
    try {
        req.logOut()

        res.status(200).json({
            msg: 'Logout successful'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


export default router