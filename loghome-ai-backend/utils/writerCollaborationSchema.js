const { Schema } = require('@tiptap/pm/model');

const writerCollaborationSchema = new Schema({
	nodes: {
		doc: { content: 'block+' },
		paragraph: {
			content: 'inline*',
			group: 'block',
			attrs: { legacyId: { default: null } },
		},
		text: { group: 'inline' },
		hardBreak: { inline: true, group: 'inline', selectable: false },
		image: {
			group: 'block',
			atom: true,
			draggable: true,
			attrs: {
				src: { default: null },
				alt: { default: null },
				title: { default: null },
			},
		},
	},
	marks: {
		textStyle: {
			attrs: { fontFamily: { default: null } },
		},
	},
});

module.exports = writerCollaborationSchema;
