#!/usr/bin/env python
# -*- coding: utf-8 -*-

import asyncio
import websockets
import json
import os
import base64
import uuid
import pymysql
from io import BytesIO
import upyun
import toml
import zipfile
import tempfile
import requests
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import inch
from PIL import Image as PILImage
import html
# 纯Python实现的EPUB生成类
class SimpleEpubBook:
    def __init__(self):
        self.identifier = str(uuid.uuid4())
        self.title = "Unknown"
        self.language = "zh"
        self.author = "Unknown"
        self.chapters = []
        self.images = []
        
    def set_identifier(self, identifier):
        self.identifier = identifier 
        
    def set_title(self, title):
        self.title = title
        
    def set_language(self, language):
        self.language = language
        
    def add_author(self, author):
        self.author = author
        
    def set_toc(self, chapters):
        self.chapters = chapters
        
    def add_item(self, item):
        if isinstance(item, dict) and item.get('type') == 'image':
            self.images.append(item)
    
    def set_spine(self, spine):
        self.spine = spine
        
    def write_epub(self, output_buffer):
        """生成EPUB文件到缓冲区"""
        import datetime
        
        # 创建ZIP文件（EPUB本质上是ZIP文件）
        with zipfile.ZipFile(output_buffer, 'w', zipfile.ZIP_DEFLATED) as epub_zip:
            # 1. 添加mimetype文件（必须第一个添加，且不能压缩）
            epub_zip.writestr('mimetype', 'application/epub+zip', compress_type=zipfile.ZIP_STORED)
            
            # 2. 添加META-INF/container.xml
            container_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>'''
            epub_zip.writestr('META-INF/container.xml', container_xml)
            
            # 3. 生成并添加content.opf
            content_opf = self._generate_content_opf()
            epub_zip.writestr('OEBPS/content.opf', content_opf)
            
            # 4. 生成并添加toc.ncx
            toc_ncx = self._generate_toc_ncx()
            epub_zip.writestr('OEBPS/toc.ncx', toc_ncx)
            
            # 5. 生成并添加nav.xhtml（EPUB3导航文档）
            nav_xhtml = self._generate_nav_xhtml()
            epub_zip.writestr('OEBPS/nav.xhtml', nav_xhtml)
            
            # 6. 添加章节文件
            for i, chapter in enumerate(self.chapters):
                if isinstance(chapter, dict) and chapter.get('content'):
                    chapter_filename = f'OEBPS/chap_{i+1}.xhtml'
                    chapter_content = self._generate_chapter_xhtml(chapter['title'], chapter['content'])
                    epub_zip.writestr(chapter_filename, chapter_content)
            
            # 7. 添加图片文件
            for image in self.images:
                if image.get('filename') and image.get('content'):
                    epub_zip.writestr(f'OEBPS/{image["filename"]}', image['content'])
            
            # 8. 添加样式表
            css_content = '''/* Basic CSS for EPUB */
body {
    font-family: serif;
    font-size: 1em;
    line-height: 1.5;
    margin: 0;
    padding: 1em;
}
h1, h2, h3 {
    font-weight: bold;
    margin: 1em 0 0.5em 0;
}
h1 {
    font-size: 1.5em;
}
h2 {
    font-size: 1.3em;
}
p {
    margin: 0.5em 0;
    text-indent: 2em;
}
img {
    max-width: 100%;
    height: auto;
}
'''
            epub_zip.writestr('OEBPS/style.css', css_content)
    
    def _generate_content_opf(self):
        """生成content.opf文件"""
        import datetime
        metadata = f'''<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:identifier id="bookid">{html.escape(self.identifier)}</dc:identifier>
        <dc:title>{html.escape(self.title)}</dc:title>
        <dc:language>{html.escape(self.language)}</dc:language>
        <dc:creator>{html.escape(self.author)}</dc:creator>
        <dc:date>{datetime.datetime.now().strftime('%Y-%m-%d')}</dc:date>
        <meta property="dcterms:modified">{datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')}</meta>
    </metadata>
    <manifest>
        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
        <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
        <item id="style" href="style.css" media-type="text/css"/>'''
        
        # 添加章节条目
        for i, chapter in enumerate(self.chapters):
            metadata += f'\n        <item id="chap_{i+1}" href="chap_{i+1}.xhtml" media-type="application/xhtml+xml"/>'
        
        # 添加图片条目
        for i, image in enumerate(self.images):
            if image.get('filename'):
                ext = image['filename'].split('.')[-1].lower()
                media_type = f'image/{ext}' if ext in ['jpg', 'jpeg', 'png', 'gif'] else 'image/jpeg'
                metadata += f'\n        <item id="img_{i+1}" href="{image["filename"]}" media-type="{media_type}"/>'
        
        metadata += '\n    </manifest>\n    <spine toc="ncx">'
        metadata += '\n        <itemref idref="nav"/>'
        
        # 添加章节引用
        for i, chapter in enumerate(self.chapters):
            metadata += f'\n        <itemref idref="chap_{i+1}"/>'
        
        metadata += '\n    </spine>\n</package>'
        return metadata
    
    def _generate_toc_ncx(self):
        """生成toc.ncx文件"""
        ncx = f'''<?xml version="1.0" encoding="UTF-8"?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
    <head>
        <meta name="dtb:uid" content="{html.escape(self.identifier)}"/>
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle>
        <text>{html.escape(self.title)}</text>
    </docTitle>
    <navMap>'''
        
        # 添加章节导航
        for i, chapter in enumerate(self.chapters):
            if isinstance(chapter, dict) and chapter.get('title'):
                ncx += f'''\n        <navPoint id="navPoint-{i+1}" playOrder="{i+1}">
            <navLabel>
                <text>{html.escape(chapter["title"])}</text>
            </navLabel>
            <content src="chap_{i+1}.xhtml"/>
        </navPoint>'''
        
        ncx += '\n    </navMap>\n</ncx>'
        return ncx
    
    def _generate_nav_xhtml(self):
        """生成EPUB3导航文档"""
        nav = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>{html.escape(self.title)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>目录</h1>
        <ol>'''
        
        # 添加章节链接
        for i, chapter in enumerate(self.chapters):
            if isinstance(chapter, dict) and chapter.get('title'):
                nav += f'\n                <li><a href="chap_{i+1}.xhtml">{html.escape(chapter["title"])}</a></li>'
        
        nav += '''\n        </ol>
    </nav>
</body>
</html>'''
        return nav
    
    def _generate_chapter_xhtml(self, title, content):
        """生成章节XHTML文件"""
        xhtml = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>{html.escape(title)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <h1>{html.escape(title)}</h1>
    {content}
</body>
</html>'''
        return xhtml

# 注册中文字体
def register_chinese_font():
    # 尝试从常见路径加载字体，或者指定一个确切的路径
    font_path = "./SourceHanSansSC-Regular.ttf" # 例如微软雅黑
    if os.path.exists(font_path):
        pdfmetrics.registerFont(TTFont('ssc', font_path))
        return 'ssc'
    return 'Helvetica' # Fallback font

CHINESE_FONT_NAME = register_chinese_font()

# 加载配置文件
def load_config():
    config_path = "./config.toml"
    return toml.load(config_path)

config = load_config()

# UPYUN 配置
UPYUN_SERVICE_NAME = config['upyun']['service_name']
UPYUN_OPERATOR_NAME = config['upyun']['operator_name']
UPYUN_OPERATOR_PASSWORD = config['upyun']['operator_password']
UPYUN_DOMAIN = config['upyun']['domain']

# 数据库配置
DB_HOST = config['database']['host']
DB_PORT = config['database']['port']
DB_USER = config['database']['user']
DB_PASSWORD = config['database']['password']
DB_NAME = config['database']['database']

# WebSocket消息大小限制
MAX_MESSAGE_SIZE = config['websocket']['max_message_size']

# 创建临时文件夹
def ensure_tmp_dir():
    tmp_dir = tempfile.gettempdir()
    if not os.path.exists(tmp_dir):
        os.makedirs(tmp_dir)
    return tmp_dir

# 数据库连接
def get_db_connection():
    return pymysql.connect(host=DB_HOST,
                           port=DB_PORT,
                           user=DB_USER,
                           password=DB_PASSWORD,
                           database=DB_NAME,
                           cursorclass=pymysql.cursors.DictCursor)

# 上传文件到又拍云
async def _upload_to_upyun_with_overwrite(up_instance, remote_path, data_stream, domain):
    try:
        try:
            up_instance.getinfo(remote_path)
            up_instance.delete(remote_path)
        except Exception:
            pass
        data_stream.seek(0)
        up_instance.put(remote_path, data_stream, checksum=True)
        return f"https://{domain}/{remote_path.lstrip('/')}"
    except Exception as e:
        raise

# WebSocket 消息处理器
async def message_handler(websocket, path=None):
    session_id = str(uuid.uuid4())
    tmp_dir = ensure_tmp_dir()

    async for message in websocket:
        try:
            data = json.loads(message)
            msg_type = data.get("type", "")

            if msg_type == "get_novel_info":
                novel_id = data.get("novel_id")
                if not novel_id:
                    await websocket.send(json.dumps({"type": "error", "message": "novel_id is required"}))
                    continue
                
                connection = get_db_connection()
                with connection.cursor() as cursor:
                    cursor.execute("SELECT name, author_id FROM novels WHERE novel_id = %s", (novel_id,))
                    novel = cursor.fetchone()
                    if novel:
                        cursor.execute("SELECT name FROM users WHERE user_id = %s", (novel['author_id'],))
                        author = cursor.fetchone()
                        await websocket.send(json.dumps({
                            "type": "novel_info",
                            "novel_name": novel['name'],
                            "author_name": author['name'] if author else "Unknown"
                        }))
                    else:
                        await websocket.send(json.dumps({"type": "error", "message": "Novel not found"}))
                connection.close()

            elif msg_type == "export_novel":
                novel_id = data.get("novel_id")
                export_type = data.get("export_type", "published")  # 'published' or 'draft'
                export_format = data.get("export_format", "zip")  # 'zip', 'pdf', or 'epub'
                
                if export_format == 'pdf':
                    # PDF导出逻辑
                    pass # 在下面单独处理
                elif export_format == 'epub':
                    # EPUB导出逻辑
                    pass # 在下面单独处理
                elif export_format == 'zip':
                    # ZIP导出逻辑
                    pass # 在下面单独处理
                else:
                    await websocket.send(json.dumps({"type": "error", "message": "Unsupported export format"}))
                    continue
                
                if not novel_id:
                    await websocket.send(json.dumps({"type": "error", "message": "novel_id is required"}))
                    continue

                connection = get_db_connection()
                with connection.cursor() as cursor:
                    articles = []
                    if export_type == 'draft':
                        # Get the ordered list of chapters from the articles table
                        cursor.execute("SELECT article_id, title, content FROM articles WHERE novel_id = %s AND deleted = 0 ORDER BY article_chapter", (novel_id,))
                        base_articles = cursor.fetchall()

                        if base_articles:
                            total_base_articles = len(base_articles)
                            for i, article in enumerate(base_articles):
                                # Check for the newest draft in articles_writer
                                cursor.execute("SELECT title, content FROM articles_writer WHERE article_id = %s ORDER BY create_time DESC LIMIT 1", (article['article_id'],))
                                draft = cursor.fetchone()
                                if draft:
                                    # If a draft exists, use it
                                    articles.append(draft)
                                else:
                                    # Otherwise, use the published article
                                    articles.append(article)
                                
                                percentage = ((i + 1) / total_base_articles) * 50
                                progress = {
                                    "type": "progress",
                                    "current": i + 1,
                                    "total": total_base_articles,
                                    "percentage": percentage
                                }
                                await websocket.send(json.dumps(progress))
                                await asyncio.sleep(0.01)

                    else: # 'published'
                        cursor.execute("SELECT title, content FROM articles WHERE novel_id = %s AND is_draft = 0 AND deleted = 0 ORDER BY article_chapter", (novel_id,))
                        articles = cursor.fetchall()

                    if not articles:
                        await websocket.send(json.dumps({"type": "error", "message": "No articles found to export."}))
                        continue
                    
                    if export_format == 'pdf':
                        pdf_buffer = BytesIO()
                        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
                        styles = getSampleStyleSheet()
                        
                        # 为标题添加中文字体
                        styles.add(ParagraphStyle(name='ChineseH2', parent=styles['h2'], fontName=CHINESE_FONT_NAME))

                        # 调整正文样式
                        styles.add(ParagraphStyle(name='ChineseStyle', fontName=CHINESE_FONT_NAME, fontSize=12, leading=20, firstLineIndent=32, spaceAfter=6))
                        
                        story = []
                        image_counter = 0

                        total_articles = len(articles)
                        for i, article in enumerate(articles):
                            story.append(Paragraph(article['title'], styles['ChineseH2']))
                            story.append(Spacer(1, 0.2*inch))

                            try:
                                content_data = json.loads(article['content'])
                                if isinstance(content_data, list):
                                    for item in content_data:
                                        item_type = item.get('type')
                                        if item_type == 'text':
                                            story.append(Paragraph(item.get('value', ''), styles['ChineseStyle']))
                                        elif item_type == 'image':
                                            image_url = item.get('img')
                                            if image_url:
                                                try:
                                                    response = requests.get(image_url, timeout=10)
                                                    if response.status_code == 200:
                                                        img_data = BytesIO(response.content)
                                                        pil_img = PILImage.open(img_data)
                                                        aspect = pil_img.height / float(pil_img.width)
                                                        story.append(Image(img_data, width=4*inch, height=(4*inch * aspect)))
                                                    else:
                                                        story.append(Paragraph(f'（图片下载失败：{image_url}）', styles['ChineseStyle']))
                                                except Exception as img_e:
                                                    story.append(Paragraph(f'（图片下载失败：{image_url}）', styles['ChineseStyle']))
                                else:
                                    story.append(Paragraph(str(article['content']), styles['ChineseStyle']))
                            except (json.JSONDecodeError, TypeError):
                                story.append(Paragraph(article['content'], styles['ChineseStyle']))
                            
                            story.append(Spacer(1, 0.5*inch))

                            if export_type == 'draft':
                                percentage = 50 + (((i + 1) / total_articles) * 50)
                            else:
                                percentage = ((i + 1) / total_articles) * 100

                            progress = {
                                "type": "progress",
                                "current": i + 1,
                                "total": total_articles,
                                "percentage": percentage
                            }
                            await websocket.send(json.dumps(progress))
                            await asyncio.sleep(0.01)
                        doc.build(story)
                        file_buffer = pdf_buffer
                        file_extension = 'pdf'

                    elif export_format == 'epub':
                        # 获取小说名称
                        cursor.execute("SELECT name FROM novels WHERE novel_id = %s", (novel_id,))
                        novel_info = cursor.fetchone()
                        novel_name = novel_info['name'] if novel_info else "未知小说"

                        # 使用纯Python实现的SimpleEpubBook类
                        book = SimpleEpubBook()
                        book.set_identifier(f'urn:uuid:{session_id}')
                        book.set_title(novel_name)
                        book.set_language('zh')
                        book.add_author('Unknown') # 你可以根据需要修改作者信息

                        chapters = []
                        image_counter = 0
                        total_articles = len(articles)
                        for i, article in enumerate(articles):
                            chapter_title = article['title']
                            chapter_content_html = ''
                            
                            try:
                                content_data = json.loads(article['content'])
                                if isinstance(content_data, list):
                                    for item in content_data:
                                        item_type = item.get('type')
                                        if item_type == 'text':
                                            raw_value = item.get('value', '')
                                            cleaned_value = raw_value.replace('\u3000\u3000', '')
                                            chapter_content_html += f"<p>{html.escape(cleaned_value)}</p>"
                                        elif item_type == 'image':
                                             image_url = item.get('img')
                                             if image_url:
                                                 try:
                                                     response = requests.get(image_url, timeout=10)
                                                     if response.status_code == 200:
                                                         img_data = response.content
                                                         img_ext = image_url.split('.')[-1].lower()
                                                         img_filename = f'img_{i}_{image_counter}.{img_ext}'
                                                         image_counter += 1
                                                         
                                                         # 使用新的图片添加方式
                                                         epub_img = {
                                                             'type': 'image',
                                                             'filename': f'images/{img_filename}',
                                                             'content': img_data
                                                         }
                                                         book.add_item(epub_img)
                                                         chapter_content_html += f'<p><img src="images/{img_filename}" alt="image"/></p>'
                                                     else:
                                                         chapter_content_html += f'<p>（图片下载失败：{html.escape(image_url)}）</p>'
                                                 except Exception as img_e:
                                                     chapter_content_html += f'<p>（图片下载失败：{html.escape(image_url)}）</p>'
                                else:
                                    chapter_content_html += f"<p>{html.escape(str(article['content']))}</p>"
                            except (json.JSONDecodeError, TypeError):
                                chapter_content_html += f"<p>{html.escape(article['content'])}</p>"

                            # 创建章节字典而不是epub.EpubHtml对象
                            chapter_dict = {
                                'title': chapter_title,
                                'content': chapter_content_html
                            }
                            chapters.append(chapter_dict)

                            if export_type == 'draft':
                                percentage = 50 + (((i + 1) / total_articles) * 50)
                            else:
                                percentage = ((i + 1) / total_articles) * 100

                            progress = {
                                "type": "progress",
                                "current": i + 1,
                                "total": total_articles,
                                "percentage": percentage
                            }
                            await websocket.send(json.dumps(progress))
                            await asyncio.sleep(0.01)

                        # 设置目录和书脊
                        book.set_toc(chapters)
                        book.set_spine(['nav'] + chapters)
                        
                        # 生成EPUB文件
                        epub_buffer = BytesIO()
                        book.write_epub(epub_buffer)
                        file_buffer = epub_buffer
                        file_extension = 'epub'

                    elif export_format == 'zip':
                        zip_buffer = BytesIO()
                        image_counter = 0
                        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                            total_articles = len(articles)
                            for i, article in enumerate(articles):
                                chapter_text_content = ""
                                try:
                                    content_data = json.loads(article['content'])
                                    if isinstance(content_data, list):
                                        for item in content_data:
                                            item_type = item.get('type')
                                            if item_type == 'text':
                                                chapter_text_content += item.get('value', '') + '\n'
                                            elif item_type == 'image':
                                                image_url = item.get('img')
                                                if image_url:
                                                    image_counter += 1
                                                    chapter_text_content += f'【图片 {image_counter}】\n'
                                                    try:
                                                        response = requests.get(image_url, timeout=10)
                                                        if response.status_code == 200:
                                                            ext = os.path.splitext(image_url.split("?")[0])[-1]
                                                            if not ext:
                                                                content_type = response.headers.get('Content-Type', '')
                                                                if 'png' in content_type: ext = '.png'
                                                                elif 'gif' in content_type: ext = '.gif'
                                                                else: ext = '.jpg'
                                                            
                                                            image_filename = f"images/{image_counter}{ext}"
                                                            zip_file.writestr(image_filename, response.content)
                                                        else:
                                                            chapter_text_content += f'（图片下载失败：{image_url}）\n'
                                                    except Exception as img_e:
                                                        chapter_text_content += f'（图片下载失败：{image_url}）\n'
                                                        print(f"Error downloading image {image_url}: {img_e}")
                                    else:
                                        chapter_text_content = str(article['content'])
                                except (json.JSONDecodeError, TypeError):
                                    chapter_text_content = article['content']
                            
                                file_name = f"{i+1:04d}_{article['title']}.txt"
                                zip_file.writestr(file_name, chapter_text_content)
                                
                                if export_type == 'draft':
                                    percentage = 50 + (((i + 1) / total_articles) * 50)
                                else:
                                    percentage = ((i + 1) / total_articles) * 100

                                progress = {
                                    "type": "progress",
                                    "current": i + 1,
                                    "total": total_articles,
                                    "percentage": percentage
                                }
                                await websocket.send(json.dumps(progress))
                                await asyncio.sleep(0.01)

                        file_buffer = zip_buffer
                        file_extension = 'zip'
                        file_buffer.seek(0)
                    
                    up = upyun.UpYun(UPYUN_SERVICE_NAME, UPYUN_OPERATOR_NAME, UPYUN_OPERATOR_PASSWORD)
                    remote_path = f"{session_id}/{novel_id}_{export_type}.{file_extension}"
                    try:
                        up.mkdir(session_id)
                    except Exception:
                        pass
                    
                    download_url = await _upload_to_upyun_with_overwrite(up, remote_path, file_buffer, UPYUN_DOMAIN)
                    
                    # 获取小说名称和作者ID
                    cursor.execute("SELECT name, author_id FROM novels WHERE novel_id = %s", (novel_id,))
                    novel_info = cursor.fetchone()
                    novel_name = novel_info['name'] if novel_info else "未知小说"
                    author_id = novel_info['author_id'] if novel_info else None

                    # 发送消息给作者
                    if author_id:
                        message_content = f"您的小说《{novel_name}》({'读者版本' if export_type == 'published' else '存稿版本'}) 已成功导出，点击这里下载。"
                        cursor.execute(
                            "INSERT INTO user_message(from_id, to_id, message_content, router, message_type) VALUES(%s, %s, %s, %s, %s)",
                            (-1, author_id, message_content, f"apps/openInBrowser?url={download_url}", 'notification')
                        )
                        connection.commit()

                    await websocket.send(json.dumps({
                        "type": "export_complete",
                        "download_url": download_url
                    }))

                connection.close()

            else:
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": f"未知消息类型: {msg_type}"
                }))
        except Exception as e:
            await websocket.send(json.dumps({
                "type": "error",
                "message": f"内部处理错误: {str(e)}"
            }))

# 启动 WebSocket 服务器
async def main():
    ensure_tmp_dir()
    server = await websockets.serve(
        message_handler,
        "0.0.0.0",
        9000,
        max_size=MAX_MESSAGE_SIZE,
        max_queue=None
    )
    print(f"WebSocket 服务器已启动在 ws://0.0.0.0:9000")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
