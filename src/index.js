import minimist from "minimist;";
import { McpServer, ResourceTemplate, } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// Create an MCP server
const server = new McpServer({
    name: "Demo",
    version: "1.0.0",
});
const args = minimist(process.argv.slice(2), {
    alias: { p: "port", url: "url" },
    default: { port: 8080 },
});
console.log({ args });
// server
//   .tool("search-registry", { query: z.string() }, async ({ query }) => {
//     const url = args.url ===
//     const res = await fetch(url)
//     const data = "";
//     return { content: [{ type: "text", text: String(data) }] };
//   });
// // Start receiving messages on stdin and sending messages on stdout
// const transport = new StdioServerTransport();
// await server.connect(transport);
