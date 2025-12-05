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
├── api/                          # Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── db/                   # Database schemas & Drizzle ORM
│   │   │   ├── schemas/          # Table definitions
│   │   │   ├── responses/        # Response formatters
│   │   │   └── utils.ts          # DB utilities
│   │   ├── drizzle/              # Migration files
│   │   ├── lib/                  # Backend utilities
│   │   │   ├── @types/           # TypeScript types
│   │   │   ├── bcrypt/           # Password hashing
│   │   │   ├── email/            # Email templates (Resend)
│   │   │   ├── exceptions/       # Error handlers
│   │   │   └── helpers/          # Helper functions
│   │   ├── middleware/           # Express middleware
│   │   │   ├── dto.validator.middleware.ts
│   │   │   ├── error.interceptor.ts
│   │   │   ├── jwt.middleware.ts
│   │   │   └── response.interceptor.ts
│   │   ├── modules/              # Feature modules
│   │   │   ├── artists/          # Artist management
│   │   │   ├── banners/          # Banner management
│   │   │   ├── playlists/        # Playlist CRUD
│   │   │   ├── songs/            # Song management
│   │   │   ├── users/            # User auth & profile
│   │   │   └── socket/           # WebSocket support
│   │   └── index.ts              # API entry point
│   ├── uploads/                  # Uploaded files (lyrics, audio)
│   ├── drizzle.config.ts         # Drizzle ORM config
│   └── package.json
│
├── app/                          # Frontend (React + Vite + TypeScript)
│   ├── public/
│   │   └── assets/               # Static assets
│   ├── src/
│   │   ├── @types/               # TypeScript definitions
│   │   ├── assets/               # Images, dummy data
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/               # Shadcn UI components
│   │   │   ├── hook-form/        # React Hook Form wrappers
│   │   │   ├── upload/           # File upload components
│   │   │   └── snackbar/         # Toast notifications
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Frontend utilities
│   │   │   ├── auth/             # Auth context & guards
│   │   │   ├── locales/          # i18n (en/fr/vi/cn/ar)
│   │   │   ├── route/            # Router config
│   │   │   └── httpClient.ts     # Axios API client
│   │   ├── pages/                # Route pages
│   │   ├── redux/                # Redux Toolkit store
│   │   │   └── slices/           # State slices
│   │   └── sections/             # Page sections
│   ├── vite.config.ts            # Vite build config
│   └── package.json
│
├── docs/                         # Documentation
│   └── database.md               # Database schema docs
│
├── tools/
│   └── nginx/                    # Nginx reverse proxy configs
│       ├── music-player-app.conf
│       └── music-player-api.conf
│
├── docker-compose.yml            # Docker orchestration
├── LICENSE                       # MIT License
└── README.md                     # This file
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
