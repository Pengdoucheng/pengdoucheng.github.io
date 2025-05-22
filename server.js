// server.js（支援 Node.js v18，無需額外 fetch 套件）

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 允許接收 JSON
app.use(express.json());

// 提供 public 資料夾內的 HTML、CSS、JS 等靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

// AI 分析 API 路由
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
    console.error('AI 分析失敗:', error);
    res.status(500).json({ error: '伺服器錯誤，請稍後再試。' });
  }
});

const fs = require('fs');

const toolPath = path.join(__dirname, 'public', 'tool.html');
fs.existsSync(toolPath)
  ? console.log('✅ tool.html 存在於 public/')
  : console.log('❌ 找不到 tool.html，請確認位置與名稱');


// 啟動伺服器
app.listen(PORT, () => {
  console.log(`✅ 後端伺服器已啟動：http://localhost:${PORT}`);
});
