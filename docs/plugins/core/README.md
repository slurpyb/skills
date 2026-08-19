# core

Always-on MCP: library docs, web search, crawl, and GitHub code research.

## API keys and env vars

| Variable | Needed by | For |
|---|---|---|
| `CONTEXT7_API_KEY` | context7 MCP | Library and framework docs |
| `EXA_API_KEY` | exa MCP | Web search, code context, crawl, company research |
| `JINA_API_KEY` | jina MCP | Reader and search at `mcp.jina.ai` |
| `PERPLEXITY_API_KEY` | perplexity MCP | Perplexity search |
| `FIRECRAWL_API_KEY` | firecrawl MCP | Crawl and extract at `mcp.firecrawl.dev` |
| `OCTOCODE_TOKEN`, `GH_TOKEN`, or `GITHUB_TOKEN` | octocode MCP | GitHub-backed code search (or `npx octocode auth login`) |

Tavily is wired as `https://mcp.tavily.com/mcp/` with no key. sequential-thinking takes none.
