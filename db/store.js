const util = require('util');
const fs = require('fs');
const { v1: uuidv1 } = require('uuid');


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    constructor() { 
        this.filePath = './db/db.json';
    }

    async read() {
        try {
            const notes = await readFileAsync(this.filePath, 'utf8');
            return JSON.parse(notes) || [];
        } catch (err) {
            console.log(err);
            return [];
        } 
    }

    async write(notes) {
        try {
          console.log('Writing notes:', JSON.stringify(notes, null, 2));
          await writeFileAsync(this.filePath, JSON.stringify(notes, null, 2));
        } catch (err) {
          console.error('Error writing file:', err);
          throw new Error('Error writing to file');
        }
      }

    async getNotes() {
        try {
            return await this.read();
        } catch (err) {
            console.log(err);
            throw new Error('Error getting notes');
        }
    }

    async addNote (note) {
        const { title, text } = note;

        if (!title || !text) {
            throw new Error('Note title and text cannot be blank');
        }

        const newNote = { id: uuidv1(), title, text };

        try {
            const notes = await this.getNotes();
            const updatedNotes = [...notes, newNote];
            console.log('Updated notes:', updatedNotes);
            await this.write(updatedNotes);
            console.log('New note added:', newNote);
            return newNote;
        } catch (err) {
            console.log(err);
            throw new Error('Error adding note');
        }
    }

    async removeNote (id) {
        try {
            const notes = await this.getNotes();
            const filteredNotes = notes.filter(note => note.id !== id);
            await this.write(filteredNotes);
        } catch (err) {
            console.log(err);
            throw new Error('Error removing note');
        }
    }
}

module.exports = new Store();