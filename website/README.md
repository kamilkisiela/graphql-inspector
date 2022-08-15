# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Installation

Run this command in both root dir as well as the website directory

```
$ yarn --ignore-engines --ignore-optional
```

`--ignore-engines` is required if you are using node versions greater than `14.0` since the `graphql-request` package
being used is incompatible with them.

## Building the plugins

You will need to build the plugins before firing up the development server.

Run `yarn build` from the root directory

## Local Development

`$ yarn start`

This command starts a local development server and open up a browser window. Most changes are reflected live without
having to restart the server.

## Generate a static version of the website

Run `yarn build` from the website directory to build the static website
