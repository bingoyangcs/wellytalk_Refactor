# Wellytalk Refactor Prototype

A dependency-free product prototype for the Wellytalk navigation, Routing rules, and Agents management experiences.

## Run locally

Open `index.html` directly, or start a local static server:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4173/`.

## Test

```bash
node --test tests/*.test.js
```

## Online site

The `Deploy GitHub Pages` workflow publishes the static prototype whenever `main` is updated.
