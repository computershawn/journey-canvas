# React + TypeScript + Vite

```
TODO:
[x] Fix the dropdown-select, it's not working
[x] Create and upload thumbnail on video create
[x] Add video thumbnails somewhere in the UI
[x] Make render job non-blocking; user can interact with the UI
[x] Add ability to delete a video
[x] Add ability to download a video
[x] Remove redundant menu from logged-in 'render video' button.
    The 'View your recent video' functionality has been moved to
    the controls drawer
[ ] Limit user to 5 videos. Inform the user that they need to delete
    a video before creating a new one.
[ ] Show 'Rendering your video' status in VideoList if applicable
[ ] Open preview dialog when user clicks the video thumbnail
[ ] Prevent new video renders if one is in progress
[ ] The user can navigate away from the page while their video is
    rendering. We can either cancel the render or allow it to complete
    in the background. If we allow the render to complete in the
    background and the user returns to the page, we probably still need
    to prevent new renders and display the in-progress spinner.
    store the job ID in the user's document in Firestore?
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
