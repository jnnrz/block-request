# block-request 🚀
An image/media/js blocker addon for Firefox

<br />

**Getting Started**

Run the following commands to install dependencies and start developing

```
pnpm install
pnpm dev
```

**Scripts**

-   `pnpm dev` - run `webpack` in `watch` mode
-   `pnpm build` - builds the production-ready unpacked extension
-   `pnpm test -u` - runs Jest + updates test snapshots
-   `pnpm lint` - runs EsLint
-   `pnpm prettify` - runs Prettier


<details>
  <summary>Loading the extension in Mozilla Firefox</summary>

In [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/), open up the [about:debugging](about:debugging) page in a new tab. Click the `Load Temporary Add-on...` button and select the `manfiest.json` from the `dist` directory in this repository - your extension should now be loaded.

![Installed Extension in Mozilla Firefox](https://i.imgur.com/gO2Lrb5.png "Installed Extension in Mozilla Firefox")

</details>


**Built with**

-   [React](https://reactjs.org)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Eslint](https://eslint.org/)
-   [Prettier](https://prettier.io/)
-   [Webpack](https://webpack.js.org/)
-   [SCSS](https://sass-lang.com/)
-   [webextension-polyfill-ts](https://github.com/Lusito/webextension-polyfill-ts)

Icons by [Icons8](https://icons8.com)
