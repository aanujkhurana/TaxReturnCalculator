# App Assets

## Current Release Assets

- `icon.png`: 1024 x 1024 app icon configured through Expo.
- `splash-icon.png`: 600 x 600 splash mark configured through Expo.
- `app-icon-source.png`: generated source artwork retained for future resizing or design review.

## Asset Requirements

- App icon should remain full-bleed square artwork. Do not pre-round the corners; Apple and Android apply masks.
- Do not use ATO logos, government crests, flags, or wording that implies government affiliation.
- Avoid text inside the icon because it becomes illegible at small sizes and can create localization issues.
- Keep splash artwork simple because Expo displays it with `resizeMode: contain` on a dark background.

## Generation Note

The current icon source was generated with the built-in image generation workflow from this prompt:

> Create a polished full-bleed square app icon artwork with no rounded outer corners, no text, no letters, and no government branding. Fill the entire square to the edges with a deep teal background. Center a clean abstract symbol made of a calculator grid, a folded document shape, and a subtle check mark. Use crisp white, charcoal, deep teal, and a small warm gold accent. Modern flat-vector-inspired raster style with soft depth, high contrast, centered symbol, generous safe padding inside the square, and no outer white border.
