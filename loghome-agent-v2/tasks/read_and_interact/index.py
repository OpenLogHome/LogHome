from data_gen.novels import select_book, get_chapters_to_read, mark_chapter_as_read, extract_full_text_from_chapter_content
from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient
from .chapter_reader import read_and_summarize_chapter
from .reading_thoughts import is_book_change, process_book_reading_completion
import time
import utils.probability_utils as probability_utils
from .like_book import like_book

# read_and_interact
# 该任务负责阅读书籍，并且在阅读过程中进行点赞、收藏、评论等操作
def logic(api_info: dict, community_token: str, db: MySQLClient, memory_db: MySQLClient):
    # 书籍选取
    # 使用select_book函数选择书籍，优先选择最近更新的书籍，最多3本
    selected_books = select_book(db, memory_db)
    
    if not selected_books:
        print("❌ 没有找到需要阅读的书籍")
        return
    
    print(f"📚 选中了 {len(selected_books)} 本书籍:")
    for book in selected_books:
        print(f"  - {book['name']} (ID: {book['novel_id']})")

        # 有80% 的概率点赞该书
        if probability_utils.roll_probability(0.8):
            like_book(community_token, book['novel_id'])
            
    
    # 获取需要阅读的章节，总字数不超过2万字
    chapters_to_read = get_chapters_to_read(db, memory_db, selected_books, max_chars=20000)
    
    if not chapters_to_read:
        print("❌ 没有找到需要阅读的章节")
        return
    
    total_chars = sum(chapter['char_count'] for chapter in chapters_to_read)
    print(f"📖 找到 {len(chapters_to_read)} 个章节需要阅读，总字数: {total_chars}")
    
    # 初始化 MLLMClient
    client = MLLMClient(**api_info)
    
    # 依次阅读章节
    for i, chapter in enumerate(chapters_to_read, 1):
        print(f"\n📄 正在阅读第 {i}/{len(chapters_to_read)} 章:")
        print(f"   书籍: {chapter['novel_name']}")
        print(f"   章节: {chapter['title']}")
        print(f"   字数: {chapter['char_count']}")
        
        # 处理章节内容
        chapter_text = extract_full_text_from_chapter_content(chapter['title'], chapter['content'], api_info)
        
        if chapter_text:
            # 使用AI阅读并生成章节摘要
            success = read_and_summarize_chapter(
                db, 
                memory_db, 
                client, 
                chapter['novel_id'], 
                chapter['article_id'], 
                chapter_text, 
                chapter['title'],
                api_info
            )
            
            if success:
                print(f"   ✅ 章节摘要生成成功")
                
                # 标记章节为已阅读
                mark_success = mark_chapter_as_read(memory_db, chapter['novel_id'], chapter['article_id'])
                if mark_success:
                     print(f"   ✅ 章节已标记为已读")
                else:
                     print(f"   ❌ 标记章节已读失败")
            else:
                 print(f"   ❌ 章节摘要生成失败")
        else:
             print(f"   ❌ 无法提取章节文本内容")
        

        # 互动（有概率进入互动环节，具体与该章节的字数、评论的数量相关）
        
        
        # 检查是否换书了（最后一章或下一章是不同的书）
        next_chapter = chapters_to_read[i] if i < len(chapters_to_read) else None
        if is_book_change(chapter, next_chapter):
            # 生成并保存阅读想法
            process_book_reading_completion(
                db,
                memory_db, 
                client, 
                chapter['novel_id'], 
                chapter['novel_name']
            )
        
        time.sleep(15)
    
    print(f"\n🎉 阅读完成！共阅读了 {len(chapters_to_read)} 个章节，总字数: {total_chars}")