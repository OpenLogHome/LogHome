// 测试搜索功能的增强版实现
const axios = require('axios');
const nodejieba = require('nodejieba');

// 测试配置
const API_URL = 'http://localhost:3000'; // 修改为你的API地址
const TEST_KEYWORDS = [
  '科幻小说推荐',
  '原创奇幻',
  '热门社区话题',
  '用户反馈'
];

// 测试函数
async function testSearch() {
  console.log('开始测试增强版搜索功能...');
  
  for (const keyword of TEST_KEYWORDS) {
    console.log(`\n测试关键词: "${keyword}"`);
    
    // 显示分词结果
    const segments = nodejieba.cut(keyword, true);
    console.log(`分词结果: ${segments.join(', ')}`);
    
    try {
      // 执行搜索
      const response = await axios.get(`${API_URL}/community/search`, {
        params: {
          keyword,
          type: 'all',
          page: 1,
          pageSize: 10
        }
      });
      
      const results = response.data.results;
      
      // 显示搜索结果统计
      console.log('搜索结果统计:');
      console.log(`- 书籍: ${results.books.list.length || 0}/${results.books.total || 0}`);
      console.log(`- 帖子: ${results.posts.list.length || 0}/${results.posts.total || 0}`);
      console.log(`- 圈子: ${results.circles.list.length || 0}/${results.circles.total || 0}`);
      console.log(`- 用户: ${results.users.list.length || 0}/${results.users.total || 0}`);
      
      // 显示部分结果
      if (results.books && results.books.list.length > 0) {
        console.log('\n书籍结果示例:');
        results.books.list.slice(0, 2).forEach((book, i) => {
          console.log(`${i+1}. ${book.name} - ${book.author_name}`);
        });
      }
      
      if (results.posts && results.posts.list.length > 0) {
        console.log('\n帖子结果示例:');
        results.posts.list.slice(0, 2).forEach((post, i) => {
          console.log(`${i+1}. ${post.title} - ${post.author_name}`);
        });
      }
      
    } catch (error) {
      console.error(`测试关键词 "${keyword}" 失败:`, error.message);
    }
  }
  
  console.log('\n测试完成!');
}

// 运行测试
testSearch().catch(console.error); 