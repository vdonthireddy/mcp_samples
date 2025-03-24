import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Creates and configures a Hello World MCP server
 * with one resource, one prompt, and one tool
 */
export function createServer() {
  // Create an MCP server
  const server = new McpServer({
    name: "hello-world",
    version: "1.0.0",
  });

  // Add a static resource
  server.resource("hello2", "hello://world", async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: "Hello, World from the resource!",
      },
    ],
  }));

  // Add a dynamic resource with parameters
  server.resource(
    "greeting2",
    new ResourceTemplate("greeting2://{name}", { list: undefined }),
    async (uri, { name }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Hello, ${name} from the resource!`,
        },
      ],
    })
  );

  // Add a prompt
  server.prompt(
    "helpful-assistant2",
    "A helpful assistant prompt", // Add description as second parameter
    () => ({
      messages: [
        {
          role: "assistant", 
          content: {
            type: "text",
            text: "You are a helpful assistant.",
          },
        },
      ],
    })
  );

  // Add an echo tool
  server.tool(
    "ping",
    "Returns pong when received a ping",
    { message: z.string().describe("The message to ping") },
    async ({ message }) => ({
      content: [
        {
          type: "text",
          text: `pong`,
        },
      ],
    })
  );


  // Add a calculator tool
  server.tool(
    "even-or-odd",
    "Returns if the input number is an even or odd number",
    {
      num: z.number().describe("The first number"),
    },
    async ({ num }) => {
      let result;
      if (num % 2 === 0) {
        result = "even";
      } else {
        result = "odd";
      }
      return {
        content: [
          {
            type: "text",
            text: `The result of ${num} is ${result}`,
          },
        ],
      };
    }
  );


  return server;
}
