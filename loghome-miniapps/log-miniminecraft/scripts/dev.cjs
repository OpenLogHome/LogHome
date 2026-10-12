process.env.LOGHOME_API_URL ||= 'http://127.0.0.1:9000';
process.env.ALLOWED_PARENT_ORIGINS ||= 'null,http://localhost:8080,http://127.0.0.1:8080';
const {createServer}=require('../server/index.cjs');
const port=Number(process.env.PORT||8788);
createServer().listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Log MiniMinecraft dev: http://127.0.0.1:${port}/log-miniminecraft/`));
