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
        const memories = await getNovelMemories(novelId);
        
        // Parse JSON fields for easier frontend handling
        const processedMemories = memories.map(m => ({
            ...m,
            chapter_comprehension: typeof m.chapter_comprehension === 'string' 
                ? JSON.parse(m.chapter_comprehension) 
                : m.chapter_comprehension,
            character_comprehension: typeof m.character_comprehension === 'string' 
                ? JSON.parse(m.character_comprehension) 
                : m.character_comprehension
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
