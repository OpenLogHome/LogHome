function flushDraft(){
  clearTimeout(saveTimer);
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}
var exportPreview = document.getElementById('exportPreview');
function closePreview(){
  if (!exportPreview.open) return false;
  exportPreview.close();
  return true;
}
document.getElementById('closePreview').addEventListener('click', closePreview);
document.getElementById('save').addEventListener('click', function(){
  try {
    render();
    var dataUrl = cv.toDataURL('image/png');
    document.getElementById('exportImage').src = dataUrl;
    document.getElementById('downloadImage').href = dataUrl;
    exportPreview.showModal();
  } catch (error) { toast('图片生成失败，请重试'); }
});
window.__loghomePostCover = {save:flushDraft, back:closePreview};
