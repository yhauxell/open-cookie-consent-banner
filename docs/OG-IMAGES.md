# Open Graph Images

This project uses Next.js dynamic image generation for Open Graph and Twitter Card previews.

## Implementation

### Files Created

1. **`app/opengraph-image.tsx`** - Generates Open Graph images (1200x630px)
2. **`app/twitter-image.tsx`** - Generates Twitter Card images (1200x630px)

### How It Works

Next.js automatically detects these files and serves them at:
- `/opengraph-image` - For Open Graph (Facebook, LinkedIn, etc.)
- `/twitter-image` - For Twitter Cards

The images are generated dynamically using `@vercel/og` package, which creates PNG images from React components.

## Image Design

The current design features:
- Gradient background (purple/blue)
- Cookie emoji (🍪) and title
- Subtitle: "GDPR & CCPA Compliant Cookie Consent Solution"
- Technology stack: React • Next.js • shadcn/ui

## Testing

### 1. View the Images Directly

Visit these URLs after deployment:
- `https://your-domain.com/opengraph-image`
- `https://your-domain.com/twitter-image`

### 2. Test Open Graph Tags

Use these tools to preview how your site appears when shared:

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Open Graph Preview**: https://www.opengraph.xyz/

### 3. Test Twitter Cards

- **Twitter Card Validator**: https://cards-dev.twitter.com/validator

## Customization

To customize the images, edit the JSX in:
- `app/opengraph-image.tsx`
- `app/twitter-image.tsx`

You can:
- Change colors, fonts, and layout
- Add logos or additional graphics
- Modify text content
- Adjust dimensions (standard is 1200x630px)

## Metadata Configuration

The images are referenced in `app/layout.tsx`:

```typescript
openGraph: {
  images: [
    {
      url: `${baseUrl}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: siteName,
    },
  ],
},
twitter: {
  images: [`${baseUrl}/twitter-image`],
},
```

## Best Practices

1. **Dimensions**: Use 1200x630px for optimal display across platforms
2. **Text**: Keep text minimal and readable at small sizes
3. **Branding**: Include your logo or brand colors
4. **Testing**: Always test on actual platforms before deploying
5. **Caching**: Images are cached by social platforms - use Facebook Debugger to refresh cache

## Troubleshooting

### Images Not Showing

1. Check that `@vercel/og` is installed: `pnpm list @vercel/og`
2. Verify the routes are accessible: Visit `/opengraph-image` directly
3. Check build logs for errors
4. Clear social media platform caches using their debugger tools

### Font Issues

If you see font loading errors:
- Use system fonts: `fontFamily: 'system-ui, -apple-system, sans-serif'`
- Avoid special characters or emojis that require custom fonts
- Test with simple text first

## Next Steps

Consider creating:
- Page-specific OG images (e.g., `/demo/opengraph-image.tsx`)
- Dynamic images with query parameters for customization
- A/B testing different designs

