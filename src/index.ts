#!/usr/bin/env node
/**
 * PeakInfer MCP Server
 *
 * Model Context Protocol server for Claude Desktop and Claude Code.
 * Provides tools for LLM inference analysis and optimization.
 *
 * Usage:
 *   npx @peakinfer/mcp
 *
 * Claude Desktop config (~/.config/claude/claude_desktop_config.json):
 * {
 *   "mcpServers": {
 *     "peakinfer": {
 *       "command": "npx",
 *       "args": ["@peakinfer/mcp"]
 *     }
 *   }
 * }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { registerTools, handleToolCall, getToolsList } from './tools/index.js';
import { registerResources, handleResourceRead, getResourcesList } from './resources/index.js';
import { registerPrompts, handlePromptGet, getPromptsList } from './prompts/index.js';

const SERVER_NAME = 'peakinfer';
const SERVER_VERSION = '1.0.0';

async function main() {
  const server = new Server(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // Register all components
  registerTools(server);
  registerResources(server);
  registerPrompts(server);

  // List Tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: getToolsList(),
    };
  });

  // Call Tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handleToolCall(name, args || {});
  });

  // List Resources handler
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: getResourcesList(),
    };
  });

  // Read Resource handler
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    return handleResourceRead(uri);
  });

  // List Prompts handler
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: getPromptsList(),
    };
  });

  // Get Prompt handler
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handlePromptGet(name, args || {});
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log startup (to stderr so it doesn't interfere with stdio transport)
  console.error(`PeakInfer MCP Server v${SERVER_VERSION} started`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
