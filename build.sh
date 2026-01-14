#!/bin/bash
build_type="${1:-pm2}"

if [ "$build_type" = "pm2" ]; then
	# fetch and pull newest code from github
	git fetch origin
	git checkout main
	git pull

	pm2 delete all || true

	# build script when not using docker
	# Load Bun
	export BUN_INSTALL="$HOME/.bun"
	export PATH="$BUN_INSTALL/bin:$PATH"

	SERVER_NAME="music-api"
	FRONTEND_NAME="music-app"

	# 1. Install dependencies
	bun install

	# 2. Build packages
	bun run build:packages

	# 3. Build services
	# bun run build:services
	turbo run build --filter=@yukikaze/playlist-service && turbo run build --filter=@yukikaze/gateway-service && turbo run build --filter=@yukikaze/home-service && turbo run build --filter=@yukikaze/song-service && turbo run build --filter=@yukikaze/artist-service && turbo run build --filter=@yukikaze/banner-service && turbo run build --filter=@yukikaze/user-service && turbo run build --filter=@yukikaze/auth-service

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
elif [ "$build_type" = "docker" ]; then	
	# fetch and pull newest code from github
	git fetch origin
	git checkout main
	git pull

	# check if docker is installed
	if ! command -v docker compose &> /dev/null; then
		echo "Docker Compose not found"
		echo "Installing Docker Compose"

		# Uninstall old versions if any
		sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)

		# Add Docker's official GPG key:
		sudo apt install ca-certificates curl
		sudo install -m 0755 -d /etc/apt/keyrings
		sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
		sudo chmod a+r /etc/apt/keyrings/docker.asc

		# Add the repository to Apt sources
		sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

		# Install the Docker packages
		sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
		echo "Docker status:"
		sudo systemctl status docker
	fi

	echo "Stopping music-player-container only"
	docker stop music-player-container || true

	echo "Removing old images"
	docker compose -f docker-compose.prod.yml rm -f || true

	echo "Building and starting containers"
	docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_gateway_prod' && docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_song_prod' && docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_home_prod' && docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_artist_prod' && docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_auth_prod' && docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_playlist_prod' && docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_banner_prod' && docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_user_prod' && docker compose -f 'docker-compose.prod.yml' build 'yukikaze_player_app_prod'
	
	# docker compose -f docker-compose.prod.yml up --build -d

	echo "Deployment completed successfully"

	echo "Container status:"
	docker compose -f docker-compose.prod.yml ps
else
	echo "Invalid build_type: $build_type. Use 'pm2' or 'docker'."
	exit 1
fi