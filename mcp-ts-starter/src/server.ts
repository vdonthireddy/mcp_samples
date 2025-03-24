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
  server.resource("hello", "hello://world", async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: "Hello, World from the resource!",
      },
    ],
  }));

  // Add a dynamic resource with parameters
  server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
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
    "helpful-assistant",
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
    "echo",
    "Echoes back a message with 'Hello' prefix",
    { message: z.string().describe("The message to echo") },
    async ({ message }) => ({
      content: [
        {
          type: "text",
          text: `Hello ${message}`,
        },
      ],
    })
  );


  // Add a calculator tool
  server.tool(
    "calculator",
    "Performs basic arithmetic operations",
    {
      operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The arithmetic operation to perform"),
      num1: z.number().describe("The first number"),
      num2: z.number().describe("The second number"),
    },
    async ({ operation, num1, num2 }) => {
      let result;
      switch (operation) {
        case "add":
          result = num1 + num2;
          break;
        case "subtract":
          result = num1 - num2;
          break;
        case "multiply":
          result = num1 * num2;
          break;
        case "divide":
          if (num2 === 0) {
            throw new Error("Division by zero is not allowed");
          }
          result = num1 / num2;
          break;
      }
      return {
        content: [
          {
            type: "text",
            text: `The result of ${operation} ${num1} and ${num2} is ${result}`,
          },
        ],
      };
    }
  );


  return server;
}
