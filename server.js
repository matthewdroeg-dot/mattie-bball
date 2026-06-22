const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const TL_KEY = process.env.TL_KEY || 'tlk_3SSYBJ92DPEJVW2M4C1E71RP6MXG';
const TL_INDEX = process.env.TL_INDEX || '6a399e56e1f6dd2f3c3fb0d5';
const SS_KEY = process.env.SS_KEY || 'DLRmcddTqC6tHUXqHsnDFax9u4m2v3tnBoZ1YOyB';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', player: 'Mattie Droeg #34' });
});

app.post('/api/tl/upload', upload.single('video_file'), async (req, res) => {
  try {
    const fd = new FormData();
    fd.append('index_id', TL_INDEX);
    fd.append('language', 'en');
    fd.append('video_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    const r = await fetch('https://api.twelvelabs.io/v1.2/tasks', {
      method: 'POST',
      headers: { 'x-api-key': TL_KEY, ...fd.getHeaders() },
      body: fd,
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error('TL upload error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/tl/search', async (req, res) => {
  try {
    const r = await fetch('https://api.twelvelabs.io/v1.2/search', {
      method: 'POST',
      headers: { 'x-api-key': TL_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ index_id: TL_INDEX, ...req.body }),
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error('TL search error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/tl/task/:id', async (req, res) => {
  try {
    const r = await fetch(`https://api.twelvelabs.io/v1.2/tasks/${req.params.id}`, {
      headers: { 'x-api-key': TL_KEY },
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ss/render', async (req, res) => {
  try {
    console.log('Shotstack render request received');
    const payload = JSON.stringify(req.body);
    console.log('Payload size:', payload.length, 'bytes');

    const r = await fetch('https://api.shotstack.io/stage/render', {
      method: 'POST',
      headers: {
        'x-api-key': SS_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      body: payload,
    });

    console.log('Shotstack response status:', r.status);
    const text = await r.text();
    console.log('Shotstack response:', text.slice(0, 500));

    try {
      res.json(JSON.parse(text));
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON from Shotstack', raw: text.slice(0, 500) });
    }
  } catch (e) {
    console.error('Shotstack render error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/ss/render/:id', async (req, res) => {
  try {
    const r = await fetch(`https://api.shotstack.io/stage/render/${req.params.id}`, {
      headers: { 'x-api-key': SS_KEY },
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mattie Bball server running on port ${PORT}`));
