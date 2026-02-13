#!/bin/bash

# GLM API 配置信息
GLM_API="http://8.152.99.246:8002/v1/chat/completions"
GLM_MODEL="glm-4-plus"
GLM_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiLnlKjmiLdfUnh6N2dGIiwiZXhwIjoxNzY4NDgxNzIyLCJuYmYiOjE3NjgzOTUzMjIsImlhdCI6MTc2ODM5NTMyMiwianRpIjoiNWRiNWZlMjQwNzY2NDBjNGE4NGEzZGViODMyNDY4MjciLCJ1aWQiOiI2OGY4ZGJmMTViZGFmYWE0MDNiNjFkYjgiLCJkZXZpY2VfaWQiOiI4NDNiMDkyZDkzMGI0MjY3YWM1NjAyNjBlOTQwOTQ4ZCIsInR5cGUiOiJhY2Nlc3MifQ.KjcriGZaNifmaVyEwDriw5yrhNYHPyGFtS7C4OrI6LY"

# 发送请求
curl -X POST "${GLM_API}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GLM_API_KEY}" \
  -d '{
    "model": "'"${GLM_MODEL}"'",
    "messages": [
      {
        "role": "user",
        "content": "你好，请介绍一下自己"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1024,
    "stream": false
  }'