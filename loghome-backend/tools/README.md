# 工具脚本说明

## update_content_hash.js

### 功能描述
这个脚本用于批量计算并更新数据库中现有文章的 `content_hash` 字段。它会处理以下两个表：
- `articles_writer` 表
- `articles` 表

### 使用方法

#### 方法1：直接运行脚本
```bash
cd d:\Project-LogHome\LogHome\loghome-backend
node tools/update_content_hash.js
```

#### 方法2：在其他脚本中引用
```javascript
const { main, updateArticlesWriterContentHash, updateArticlesContentHash } = require('./tools/update_content_hash.js');

// 更新所有表
await main();

// 或者单独更新某个表
await updateArticlesWriterContentHash();
await updateArticlesContentHash();
```

### 功能特性

1. **批量处理**：一次性处理所有现有文章记录
2. **进度显示**：每处理100条记录显示一次进度
3. **错误处理**：包含完整的错误处理机制
4. **安全性**：只更新有内容的记录，跳过空内容
5. **模块化**：可以作为模块被其他脚本引用

### 输出示例
```
开始批量更新content_hash...
时间: 2024/1/1 上午10:00:00
开始更新articles_writer表的content_hash...
找到 1250 条articles_writer记录需要更新
已更新 100/1250 条articles_writer记录
已更新 200/1250 条articles_writer记录
...
articles_writer表更新完成，共更新 1250 条记录
开始更新articles表的content_hash...
找到 800 条articles记录需要更新
已更新 100/800 条articles记录
...
articles表更新完成，共更新 800 条记录
所有表的content_hash更新完成!
完成时间: 2024/1/1 上午10:05:30
```

### 注意事项

1. **数据库连接**：确保数据库配置正确且可连接
2. **备份建议**：运行前建议备份相关表数据
3. **执行时间**：根据数据量大小，执行时间可能较长
4. **字段要求**：确保目标表已添加 `content_hash` 字段

### 技术实现

- 使用 MD5 算法计算内容哈希值
- 批量查询和更新，提高执行效率
- 异步处理，避免阻塞
- 完整的错误处理和日志输出