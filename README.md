## ArabDevs CLI

Simple Arabic-first CLI that connects to Google Gemini to explain, debug, and document codebases. Built by Arab developers for Arab developers — fast setup, clear Arabic logs, and RTL-safe output in any terminal.

### Contribution
- Mohamed Abdelhady (me)
- Adham Ashraf
- Gamal Khaled
- Ahmed Sabry

### Requirements
- Node.js 20+ (required by `commander@14` and `@google/genai`)
- npm 9+
- Google AI Studio API key with access to Gemini models
- Internet access (the CLI calls Google’s REST API)

### Core Dependencies
- `commander` – CLI argument parsing
- `chalk` – colored terminal output
- `@google/genai` – Gemini API client (Gemini 2.5)
- `arabic-reshaper` + `bidi-js` – fix Arabic text rendering in LTR terminals
- `ignore` – respects `.gitignore` when scanning files
- `dotenv` – load `.env` files automatically
- `fs-extra` – filesystem helpers (future features)

### Installation
```bash
git clone https://github.com/<your-org>/ArabDevs-toolkit.git
cd "ArabDevs toolkit"
npm install
npm link   # optional for global `arabdevs` command
```
If you prefer running without `npm link`, use `node bin/cli.js <command>`.

### Configuration
Store the Gemini API key once:
```bash
arabdevs config --key AIzaSyXXXXXXXXXXXX
```
This writes the key to `~/.arabdevs-config.json`. As an alternative, set any of these environment variables or `.env` entries: `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `ARABDEVS_API_KEY`.

### Available Commands
| Command | Description |
| --- | --- |
| `arabdevs help` | Show compact help with RTL-friendly Arabic text. |
| `arabdevs comment [path]` | Generate Arabic code comments. If `path` is omitted, scans the whole project (excluding ignored files). |
| `arabdevs debug [path] --error "<stack>"` | Send code plus an optional CLI error message for diagnosis. If `path` is missing, you must pass `--error`. |
| `arabdevs explain <file>` | Explain a single file in Arabic. |
| `arabdevs generate <path>` | Build `GENERATED_README.md` from the given directory’s files. |
| `arabdevs config --key <KEY>` | Save or update the Gemini key locally. |

### Usage Examples
```bash
# Comment current project
arabdevs comment

# Comment specific file
arabdevs comment src/api/client.js

# Debug file with error output
arabdevs debug src/index.js --error "TypeError: cannot read properties of undefined"

# Explain file
arabdevs explain src/utils/logger.js

# Generate README for entire repo
arabdevs generate .
```

### Arabic Rendering
The CLI reshapes and reorders Arabic text using `arabic-reshaper` + `bidi-js`, so terminals that lack native RTL support still show connected letters. If output still appears disjointed, install a font with Arabic glyphs (e.g., “Noto Sans Arabic”) or run the command inside an RTL-aware terminal emulator.

### Troubleshooting
- **“unknown option '--key'”** → Run `arabdevs config --key <KEY>` (sub-command required).  
- **Missing `generate` path** → Pass a directory or file: `arabdevs generate .`.  
- **Gemini 404 / model unavailable** → Ensure your key has access to Gemini models and the machine can reach `https://generativelanguage.googleapis.com`. The CLI automatically tries multiple model IDs.  
- **RTL output still broken** → Confirm locale and font; export `LC_ALL=ar_EG.UTF-8` to hint RTL support.

### Development Scripts
```bash
npm test           # placeholder – add tests as needed
node test-direct.js  # quick API connectivity test
```

### How to make a contribution?
1. Fork the repo & create a branch.  
2. Make changes with clear inline comments only where needed.  
3. Run lint/tests (if configured).  
4. Submit a PR describing the change in plain Arabic or English—no emojis.

### License
ISC License © ArabDevs. Feel free to fork, customize, and publish your own distributions as long as attribution remains.
