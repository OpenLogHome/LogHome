import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './utils/db.js';
import { getNovelMemories } from './utils/memoryManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API: Get list of novels
app.get('/api/novels', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT novel_id, name, update_time FROM novels ORDER BY update_time DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching novels:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API: Get memories for a specific novel
app.get('/api/memories/:novelId', async (req, res) => {
    try {
        const novelId = req.params.novelId;
        const scope = req.query.scope || 'reader';
        const memories = await getNovelMemories(novelId, { scope });
        
        const processedMemories = memories.map(m => ({
            ...m,
            characters: typeof m.characters === 'string' 
                ? JSON.parse(m.characters) 
                : m.characters
        }));

        res.json(processedMemories);
    } catch (error) {
        console.error('Error fetching memories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
