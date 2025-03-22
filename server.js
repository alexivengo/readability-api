const express = require('express');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/parse', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const response = await fetch(url);
    const html = await response.text();

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Readability server running on port ${port}`);
});