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
VITE_API_URL=http://localhost:8000/api
```

`VITE_API_URL` is embedded at build time for production builds.

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
make audit              # Audit production dependencies
make outdated           # Check outdated dependencies
```

## Production Build

The production image builds static assets and serves them with nginx.

```sh
VITE_API_URL=https://api.example.com make build ENV=prod
make up ENV=prod
```
