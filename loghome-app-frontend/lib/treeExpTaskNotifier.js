import axios from 'axios'

function getToken() {
    try {
        let rawToken = ''
        if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
            rawToken = uni.getStorageSync('token')
        } else if (typeof window !== 'undefined' && window.localStorage) {
            rawToken = window.localStorage.getItem('token')
        }

        const tokenData = typeof rawToken === 'string' ? JSON.parse(rawToken || 'null') : rawToken
        return (tokenData && tokenData.tk) || ''
    } catch (e) {
        return ''
    }
}

function toNumber(value, fallback = 0) {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
}

function getTaskCompletionGain(task, deltaValue) {
    const requiredValue = Math.max(1, Math.floor(toNumber(task && task.required_value, 1)))
    const dailyLimit = Math.max(1, Math.floor(toNumber(task && task.daily_limit, 1)))
    const currentProgress = Math.max(0, toNumber(task && task.progress_value, 0))
    const previousProgress = Math.max(0, currentProgress - Math.max(0, toNumber(deltaValue, 0)))
    const currentAchievable = Math.min(Math.floor(currentProgress / requiredValue), dailyLimit)
    const previousAchievable = Math.min(Math.floor(previousProgress / requiredValue), dailyLimit)
    return Math.max(0, currentAchievable - previousAchievable)
}

export function summarizeExpTaskCompletion(expTasks, sourceCode, deltaValue) {
    const tasks = Array.isArray(expTasks) ? expTasks : []
    const normalizedDelta = Math.max(0, toNumber(deltaValue, 0))
    const matchedTasks = []
    let totalReward = 0
    let totalCompletions = 0

    tasks
        .filter((task) => task && task.source_code === sourceCode)
        .forEach((task) => {
            const gain = getTaskCompletionGain(task, normalizedDelta)
            if (gain <= 0) return

            const reward = Math.max(0, toNumber(task.exp_reward, 0)) * gain
            totalReward += reward
            totalCompletions += gain
            matchedTasks.push({
                task_code: task.task_code,
                task_name: task.task_name,
                gain,
                reward,
            })
        })

    return {
        sourceCode,
        deltaValue: normalizedDelta,
        totalReward,
        totalCompletions,
        tasks: matchedTasks,
    }
}

export function showExpTaskCompletionToast(summary) {
    if (!summary || summary.totalCompletions <= 0) return false
    if (typeof uni === 'undefined' || typeof uni.showToast !== 'function') return false

    uni.showToast({
        title: `经验任务完成 成长值+${summary.totalReward}`,
        icon: 'none',
        duration: 2200,
    })
    return true
}

export function notifyExpTaskCompletion(expTasks, sourceCode, deltaValue) {
    const summary = summarizeExpTaskCompletion(expTasks, sourceCode, deltaValue)
    showExpTaskCompletionToast(summary)
    return summary
}

export function notifySettledExpTaskCompletion(result, sourceCode, deltaValue) {
    const totalReward = Math.max(0, toNumber(result && result.total_reward, 0))
    if (totalReward > 0) {
        const settledTasks = Array.isArray(result && result.settled_tasks) ? result.settled_tasks : []
        const totalCompletions = settledTasks.reduce((sum, item) => {
            return sum + Math.max(0, toNumber(item && item.settled_times, 0))
        }, 0)

        const summary = {
            sourceCode,
            deltaValue: Math.max(0, toNumber(deltaValue, 0)),
            totalReward,
            totalCompletions,
            tasks: settledTasks,
        }
        showExpTaskCompletionToast(summary)
        return summary
    }

    if (result && result.has_active_tree === false) {
        return {
            sourceCode,
            deltaValue: Math.max(0, toNumber(deltaValue, 0)),
            totalReward: 0,
            totalCompletions: 0,
            tasks: [],
        }
    }

    if (result && Array.isArray(result.exp_tasks)) {
        return notifyExpTaskCompletion(result.exp_tasks, sourceCode, deltaValue)
    }

    return {
        sourceCode,
        deltaValue: Math.max(0, toNumber(deltaValue, 0)),
        totalReward: 0,
        totalCompletions: 0,
        tasks: [],
    }
}

export async function fetchExpTaskStatus(vm) {
    const token = getToken()
    if (!token || !vm || !vm.$baseUrl) return []

    const res = await axios.get(vm.$baseUrl + '/treePlant/exp_task_status', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    })

    return res && res.data && Array.isArray(res.data.exp_tasks) ? res.data.exp_tasks : []
}

export async function checkAndNotifyExpTaskCompletion(vm, sourceCode, deltaValue) {
    const expTasks = await fetchExpTaskStatus(vm)
    return notifyExpTaskCompletion(expTasks, sourceCode, deltaValue)
}

export async function settleAndNotifyExpTaskCompletion(vm, sourceCode, deltaValue) {
    const token = getToken()
    if (!token || !vm || !vm.$baseUrl) {
        return {
            sourceCode,
            deltaValue: Math.max(0, toNumber(deltaValue, 0)),
            totalReward: 0,
            totalCompletions: 0,
            tasks: [],
        }
    }

    const res = await axios.post(
        vm.$baseUrl + '/treePlant/settle_exp_tasks',
        {
            source_code: sourceCode,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        }
    )

    return notifySettledExpTaskCompletion(res && res.data ? res.data : null, sourceCode, deltaValue)
}
