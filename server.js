const express = require('express')
const path = require('path')
const fs = require('uuid')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(express.static('public'))

const dbFilePath = path.join(__dirname, 'db', 'db.json')

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','notes.html'))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes data.' })
        }
    res.json(JSON.parse(data))    
    })
})

app.post('/api/notes', (req, res) => {
    const newNote = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text,
    }
    
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'failed to read notes data.'})
        }
        const notes = JSON.parse(data)
        notes.push(newNote)
    
     fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), (err) => {
     if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save new note'})
     }
     res.json(newNote);    
    })
  })    
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})