# assets/images

**hero-scene.jpg** is the Home hero photograph — a museum room with a
blank canvas on the wall. It's shown full-bleed behind the hero
content; see `js/hero-scene.js` for how the color overlay stays
aligned with the canvas in the photo, and its header comment for how
to re-measure the canvas if you swap in a different image.

Everything else on the site (the project mockups on `project.html`,
the About portrait) still uses **CSS-generated visuals** rather than
real photos or screenshots — gradients defined in the CSS and JS
files. That's intentional: it keeps the template dependency-free and
instantly editable (change a project's accent color, get a new
"artwork" automatically).

When you're ready to swap those in for real assets, this is where
they go.

### Replacing the About portrait
1. Add your photo here, e.g. `assets/images/portrait.jpg`.
2. In `about.html`, replace:
   ```html
   <div class="portrait-frame" id="portraitFrame"></div>
   ```
   with:
   ```html
   <div class="portrait-frame">
     <img src="assets/images/portrait.jpg" alt="Portrait of Ángel Rosas">
   </div>
   ```
3. You can remove the placeholder gradient in `css/pages.css` under
   `.portrait-frame` once a real image is in place.

### Replacing a project's mockup screens
The phone mockups on `project.html` are built from HTML/CSS in
`js/gallery.js` (see `phoneScreen()`). If you'd rather show a real
screenshot:
1. Add the image here, e.g. `assets/images/moneymind-01.png`.
2. Swap the `.phone-screen` markup in `phoneScreen()` for an
   `<img>` tag, or add a screenshot into the `.thumb-strip` thumbnails
   the same way.

### Naming convention
Suggested pattern for consistency as the collection grows:
```
assets/images/<project-id>-01.jpg
assets/images/<project-id>-02.jpg
assets/images/portrait.jpg
```

### The seated point of view (pov-scene.jpg)
The second Home scene — the view from the bench. Its painting corners and
wall-text positions are measured in `js/hero-scene.js` (`POV`). If you
replace it, re-measure with `tools/measure-corners.html`.
