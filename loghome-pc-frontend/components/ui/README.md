# UI icons

`SiteIcon.vue` renders the vendored Phosphor glyphs in `assets/icons/phosphor-glyphs.js`.
The source revision and MIT license are recorded beside the glyphs. Only the icons
used by the UI are included; no external font, runtime download, or new package is required.

```vue
<SiteIcon name="image" /> 图片
<SiteIcon name="heart" :filled="liked" />
```

Icons inherit `currentColor` and font size. The default size is `1.125em`.
Keep a visible text label or an accessible name on the surrounding button/link;
the SVG itself is decorative and hidden from assistive technology.
Use the regular glyphs by default and the filled heart for the liked state.

Do not use emoji as UI icons. Emoji in user content and the emoji picker data remain content.
Keep the homepage's intentionally pixelated brand icons and existing interface icons.
For a missing glyph, import its official SVG paths with the source/license recorded;
do not draw a substitute by hand.
