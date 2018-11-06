## Overview

- A Vue.js 2.0 component wrapping [Dropzone.js](https://github.com/enyo/dropzone)
- Upload files to AWS S3 _serverlessly_ with AWS Lambda.

## Quickstart

This repo contains two directories: **frontend** and **lambda**. You must first
create the AWS Lambda function and deploy it onto AWS API Gateway. Then put the
invoke URL into `frontend/src/config.js` so that you can run and test the Vue
powered web client by:

```
cd frontend
yarn install
npm run dev
```

Please make sure you have correct privilege/policy/CORS settings on AWS.

## License

MIT
