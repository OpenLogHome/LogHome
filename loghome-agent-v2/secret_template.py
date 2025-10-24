# 配置模板文件 - 请根据实际情况修改配置值
# 注意：这是一个模板文件，实际的 secret.py 应该包含真实的配置信息

# 主数据库配置
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "your_username",
    "password": "your_password",
    "database": "loghome_main"
}

# 记忆数据库配置
MEMORY_DB_CONFIG = {
    "host": "localhost", 
    "port": 3306,
    "user": "your_username",
    "password": "your_password",
    "database": "loghome_memory"
}

# API配置信息
API_INFO = {
    "api_key": "your_api_key",
    "base_url": "https://api.example.com",
    "model": "your_model_name"
}

# 社区令牌
COMMUNITY_TOKEN = "your_community_token"