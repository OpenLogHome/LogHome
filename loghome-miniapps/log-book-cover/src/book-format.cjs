// Twice the original LogHome cover size, with the same aspect ratio.
const BOOK_RATIO = '499:646';
const BOOK_SIZE = {width:998, height:1292};
const MIN_SIDE = 128, MAX_SIDE = 4096;
const DESIGN_WIDTH = 1080;
const DESIGN_HEIGHT = BOOK_SIZE.height * DESIGN_WIDTH / BOOK_SIZE.width;
function scaleElement(element, scale, offsetX=0, offsetY=0) {
  const result = JSON.parse(JSON.stringify(element));
  result.left = element.left * scale + offsetX;
  result.top = element.top * scale + offsetY;
  if (element.type === 'image') {
    // Fabric image dimensions address source pixels; keep them intact and scale
    // the object, so photos and embedded SVGs are not cropped during conversion.
    result.scaleX = (element.scaleX ?? 1) * scale;
    result.scaleY = (element.scaleY ?? 1) * scale;
  } else {
    for (const key of ['width','height','fontSize','strokeWidth','radius','padding']) {
      if (typeof result[key] === 'number') result[key] *= scale;
    }
    if (result.shadow) for (const key of ['blur','offsetX','offsetY']) {
      if (typeof result.shadow[key] === 'number') result.shadow[key] *= scale;
    }
  }
  return result;
}
function fromDesignElement(element) {
  return scaleElement(element, BOOK_SIZE.width / DESIGN_WIDTH);
}
function validSize(size) {
  return !!size && [size.width,size.height].every(value => Number.isInteger(value) && value>=MIN_SIDE && value<=MAX_SIDE);
}
function sizeError(width,height) {
  return validSize({width:Number(width),height:Number(height)}) ? '' : `宽度和高度须为 ${MIN_SIDE}–${MAX_SIDE} 之间的整数`;
}
function ratioForSize(size) {
  let a=size.width,b=size.height;
  while(b) [a,b]=[b,a%b];
  return `${size.width/a}:${size.height/a}`;
}
function fitDocument(document, size=BOOK_SIZE) {
  if (!validSize(size)) throw new Error('画布尺寸无效');
  if (!document || document.schemaVersion !== 1 || !Array.isArray(document.elements) ||
    !Number.isFinite(document.size?.width) || !Number.isFinite(document.size?.height) ||
    document.size.width <= 0 || document.size.height <= 0) return null;
  const result = JSON.parse(JSON.stringify(document));
  const scale = Math.min(size.width/document.size.width, size.height/document.size.height);
  const offsetX = (size.width-document.size.width*scale)/2;
  const offsetY = (size.height-document.size.height*scale)/2;
  result.elements = document.elements.map(element => scaleElement(element,scale,offsetX,offsetY));
  result.ratio = ratioForSize(size);
  result.size = {...size};
  result.canvasVersion = 2;
  return result;
}
function normalizeDocument(document) {
  if (document?.canvasVersion===2 && !validSize(document.size)) return null;
  return fitDocument(document, document?.canvasVersion===2 ? document.size : BOOK_SIZE);
}
function createDocument(template, size=BOOK_SIZE) {
  return fitDocument(template || {schemaVersion:1,size:BOOK_SIZE,background:{type:'color',color:'#f7f7f2'},elements:[]},size);
}
function adaptElement(element,size) {
  const scale=Math.min(size.width/BOOK_SIZE.width,size.height/BOOK_SIZE.height);
  return scaleElement(element,scale,(size.width-BOOK_SIZE.width*scale)/2,(size.height-BOOK_SIZE.height*scale)/2);
}
module.exports = {BOOK_RATIO, BOOK_SIZE, MIN_SIDE, MAX_SIDE, DESIGN_WIDTH, DESIGN_HEIGHT, scaleElement, fromDesignElement,
  validSize, sizeError, ratioForSize, fitDocument, normalizeDocument, createDocument, adaptElement};
