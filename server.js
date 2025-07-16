const fs = require('fs');
const path = require('path');
const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors({
    origin: '*'
}));

app.get('/audio-file-exists', (req, res) => {
  const filePath = "static/audio_file.mp3";

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json({ exists: false });
      }
      return res.status(500).json({ error: 'Error checking file' });
    }
    res.json({ exists: true });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});