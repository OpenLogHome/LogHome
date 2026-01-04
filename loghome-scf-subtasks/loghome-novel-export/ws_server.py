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
async def message_handler(websocket, path):
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
                export_type = data.get("export_type", "published") # 'published' or 'draft'
                
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

                    zip_buffer.seek(0)
                    
                    up = upyun.UpYun(UPYUN_SERVICE_NAME, UPYUN_OPERATOR_NAME, UPYUN_OPERATOR_PASSWORD)
                    remote_path = f"{session_id}/{novel_id}_{export_type}.zip"
                    try:
                        up.mkdir(session_id)
                    except Exception:
                        pass
                    
                    download_url = await _upload_to_upyun_with_overwrite(up, remote_path, zip_buffer, UPYUN_DOMAIN)
                    
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
