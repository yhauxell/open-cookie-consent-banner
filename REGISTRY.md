# Open Cookie Consent Banner Registry

This project is set up as a component registry to distribute the cookie-consent component via the shadcn/ui registry system.

## Registry Structure

The registry is configured in `registry.json` and generates registry items in the `public/r/` directory during build.

## Installation

Users can install the cookie-consent component using the shadcn CLI:

```bash
npx shadcn@latest add https://your-domain.com/r/cookie-consent.json
```

Or using the registry URL directly:

```bash
npx shadcn@latest add /r/cookie-consent.json
```

## Building the Registry

The registry is automatically built during `npm run build` and `npm run dev`. You can also build it manually:

```bash
npm run registry:build
```

This will:

1. Read `registry.json`
2. Generate registry item JSON files in `public/r/`
3. Copy `registry.json` to `public/` for MCP support

## Registry Endpoints

- `/r/cookie-consent.json` - Registry item for the cookie-consent component
- `/registry` - Registry UI page with component preview
- `/demo` - Full demo page

## MCP Support

For MCP (Model Context Protocol) support, the `registry.json` file is copied to `public/registry.json` during build. This allows AI tools like Cursor and Windsurf to access the registry.

## Authentication (Optional)

To protect your registry, you can add authentication middleware. See the registry-starter documentation for details on setting up `REGISTRY_AUTH_TOKEN`.

## Deployment

When deploying, ensure:

1. The `public/r/` directory is included
2. The `public/registry.json` file is included
3. Environment variables are set (if using authentication)

## Registry Item Structure

Each registry item includes:

- Component files with their content
- Dependencies (shadcn/ui components)
- Metadata (description, category, etc.)

The registry item is generated from the files listed in `registry.json`.
