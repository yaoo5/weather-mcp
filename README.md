# weather-mcp
使用高德接口搭建的天气MCP。

## 使用 

1. 获取API_KEY = 👉 https://console.amap.com/dev/key/app （免费）

2. MCP配置（注意：不同的ide或客户端配置方式有所不同）
```shell
# stdio模式
node ./build/index.js --stdio API_KEY=<YOUR_API_KEY>

# sse模式
node ./build/index.js API_KEY=<YOUR_API_KEY>
```

## 高德天气接口
👉 https://lbs.amap.com/api/webservice/guide/api-advanced/weatherinfo)


## 推荐阅读
- [官网 - Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)
- [Github - modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
