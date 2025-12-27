set -euo pipefail

# Load Bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Load NVM (Node Version Manager) if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

SERVER_NAME="music-api"
FRONTEND_NAME="music-app"

export PATH="$HOME/.bun/bin:$PATH"

# 1. Install dependencies
bun install

# 2. Build packages
bun run build:packages

# 3. Build services
bun run build:services

# 4. Build web
bun run build:web

# 5. Reload or start pm2 process for music-app (web)
if pm2 describe "$SERVER_NAME" >/dev/null 2>&1; then
	pm2 reload "$SERVER_NAME"
else
	pm2 start "bun run start:services" --name "$SERVER_NAME"
fi
if pm2 describe "$FRONTEND_NAME" >/dev/null 2>&1; then
	pm2 reload "$FRONTEND_NAME"
else
	pm2 start "bun run start:web" --name "$FRONTEND_NAME"
fi