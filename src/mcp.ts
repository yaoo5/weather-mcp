import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getWeatherByCity } from "./services/weather";

// 创建一个MCP Server
export function createMcpServer() {
    const mcpServer = new McpServer({
        "name": "Weather MCP Server",
        "version": "1.0.0",
    });

    mcpServer.registerTool(
        "get_weather_by_city", {
            title: "Get Weather by City",
            description: "Get the weather for a city",
            inputSchema: {
                city: z.string().describe("The city name"),
            },
            outputSchema: {
                weather: z.string()
            },
        }, async ({ city }) => {
            console.log(`get_weather_by_city tool, city=${city}`);
            const weather = await getWeatherByCity(city);
            console.log(`weather=${weather}`);
            const output = { weather: `${weather}。` }

            return {
                content: [{ type: "text", text: JSON.stringify(output) }],
                structuredContent: output
            }
        }
    );

    return mcpServer;
}
