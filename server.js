require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // ✅ 兼容 fetch

const app = express();
const PORT = process.env.PORT || 3000;

console.log("✅ 使用的 API 金鑰是：", process.env.OPENAI_API_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔁 API 分析路由
app.post('/api/analyze', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log("🟡 收到前端傳來的 prompt：", prompt); 

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: '你是一位專業時間規劃教練。' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log("🧠 OpenAI 回傳資料：", JSON.stringify(data, null, 2));
    const reply = data.choices?.[0]?.message?.content;
    res.json({ reply });

  } catch (error) {
    console.error('❌ AI 分析失敗:', error);
    res.status(500).json({ error: '伺服器錯誤，請稍後再試。' });
  }
});

// ✅ tool.html 是否存在提示
const toolPath = path.join(__dirname, 'public', 'tool.html');
fs.existsSync(toolPath)
  ? console.log('✅ tool.html 存在於 public/')
  : console.log('❌ 找不到 tool.html，請確認位置與名稱');

app.listen(PORT, () => {
  console.log(`✅ 後端伺服器已啟動：http://localhost:${PORT}`);
});
