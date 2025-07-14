const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.post('/generate', async (req, res) => {
  if (!req.files || !req.files.images) {
    return res.status(400).json({ error: 'No images uploaded' });
  }

  const images = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images];

  try {
    // ✅ Ensure the uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const uploadedPaths = [];

    for (const img of images) {
      const uploadPath = path.join(uploadsDir, img.name);
      await img.mv(uploadPath);
      uploadedPaths.push(uploadPath);
    }
    const pythonPath = 'C:/Python313/python.exe';
    const pythonScript = path.join(__dirname, '../../ai-services/descriptiongen.py');
    const command = `"${pythonPath}" "${pythonScript}" ${uploadedPaths.join(' ')}`; 

    exec(command, (err, stdout, stderr) => {
      // Clean up
      for (const filePath of uploadedPaths) {
        fs.unlink(filePath, () => {});
      }

      if (err) {
        console.error("Python Error:", stderr);
        return res.status(500).json({ error: 'Failed to run AI script', details: stderr });
      }

      try {
        const output = JSON.parse(stdout);
        res.json(output);
      } catch (parseErr) {
        res.status(500).json({ error: 'Failed to parse AI output', details: parseErr.toString() });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error during file handling', details: err.toString() });
  }
});

module.exports = router;
