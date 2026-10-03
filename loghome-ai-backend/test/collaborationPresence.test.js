const assert = require('node:assert/strict');
const test = require('node:test');
const {
	handleCollaborationStateless,
	serializeAwarenessParticipants,
} = require('../bin/collaborationService');

test('serializes and deduplicates realtime awareness users', () => {
	const states = new Map([
		[10, { user: { id: 8, name: '甲', avatarUrl: '/a.jpg', color: '#ABCDEF' } }],
		[11, { user: { id: 3, name: '乙', avatar_url: '/b.jpg', color: 'invalid' } }],
		[12, { user: { id: 8, name: '甲（另一标签页）', avatarUrl: '/a2.jpg', color: '#123456' } }],
		[13, { user: { id: 0, name: '无效用户' } }],
		[14, {}],
	]);

	assert.deepEqual(serializeAwarenessParticipants(states), [
		{
			user_id: 3,
			name: '乙',
			avatar_url: '/b.jpg',
			color: '#dc2626',
		},
		{
			user_id: 8,
			name: '甲（另一标签页）',
			avatar_url: '/a2.jpg',
			color: '#123456',
		},
	]);
});

test('broadcasts authenticated chat messages and returns room history', () => {
	const sentToConnection = [];
	const broadcasts = [];
	const connection = {
		context: {
			userId: 8,
			name: '认证名称',
			avatarUrl: '/auth.jpg',
			color: '#2563eb',
		},
		sendStateless(payload) {
			sentToConnection.push(JSON.parse(payload));
		},
	};
	const document = {
		awareness: {
			getStates: () => new Map([
				[10, { user: {
					id: 8,
					name: '在线名称',
					avatarUrl: '/online.jpg',
					color: '#123456',
				} }],
			]),
		},
		broadcastStateless(payload) {
			broadcasts.push(JSON.parse(payload));
		},
	};
	const documentName = 'article:chat-test:room';

	handleCollaborationStateless({
		connection,
		document,
		documentName,
		payload: JSON.stringify({
			type: 'collaboration_chat_send',
			content: '  大家好  ',
			user_id: 999,
		}),
	});

	assert.equal(broadcasts.length, 1);
	assert.equal(broadcasts[0].type, 'collaboration_chat_message');
	assert.deepEqual(
		{
			user_id: broadcasts[0].message.user_id,
			name: broadcasts[0].message.name,
			avatar_url: broadcasts[0].message.avatar_url,
			color: broadcasts[0].message.color,
			content: broadcasts[0].message.content,
		},
		{
			user_id: 8,
			name: '在线名称',
			avatar_url: '/online.jpg',
			color: '#123456',
			content: '大家好',
		},
	);

	handleCollaborationStateless({
		connection,
		document,
		documentName,
		payload: JSON.stringify({ type: 'collaboration_chat_history_request' }),
	});
	assert.equal(sentToConnection.length, 1);
	assert.equal(sentToConnection[0].type, 'collaboration_chat_history');
	assert.equal(sentToConnection[0].messages.length, 1);
	assert.equal(sentToConnection[0].messages[0].id, broadcasts[0].message.id);
});
