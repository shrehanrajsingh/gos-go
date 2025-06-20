# gOS - go Online Shell

## Overview

gOS is a terminal UI interface based social network application. It provides a unique, terminal-like experience for social networking. The application features a Next.js frontend with a Go backend, containerized with Docker for easy deployment.

## Features

- Terminal-inspired user interface
- User authentication with JWT
- Dockerized for easy deployment

## Requirements

- Docker and Docker Compose
- Node.js (for local development)
- Go (for local development)
- PostgreSQL (handled by Docker)

## Installation

Clone the repository:

```bash
git clone https://github.com/shrehanrajsingh/gos-go.git
cd gos-go
```

## Usage

### Running with Docker

The simplest way to run the application is with Docker Compose:

```bash
docker-compose up --build
```

This will start both the frontend and backend services, along with a PostgreSQL database.

### API Endpoints

The backend supports the following routes:

- `POST /signin` - Authenticate user and return JWT
- `POST /signup` - Create a new user
- `GET /me` - Get current user information
- `PUT /me` - Update current user information

## Development

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Go)

```bash
cd backend
go run main.go
```

## Database

The application uses PostgreSQL as its database. The schema is automatically initialized when running with Docker.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

## Reporting Bugs

Please use the GitHub issue tracker to report bugs.

## Authors

- [Shrehan Raj Singh](https://github.com/shrehanrajsingh)