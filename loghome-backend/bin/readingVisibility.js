// Public readers never receive private/deleted works or unpublished chapters.
// Author previews use the authenticated essays routes and collaboration permissions.
const PUBLIC_NOVEL = 'n.deleted = 0 AND n.is_personal = 0';
const PUBLIC_ARTICLE = `a.deleted = 0 AND a.is_draft = 0 AND ${PUBLIC_NOVEL}`;

module.exports = { PUBLIC_NOVEL, PUBLIC_ARTICLE };
