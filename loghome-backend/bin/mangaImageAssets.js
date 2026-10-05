const sharp = require('sharp');
// 仍需拦截解压炸弹；正常的高清页漫和长条漫不再受旧的 1 亿像素限制。
const MAX_PIXELS = 300000000;
const STRIP_HEIGHT = 6000;
const openImage = (buffer) => sharp(buffer, { limitInputPixels: MAX_PIXELS });

/** Build bounded strip segments and separate assets without contacting storage directly. */
async function createMangaImageAssets(buffer, { strip = false, upload, isCancelled = () => false }) {
  const originalBuffer = buffer;
  let metadata = await openImage(buffer).metadata();
  if (metadata.orientation && metadata.orientation !== 1) {
    buffer = await openImage(buffer).rotate().toBuffer();
    metadata = await openImage(buffer).metadata();
  }
  const { width, height, format } = metadata;
  if (!width || !height) throw new Error('图片尺寸无法识别');
  if (width * height > MAX_PIXELS) throw new Error('图片像素超过安全上限');
  if (!['jpeg', 'png', 'webp', 'gif'].includes(format)) throw new Error('仅支持 jpg/png/webp/gif');
  // Animated images retain their frames and are never sliced.
  const animated = (metadata.pages || 1) > 1;
  const sourceHeight = animated ? (metadata.pageHeight || height) : height;
  const segments = [];
  const ensureActive = () => { if (isCancelled()) throw new Error('上传已取消'); };
  for (let top = 0; top < sourceHeight; top += strip && !animated ? STRIP_HEIGHT : sourceHeight) {
    ensureActive();
    const h = strip && !animated ? Math.min(STRIP_HEIGHT, sourceHeight - top) : sourceHeight;
    let original = originalBuffer, originalFormat = format;
    if (h !== sourceHeight) {
      const crop = openImage(buffer).extract({ left: 0, top, width, height: h });
      originalFormat = ['jpeg', 'webp'].includes(format) ? format : 'png';
      original = await (originalFormat === 'jpeg' ? crop.jpeg({ quality: 96 }) : originalFormat === 'webp' ? crop.webp({ lossless: true }) : crop.png()).toBuffer();
    }
    const url = await upload(original, originalFormat);
    ensureActive();
    const thumbBuffer = await openImage(original).rotate().resize({ width: 320, height: 480, fit: 'inside', withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
    const thumb = await upload(thumbBuffer, 'webp');
    ensureActive();
    let readingUrl = url;
    if (!animated) {
      // WebP 单边不能超过约 16K；只缩小阅读副本，不改变上传的高清原图。
      const reading = await openImage(original).rotate().resize({ width: 1600, height: 16000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
      readingUrl = await upload(reading, 'webp');
    }
    segments.push({ url, thumb, readingUrl, width, height: h });
  }
  return segments;
}
module.exports = { createMangaImageAssets, MAX_PIXELS, STRIP_HEIGHT };
