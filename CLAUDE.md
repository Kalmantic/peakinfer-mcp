# PeakInfer MCP Server - Project Overview

This is the **peakinfer-mcp** (Model Context Protocol Server) repository.

## Key Information

- **Type:** MCP Server for Claude Desktop / Claude Code
- **Protocol:** Model Context Protocol (MCP)
- **Usage:** AI-assisted LLM inference analysis

---

## Architecture

### What This Server Provides

**Tools (8):**
| Tool | Description |
|------|-------------|
| `analyze` | **Primary** - Analyze code via PeakInfer API/CLI with fallback chain |
| `get_helicone_events` | Fetch runtime events from Helicone |
| `get_langsmith_traces` | Fetch traces from LangSmith |
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
      "command": "npx",
      "args": ["-y", "@peakinfer/mcp"],
      "env": {
        "PEAKINFER_API_TOKEN": "pk_live_YOUR_TOKEN_HERE",
        "HELICONE_API_KEY": "your-key-here",
        "LANGSMITH_API_KEY": "your-key-here"
      }
    }
  }
}
```

**Environment Variables:**
| Variable | Purpose | Required |
|----------|---------|----------|
| `PEAKINFER_API_TOKEN` | PeakInfer API token (get from peakinfer.com/dashboard) | For `analyze` tool (paid) |
| `ANTHROPIC_API_KEY` | BYOK mode (free, no credits) | For `analyze` tool (free) |
| `PEAKINFER_API_URL` | Custom API URL | Testing only |
| `HELICONE_API_KEY` | Helicone runtime data | For drift detection |
| `LANGSMITH_API_KEY` | LangSmith runtime data | For drift detection |

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
| `src/connectors/peakinfer-api.ts` | PeakInfer API connector (peakinfer.com) |
| `src/connectors/peakinfer-cli.ts` | PeakInfer CLI fallback |
| `src/connectors/file-reader.ts` | Local file reader for API submission |
| `src/connectors/helicone.ts` | Helicone runtime connector |
| `src/connectors/langsmith.ts` | LangSmith runtime connector |
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

## Session Memory (Last Updated: February 23, 2026)

### Current State

**v2.0.0 Status:** `analyze` tool added - Full pipeline: Skills → MCP → PeakInfer API

### Repository Change

**Before:** `peakinfer/packages/mcp-server/`
**After:** `peakinfer-mcp/` (standalone repo)

**Why separated:**
- MCP server is for Claude Desktop/Code, not CLI
- Users can install only what they need
- Independent versioning and releases

### Work Completed

- Bundled connectors (Helicone, LangSmith) locally
- Bundled benchmarks (InferenceMAX) locally
- Added error boundaries with specific error codes
- Fixed import paths (no CLI dependencies)
- **v2.0.0**: Added `analyze` tool with PeakInfer API connector
- **v2.0.0**: Added CLI fallback connector
- **v2.0.0**: Added file-reader utility for local code reading
- **v2.0.0**: Fallback chain: CLI (free, local) → API (cloud) → error with setup instructions

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
2. **Bundled connectors** - Helicone, LangSmith in src/connectors/
3. **Bundled benchmarks** - InferenceMAX in data/
4. **Error boundaries** - Specific error codes for debugging
5. **Analyze tool** - Tries local CLI first (free), falls back to peakinfer.com/api/analyze
6. **Auth modes** - CLI (no auth needed), Bearer token (paid), or BYOK via ANTHROPIC_API_KEY (free)

### Reference Documents

| Document | Location |
|----------|----------|
| Implementation Guide | `peakinfer/design/PeakInfer Implementation v1.9.5.md` |
| Main CLAUDE.md | `peakinfer/CLAUDE.md` |
| MCP README | `README.md` |
