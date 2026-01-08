# PeakInfer MCP Server - Project Overview

This is the **peakinfer-mcp** (Model Context Protocol Server) repository.

## Key Information

- **Type:** MCP Server for Claude Desktop / Claude Code
- **Protocol:** Model Context Protocol (MCP)
- **Usage:** AI-assisted LLM inference analysis

---

## Architecture

### What This Server Provides

**Tools (7):**
| Tool | Description |
|------|-------------|
| `get_helicone_events` | Fetch runtime events from Helicone |
| `get_langfuse_traces` | Fetch traces from Langfuse |
| `get_inferencemax_benchmark` | Get benchmark data for a model |
| `compare_to_baseline` | Compare analysis to historical baseline |
| `list_templates` | List available optimization templates |
| `get_template` | Get details of a specific template |
| `save_analysis` | Save analysis results to history |

**Resources (3):**
- `peakinfer://templates` - List of optimization templates
- `peakinfer://benchmarks` - InferenceMAX benchmark data
- `peakinfer://history` - Analysis run history

**Prompts (3):**
- `analyze-file` - Analyze a file for LLM inference points
- `compare-benchmarks` - Compare metrics to benchmarks
- `suggest-optimizations` - Get optimization recommendations

---

## Installation

### Claude Desktop

Add to `~/.config/claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "peakinfer": {
      "command": "node",
      "args": ["/path/to/peakinfer-mcp/dist/index.js"],
      "env": {
        "HELICONE_API_KEY": "your-key-here",
        "LANGFUSE_PUBLIC_KEY": "your-public-key-here",
        "LANGFUSE_SECRET_KEY": "your-secret-key-here"
      }
    }
  }
}
```

### Build

```bash
cd peakinfer-mcp
npm install
npm run build
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Server entry, stdio transport |
| `src/tools/index.ts` | Tool implementations |
| `src/resources/index.ts` | Resource handlers |
| `src/prompts/index.ts` | Prompt templates |
| `src/connectors/` | Helicone, Langfuse connectors |
| `src/benchmarks/` | InferenceMAX data |
| `data/inferencemax.json` | Benchmark data (15 models) |

---

## Error Handling

Error codes returned by tools:

| Code | Description |
|------|-------------|
| `ERR_MISSING_API_KEY` | API key not configured |
| `ERR_NETWORK` | Network/connection error |
| `ERR_RATE_LIMITED` | Rate limit exceeded |
| `ERR_NOT_FOUND` | Resource not found |
| `ERR_INVALID_INPUT` | Invalid input parameters |
| `ERR_FILE_ERROR` | File system error |
| `ERR_INTERNAL` | Internal server error |

---

## Session Memory (Last Updated: December 28, 2025)

### Current State

**v1.9.5 Status:** ✅ Complete - Separated from CLI repo

### Repository Change

**Before:** `peakinfer/packages/mcp-server/`
**After:** `peakinfer-mcp/` (standalone repo)

**Why separated:**
- MCP server is for Claude Desktop/Code, not CLI
- Users can install only what they need
- Independent versioning and releases

### Work Completed

- Bundled connectors (Helicone, Langfuse) locally
- Bundled benchmarks (InferenceMAX) locally
- Added error boundaries with specific error codes
- Fixed import paths (no CLI dependencies)

### Cross-Repo Context

| Repository | Role | Status |
|------------|------|--------|
| `peakinfer/` | CLI (BYOK) | ✅ Complete |
| `peakinfer-mcp/` (this repo) | MCP Server | ✅ Complete |
| `peakinfer-action/` | GitHub Action | ✅ Complete |
| `peakinfer-site/` | Website + API | ✅ Complete |
| `peakinfer-vscode/` | VS Code Extension | ✅ Complete |
| `peakinfer_templates/` | Templates | ✅ Complete |

### Important Context

1. **Self-contained** - No dependencies on CLI repo
2. **Bundled connectors** - Helicone, Langfuse in src/connectors/
3. **Bundled benchmarks** - InferenceMAX in data/
4. **Error boundaries** - Specific error codes for debugging

### Reference Documents

| Document | Location |
|----------|----------|
| Implementation Guide | `peakinfer/design/PeakInfer Implementation v1.9.5.md` |
| Main CLAUDE.md | `peakinfer/CLAUDE.md` |
| MCP README | `README.md` |
