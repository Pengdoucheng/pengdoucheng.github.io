// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 前端 HTML 請放在 public 資料夾

app.post('/api/analyze', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: '你是一位專業時間規劃教練。' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('分析失敗:', error);
    res.status(500).json({ error: '伺服器錯誤，請稍後再試。' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 後端伺服器已啟動：http://localhost:${PORT}`);
});
