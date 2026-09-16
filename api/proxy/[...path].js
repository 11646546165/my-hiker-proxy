export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vercel 全捕获路由的参数提取
  const pathArray = req.query.path || [];
  if (pathArray.length < 2 || pathArray[0] !== 'httpproxy') {
    return res.status(400).send('代理路径格式错误。正确格式: /api/proxy/httpproxy/目标域名/路径');
  }

  const targetDomain = pathArray[1];
  const targetPath = pathArray.slice(2).join('/');
  const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const targetUrl = `http://${targetDomain}/${targetPath}${queryString}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    res.status(response.status).send(buffer);
  } catch (error) {
    res.status(500).send('代理请求失败: ' + error.message);
  }
}
