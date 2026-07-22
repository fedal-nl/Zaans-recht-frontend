# Zaans Recht frontend

A framework-free HTML, CSS, and JavaScript website for Zaans Recht.

## Local development

Install the build-only Tailwind dependency and start the site:

```bash
npm ci
make run-http-server
```

Open <http://localhost:8002>. The local defaults use:

- API URL: `http://localhost:8000/api/v1`
- The development reCAPTCHA site key in `js/config.js`

Override either value while rebuilding:

```bash
API_URL=https://api.example.com/api/v1 \
RECAPTCHA_SITE_KEY=your-public-site-key \
npm run build
```

## Cloudflare Pages

Connect this repository using Cloudflare Pages and configure:

```text
Framework preset: None
Build command: npm ci && npm run build
Build output directory: .
Production branch: main
```

Set these environment variables in the Cloudflare Pages project settings:

```text
API_URL=https://your-api-domain.example/api/v1
RECAPTCHA_SITE_KEY=your-public-recaptcha-site-key
```

These values are compiled into `js/config.js` and are visible to browsers. Never
put `RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY`, database credentials, or other
secrets in the frontend or Cloudflare Pages build variables.

Tailwind is used only at build time. The deployed site loads the generated
`css/tailwind.css` file and does not load Tailwind from a CDN.
