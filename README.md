# MoodLink

A social networking frontend built around mood-aware interactions. MoodLink combines a social feed, messaging, user profiles, activities, and mood reports in a Next.js application.

This repository contains the web client and the backend API schema. The backend service and its deployment are maintained separately.

## Features

- **Social feed:** create text and image posts, browse posts, and interact through likes and comments.
- **Accounts and profiles:** registration, email verification, sign-in, password reset, profile editing, and user discovery.
- **Messaging:** direct and group chat interfaces, with new messages fetched through periodic API polling.
- **Mood reports:** weekly and monthly views of emotion scores, insights, and recommendations returned by the backend.
- **Activities:** a prototype interface for creating, joining, and filtering activities using local component state.
- **Interface:** responsive navigation, reusable UI components, and configurable themes.

## Technology

| Layer | Tools |
| --- | --- |
| Application | Next.js 15, React 19, TypeScript |
| Styling and components | Tailwind CSS, Radix UI, shadcn/ui-style components, Lucide icons |
| API integration | Axios, TypeScript request/response definitions, Swagger schema |
| Forms and validation | React Hook Form, Zod |
| UI utilities | Embla Carousel, date-fns |

## Run locally

Use Node.js 22 and npm.

```bash
git clone https://github.com/eraykocabozdogan/Moodlink1.git
cd Moodlink1
npm ci --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The login and registration screens render locally; authenticated features require a compatible, reachable backend.

The existing dependency set includes React 19 and date-fns 4 alongside react-day-picker 8, whose peer ranges target earlier versions. `--legacy-peer-deps` allows installation of the existing dependency set; it does not resolve runtime compatibility.

### Backend configuration

Set the backend origin in `.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://moodlinkbackend.onrender.com
```

This is the API client's current default address, not a verified live demo. Replace it with your compatible backend origin as needed. The backend must allow requests from the frontend origin through its CORS configuration.

`NEXT_PUBLIC_` values are exposed to the browser. Keep passwords, API keys, and other secrets out of this variable.

### Build commands

```bash
npm run build
npm run start
```

`npm run start` serves the production build after `npm run build` completes. The current Next.js configuration skips TypeScript and ESLint errors during builds, so a successful build alone does not establish code quality.

## Repository guide

| Path | Purpose |
| --- | --- |
| [`app/`](app/) | Application entry point, root layout, and global styles |
| [`components/pages/`](components/pages/) | Feed, chat, profiles, reports, activities, and settings screens |
| [`components/ui/`](components/ui/) | Shared interface components |
| [`hooks/`](hooks/) | Authentication and UI hooks |
| [`lib/apiClient.ts`](lib/apiClient.ts) | API configuration, authentication headers, and endpoint methods |
| [`lib/types/api.ts`](lib/types/api.ts) | API request and response definitions |
| [`swagger.json`](swagger.json) | Backend API schema |
| [`PROFILE_PICTURE_SYSTEM.md`](PROFILE_PICTURE_SYSTEM.md) | Profile image integration notes |
| [`PaperRapor_G2.pdf`](PaperRapor_G2.pdf) | Project report |

See [`lib/README.md`](lib/README.md) for API client usage examples.

## Current scope

- The activities screen uses sample data and in-memory state; changes are not persisted to the backend.
- Mood reports include mock fallback data and synthetic chart variation. Feed mood and compatibility labels also include random values. These displays should not be treated as validated emotion predictions.
- Backend availability, authentication, and CORS affect whether the full application can be used. This repository does not include a standalone backend or an offline demo mode.
- The repository has no configured automated test suite. The profile upload script is a manual integration helper.
