const sharp = require('sharp');
const MAX_PIXELS = 100000000;
const STRIP_HEIGHT = 6000;

/** Build bounded strip segments and separate assets without contacting storage directly. */
async function createMangaImageAssets(buffer, { strip = false, upload, isCancelled = () => false }) {
  const originalBuffer = buffer;
  let metadata = await sharp(buffer, { limitInputPixels: MAX_PIXELS }).metadata();
  if (metadata.orientation && metadata.orientation !== 1) {
    buffer = await sharp(buffer, { limitInputPixels: MAX_PIXELS }).rotate().toBuffer();
    metadata = await sharp(buffer).metadata();
  }
  const { width, height, format } = metadata;
  if (!width || !height || width > 20000 || width * height > MAX_PIXELS) throw new Error('图片尺寸过大或无法识别');
  if (!['jpeg', 'png', 'webp', 'gif'].includes(format)) throw new Error('仅支持 jpg/png/webp/gif');
  // Animated images retain their frames and are never sliced.
  const animated = (metadata.pages || 1) > 1;
  const sourceHeight = animated ? (metadata.pageHeight || height) : height;
  if (!strip && sourceHeight > 20000) throw new Error('页漫图片高度不能超过 20000 像素，请改用条漫');
  const segments = [];
  const ensureActive = () => { if (isCancelled()) throw new Error('上传已取消'); };
  for (let top = 0; top < sourceHeight; top += strip && !animated ? STRIP_HEIGHT : sourceHeight) {
    ensureActive();
    const h = strip && !animated ? Math.min(STRIP_HEIGHT, sourceHeight - top) : sourceHeight;
    let original = originalBuffer, originalFormat = format;
    if (h !== sourceHeight) {
      const crop = sharp(buffer).extract({ left: 0, top, width, height: h });
      originalFormat = ['jpeg', 'webp'].includes(format) ? format : 'png';
      original = await (originalFormat === 'jpeg' ? crop.jpeg({ quality: 96 }) : originalFormat === 'webp' ? crop.webp({ lossless: true }) : crop.png()).toBuffer();
    }
    const url = await upload(original, originalFormat);
    ensureActive();
    const thumbBuffer = await sharp(original).rotate().resize({ width: 320, height: 480, fit: 'inside', withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
    const thumb = await upload(thumbBuffer, 'webp');
    ensureActive();
    let readingUrl = url;
    if (!animated) {
      const reading = await sharp(original).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
      readingUrl = await upload(reading, 'webp');
    }
    segments.push({ url, thumb, readingUrl, width, height: h });
  }
  return segments;
}
module.exports = { createMangaImageAssets, MAX_PIXELS, STRIP_HEIGHT };
