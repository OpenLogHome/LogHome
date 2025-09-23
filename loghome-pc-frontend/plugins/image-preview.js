import Vue from 'vue'

// 简单的图片预览功能
const ImagePreview = {
  install(Vue) {
    Vue.prototype.$preview = function(images, index = 0) {
      // 确保images是数组
      const imageList = Array.isArray(images) ? images : [images]
      
      // 创建预览容器
      const previewContainer = document.createElement('div')
      previewContainer.className = 'image-preview-container'
      previewContainer.innerHTML = `
        <div class="image-preview-overlay">
          <div class="image-preview-wrapper">
            <div class="image-preview-header">
              <span class="image-preview-counter">${index + 1} / ${imageList.length}</span>
              <button class="image-preview-close">&times;</button>
            </div>
            <div class="image-preview-content">
              <button class="image-preview-prev" ${imageList.length <= 1 ? 'style="display:none"' : ''}>&lt;</button>
              <img class="image-preview-img" src="${imageList[index]}" alt="预览图片" />
              <button class="image-preview-next" ${imageList.length <= 1 ? 'style="display:none"' : ''}>&gt;</button>
            </div>
          </div>
        </div>
      `
      
      // 添加样式
      const style = document.createElement('style')
      style.textContent = `
        .image-preview-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-preview-wrapper {
          position: relative;
          max-width: 90%;
          max-height: 90%;
          display: flex;
          flex-direction: column;
        }
        
        .image-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          color: #fff;
        }
        
        .image-preview-counter {
          font-size: 16px;
        }
        
        .image-preview-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 30px;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.3s;
        }
        
        .image-preview-close:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .image-preview-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-preview-img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
        }
        
        .image-preview-prev,
        .image-preview-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          padding: 10px 15px;
          border-radius: 50%;
          transition: background-color 0.3s;
          z-index: 1;
        }
        
        .image-preview-prev:hover,
        .image-preview-next:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        
        .image-preview-prev {
          left: -60px;
        }
        
        .image-preview-next {
          right: -60px;
        }
        
        @media (max-width: 768px) {
          .image-preview-prev {
            left: 10px;
          }
          
          .image-preview-next {
            right: 10px;
          }
        }
      `
      
      document.head.appendChild(style)
      document.body.appendChild(previewContainer)
      
      let currentIndex = index
      
      // 更新图片
      const updateImage = () => {
        const img = previewContainer.querySelector('.image-preview-img')
        const counter = previewContainer.querySelector('.image-preview-counter')
        img.src = imageList[currentIndex]
        counter.textContent = `${currentIndex + 1} / ${imageList.length}`
      }
      
      // 事件处理
      const closePreview = () => {
        document.body.removeChild(previewContainer)
        document.head.removeChild(style)
      }
      
      const prevImage = () => {
        if (currentIndex > 0) {
          currentIndex--
          updateImage()
        }
      }
      
      const nextImage = () => {
        if (currentIndex < imageList.length - 1) {
          currentIndex++
          updateImage()
        }
      }
      
      // 绑定事件
      previewContainer.querySelector('.image-preview-close').addEventListener('click', closePreview)
      previewContainer.querySelector('.image-preview-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          closePreview()
        }
      })
      
      const prevBtn = previewContainer.querySelector('.image-preview-prev')
      const nextBtn = previewContainer.querySelector('.image-preview-next')
      
      if (prevBtn) prevBtn.addEventListener('click', prevImage)
      if (nextBtn) nextBtn.addEventListener('click', nextImage)
      
      // 键盘事件
      const handleKeydown = (e) => {
        switch (e.key) {
          case 'Escape':
            closePreview()
            break
          case 'ArrowLeft':
            prevImage()
            break
          case 'ArrowRight':
            nextImage()
            break
        }
      }
      
      document.addEventListener('keydown', handleKeydown)
      
      // 清理函数
      const originalClose = closePreview
      previewContainer.closePreview = () => {
        document.removeEventListener('keydown', handleKeydown)
        originalClose()
      }
      
      // 重新绑定关闭事件
      previewContainer.querySelector('.image-preview-close').addEventListener('click', previewContainer.closePreview)
      previewContainer.querySelector('.image-preview-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          previewContainer.closePreview()
        }
      })
    }
  }
}

Vue.use(ImagePreview)

export default ImagePreview