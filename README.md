# halal-restaurant-locator

## One Time Setup to Run full stack application in Development Mode:

- For the purpose of having one source of truth for documentation, please refer to respective readme links below to run the full stack application.

- **Additionally, it is highly recommended to have a look at [debugging common issues section](#debugging-common-issues) before running your application to avoid common pitfalls in running this application.**

# Client
[client read me](/client/README.md)

# Backend
[backend read me](/backend/Readme.md)

## Debugging common issues:

One frequent issue you can run into is, if you change the port of your backend server. The client package.json file has been configured to proxy request to `http://localhost:6000` to avoid CORS error. If you are changing your backend server port, then navigate to package.json file in the client folder and do the following:

- Find the `proxy` property in the package.json file and edit it -  "proxy": `http://localhost:{YOUR_BACKEND_PORT}`




