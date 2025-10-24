import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createMcpServer } from "./mcp.ts";
import express from "express";

const transports = {
    streamable: {} as Record<string, StreamableHTTPServerTransport>,
    sse: {} as Record<string, SSEServerTransport>
};

export async function startServer() {
    const mcpServer = createMcpServer();
    // mcp有两种模式：stdio模式和streamable-http模式
    const isStdioMode = process.argv.includes("--stdio");

    console.log(`weather-mcp start, mode=${isStdioMode?'stdio':"streamable-http"}`)
    // 如果是stdio模式
    if (isStdioMode) {
        console.log(`🐬 weather-mcp start, stdio mode`);
        // step 2: 启动stdio模式的mcp server
        const stdioServerTransport = new StdioServerTransport();
        await mcpServer.connect(stdioServerTransport);
    // 如果是 StreamableHTTPServer 模式
    } else {
        console.log(`🐬 weather-mcp start, streamable-http mode`);
        const app = express();

        // Parse JSON requests for the Streamable HTTP endpoint only, will break SSE endpoint
        app.use("/mcp", express.json());
        app.post('/mcp', async (req, res) => {
            const transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: undefined
            });
            await mcpServer.connect(transport);
        });

        // Legacy SSE endpoint for older clients
        app.get('/sse', async (req, res) => {
            // Create SSE transport for legacy clients
            const transport = new SSEServerTransport('/messages', res);
            transports.sse[transport.sessionId] = transport;

            res.on('close', () => {
                delete transports.sse[transport.sessionId];
            });

            await mcpServer.connect(transport);
        });

        // Legacy message endpoint for older clients
        app.post('/messages', async (req, res) => {
            console.log(`[${new Date().toISOString()}]post /messages }`)
            const sessionId = req.query.sessionId as string;
            const transport = transports.sse[sessionId];
            if (transport) {
                await transport.handlePostMessage(req, res, req.body);
            } else {
                res.status(400).send('No transport found for sessionId');
            }
        });

        app.listen(3000, () => {
            console.log('Streamable HTTP server is running on port 3000');
        });
    } 
}

startServer().then(res => {
    console.warn(`weather-mcp start...`)
})