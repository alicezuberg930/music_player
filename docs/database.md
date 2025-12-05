---
nav_order: 7
---

# Database Documentation

This document provides an overview of Music Player's MySQL database design and implementation using Drizzle ORM.

## Technology Stack

- **Database**: MySQL
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle Kit

## Core Database Concepts

Music Player follows a **music streaming platform model**, where:

- Users can upload and manage their own songs
- Songs are organized into playlists and albums
- Artists can be associated with multiple songs and playlists
- Content can be public or private

Data is structured to support music streaming, user musics and playlists management, and social features.

## Main Entities

### 1. Users

Stores authentication and user profile information.

**Key Fields:**

- `id`: Primary key (cid)
- `fullname`: User's full name
- `email`: Unique email for authentication
- `password`: Hashed password
- `phone`: Optional phone number
- `avatar`: Profile picture URL
- `birthday`: Date of birth
- `isVerified`: Email verification status
- `verifyToken` & `verifyTokenExpires`: Email verification tokens
- `resetPasswordToken` & `resetPasswordExpires`: Password reset tokens

**Relationships:**

- One user can upload many songs
- One user can create many playlists

### 2. Artists

Represents music artists who perform songs.

**Key Fields:**

- `id`: Primary key (cid)
- `name`: Artist name
- `alias`: URL-friendly name
- `thumbnail`: Artist profile image
- `spotlight`: Featured artist flag
- `totalFollow`: Number of followers

**Relationships:**

- Many-to-many relationship with songs through `artists_songs`
- Many-to-many relationship with playlists through `playlist_artists`

### 3. Songs

Core content entity representing music tracks.

**Key Fields:**

- `id`: Primary key (cid)
- `title`: Song title
- `alias`: URL-friendly title
- `artistNames`: Comma-separated artist names
- `thumbnail`: Cover art URL
- `lyricsFile`: Lyrics file URL (.lrc format)
- `duration`: Song length in seconds
- `size`: File size in bytes
- `releaseDate`: Publication date
- `isPrivate`: Privacy flag
- `isWorldWide`: Global availability
- `mvlink`: Music video URL
- `likes`, `listens`, `comments`: Engagement metrics
- `userId`: Uploader reference

**Relationships:**

- Belongs to one user (uploader)
- Many-to-many with artists
- Many-to-many with genres through `song_genres`
- Can be added to multiple playlists

### 4. Playlists

Collections of songs organized by users.

**Key Fields:**

- `id`: Primary key (cid)
- `title`: Playlist name
- `artistNames`: Featured artists
- `thumbnail`: Playlist cover image
- `description`: Playlist description
- `isAlbum`: Marks if it's an album
- `isPrivate`: Privacy setting
- `totalDuration`: Sum of song durations
- `releaseDate`: Publication date
- `likes`, `listens`, `comments`: Engagement metrics
- `userId`: Creator reference

**Relationships:**

- Belongs to one user (creator)
- Many-to-many with songs through `playlist_songs`
- Many-to-many with artists through `playlist_artists`

### 5. Genres

Music genre categories for classification.

**Key Fields:**

- `id`: Primary key (UUID)
- `name`: Genre name
- `alias`: URL-friendly name

**Relationships:**

- Many-to-many with songs through `song_genres`

### 6. Junction Tables

**artists_songs**: Links artists to their songs
**playlist_songs**: Links songs to playlists
**playlist_artists**: Links artists to playlists/albums
**song_genres**: Categorizes songs by genre

## Entity Relationship Model (ERD)

To be added: ERD Diagram showing relationships between:
Users ↔ Vendors ↔ Products ↔ Orders ↔ Payments

(We can generate a full ERD image based on the Drizzle schema if needed.)

## Migrations

Run migration commands using Drizzle Kit:

```bash
npm run generate
npm run migrate
```

Migration history stored under:

```text
api/src/drizzle
```

## Deployment Notes

- MySQL service is from a 3rd party service called "Aiven"
- Enable SSL only in production
