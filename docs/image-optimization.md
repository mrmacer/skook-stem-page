# Image optimization

The original photographs and logos remain in their existing `assets/` folders.
Live HTML uses generated WebP variants under `assets/optimized/`, mirroring the
original folder and filename structure with a `.webp` extension.

## Current result

The 14 live pages reference 115 unique raster asset paths. Of those, 100 use
generated files under `assets/optimized/`. Five large JPEG references remain
only as `<picture>` fallbacks on the homepage, and ten already-efficient WebP
or AVIF logos remain in their original branding folders.

The 14 unique optimized images used by the homepage totaled approximately
54.9 MiB in their original formats. Their WebP equivalents total approximately
3.3 MiB. Browsers with WebP support do not transfer the large JPEG files used
as `<picture>` fallbacks.

Only the first hero frame is requested eagerly and receives
`fetchpriority="high"`. Subsequent hero frames and below-the-fold imagery are
eligible for deferred loading. Navigation logos remain eager because they are
visible immediately; footer logos and other below-the-fold marks load lazily.

## Future uploads

1. Add the original image to the appropriate existing `assets/` folder.
2. Reference that original path in the relevant HTML with accurate alt text.
3. Run `scripts/optimize_images.py` from the project root with the bundled
   workspace Python runtime.
4. Confirm the generated WebP looks clean and that the page still crops it as
   intended.

The optimizer caps hero, slideshow, and general gallery photographs at 1920
pixels wide; card banners and AI-generated card art at 1200 pixels; brand marks
at 600 pixels; partner/tool logos at 480 pixels; and school logos at 320
pixels. Photographs use WebP quality 80; transparent artwork uses quality 86.
Existing efficient WebP, AVIF, and SVG assets are retained as-is.

Above-the-fold navigation marks remain eager. The first homepage hero image is
eager and high priority; later slideshow frames and below-the-fold images use
lazy loading and asynchronous decoding. Width and height attributes are
generated from the optimized files to reduce layout shift.
