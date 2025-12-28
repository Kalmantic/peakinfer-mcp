# PeakInfer MCP Server

Model Context Protocol (MCP) server for PeakInfer LLM inference analysis. Use with Claude Desktop or Claude Code for AI-assisted code analysis.

## Features

- **Runtime Connectors**: Fetch events from Helicone and LangSmith
- **Benchmark Comparison**: Compare metrics to InferenceMAX benchmarks
- **Template Library**: Access 43 optimization templates
- **Analysis History**: Save and compare analysis runs

## Installation

### Claude Desktop

Add to `~/.config/claude/claude_desktop_config.json` (macOS) or `%APPDATA%\claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "peakinfer": {
      "command": "node",
      "args": ["/path/to/peakinfer/packages/mcp-server/dist/index.js"],
      "env": {
        "HELICONE_API_KEY": "your-key-here",
        "LANGSMITH_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Build from Source

```bash
cd peakinfer/packages/mcp-server
npm install
npm run build
```

## Available Tools

### Runtime Data

| Tool | Description |
|------|-------------|
| `get_helicone_events` | Fetch LLM events from Helicone |
| `get_langsmith_traces` | Fetch traces from LangSmith |

### Benchmarks

| Tool | Description |
|------|-------------|
| `get_inferencemax_benchmark` | Get benchmark data for a model |
| `compare_to_baseline` | Compare current analysis to historical baseline |

### Templates

| Tool | Description |
|------|-------------|
| `list_templates` | List available optimization templates |
| `get_template` | Get details of a specific template |

### Analysis

| Tool | Description |
|------|-------------|
| `save_analysis` | Save analysis results to history |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `HELICONE_API_KEY` | API key for Helicone integration |
| `LANGSMITH_API_KEY` | API key for LangSmith integration |

## Example Usage

In Claude Desktop or Claude Code:

```
Fetch the last 7 days of events from Helicone and compare them to benchmarks.
```

```
Get the benchmark data for gpt-4o and show me optimization opportunities.
```

```
List available templates for cost optimization.
```

## Resources

The server also exposes MCP resources:

- `peakinfer://templates` - List of all optimization templates
- `peakinfer://benchmarks` - InferenceMAX benchmark data
- `peakinfer://history` - Analysis run history

## Prompts

Available prompt templates:

- `analyze-file` - Analyze a file for LLM inference points
- `compare-benchmarks` - Compare metrics to benchmarks
- `suggest-optimizations` - Get optimization recommendations

## Troubleshooting

### Server not appearing in Claude Desktop

1. Check the path to `dist/index.js` is absolute
2. Verify `npm run build` completed successfully
3. Restart Claude Desktop after config changes

### API key errors

1. Verify API keys are set in config `env` section
2. Check keys are valid at provider's dashboard
3. Ensure no trailing whitespace in key values

## License

Apache-2.0 - See main PeakInfer repository
