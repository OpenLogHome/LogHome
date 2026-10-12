import axios from 'axios'

export async function getLabEntries(baseUrl) {
  const response = await axios.get(baseUrl + '/lab')
  const entries = response.data && response.data.data
  if (!Array.isArray(entries) || entries.some(entry => !entry || !/^[a-z][a-z0-9-]{0,63}$/.test(entry.id) || !/^[a-z][a-z0-9-]{0,63}$/.test(entry.miniappId) || typeof entry.name !== 'string' || typeof entry.icon !== 'string')) {
    throw new Error('实验室配置格式不正确')
  }
  return entries
}
