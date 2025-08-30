<template>
  <div class="agreement-page">
    <div class="page-header">
      <h1 class="page-title">原木社区用户内容上传协议</h1>
    </div>

    <div class="agreement-container">
      <div class="agreement-content">
        <h2>一、总则</h2>
        <p>1.1 本协议是您与原木社区（以下简称"本社区"）之间关于您使用本社区提供的网络服务所订立的协议。</p>
        <p>1.2 您在使用本社区提供的网络服务之前，应当仔细阅读本协议，充分理解各条款内容，特别是免除或限制责任的条款以及开通或使用某项服务的单独协议。</p>
        <p>1.3 您一旦注册、登录、使用或以任何方式使用本协议所涉及的相关服务，即视为您已阅读并同意受本协议约束。</p>

        <h2>二、内容规范</h2>
        <p>2.1 您在本社区上传、发布的内容应当符合国家法律法规、社会公序良俗和本社区的相关规定。</p>
        <p>2.2 您保证对您所上传、发布的内容拥有合法的知识产权或使用权，不侵犯任何第三方的合法权益。</p>
        <p>2.3 常见侵犯知识产权的情形：</p>
        <ul>
          <li>未经授权，将他人作品<strong>转载</strong>，发表至原木社区；</li>
          <li>未经授权，<strong>改编</strong>他人作品，发表至原木社区；</li>
          <li>未经授权，将他人作品<strong>过多引用或重新组织语句</strong>，发表至原木社区；</li>
          <li>未经授权，发表与他人<strong>大纲雷同度高</strong>的作品至原木社区；</li>
          <li>未经授权，将电影、电视剧、动漫等<strong>视频化内容改编</strong>成文字，发表至原木社区；</li>
          <li>未经授权，将<strong>漫画改编</strong>成文字，发表至原木社区；</li>
          <li>未经授权，将戏剧、词曲等<strong>艺术作品改编</strong>，发表至原木社区；</li>
          <li>未经授权，将<strong>网络图片</strong>发布于作品中；</li>
          <li>其它违法违规行为。</li>
        </ul>
        
        <p>2.4 常见的违规情形：</p>
        <ul>
          <li>利用作品发布<strong>虚假欺诈广告</strong>；</li>
          <li>利用作品外站<strong>拉人、拉书</strong>；</li>
          <li>利用作品<strong>谩骂编辑、平台</strong>，<strong>恶意攻击他人或传播谣言</strong>；</li>
          <li>利用作品传播<strong>色情文字或图片</strong>；</li>
          <li>利用作品<strong>恶意传播宗教、政治倾向、暴力等情形</strong>；</li>
          <li>其它不文明违规行为。</li>
        </ul>
        
        <h2>三、权益保护与处罚</h2>
        <p>3.1 如发现<strong>站内</strong>有侵犯知识产权或违规情形，请联系社区管理员。若情况属实，根据情节严重将会受到警告、禁言、封号、删除违法违规作品、追究法律责任的处罚；</p>
        <p>3.2 如发现<strong>站外</strong>有侵犯本站作品作者知识产权的情形，请准备相关证据资料，联系原木社区，我们会运用<strong>法律手段协助作者维护权益</strong>。</p>

        <h2>四、权利声明</h2>
        <p>4.1 您保留对您上传、发布内容的著作权和其他合法权益。</p>
        <p>4.2 您授予本社区一项全球性、免费、非独家、可转授权的许可，允许本社区在全球范围内、在本协议期限内，为实现本社区的目的而使用、复制、修改、改编、出版、翻译、创建衍生作品、传播、表演和展示您的内容，和/或将前述权利的全部或部分转授权给第三方。</p>
        <p>4.3 本社区有权但无义务对您上传、发布的内容进行审核，有权根据相关法律法规的要求或本社区的判断对您上传、发布的内容进行删除或采取其他处理措施。</p>

        <h2>五、责任限制</h2>
        <p>5.1 您应对您上传、发布的内容承担全部责任。</p>
        <p>5.2 如因您上传、发布的内容导致本社区或任何第三方遭受损失，您应当承担全部责任并赔偿相关损失。</p>
        <p>5.3 本社区不对您上传、发布的内容的准确性、完整性、适用性等做任何保证。</p>

        <h2>六、协议修改</h2>
        <p>6.1 本社区有权在必要时修改本协议条款，并在本社区网站公布。</p>
        <p>6.2 如您不同意相关变更，请立即停止使用本社区服务。如您继续使用本社区服务，则视为您已接受修改后的协议。</p>

        <h2>七、其他</h2>
        <p>7.1 本协议的成立、生效、履行、解释及争议的解决均适用中华人民共和国法律。</p>
        <p>7.2 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</p>
        <p>7.3 本协议的最终解释权归本社区所有。</p>
      </div>

      <div class="agreement-actions">
        <button class="back-button" @click="$router.back()">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '用户内容上传协议 - 原木社区'
    }
  }
}
</script>

<style lang="scss" scoped>
// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;
$orange-color: #FB7D46;
$orange-dark: #fa6c2e;

.agreement-page {
  width: 100%;
  
  .page-header {
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 32px;
    color: $secondary-color;
  }

  .agreement-container {
    background-color: $background-color;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .agreement-content {
    h2 {
      font-size: 20px;
      color: $secondary-color;
      margin: 30px 0 15px;
      
      &:first-child {
        margin-top: 0;
      }
    }

    p {
      margin: 10px 0;
      line-height: 1.6;
      color: $text-color;
    }

    ul {
      margin: 10px 0;
      padding-left: 20px;
      
      li {
        margin: 8px 0;
        line-height: 1.6;
        color: $text-color;
      }
    }
  }

  .agreement-actions {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }

  .back-button {
    padding: 12px 25px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    background-color: $primary-color;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: $secondary-color;
    }
  }

  @media (max-width: 768px) {
    .agreement-container {
      padding: 20px;
    }
  }
}
</style>