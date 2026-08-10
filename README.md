# scaf-react

React + TypeScript + Vite frontend template.

This template assumes Docker-based development. Local Node.js is not required.

## Setup

```sh
cp .env.example .env
make build
make up
```

Open http://localhost:3000.

## Environment

```sh
WEB_PORT=3000
APP_API_URL=http://localhost:8000/api
```

`APP_API_URL` is written to `/env.json` when the container starts. The production
image can be reused across environments without rebuilding for each API URL.

## Commands

```sh
make up                 # Start dev server
make down               # Stop containers
make down_volumes       # Stop containers and remove named volumes
make log                # Follow web logs
make in                 # Open sh in the web container

make check              # Run lint and production build
make lint               # Run ESLint
make typecheck          # Run TypeScript check
make format             # Format with Prettier
make smoke              # Check key routes on the running app
make audit              # Audit production dependencies
make outdated           # Check outdated dependencies
```

## Production Build

The production image builds static assets and serves them with nginx.

```sh
make build ENV=prod
APP_API_URL=https://api.example.com make up ENV=prod
```
