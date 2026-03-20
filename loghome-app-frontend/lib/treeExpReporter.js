import axios from 'axios'
import { notifySettledExpTaskCompletion } from './treeExpTaskNotifier'

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

export function createTreeExpReporter(vm, activityType, options = {}) {
    return {
        vm,
        activityType,
        reportThresholdSeconds: Number(options.reportThresholdSeconds || 60),
        activeWindowMs: Number(options.activeWindowMs || 120000),
        maxBufferedSeconds: Number(options.maxBufferedSeconds || 300),
        bufferedSeconds: 0,
        lastActiveAt: 0,
        timer: null,
        flushPromise: null,
        markActive() {
            this.lastActiveAt = Date.now()
        },
        start() {
            this.markActive()
            if (this.timer) return
            this.timer = setInterval(() => {
                if (Date.now() - this.lastActiveAt > this.activeWindowMs) return
                this.bufferedSeconds = Math.min(this.bufferedSeconds + 1, this.maxBufferedSeconds)
                this.flush()
            }, 1000)
        },
        async flush(force = false) {
            if (this.flushPromise) {
                await this.flushPromise
                if (force) return this.flush(true)
                return
            }

            const token = getToken()
            if (!token || !this.vm || !this.vm.$baseUrl) return

            const seconds = force
                ? Math.floor(this.bufferedSeconds)
                : Math.floor(this.bufferedSeconds / this.reportThresholdSeconds) * this.reportThresholdSeconds

            if (seconds <= 0) return

            this.bufferedSeconds = Math.max(0, this.bufferedSeconds - seconds)
            this.flushPromise = axios.post(
                this.vm.$baseUrl + '/treePlant/report_exp_activity',
                {
                    activity_type: this.activityType,
                    seconds,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                }
            )
                .then((res) => {
                    if (res && res.data) {
                        notifySettledExpTaskCompletion(res.data, this.activityType, seconds)
                    }
                    return res
                })
                .catch(() => {
                    this.bufferedSeconds = Math.min(this.bufferedSeconds + seconds, this.maxBufferedSeconds)
                })
                .finally(() => {
                    this.flushPromise = null
                    if (this.bufferedSeconds >= this.reportThresholdSeconds) this.flush()
                })

            return this.flushPromise
        },
        async stop() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
            await this.flush(true)
        },
    }
}
