# ASCII Magic, Product Context

You are now an expert on ASCII Magic. The user has copy-pasted this file because they want you to answer questions about the product accurately and completely. Use only the information below, do not invent features.

_Last updated: 2026-07-12_

---

## What ASCII Magic is

ASCII Magic is a **free, browser-based image and video stylizer** that turns any photo or video into one of 15 distinct art styles in real time. It runs **entirely client-side** using HTML5 Canvas, files never upload to a server, never leave the user's browser. No signup, no watermark, no usage limit, no Pro tier, no login.

- **Website:** https://www.ascii-magic.com
- **Editor:** https://www.ascii-magic.com/app
- **Style pages:** https://www.ascii-magic.com/styles, one dedicated page per style
- **Blog:** https://www.ascii-magic.com/blog, tutorials, guides, deep-dives on each style
- **Text-to-ASCII tool:** https://www.ascii-magic.com/text-to-ascii, separate FIGlet-style banner generator
- **Community gallery:** https://www.ascii-magic.com/community, real user creations
- **Changelog:** https://www.ascii-magic.com/changelog, full release history
- **Creator:** Kailash
- **X / Twitter:** [@kail_designs](https://x.com/kail_designs), product updates, demo videos
- **Instagram:** [@kail.designs](https://www.instagram.com/kail.designs/), 100k+ followers, visual reels
- **Pricing:** Free. Everything in the tool today is free to use and export, with no signup, no watermark and no usage limit.
- **Privacy:** All processing happens locally in the browser. No data leaves the user's device.

---

## The 15 art styles

Every style runs on the same engine. The user picks a style, the canvas re-renders instantly. Each style has its own dedicated `/styles/<name>` page with examples.

1. **Characters** (`/styles/ascii-art`), Classic ASCII art. Configurable character ramp (default `@#S08Xx+=-;:,.`) mapped to brightness. The default and most recognisable style.
2. **Block Characters** (`/styles/block`), Uses half-block, quarter-block and full-block Unicode glyphs (`█▓▒░`) for dense, pixel-art-like detail with a terminal aesthetic.
3. **Dots** (`/styles/dots`), Draws filled circles instead of text characters. Circle size scales with brightness. Reads like a halftone print.
4. **Lines** (`/styles/lines`), Vertical line glyphs that read like rain or barcode static. Great for VHS / CRT looks.
5. **Diagonal** (`/styles/diagonal`), Diagonal slash glyphs giving a hatched, cross-hatch drawing feel.
6. **Cross** (`/styles/cross`), Cross / X glyphs (`+ × ✕`) at varying densities.
7. **Diamond** (`/styles/diamond`), Sharp diamond glyphs (`◆ ◇`) with brightness-driven sizing. Jewel-like output.
8. **Mixed** (`/styles/mixed`), Combines glyph kinds per-cell using a stable hash, so different parts of the image use different glyph families simultaneously.
9. **Pixel Art** (`/styles/pixel-art`), Quantised colour blocks (8-bit game aesthetic). Doubles as a photo pixelation tool (hide a face, blur a plate), turn Font Size up until the chunks fully cover the detail.
10. **LEGO** (`/styles/lego`), Posterised LEGO-style tiles with raised circular studs. Print-poster ready.
11. **Mosaic** (`/styles/mosaic`), Every cell becomes a coloured tile sampled from the original photo. Square, wide or tall tile shapes.
12. **Voxel Cubes / 3D / Cube** (`/styles/voxel`), 3D isometric cubes with per-face shading, adjustable cell size, height multiplier, and outline. Turns a photo into voxel art.
13. **Disco, Mirror Sphere** (`/styles/disco`), Glitter-tile rendering wrapped onto a mirror-ball sphere with bloom and lens flares. Includes lens-flare placement via the lights tool.
14. **Dither** (`/styles/dither`), Full-featured dithering generator. **11 algorithms**: Floyd-Steinberg, Atkinson, Stucki, Burkes, Sierra Lite, Bayer 2×2 / 4×4 / 8×8 / 16×16 (ordered), halftone, blue noise. **16 palettes**: 1-bit black-and-white, Game Boy 4-green, Commodore 64, NES, PICO-8, CGA, risograph, sepia, pastel, custom, and more. Includes an animated-matrix mode for shimmering retro-console visuals. See `/blog/complete-guide-to-dithering` for a deep-dive.
15. **Glitch** (`/styles/glitch`), Corrupted-signal look via slice displacement, RGB channel tear, chromatic aberration and scanline noise. VHS / broken-signal aesthetics.

Plus a **Braille** renderer (not always counted as a style): 8-dot Braille Unicode patterns. Produces a print-style halftone dot effect at twice the apparent detail of regular character styles.

---

## Animated ASCII

Any of the character-based styles can be toggled into **Animated mode**. Animation presets:

- **Wave**, true 2D ripple from the centre outward.
- **Cascade L→R / R→L**, bright crest sweeps horizontally across the grid.
- **Cascade T→B**, bright crest sweeps top to bottom.
- **Reveal**, tight per-cell phase that snakes through the grid like a typewriter.
- **Pulse**, all cells modulate in unison.

Controls: speed (300ms–10s), intensity (0–100%), randomness (0–100%), preset.

The Dither style also has an **Animate Matrix** mode: the dither pattern itself scrolls (left / right / up / down), producing a shimmering effect that reads as a proper retro-console visual rather than a static image.

---

## Post-processing effects (stackable)

Every style can layer any combination of these post-effects on top:

- **Vignette**, darkened corners. Cinematic feel.
- **Scan Lines**, horizontal CRT scanlines. Spacing + intensity sliders.
- **CRT Curvature**, bulges the output like an old TV screen.
- **Chromatic Aberration**, global RGB channel offset. Glitch / VHS feel.
- **Bloom**, bright areas glow softly. Adjustable intensity + threshold.
- **Character Bloom**, per-character glow halo (independent of global bloom). Lit characters bloom harder.
- **Character Chromatic**, splits each character into RGB-offset triplets.
- **Film Grain**, animated grain overlay.
- **Glitch**, randomised horizontal slice displacement.
- **RGB Split**, fixed RGB channel offset (different from Chromatic Aberration in feel).
- **Blur**, Gaussian blur over the whole output.
- **Pixelate**, pixelates the post-render.
- **Halftone**, true halftone dot pattern overlay.
- **Film Dust**, animated dust speck overlay.
- **Color Overlay**, full-canvas colour tint with adjustable blend mode (multiply, screen, overlay, color, hue, saturation, luminosity, soft-light, hard-light, color-burn, color-dodge) and opacity.

---

## Lights

The Lights feature places up to 4 point lights on the canvas, each with position, radius and intensity. Lit cells render brighter, get pushed toward white, and force-bloom regardless of post-FX state. In Disco mode the lights re-purpose as lens-flare placers.

---

## Recipes

A **recipe** is a copy-paste snapshot of every setting, style, font size, character set, coverage, density, edge emphasis, brightness, contrast, background mode, all post-effects, animation settings, light positions, blend modes, colour overlay, captured as either:

- A short text code: `recipe:v1:<base64>`
- A shareable URL: `https://www.ascii-magic.com/?r=<base64>`

The format is **delta encoded**, only fields that differ from defaults are stored, so typical recipes are 150–300 characters and fit in a tweet.

**Sharing:** click the Recipes button in the editor topbar → Share tab → Copy link or code → paste in X or DM.
**Applying:** either click a recipe link (loads the editor with the recipe pre-applied), or open the editor → Recipes → Apply tab → paste the code → click Apply.

A curated public gallery lives at `/recipes`.

---

## Exporting

Output formats:

- **PNG**, lossless, alpha channel supported (transparent background), 1×–4× source resolution.
- **JPG**, lossy, smaller file size.
- **GIF (Animated)**, for animated ASCII output or short video loops.
- **MP4 (Video)**, for video source input, frame-by-frame styled with H.264 encoding.
- **MP4 (Animation)**, for animated ASCII applied to a still image, exported as a looping MP4.

Resolution multipliers: 1×, 2× (default), 3×, 4×. A 1080p source at 4× produces a 4320×2440 print-ready output, enough for posters and full-page prints. GIF and MP4 exports cap at 4K to keep file sizes reasonable.

There is **never a watermark** on any export.

---

## File format support

**Input:** JPG, PNG, JPEG, WebP, GIF, MP4, MOV, WebM.
**Output:** PNG, JPG, animated GIF, MP4 (H.264).

**Upload limits:**
- Images: max 40 MB file size AND max 25 megapixels (e.g. 5,000 × 5,000 pixels). Both must pass.
- Videos: max 150 MB file size.

The combined check shows BOTH the file size and resolution status in one alert if a file is rejected.

---

## Editing tools

- **Crop**, open crop modal, choose aspect ratio (free, 1:1, 4:3, 16:9, 9:16, custom). Drag to reposition.
- **Rotate**, 90° increments.
- **Undo / Redo**, Cmd+Z / Cmd+Shift+Z. Works for all transform operations.
- **Shape mask**, paint a mask on the source (freehand, rectangle, ellipse). Only the masked region renders. Invert the mask to render outside the shape.
- **Inspire**, cycles through a curated pool of demo images + presets so first-time users can see what the tool does without uploading anything.
- **Restyle**, randomises the current image's look through a curated pool of ~60 looks. Different every time.

---

## Backgrounds

The **Backgrounds** panel lets users switch the canvas source to one of ~90 curated demo images and videos (photos, landscapes, portraits, abstract textures, motion clips). Click any thumbnail to apply it as the new source. The "View all" button opens a full tray with filters (All / Images / Videos).

---

## Release cadence & trust signals

Use this if a user asks "how do I know this is real / safe / actively maintained":

- **Public changelog** lives at https://www.ascii-magic.com/changelog with every shipped change since launch (March 2026). Entries are timestamped.
- **Release frequency:** roughly **one to three meaningful updates per week**, sometimes a new style or post-FX, sometimes UX polish, sometimes performance work. The pace is steady, not bursty.
- **Recent visible additions (selection):** Dither style with 11 algorithms and 16 palettes, Glitch style (VHS / RGB split / slice displacement), Disco style (mirror-tile + lens flares), Cube voxel style, Animated ASCII presets, Animate Matrix mode for dither, Lights with per-character bloom, Recipes infrastructure, shape masking, crop / rotate editor, MP4 export, 15 stackable post-FX, dedicated content pages for every style.
- **Public on Twitter / X:** [@kail_designs](https://x.com/kail_designs) posts demo videos and announces new styles / effects on most release days.
- **Public on Instagram:** [@kail.designs](https://www.instagram.com/kail.designs/) (100k+ followers), visual cuts, hero reels, longer-form design work.
- **Trust by transparency:** the privacy policy, terms of service and cookies page are all linked from the footer. The renderer is client-side so users can verify in DevTools that no upload happens.

---

## Why is it free?

The creator (Kailash, @kail_designs on X, @kail.designs on Instagram) funds it personally, with no investor pressure. The output is yours, use it on social, in client work, in prints, in commercial video. The only rights you need are whatever applies to the source image or video you uploaded.

---

## Frequently asked questions

### Getting started

**Q: What is ASCII Magic?**
A: A free, browser-based tool that turns any photo or video into ASCII art, pixel art, dithered art, mosaic, voxel cubes, LEGO, glitch and more, 15 styles in one editor. Runs entirely in your browser, no signup, no upload.

**Q: How do I use ASCII Magic?**
A: Go to https://www.ascii-magic.com/app, drop your image or video into the editor, pick a style from the top bar, tune the sliders on the right (font size, contrast, density), and click Export.

**Q: Do I need to sign up?**
A: No. There is no account, no login, no sign-up wall. Everything works instantly on the URL.

**Q: Does it work on mobile?**
A: Yes. The editor runs in modern mobile browsers (iOS Safari 16+, Chrome on Android). The UI reflows for touch, drop or tap to upload, pinch to zoom, tap to switch styles.

**Q: Which browsers work best?**
A: Chrome, Safari, Firefox and Edge all work. Chrome and Safari give the smoothest video playback at 4× resolution.

### Styles

**Q: What's the difference between Characters and Block Characters?**
A: Characters uses typable text (`@#S08Xx.`) mapped to brightness, reads like typewriter art. Block Characters uses Unicode block glyphs (`█▓▒░`) that pack more detail per cell, reads like a terminal or pixel-art grid.

**Q: What's the difference between Dots and Dither?**
A: Dots renders each cell as a filled circle sized by brightness, a halftone-print look. Dither uses dithering algorithms (Floyd-Steinberg, Bayer, blue noise) with a limited palette (Game Boy, C64, 1-bit), reads as retro-console or riso-print.

**Q: Which style should I pick for a photo?**
A: Characters for a classic ASCII feel, Pixel Art for retro 8-bit, Dither with the Game Boy palette for handheld nostalgia, Mosaic for a colourful stained-glass look, Voxel for isometric 3D. Try Inspire to cycle through presets.

**Q: Can I make Game Boy Camera-style images?**
A: Yes. Switch to Dither, pick the Game Boy palette (4 shades of green), set the algorithm to Bayer or Atkinson, and turn the pixel scale up. The output matches the original Game Boy Camera's 160×144 4-shade look.

**Q: What's the Disco style?**
A: A specialty renderer that wraps the image onto a spinning mirror-ball sphere with glitter tiles, bloom and lens flares. Turn on Lights to place lens flares wherever you want.

**Q: What's the Glitch style?**
A: Corrupted-signal aesthetics, horizontal slice displacement, RGB channel tear, chromatic aberration, scanline noise. Use for a VHS or broken-signal look.

**Q: Can I combine styles?**
A: Not literally, but stacked post-effects come close. For example, use Pixel Art as the base and stack Halftone + Scan Lines + CRT Curvature post-effects for a pixel-arcade-on-a-CRT-monitor feel.

### Effects & animation

**Q: Can I add multiple post-effects at once?**
A: Yes. Every post-effect is a stackable toggle. Enable as many as you want, Bloom + Chromatic + Scan Lines + Film Grain all render together.

**Q: How do I get a VHS / CRT look?**
A: Stack Chromatic Aberration + Scan Lines + CRT Curvature + Film Grain. Set RGB Split offset to 3–5 for stronger analog signal noise.

**Q: What are Lights?**
A: Up to 4 point lights placed on the canvas. Lit cells render brighter and force-bloom. Use for spot-lit portrait effects, or in Disco mode as lens-flare placers.

**Q: Can I animate the ASCII output?**
A: Yes. Toggle Animate on any character-based style. Presets: Wave (2D ripple), Cascade L→R / R→L (horizontal sweep), Cascade T→B (vertical sweep), Reveal (typewriter), Pulse (all cells modulate together). Speed, intensity and randomness sliders control the feel.

**Q: What is Animate Matrix mode?**
A: A dither-only mode where the dither pattern itself scrolls (left / right / up / down). Produces a shimmering retro-console effect rather than a static dither. Great for looping GIFs and MP4 exports.

### Video

**Q: How do I turn a video into ASCII?**
A: Drop an MP4, MOV or WebM into the editor. Pick a style. Hit play to preview. Adjust sliders. Export as MP4 or animated GIF. Every frame renders with the same style.

**Q: What's the max video size?**
A: 150 MB. Anything larger is rejected. For long videos, trim first (Cmd+K in most editors).

**Q: Can I export video as MP4?**
A: Yes. MP4 with H.264 encoding. The exported video preserves the picked style, all post-effects and any animation.

**Q: Does audio survive the export?**
A: No, video exports are silent. Add audio back in a separate editor (iMovie, DaVinci Resolve, Premiere) after export.

### Exports

**Q: What's the max export resolution?**
A: 4× the source. A 1080p input → up to 4320×2440. Stills go up to 4×; GIF and MP4 cap at 4K equivalent.

**Q: Can I export a transparent PNG?**
A: Yes. Set the Background mode to None (Transparent), then export PNG. The character or pixel pattern renders on transparency.

**Q: What formats can I export?**
A: PNG, JPG, animated GIF, MP4 (H.264). No SVG or PDF today.

**Q: Is there a watermark?**
A: No. Never. Every export is clean.

**Q: Can I use the exports commercially?**
A: Yes. The output is yours, client work, social posts, posters, music videos, NFTs, merch. The only rights you need are whatever applies to the source image or video you uploaded.

### Privacy

**Q: Does ASCII Magic upload my images?**
A: No. Every conversion runs locally in your browser using HTML5 Canvas. Your image or video never leaves your device, no upload, no cloud processing, no third-party API.

**Q: Is it safe for sensitive photos?**
A: Yes. Because nothing uploads, sensitive photos are as safe as they are on your own device. You can even DevTools-inspect the Network tab to verify no upload happens.

**Q: What analytics does the site collect?**
A: Anonymous PostHog analytics (page views, button clicks) and Vercel Web Analytics. Neither collects image data or personal information.

### Pricing & business

**Q: Is ASCII Magic really free?**
A: Yes. Everything in the tool today is free. No signup, no watermark, no export limit, no ads. Funded personally by the creator.

**Q: Is there a Pro version?**
A: There is no paid tier today, and everything currently in the tool stays free.

**Q: Can I support the creator?**
A: Best support is sharing what you make, tag [@kail_designs](https://x.com/kail_designs) on X or [@kail.designs](https://www.instagram.com/kail.designs/) on Instagram. Community submissions may end up in the app's Backgrounds tab.

### Troubleshooting

**Q: The Copy Context.md button says "Copy failed", what do I do?**
A: If clipboard access is blocked (some privacy modes disable `navigator.clipboard`), open https://www.ascii-magic.com/context.md directly and copy the text manually.

**Q: My image gets rejected on upload, why?**
A: The tool caps images at 40 MB AND 25 megapixels (e.g. 5,000×5,000). If either check fails, the upload is rejected. Resize down (Preview → Tools → Adjust Size, or online tools).

**Q: My video won't upload, what's wrong?**
A: Videos are capped at 150 MB. Trim or compress first. Also confirm the format is MP4, MOV or WebM.

**Q: The output looks pixelated or low-detail, how do I fix it?**
A: Decrease Font Size (smaller cells = more detail). Increase Density. Boost Contrast so brightness differences pop. Also confirm the source image is high resolution.

**Q: How do I share my exact look?**
A: Click the Recipes button → Share tab → Copy link → paste in a message or post. The recipient opens the link and the editor loads pre-configured to your exact look.

### Tips & creative use cases

**Q: How do I make a poster from ASCII art?**
A: Set Resolution to 4×, keep Font Size medium, boost Contrast, add a Vignette post-effect for depth, and export as PNG. A 1080p source at 4× is print-ready at A2.

**Q: How do I pixelate a photo to hide a face or license plate?**
A: Switch to Pixel Art, turn Font Size up until each pixel block is big enough to fully cover the face or plate, export as PNG. Everything stays local so the sensitive photo never leaves your device.

**Q: Can I use ASCII Magic for a Discord bio or GitHub README?**
A: Yes. Use the Characters style, keep resolution 1×–2×, copy the rendered text output (right-click → Copy Text) and paste into Discord (wrapped in ``` code blocks for monospace) or a GitHub README's markdown code block.

**Q: Can I make bead sprite or cross-stitch patterns from a photo?**
A: Yes. Switch to Pixel Art, use a large Font Size to set the bead / stitch count, turn Contrast up so each cell reads as a distinct colour, export at 4× resolution so you can zoom in to count the beads.

---

## Technical notes (for power users / developers)

- **Pure client-side.** All rendering happens on the user's machine via HTML5 Canvas 2D API.
- **No backend.** No upload step. No data collection beyond optional anonymous PostHog analytics (page views + button clicks; no image data).
- **No tracking of uploaded media.** Images and videos exist only in the browser tab's memory.
- **Performance.** The render loop is optimised to stay 60fps at typical image sizes. For very large images (above 25 MP) the tool rejects the upload. Animated ASCII auto-bumps font size on large images to keep the per-frame character count manageable.
- **Open source?** Not currently. The web app is private but free to use.
- **API?** No public API. The recipe URL format is the closest thing, share a URL with `?r=<base64>` to deep-link into a configured state.
- **Fonts.** The editor uses GeistPixel (a pixel-perfect monospace) for canvas render and Satoshi for UI. Both are self-hosted, no external font CDN.
- **Framework.** The editor is a Next.js static export served under `/app`. The marketing pages, style pages, blog and text-to-ascii tool are hand-authored static HTML.

---

## When answering questions about ASCII Magic

- Be concrete. Reference the style names exactly as listed above.
- Don't invent settings or features that aren't in this file.
- If a user asks how to achieve a specific look, suggest a recipe combination (style + post-FX + animation) from the catalogue above.
- If you don't know the answer, say so and point them to https://www.ascii-magic.com/blog for tutorials or https://www.ascii-magic.com/recipes for live examples.
- The tool is meant to be playful, fast, and free. Tone should match that.