import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.info_retrieval_manager import InfoRetrievalManager
from utils.mysql_client import MySQLClient

# 尝试导入配置文件，如果不存在则使用测试配置
try:
    from secret import DB_CONFIG, MEMORY_DB_CONFIG, API_INFO
    print("✅ 使用 secret.py 中的配置")
except ImportError:
    print("⚠️  secret.py 不存在，使用测试配置")
    # 使用与 main.py 相同的配置结构，但使用测试值
    DB_CONFIG = {
        "host": "localhost",
        "port": 3306,
        "user": "test_user",
        "password": "test_password",
        "database": "test_loghome_main"
    }
    
    MEMORY_DB_CONFIG = {
        "host": "localhost", 
        "port": 3306,
        "user": "test_user",
        "password": "test_password",
        "database": "test_loghome_memory"
    }
    
    API_INFO = {
        "api_key": "test_api_key",
        "base_url": "https://api.test.com",
        "model": "test_model"
    }

def test_info_retrieval_manager():
    """测试 InfoRetrievalManager 的基本功能"""
    print("🧪 开始测试 InfoRetrievalManager...")
    
    try:
        # 使用与 main.py 相同的方式初始化数据库连接
        print("📊 初始化数据库连接...")
        
        db = MySQLClient(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"]
        )
        
        memory_db = MySQLClient(
            host=MEMORY_DB_CONFIG["host"],
            port=MEMORY_DB_CONFIG["port"],
            user=MEMORY_DB_CONFIG["user"],
            password=MEMORY_DB_CONFIG["password"],
            database=MEMORY_DB_CONFIG["database"]
        )
        
        print("🔧 创建 InfoRetrievalManager 实例...")
        manager = InfoRetrievalManager(db, memory_db, API_INFO)
        
        print("✅ InfoRetrievalManager 实例创建成功！")
        print(f"📋 配置信息:")
        print(f"  - 主数据库: {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")
        print(f"  - 记忆数据库: {MEMORY_DB_CONFIG['host']}:{MEMORY_DB_CONFIG['port']}/{MEMORY_DB_CONFIG['database']}")
        print(f"  - API配置: {API_INFO.get('base_url', 'N/A')}")
        
        # 注意：实际的信息检索需要数据库连接成功
        print("📝 注意：要进行实际的信息检索测试，需要确保数据库连接配置正确且数据库可访问")
        
        # 如果需要测试实际的检索功能，可以取消注释以下代码：
        print("🔍 测试信息检索功能...")
        retrieved_info = manager.retrieve_information(keywords=["我的世界"], context={})
        print(f"检索结果: {retrieved_info}")
        
        return True
        
    except Exception as e:
        print(f"❌ 测试过程中出错: {e}")
        print("💡 提示：请检查数据库配置是否正确，或者数据库服务是否正在运行")
        return False

if __name__ == "__main__":
    print("🚀 InfoRetrievalManager 测试程序")
    print("=" * 50)
    
    success = test_info_retrieval_manager()
    
    print("=" * 50)
    if success:
        print("✅ 测试完成")
    else:
        print("❌ 测试失败")
