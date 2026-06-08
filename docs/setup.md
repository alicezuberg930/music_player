# Deployment

## Install bun

- curl -fsSL <https://bun.com/install> | bash
- source /root/.bashrc

## Install nginx

- sudo apt install nginx

## Install SSL certificate

- sudo apt install certbot python3-certbot-nginx -y
- sudo certbot --nginx -d <tien-music-player.site> -d <www.tien-music-player.site> -d <api.tien-music-player.site>

## Clone and build project

- git clone <https://github.com/alicezuberg930/music_player.git>
- bun install
- bun run build
