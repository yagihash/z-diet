# #z-diet
GCP Cloud function for #z-diet.

## Create cloud function
Config example (author's case)

- Function spec
  - Node.js v8
  - 512MB memory
  - 180sec timeout
  - call `main`
- Environment variables
  - `secret`: Secret string to authenticate valid request
  - `username`: Username for logging in to withings site
  - `password`: Password for logging in to withings site

## Create iOS shortcut
[Shortcut sample](https://www.icloud.com/shortcuts/97744823aecc4d5f98866a0148fb5d5f)
