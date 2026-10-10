// Shared mobile/desktop mutations. Lock the bank first, then the owned tree;
// every reward and state change commits on the same connection.
function failure(message, status = 409) { return Object.assign(new Error(message), { status }); }
function positive(value, name) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number <= 0) throw failure(`${name}无效`, 400);
    return number;
}
function statusFor(growth) { return growth >= 100 ? '结果' : growth >= 40 ? '开花' : '种植'; }
function createReaderTreeOperations({ withTransaction, expReady, settings, normalizeTheme, benefits, sameDay, rewardFor, random = Math.random }) {
    async function lockBank(q, userId) {
        await q('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [userId]);
        const rows = await q('SELECT log, apple FROM user_bank WHERE user_id = ? FOR UPDATE', [userId]);
        if (!rows[0]) throw failure('资源账户不可用', 503);
        return rows[0];
    }
    async function ownedTree(q, userId, plantId) {
        const rows = await q(plantId
            ? 'SELECT * FROM treeplant WHERE user_id = ? AND plant_id = ? FOR UPDATE'
            : 'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0 ORDER BY plant_id DESC LIMIT 1 FOR UPDATE',
        plantId ? [userId, plantId] : [userId]);
        if (!rows[0]) throw failure('树木不存在或不属于当前账号', 404);
        return rows[0];
    }
    async function collectOrbs(q, userId, tree, orbId, limit) {
        await q("UPDATE tree_exp_orbs SET status = 'expired' WHERE user_id = ? AND status = 'pending' AND expire_at IS NOT NULL AND expire_at <= NOW()", [userId]);
        const rows = await q(`SELECT orb_id, reward FROM tree_exp_orbs WHERE user_id = ? AND plant_id = ? AND status = 'pending'${orbId ? ' AND orb_id = ?' : ''} ORDER BY orb_id ASC${limit ? ' LIMIT ?' : ''} FOR UPDATE`,
            [userId, tree.plant_id, ...(orbId ? [orbId] : []), ...(limit ? [limit] : [])]);
        if (!rows.length) return { reward: 0, count: 0 };
        const ids = rows.map(row => positive(row.orb_id, '经验球编号'));
        const reward = rows.reduce((sum,row) => sum + positive(row.reward, '经验球成长值'), 0);
        const updated = await q(`UPDATE tree_exp_orbs SET status = 'collected', collected_at = NOW() WHERE user_id = ? AND plant_id = ? AND status = 'pending' AND orb_id IN (${ids.map(() => '?').join(',')})`, [userId, tree.plant_id, ...ids]);
        if (updated.affectedRows !== ids.length) throw failure('经验球状态已变化，请刷新后重试');
        tree.growth_val = Number(tree.growth_val || 0) + reward;
        tree.tree_status = statusFor(tree.growth_val);
        const grown = await q('UPDATE treeplant SET growth_val = ?, tree_status = ? WHERE plant_id = ? AND user_id = ? AND is_gotten = 0', [tree.growth_val, tree.tree_status, tree.plant_id, userId]);
        if (grown.affectedRows !== 1) throw failure('树木状态已变化，请刷新后重试');
        return { reward, count: ids.length };
    }
    async function pendingOrbs(q, userId, plantId) {
        return q("SELECT orb_id, reward, pos_x, pos_y, source_task_code, spawn_type, created_at FROM tree_exp_orbs WHERE user_id = ? AND plant_id = ? AND status = 'pending' ORDER BY orb_id ASC", [userId,plantId]);
    }
    return {
        async task({ userId, taskCode }) {
            userId = positive(userId,'用户编号');
            if (!/^[a-zA-Z0-9_-]{1,80}$/.test(String(taskCode || ''))) throw failure('任务编号无效',400);
            const config = await settings(), rewardBenefits = await benefits(userId);
            return withTransaction(async q => {
                await lockBank(q,userId);
                const tree = await ownedTree(q,userId);
                const tasks = await q('SELECT * FROM tree_tasks WHERE task_code = ? LIMIT 1',[taskCode]);
                if (!tasks[0]) throw failure('任务不存在',404);
                const task = tasks[0];
                const previous = await q('SELECT * FROM user_tree_tasks WHERE user_id = ? AND task_code = ? FOR UPDATE',[userId,taskCode]);
                const prior = previous[0], now = new Date();
                if (prior && ((task.task_type === 'daily' && sameDay(prior.last_completed_at,now)) || (task.task_type === 'fixed' && Number(prior.is_completed) === 1))) throw failure('任务已完成');
                if (!['daily','fixed'].includes(task.task_type)) throw failure('任务配置无效',503);
                if (prior) await q('UPDATE user_tree_tasks SET last_completed_at = ?, is_completed = 1 WHERE id = ?',[now,prior.id]);
                else await q('INSERT INTO user_tree_tasks (user_id, task_code, last_completed_at, is_completed) VALUES (?, ?, ?, 1)',[userId,taskCode,now]);
                const reward = rewardFor(task.growth_reward,rewardBenefits.multiplier), growth = Number(tree.growth_val || 0)+reward, status=statusFor(growth);
                await q('UPDATE treeplant SET growth_val = ?, tree_status = ? WHERE plant_id = ? AND user_id = ? AND is_gotten = 0',[growth,status,tree.plant_id,userId]);
                return { msg:'Task completed', reward, growth_val:growth, tree_status:status, max_growth:Number(config.max_growth)||100, base_reward:Number(task.growth_reward), reward_multiplier:rewardBenefits.multiplier, reward_benefits:rewardBenefits, task_icon:task.icon };
            }, 'reader tree daily task');
        },
        async plant({ userId, treeType }) {
            userId = positive(userId, '用户编号');
            return withTransaction(async q => {
                await lockBank(q,userId);
                const active = await q('SELECT plant_id FROM treeplant WHERE user_id = ? AND is_gotten = 0 FOR UPDATE', [userId]);
                if (active.length) throw failure('已有正在生长的树木，请刷新树场');
                const rows = await q('SELECT * FROM treeplant WHERE user_id = ? ORDER BY plant_id DESC LIMIT 1 FOR UPDATE', [userId]);
                const last = rows[0], growth = Math.max(0, Number(last && last.growth_val || 0) - 100);
                const theme = normalizeTheme(treeType || (last && last.treeType));
                const result = await q('INSERT INTO treeplant(treeType, user_id, tree_status, growth_val) VALUES(?, ?, ?, ?)', [theme,userId,statusFor(growth),growth]);
                return { success:true, insertId:result.insertId, plant_id:result.insertId, affectedRows:result.affectedRows, growth_val:growth, tree_status:statusFor(growth), treeType:theme };
            }, 'reader plant tree');
        },
        async collect({ userId, plantId, orbId }) {
            userId = positive(userId,'用户编号');
            if (plantId != null) plantId = positive(plantId,'树木编号');
            if (orbId != null) orbId = positive(orbId,'经验球编号');
            if (!await expReady()) throw failure('经验球功能暂不可用', 503);
            const config = await settings();
            return withTransaction(async q => {
                await lockBank(q,userId);
                const tree = await ownedTree(q,userId,plantId);
                if (Number(tree.is_gotten) !== 0) throw failure('这棵树已收获，请刷新树场');
                const result = await collectOrbs(q,userId,tree,orbId,Math.max(1,Number(config.collect_all_limit)||50));
                if (!result.count) throw failure(orbId ? '经验球不存在或已被收集' : '暂无可收集经验球');
                return { success:true, msg:orbId ? '收集成功' : '一键收集成功', reward:result.reward, total_reward:result.reward, collect_count:result.count, growth_val:Number(tree.growth_val), tree_status:tree.tree_status, max_growth:Number(config.max_growth)||100, exp_orbs:await pendingOrbs(q,userId,tree.plant_id) };
            }, 'reader collect tree orbs');
        },
        async harvest({ userId, plantId, collectPending = false }) {
            userId = positive(userId,'用户编号');
            if (plantId != null) plantId = positive(plantId,'树木编号');
            const enabled = await expReady();
            return withTransaction(async q => {
                const balance = await lockBank(q,userId), tree = await ownedTree(q,userId,plantId);
                // Explicit desktop IDs safely replay after a lost response, even
                // after the user has planted a different tree.
                if (Number(tree.is_gotten) === 1) return { success:true, replayed:true, plant_id:Number(tree.plant_id), rewards:null, balances:{log:Number(balance.log),apple:Number(balance.apple)} };
                let collected = { reward:0, count:0 };
                if (enabled && collectPending) collected = await collectOrbs(q,userId,tree,null,null);
                if (!['开花','结果'].includes(tree.tree_status)) throw failure('树苗还在成长中，无法收获');
                const log = 5, apple = tree.tree_status === '结果' ? 1+Math.floor(random()*3) : 0;
                const changed = await q('UPDATE treeplant SET is_gotten = 1 WHERE user_id = ? AND plant_id = ? AND is_gotten = 0', [userId,tree.plant_id]);
                if (changed.affectedRows !== 1) throw failure('这棵树已收获，请刷新树场');
                const credited = await q('UPDATE user_bank SET log = log + ?, apple = apple + ? WHERE user_id = ?', [log,apple,userId]);
                if (credited.affectedRows !== 1) throw failure('资源入账失败', 503);
                if (enabled) await q("UPDATE tree_exp_orbs SET status = 'expired', collected_at = NOW() WHERE user_id = ? AND plant_id = ? AND status = 'pending'", [userId,tree.plant_id]);
                return { success:true, replayed:false, plant_id:Number(tree.plant_id), rewards:{log,apple}, collected_count:collected.count, collected_reward:collected.reward, growth_val:Number(tree.growth_val), balances:{log:Number(balance.log)+log,apple:Number(balance.apple)+apple} };
            }, 'reader harvest tree');
        }
    };
}
module.exports = { createReaderTreeOperations };
