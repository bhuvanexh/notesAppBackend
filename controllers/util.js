import { Note } from "../models/notesModel.js"


export async function getUserNotes(req, res) {
    try {
        console.log(req.user.id, 'user id in get notes');
        let allNotes = await Note.find({ userID: req.user.id });
        res.status(200).json({ notes: allNotes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getNote(req, res) {
    try {
        let singleNote = await Note.findOne({ _id: req.params.id, userID: req.user.id });
        if (!singleNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json(singleNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function createNote(req, res) {
    try {
        let noteTemp = req.body;
        noteTemp.userID = req.user.id;
        let response = await Note.create(noteTemp);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function updateNote(req, res) {
    try {
        const note = await Note.findOne({ _id: req.params.id, userID: req.user.id });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        Object.assign(note, req.body);
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function deleteNote(req, res) {
    try {
        let response = await Note.findOneAndDelete({ _id: req.params.id, userID: req.user.id });
        if (!response) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
