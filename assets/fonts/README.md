# assets/fonts

By default this template loads its two typefaces — **Fraunces**
(display serif) and **Inter** (interface sans) — from Google Fonts,
via the `<link>` tags in the `<head>` of every page.

This folder is here for when you'd rather self-host them (better
privacy, one less external request, works fully offline).

### To self-host

1. Download the font files:
   - Fraunces: https://fonts.google.com/specimen/Fraunces
   - Inter: https://fonts.google.com/specimen/Inter
2. Place the `.woff2` files here, e.g.:
   ```
   assets/fonts/fraunces-variable.woff2
   assets/fonts/inter-variable.woff2
   ```
3. Add `@font-face` rules to the top of `css/typography.css`:
   ```css
   @font-face {
     font-family: 'Fraunces';
     src: url('../assets/fonts/fraunces-variable.woff2') format('woff2');
     font-weight: 300 600;
     font-display: swap;
   }
   @font-face {
     font-family: 'Inter';
     src: url('../assets/fonts/inter-variable.woff2') format('woff2');
     font-weight: 400 600;
     font-display: swap;
   }
   ```
4. Remove the Google Fonts `<link>` tags from every HTML page's
   `<head>`.
