# Yukikaze Music Player – Music streaming Platform

[![Release](https://github.com/alicezuberg930/music_player/actions/workflows/deploy.yml/badge.svg)](https://github.com/alicezuberg930/music_player/actions/workflows/deploy.yml)
[![Version Web](https://img.shields.io/github/package-json/v/alicezuberg930/music_player/dev?filename=app/package.json&label=version@web)](https://github.com/alicezuberg930/music_player/releases)
[![Version Server](https://img.shields.io/github/package-json/v/alicezuberg930/music_player/dev?filename=api/package.json&label=version@server)](https://github.com/alicezuberg930/music_player/releases)
[![License](https://img.shields.io/github/license/alicezuberg930/music_player)](LICENSE)
[![Contributors](https://img.shields.io/github/contributors/alicezuberg930/music_player)](https://github.com/alicezuberg930/music_player/graphs/contributors)

A modern music streaming platform that enables users to discover, search, upload, and stream music from various artists. Features include personalized playlists, real-time lyrics display, artist profiles, and a seamless listening experience with high-quality audio streaming.

## Tech Stack

### Apps

- **Web App**
  - React.js, TailwindCSS, Shadcn UI

### Backend & Shared Services

- **API**: Express
- **ORM**: Drizzle ORM + MySQL
- **Validation**: Class Validator (Back-end) & Yup (Front-end)
- **Email Service**: Resend

## Project Structure

```text
(root)
├── apps/                         # User-facing applications
│   └── web/                      # Frontend web app (React + Vite + TypeScript)
│       ├── public/
│       │   └── assets/           # Static assets
│       ├── src/
│       │   ├── @types/           # TypeScript definitions
│       │   ├── components/       # Reusable UI components
│       │   │   ├── hook-form/    # React Hook Form wrappers
│       │   │   ├── upload/       # File upload components
│       │   │   └── snackbar/     # Toast notifications
│       │   ├── hooks/            # Custom React hooks
│       │   ├── lib/              # Frontend utilities
│       │   │   ├── auth/         # Auth context & guards
│       │   │   ├── locales/      # i18n (en/fr/vi/cn/ar)
│       │   │   ├── route/        # Router config
│       │   │   └── httpClient.ts # Axios API client
│       │   ├── pages/            # Route pages
│       │   ├── redux/            # Redux Toolkit store
│       │   │   └── slices/       # State slices
│       │   └── sections/         # Page sections
│       └── server.js             # serve built file with compression
│
├── services/                     # Backend microservices
│   ├── api/                      # Main API service (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── modules/          # Feature modules
│   │   │   │   ├── artists/      # Artist management
│   │   │   │   ├── banners/      # Banner management
│   │   │   │   ├── playlists/    # Playlist CRUD
│   │   │   │   ├── songs/        # Song management
│   │   │   │   ├── users/        # User auth & profile
│   │   │   │   └── socket/       # WebSocket support
│   │   │   └── index.ts          # API entry point
│   │   ├── uploads/              # Uploaded files (lyrics, audio)
│   │   └── package.json
│   ├── gateway-service/          # API Gateway service
│   ├── home-service/             # Home page service
│   └── song-service/             # Song streaming service
│
├── packages/                     # Shared packages
│   ├── db/                       # Database schemas & Drizzle ORM
│   │   ├── drizzle/              # Migration files
│   │   │   └── meta/             # Drizzle metadata
│   │   ├── src/
│   │   │   ├── schemas/          # Table definitions
│   │   │   ├── responses/        # Response formatters
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts          # DB utilities
│   │   ├── drizzle.config.ts     # Drizzle ORM config
│   │   └── package.json
│   ├── email/                    # Email service & templates (Resend)
│   ├── eslint-config/            # Shared ESLint configurations
│   ├── lib/                      # Shared utilities & helpers
│   ├── middleware/               # Shared Express middleware
│   ├── redis/                    # Redis client & utilities
│   ├── typescript-config/        # Shared TypeScript configurations
│   └── ui/                       # Shadcn UI components library
│
├── docs/                         # Documentation
│   ├── database.md               # Database schema docs
│   └── monorepo.md               # Monorepo structure docs
│
├── tools/
│   └── nginx/                    # Nginx reverse proxy configs
│       ├── music-player-app.conf
│       └── music-player-api.conf
│
├── docker-compose.yml            # Production Docker orchestration
├── docker-compose.dev.yml        # Development Docker orchestration
└── turbo.json                    # Turborepo configuration
```

## Deployment

### Docker Deployment

This system is deployed using Docker Compose & Nginx reverse proxy.

Config files:

- docker-compose.yml
- tools/nginx/music-player-app.conf
- tools/nginx/music-player-api.conf

### Vercel Deployment

The web app and dashboard can also be deployed to Vercel directly from the monorepo.

## Documentation

Located in `/docs` folder:

- Deployment guide
- Project structure
- Privacy Policy & Terms of Service

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
