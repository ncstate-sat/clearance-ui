# Clearance UI

An interface for assigning and managing clearances.

## Environment Variables

| Name (Required \*)               | Description                                                                    | Example                          |
| -------------------------------- | ------------------------------------------------------------------------------ | -------------------------------- |
| VITE_GOOGLE_IDENTITY_CLIENT_ID\* | This ID is required to identify the application with Google Identity Services. | token.apps.googleusercontent.com |
| VITE_AUTH_SERVICE_URL\*          | The URL for the Auth Service API.                                              | https://auth.services.edu        |
| VITE_CLEARANCE_SERVICE_URL\*     | The URL for the Clearance Service API.                                         | https://clearance.services.edu   |
| E2E_REFRESH_TOKEN                | A refresh token for use by the E2E tests. Required only for E2E tests.         | somerandomtoken                  |

## Other Requirements

The application must be served on a URL registered with Google Identity Services. For example, if it should be accessed on `localhost:3000`, then that full URL should be registered with Google in the Cloud Console -> API's & Services -> Credentials as an authorized JavaScript origin.

## Running on your Local Machine

1. Install dependencies.

```
npm install
```

2. Run the app.

```
npm run dev
```

## Running in Production

1. Install dependencies.

```
npm install

```

2. Build the production application.

```
npm run build
```

3. Run the production application.

```
npm run serve
```

## Running with Docker

The Dockerfile builds a production image. That image is not meant to be used for development.

1. Build the image.

```
docker build -t clearance-ui .
```

2. Run the image.

```
docker run -p 3000:3000 --env-file .env clearance-ui
```

## Running E2E Tests

End-to-End tests must be ran with all environment variables present, with the exception of the Google Client ID. The Auth Service and Clearance Service must be running for the tests to be able to work.

### Using VSCode

- **Required:** Install the Playwright VSCode extension.
- **Required:** `E2E_REFRESH_TOKEN` and `E2E_LIAISON_REFRESH_TOKEN` are required environment variables for authentication in the E2E tests.
  - Either set them in your `.env` file or in your VSCode settings.

Click the Beaker icon on the sidebar in VSCode to view all of the tests. You can set breakpoints, toggle
the browser, or run individual tests with 1 click. It's pretty cool.

![image](https://media.github.ncsu.edu/user/25984/files/319f8f0c-026d-42b9-953d-b376e6267a31)

### Manually

```
E2E_REFRESH_TOKEN=<ask_for_e2e_jwt> E2E_LIAISON_REFRESH_TOKEN=<ask_for_liaison_e2e_jwt> npm run e2e
# npm run e2e:report # gives a nice HTML report
# npm run e2e ./path/to/test.spec.ts # run a specific test
```

You can run the tests in debug mode to see the browser window:

```
PWDEBUG=console npx playwright test
```
