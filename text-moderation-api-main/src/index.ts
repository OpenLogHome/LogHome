import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from "hono/cors"
import { poweredBy } from "hono/powered-by"
import { requestId } from "hono/request-id"
import OpenAI from "openai"
import { PROMPT } from "@/prompt"
import dotenv from 'dotenv'
// import { rateLimit } from "@/rate-limit"

// 加载环境变量
dotenv.config()

const app = new Hono()

app.use("*",
    poweredBy(),
    requestId(),
    cors()
)

// app.use(rateLimit)

app.get('/', (c) => {
    return c.text('你真的不错！')
})

const textModeration = async (c: any, text: string) => {
    if (!text || text.trim().length === 0) {
        return c.json({code: 400, msg: 'text不能为空'})
    }
    if (text.length > 200) {
        return c.json({code: 400, msg: 'text长度不能超过200'})
    }
    const openai = new OpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
    })
    const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'glm-4-flash',
        messages: [
            {
                "role": "user",
                "content": `${PROMPT}"${text}"`
            }
        ],
        response_format: {
            "type": "json_object"
        }
    })

    const {content} = completion.choices[0].message
    try {
        let jsonStr = content as string;
        if (content?.startsWith('output: ')) {
            jsonStr = content.replace('output: ', '')
        }
        const data = JSON.parse(jsonStr);
        data.code = 0;
        return c.json(data)
    } catch (e) {
        return c.json({remark: "识别失败", code: -1, content})
    }
}

app.get('/api/check', async (c) => {
    const text = c.req.query('text');
    return await textModeration(c, text || "");
})

app.post('/api/check', async (c) => {
    const {text} = await c.req.parseBody();
    return await textModeration(c, text as string);
})

const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port: Number(port)
})
