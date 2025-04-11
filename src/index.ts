import yargs from "yargs/yargs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "HyperwareMCP",
  version: "0.1.0",
});
const args = yargs(process.argv.slice(2))
  .options({
    p: { type: "number" },
    u: { alias: "url", type: "string" },
  })
  .parseSync();
const SERVER_PATH = "/indexer:hpn:sortugdev.os/api/mcp";
const DEFAULT_URL = "http://localhost";
const DEFAULT_PORT = 8080;
const url =
  args.u && args.p
    ? `${args.u}:${args.p}`
    : args.u && !args.p
      ? `${args.u}`
      : !args.u && args.p
        ? `${DEFAULT_URL}:${args.p}`
        : `${DEFAULT_URL}:${DEFAULT_PORT}`;
server.tool("search-registry", { query: z.string() }, async ({ query }) => {
  const body = { SearchRegistry: query };
  try {
    const res = await fetch(url + SERVER_PATH, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const resBody = await res.text();
    return { content: [{ type: "text", text: String(resBody) }] };
  } catch (e) {
    return {
      content: [{ type: "text", text: String(`{"error": "Request Failed"}`) }],
    };
  }
});
server.tool(
  "call-provider",
  {
    providerId: z.string(),
    providerName: z.string(),
    callArgs: z.record(z.string(), z.any()),
  },
  async ({ providerId, providerName, callArgs }) => {
    const body = {
      CallProvider: { providerId, providerName, arguments: callArgs },
    };
    try {
      const res = await fetch(url + SERVER_PATH, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const resBody = await res.text();
      return { content: [{ type: "text", text: String(resBody) }] };
    } catch (e) {
      return {
        content: [
          { type: "text", text: String(`{"error": "Request Failed"}`) },
        ],
      };
    }
  },
);

// // Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
