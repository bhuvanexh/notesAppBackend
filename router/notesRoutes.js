import express from 'express'
import { createNote, deleteNote, getNote, getUserNotes, updateNote } from '../controllers/util.js'
import { requireAuth } from './usersRoutes.js'


const router = express.Router()


router.route('/').get(requireAuth, getUserNotes).post(requireAuth, createNote)
router.route('/:id').get(requireAuth, getNote).patch(requireAuth, updateNote).delete(requireAuth, deleteNote)


export default router