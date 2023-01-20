# Clearance UI

Interface for assigning and managing clearances to individuals. Written in Next.js. Read this document to get started.

## Environment Variables

```
# .env.local (for local development)
NEXT_PUBLIC_GOOGLE_IDENTITY_CLIENT_ID=
NEXT_PUBLIC_AUTH_SERVICE_URL=
NEXT_PUBLIC_CLEARANCE_SERVICE_URL=
```

```
# .env (for VSCode + Playwright)
E2E_REFRESH_TOKEN=
```

## Running on your Local Machine

1. Install dependencies

```
npm i
```

2. Run the app

```
npm run dev
```

## Running with Docker

Build and run the container, ensuring the proper environment variables are set.

```
docker build -t clearance-ui .

docker run -it --rm --name clearance-ui -p 3000:3000 clearance-ui
```

## Running in Production

The production image is built to be optimized & lean. We've configured the app to run in standalone mode as part of the production image. This generates a server.js that can be ran with node to serve the UI. The server.js file is automatically
ran when the image starts.

### Environment Variables

Environment variables are currently baked into the image. We have not investigated alternatives for loading
environment variables (runtime vs. buildtime)

- **Important:** You must have a .env file located at `./` when running docker build for the production image.

```
docker build -t clearance-ui:prod -f Dockerfile.prod .

docker run --rm --name clearance-ui -p 3000:3000 clearance-ui:prod
```

## Running E2E Tests

E2E tests **must** be ran with the `NEXT_PUBLIC_AUTH_SERVICE_URL` set to the dev URL.

### Using VSCode

- **Required:** Install the Playwright VSCode extension.
- **Required:** `E2E_REFRESH_TOKEN` is a required env var for authentication in the E2E tests.
  - Either set it in your `.env` file or in your VSCode settings.

Click the Beaker icon on the sidebar in VSCode to view all of the tests. You can set breakpoints, toggle
the browser, or run individual tests with 1 click. It's pretty cool.

### Manually with CLI

- **Required:** `E2E_REFRESH_TOKEN` is a required env var for authentication in the E2E tests.

```
E2E_REFRESH_TOKEN=<ask_for_e2e_jwt> npm run e2e
# npm run e2e:report # gives a nice HTML report
# npm run e2e ./path/to/test.spec.ts # run a specific test
```

You can run the tests in debug mode to see the browser window:

```
PWDEBUG=console npx playwright test
```

### Troubleshooting

If you can't log in, ensure the Auth Service is running and that the corresponding environment variable is set.
The `NEXT_PUBLIC_GOOGLE_IDENTITY_CLIENT_ID` environment variable is a value provided by Google and is required for
logging in with Google to work. Logging in with Google requires a network connection with Google, and the Auth
Service must also have a connection with Google.
