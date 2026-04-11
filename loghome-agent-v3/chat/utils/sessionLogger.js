import fs from 'fs';
import path from 'path';

export class SessionLogger {
    constructor() {
        this.logPath = null;
    }

    init() {
        const now = new Date();
        const isoString = now.toISOString();
        const hourDir = isoString.slice(0, 13).replace('T', '_');
        const logDir = path.join(process.cwd(), 'logs', hourDir);
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        this.logPath = path.join(logDir, `chat_session_${isoString.replace(/[:.]/g, '-')}.log`);
        console.log(`Full logs will be saved to: ${this.logPath}`);
    }

    write(title, content) {
        if (!this.logPath) return;
        const time = new Date().toISOString();
        let text = `\n[${time}] === ${title} ===\n`;
        if (typeof content === 'object') {
            try {
                text += JSON.stringify(content, null, 2);
            } catch (e) {
                text += String(content);
            }
        } else {
            text += content;
        }
        text += `\n${'-'.repeat(80)}\n`;
        try {
            fs.appendFileSync(this.logPath, text);
        } catch (e) {
            console.error("Failed to write log:", e);
        }
    }
}
