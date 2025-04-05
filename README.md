# Pasa - AI Job Application Assistant

Pasa is a Chrome extension that uses AI to help job seekers track and optimize their job applications.

## Features

- **Resume Analysis**: Get instant feedback and scoring on your resume
- **Cover Letter Generation**: AI-powered cover letter creation tailored to job descriptions
- **Application Tracking**: Manage all your job applications in one place
- **Job Detection**: Automatically detects job listings on popular job sites
- **Metrics Dashboard**: Track your application progress and success rates

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Prisma, Node.js
- **Database**: Neon (Postgres)
- **AI Integration**: OpenAI
- **Build Tools**: Vite, pnpm

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/playbookTV/pasa-x.git
   cd pasa-x
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your database and API keys.

4. Run the development server:
   ```
   pnpm dev
   ```

### Building the Chrome Extension

To build the Chrome extension:

```
pnpm build-chrome
```

Then load the `dist` directory as an unpacked extension in Chrome.

## Database

The project uses Prisma with a PostgreSQL database. To initialize the database:

```
pnpm prisma migrate dev
pnpm prisma generate
```

To view your data with Prisma Studio:
```
pnpm prisma studio
```

## License

[MIT](LICENSE) 