# \<xof-tree>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Demo

You can test the component here:
[Netlify](https://xof-tree.netlify.app/?path=/story/xoftree--simple)

## Performance

You can test the performace with this command:
npm run tach performance/longdata.html
npm run tach performance/longdata-expanded.html

## Installation
```bash
npm i xof-tree
```

## Usage
```html
<script type="module">
  import 'xof-tree/xof-tree.js';
</script>

<xof-tree></xof-tree>
```

## Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
npm run lint
```

You can lint with ESLint and Prettier individually as well
```bash
npm run lint:eslint
```
```bash
npm run lint:prettier
```

To automatically fix many linting errors, run
```bash
npm run format
```

You can format using ESLint and Prettier individually as well
```bash
npm run format:eslint
```
```bash
npm run format:prettier
```

## Testing with Web Test Runner
To run the suite of Web Test Runner tests, run
```bash
npm run test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
npm run test:watch
```

## Demoing with Storybook
To run a local instance of Storybook for your component, run
```bash
npm run storybook
```

To build a production version of Storybook, run
```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`
