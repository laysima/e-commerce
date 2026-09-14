# Cressida storefront

The storefront pairs large Manrope typography with Bodoni Moda italic, warm fashion photography, olive ink, and acid yellow. Product photography sits directly on the page in a staggered composition. Department links act as an image index. Visible editorial copy avoids decorative numbering, dashes, and emoji. Links use text without arrow ornaments, and the hero flows directly into the collection edit.

## References

* [Fashion Editorial Website, Jannatul mim on Dribbble](https://dribbble.com/shots/27113822-Fashion-Editorial-Website): editorial scale, generous photography, overlapping visual hierarchy.
* [OFFSET, Jules Sellier on Behance](https://www.behance.net/gallery/243553699/OFFSET-Urban-Fashion-Branding): typography as brand identity and contrast between dense type and open space.
* [React Bits Scroll Reveal](https://reactbits.dev/text-animations/scroll-reveal): inspiration for the progressive word reveal. This implementation uses the existing Motion dependency.
* [Three.js shader examples](https://threejs.org/examples/webgl_shaders_ocean.html): inspiration for a custom pointer driven ripple on the campaign image. The shader is original.

These references inform an original storefront composition. No paid React Bits package or API key is required.

## Motion and rendering

The homepage shares a motion preference and pause control. Reduced motion is read through `useSyncExternalStore` so the initial client render matches the server. Preference changes are observed. The Three.js module loads only for an enabled effect on a device with a fine pointer. Its renderer pauses outside the viewport and disposes its resources on unmount or pause. The HTML photograph remains available when WebGL is unavailable.

Campaign assets are delivered as WebP. Fonts and their licenses are stored locally. Storefront styles are scoped so the existing administration styles remain independent.

## Preview limitation

The configured Supabase hostname failed DNS resolution during validation. The real preview therefore displays the empty collection state. Product layouts and shopping interactions are checked with temporary fixtures in a separate local preview. Those fixtures are not included in the application and do not alter the database. The Supabase connection needs to be restored before a live catalog can be verified or the store can launch.

## Validation

The production build and TypeScript check passed. ESLint passed for the changed TypeScript files, and the diff whitespace check passed. Desktop and mobile browser checks passed with no runtime errors. The isolated sample catalog covered search, price sorting, product details, saving and removing a piece, adding to the bag, changing quantity, department navigation, dialog focus, and Escape. Layout was checked at narrow phone, phone, tablet, and desktop widths. Reduced motion and an unavailable WebGL context were checked separately. No payment was submitted.
