# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start webpack dev server on port 8080 with live reload
npm run build      # Production build (outputs to /dist)
npm run deploy     # Build and deploy to GitHub Pages (gh-pages -d dist)
```

No test runner is configured in this project.

## Architecture

This is a vanilla JS ES6+ image gallery SPA ("Around the U.S.") built as a Practicum educational project. It uses class-based OOP components, BEM CSS methodology, and Webpack 5 with Babel.

**Entry point:** `src/pages/index.js` — wires all components together, owns API instance, sets up all event listeners, and fetches initial data via `Promise.all([api.getUserInfo(), api.getInitialCards()])`.

**Component pattern:** All classes in `src/components/` are instantiated in `index.js`. Components don't talk to each other directly.

- `Api.js` — wraps the TripleTen backend (`https://around-api.en.tripleten-services.com/v1`). All network calls go through this class.
- `Card.js` — receives name, link, like state, IDs, and callbacks from `index.js`. Hides delete button if `myId !== ownerId`.
- `Popup.js` → base class for all modals (ESC + overlay click to close)
  - `PopupWithForm.js` — adds form handling, `showLoading()`/`hideLoading()` for async submit states
  - `PopupWithImage.js` — sets image src/alt and caption on open
  - `PopupWithConfirmation.js` — used for delete confirmation; caller sets submit action via `setSubmitAction()`
- `FormValidator.js` — instantiated once per form, called with `enableValidation()`; call `resetValidation()` before reopening a form popup.
- `Section.js` — renders a list of items into a container element using a renderer callback.
- `UserInfo.js` — reads/writes profile name, about text, and avatar to the DOM.

**Constants:** `src/utils/constants.js` holds all DOM selectors and the `formValidationConfig` object (CSS class names used by `FormValidator`). Add new selectors here rather than querying inline.

**CSS:** Styles live in `src/blocks/` (one file per BEM block) and are imported from `src/pages/index.css`. Vendor styles are in `src/vendor/`.

**API auth token** is hardcoded in `src/pages/index.js` — this is expected for this educational project and its TripleTen-provided API.

## GENERAL INSTRUCTIONS TO CLAUDE

1. be brief and direct. Minimise the use of output tokens.
2. If you don't know the answer to something say explicitly. Do not make things up EVER.
3. If you're not sure about your proposed changes, first discuss them with me BEFORE making changes to files. YOU MUST ALWAYS FOLLOW THIS RULE.
