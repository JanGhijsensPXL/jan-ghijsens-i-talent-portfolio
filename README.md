# Jan Ghijsens Terminal Portfolio

A React + TypeScript portfolio website with a terminal/command-line aesthetic.

## Commands

The terminal supports:

- whoami
- skills
- education
- experience
- activities
- github
- help
- clear

Features include command history with arrow up/down keys and a typed welcome message on load.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages deployment

This project is preconfigured for GitHub Pages with:

- Vite base path set to `/jan-ghijsens-i-talent-portfolio/`
- deploy script using `gh-pages`

Deploy with:

```bash
npm run deploy
```

If your GitHub repository name differs, update:

- `homepage` in package.json
- `base` in vite.config.ts
