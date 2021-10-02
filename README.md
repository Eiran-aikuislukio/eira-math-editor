# Eira Math Editor

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `netlify dev`

To run serverless functions locally

## Deployment

TODO

## Server-side vs client-side rendering of formulas

There are two approaches to rendering LaTeX formulas, which configured in `.env` files at the root of the repository:

1. Server-side, enabled if `REACT_APP_SVG_RENDERING=server`. Images are rendered by the serverless function [`render-math-svg.js`](./lambda/render-math-svg.js), which converts LaTeX to SVG.
2. Client-side, enabled if `REACT_APP_SVG_RENDERING=client`. Images are Base64 encoded and the entire application can be hosted as a static website without serverless functions.

### Which approach should I use?

Use server-side rendering if there's a need to paste content from the editor to another website e.g. Moodle. Moodle and other tools may not allow Base64 encoded (client-side) images and require images to be returned from a url e.g `<img src="https://editori.example.com/math.svg?latex=xyz">`.

Use client-side rendering to save on the costs of running serverless functions and for simple deployment of a static website.

> Note: `/math.svg` is the required route for server-side formula rendering as this is used internally by `makeRichText`. A redirect in `netlify.toml` sends requests from `/math.svg` to the serverless function [render-math-svg.js](./lambda/render-math-svg.js).

## Global store

Answers are stored in a global `zustand` store to allow access from outside React components and are persisted to local storage. See [`src/store/answers.js`](./src/store/answers.js).

## Contributing

1. Read our [Code of Conduct](./CODE_OF_CONDUCT.md)
2. If you spot something new, open an issue to start a discussion
3. Fork the repo when you're ready to make a change
4. Make your updates!
5. Open a pull request and wait for a review
6. Your PR is merged!
