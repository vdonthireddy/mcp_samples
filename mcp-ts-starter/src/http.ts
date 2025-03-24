#!/usr/bin/env node

import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createServer } from "./server.js";

async function main() {
  // Create the server
  const server = createServer();
  
  // Create Express app
  const app = express();
  const port = process.env.PORT || 3000;
  
  // Server-side connections
  const connections = new Map();
  
  // Handle SSE connections
  app.get("/sse", async (req, res) => {
    // Set SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    });
    
    // Generate a unique connection ID
    const connectionId = Date.now().toString();
    
    // Create a new SSE transport
    const transport = new SSEServerTransport("/messages", res);
    connections.set(connectionId, transport);
    
    // Connect the server to this transport
    await server.connect(transport);
    
    // Handle client disconnect
    req.on("close", () => {
      connections.delete(connectionId);
      console.error(`Client ${connectionId} disconnected`);
    });
  });
  
  // Handle messages from client
  app.post("/messages", express.json(), async (req, res) => {
    // This would need more logic to route to the right connection in a multi-client scenario
    // For demo purposes, we'll just use the first available connection
    if (connections.size === 0) {
      return res.status(400).json({ error: "No active connections" });
    }
    
    const transport = connections.values().next().value;
    await transport.handlePostMessage(req, res);
  });
  
  // Start the server
  app.listen(port, () => {
    console.error(`Hello World MCP Server running on http://localhost:${port}`);
    console.error(`- Connect to /sse for server-sent events`);
    console.error(`- Send messages to /messages endpoint`);
  });
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});