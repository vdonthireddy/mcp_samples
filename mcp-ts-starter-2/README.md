# Hello World MCP Server

A simple TypeScript implementation of a Model Context Protocol (MCP) server with resources, prompts, and tools. This starter project demonstrates MCP fundamentals and serves as a template for building more complex MCP servers.

## Features

- **Static Resource**: Provides a "Hello, World" message when called via `hello://world`
- **Dynamic Resource**: Customizable greeting that accepts a name parameter via `greeting://{name}`
- **Prompt**: Simple prompt that configures an assistant with "You are a helpful assistant"
- **Tool**: Echo tool that returns "Hello" plus your input message
- **Multiple Transport Options**: Run as either a stdio server or HTTP server with Server-Sent Events (SSE)

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Clean

```bash
npm run clean
```

## Run

### Using STDIO (for integration with Claude Desktop)

```bash
npm run start
```

### Using HTTP with SSE (for web clients)

```bash
npm run start:http
```

By default, the HTTP server runs on port 3000. You can change this by setting the `PORT` environment variable.

## Project Structure

```
.
├── scripts/        # Helper scripts
├── src/            # Source code
│   ├── http.ts     # HTTP transport implementation
│   ├── index.ts    # Main entry point 
│   ├── server.ts   # MCP server configuration
│   └── stdio.ts    # STDIO transport implementation
├── package.json    # Project dependencies and scripts
└── tsconfig.json   # TypeScript configuration
```

## Technical Details

- Built with TypeScript and the `@modelcontextprotocol/sdk` (v1.7.0+)
- Uses Zod for type validation in tools
- HTTP server implemented with Express.js
- Supports Server-Sent Events (SSE) for real-time communication

## Using the Server

You can connect to this server using any MCP client, such as Claude Desktop, or build your own client.

### Claude Desktop Configuration

To use this server with Claude Desktop, add the following to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "hello-world": {
      "command": "node",
      "args": ["<path-to-repo>/build/stdio.js"]
    }
  }
}
```

### HTTP/SSE Client Integration

When running in HTTP mode:

1. Connect to the SSE endpoint at `/sse` to establish a connection
2. Send messages to the `/messages` endpoint via POST requests
3. Receive responses through the SSE connection

Replace `<path-to-repo>` with the absolute path to this repository.