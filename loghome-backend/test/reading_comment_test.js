// Isolated transaction/format regression checks: no live database or user credentials.
const assert = require('node:assert/strict');
const { createReadingComment } = require('../bin/createReadingComment');
function database(content = 'one\ntwo', type = 'text') {
  const state = { comments: [], centos: [], writes: 0, committed: false, rolledBack: false };
  const transaction = async work => {
    const snapshot = { comments: state.comments.slice(), centos: state.centos.slice() };
    try {
      const result = await work(async (sql, params) => {
        if (sql.startsWith('SELECT n.* FROM novels')) { assert.match(sql, /is_personal = 0/); return [{ novel_id: 7, author_id: 6, name: 'Test', novel_type: 'novel' }]; }
        if (sql.startsWith('SELECT a.*')) { assert.deepEqual(params, [3, 7]); assert.match(sql, /is_draft = 0/); return state.missingArticle ? [] : [{ article_id: 3, novel_id: 7, content, article_type: type }]; }
        if (sql.startsWith('SELECT article_cento_id')) return state.centos;
        if (sql.startsWith('INSERT INTO article_cento')) { state.writes++; state.centos.push({ article_cento_id: 10, params }); return { insertId: 10 }; }
        if (sql.startsWith('INSERT INTO novel_comments')) { state.writes++; if (state.failInsert) throw new Error('insert failed'); state.comments.push({ essay_comment_id: 20, params }); return { insertId: 20 }; }
        if (sql.startsWith('SELECT n.*,u.name')) return state.comments;
        throw new Error('Unexpected query');
      });
      state.committed = true; return result;
    } catch (error) { state.comments = snapshot.comments; state.centos = snapshot.centos; state.rolledBack = true; throw error; }
  };
  return { state, transaction };
}
async function main() {
  const body = { novel_id: 7, article_id: 3, paragraph_id: 2, content: 'hello' };
  let db = database(); const result = await createReadingComment(body, 9, db.transaction);
  assert.equal(result.comment.author_id, 6); assert.equal(db.state.centos[0].params[3], 'two'); assert.equal(db.state.comments[0].params[5], 10); assert.equal(db.state.committed, true);
  console.log('PASS legacy plain-text paragraph is canonically linked during comment insert');
  db = database(JSON.stringify({ content: [{ paragraph_id: '2', value: ['left', 'right'] }] }), 'richtext'); await createReadingComment(body, 9, db.transaction); assert.equal(db.state.centos[0].params[3], 'leftright');
  console.log('PASS wrapped rich text and numeric-string paragraph aliases');
  for (const test of [database('one'), database('[]', 'mangaPage'), database('{}', 'richtext')]) { await assert.rejects(createReadingComment(body, 9, test.transaction), error => error.status === 404); assert.equal(test.state.writes, 0); }
  db = database(); db.state.missingArticle = true; await assert.rejects(createReadingComment(body, 9, db.transaction), error => error.status === 404); assert.equal(db.state.writes, 0);
  console.log('PASS missing/malformed/manga paragraphs and mismatched chapter rejected before writes');
  db = database(); db.state.failInsert = true; await assert.rejects(createReadingComment(body, 9, db.transaction), /insert failed/); assert.equal(db.state.comments.length, 0); assert.equal(db.state.centos.length, 0); assert.equal(db.state.rolledBack, true);
  console.log('PASS failure rolls back both comment and newly created highlight');
  db = database('[]', 'mangaPage'); await createReadingComment({ ...body, paragraph_id: -1 }, 9, db.transaction); assert.equal(db.state.centos.length, 0); assert.equal(db.state.comments[0].params[3], 3);
  db = database(); await createReadingComment({ ...body, article_id: 0, paragraph_id: -1 }, 9, db.transaction); assert.equal(db.state.comments[0].params[3], 0);
  console.log('PASS manga chapter and work-wide comments remain supported');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
