let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

const POPUP_POSTERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS popup_posters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_url VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  target_url VARCHAR(500) DEFAULT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

async function ensurePopupPosterTable() {
  await query(POPUP_POSTERS_TABLE_SQL);
}

router.get('/', auth, async function (req, res) {
  try {
    await ensurePopupPosterTable();

    const keyword = String(req.query.keyword || '').trim();
    let sql = `
      SELECT id, page_url, image_url, target_url, start_time, end_time
      FROM popup_posters
      WHERE 1 = 1
    `;
    let params = [];

    if (keyword) {
      sql += ' AND (page_url LIKE ? OR target_url LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY id DESC';

    const results = await query(sql, params);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: 'bad request' });
  }
});

router.post('/', auth, async function (req, res) {
  try {
    await ensurePopupPosterTable();

    const { page_url, image_url, target_url, start_time, end_time } = req.body;

    if (!page_url || !image_url || !start_time || !end_time) {
      return res.status(400).json({ msg: 'missing required parameters' });
    }

    await query(
      `INSERT INTO popup_posters (page_url, image_url, target_url, start_time, end_time)
       VALUES (?, ?, ?, ?, ?)`,
      [page_url, image_url, target_url || '', start_time, end_time],
    );

    res.json({ msg: 'success' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: 'bad request' });
  }
});

router.put('/:id', auth, async function (req, res) {
  try {
    await ensurePopupPosterTable();

    const posterId = Number(req.params.id);
    const { page_url, image_url, target_url, start_time, end_time } = req.body;

    if (!posterId || !page_url || !image_url || !start_time || !end_time) {
      return res.status(400).json({ msg: 'missing required parameters' });
    }

    const result = await query(
      `UPDATE popup_posters
       SET page_url = ?, image_url = ?, target_url = ?, start_time = ?, end_time = ?
       WHERE id = ?`,
      [page_url, image_url, target_url || '', start_time, end_time, posterId],
    );

    if (!result.affectedRows) {
      return res.status(404).json({ msg: 'poster not found' });
    }

    res.json({ msg: 'success' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: 'bad request' });
  }
});

router.delete('/:id', auth, async function (req, res) {
  try {
    await ensurePopupPosterTable();

    const posterId = Number(req.params.id);
    if (!posterId) {
      return res.status(400).json({ msg: 'invalid poster id' });
    }

    const result = await query('DELETE FROM popup_posters WHERE id = ?', [posterId]);
    if (!result.affectedRows) {
      return res.status(404).json({ msg: 'poster not found' });
    }

    res.json({ msg: 'success' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: 'bad request' });
  }
});

module.exports = router;
