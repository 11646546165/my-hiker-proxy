export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 获取完整的请求路径
  let targetUrl = req.url;
  const prefix = '/api/proxy/httpproxy/';

  // 检查路径并提取真实目标地址
  if (targetUrl.indexOf(prefix) === 0) {
    targetUrl = 'http://' + targetUrl.substring(prefix.length);
  } else {
    return res.status(400).send('代理路径格式错误，请使用 /api/proxy/httpproxy/目标域名/路径');
  }

  try {
    // 向目标地址发起请求，伪装成正常浏览器，绕过部分拦截
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });

    // 获取返回内容
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 复制原站的内容类型
    const contentType = response.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    
    // 发送数据回海阔视界
    res.status(response.status).send(buffer);
  } catch (error) {
    res.status(500).send('代理请求失败: ' + error.message);
  }
}
