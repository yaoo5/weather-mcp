import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getWeatherByCity } from "./weather.ts";

// 创建一个MCP Server
export function createMcpServer() {
    const mcpServer = new McpServer({
        "name": "Weather MCP Server",
        "version": "1.0.0",
    });

    mcpServer.registerTool(
        "get_weather_by_city", {
            title: "Get Weather by City",
            description: "Get the weather for a location",
            inputSchema: {
                city: z.string().describe("The city name"),
            },
            outputSchema: {
                weather: z.string()
            },
        }, async ({ city }) => {
            console.log(city);
            const weather = await getWeatherByCity(city);
            const output = { weather: `今天天气${weather}。` }

            return {
                content: [{ type: "text", text: JSON.stringify(output) }],
                structuredContent: output
            }
        }
    );

    return mcpServer;
}
