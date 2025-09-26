/**
 * URI解析器工具函数
 * 用于将桌面端URI转换为移动端URI
 */

import uriMapping from '~/config/uri-mapping.js'

/**
 * 解析桌面端URI为移动端URI
 * @param {string} desktopPath - 桌面端路径
 * @param {Object} query - 查询参数对象
 * @returns {Object} 包含path和query的对象
 */
export function resolveDesktopToMobile(desktopPath, query = {}) {
  // 检查是否需要忽略的路径
  if (shouldIgnorePath(desktopPath)) {
    return { path: desktopPath, query }
  }

  let mobilePath = desktopPath
  let mobileQuery = { ...query }

  // 1. 精确匹配
  const exactMatch = uriMapping.exact[desktopPath]
  if (exactMatch) {
    mobilePath = exactMatch
  } else {
    // 2. 参数匹配
    const paramMatch = findParamMatch(desktopPath)
    if (paramMatch) {
      mobilePath = paramMatch
    } else {
      // 3. 前缀匹配
      const prefixMatch = findPrefixMatch(desktopPath)
      if (prefixMatch) {
        mobilePath = prefixMatch
      } else {
        // 4. 使用默认规则
        mobilePath = applyDefaultRules(desktopPath)
      }
    }
  }

  // 5. 处理查询参数映射
  mobileQuery = mapQueryParams(mobileQuery)

  // 6. 移除不需要的查询参数
  mobileQuery = removeUnwantedParams(mobileQuery)

  return {
    path: mobilePath,
    query: mobileQuery
  }
}

/**
 * 检查路径是否应该被忽略
 * @param {string} path - 路径
 * @returns {boolean}
 */
function shouldIgnorePath(path) {
  return uriMapping.special.ignore.some(ignorePath => 
    path.startsWith(ignorePath)
  )
}

/**
 * 查找参数匹配规则
 * @param {string} path - 路径
 * @returns {string|null}
 */
function findParamMatch(path) {
  for (const rule of uriMapping.params) {
    const match = path.match(rule.pattern)
    if (match) {
      return rule.replacement.replace(/\$(\d+)/g, (_, index) => match[index])
    }
  }
  return null
}

/**
 * 查找前缀匹配规则
 * @param {string} path - 路径
 * @returns {string|null}
 */
function findPrefixMatch(path) {
  for (const rule of uriMapping.prefix) {
    if (path.startsWith(rule.from)) {
      return path.replace(rule.from, rule.to)
    }
  }
  return null
}

/**
 * 应用默认规则
 * @param {string} path - 路径
 * @returns {string}
 */
function applyDefaultRules(path) {
  const { default: defaultRules } = uriMapping

  if (!defaultRules.keepOriginal) {
    return defaultRules.prefix + path
  }

  // 移除指定前缀
  let processedPath = path
  for (const prefix of defaultRules.removePrefix) {
    if (processedPath.startsWith(prefix)) {
      processedPath = processedPath.substring(prefix.length)
      break
    }
  }

  return defaultRules.prefix + processedPath
}

/**
 * 映射查询参数
 * @param {Object} query - 原始查询参数
 * @returns {Object}
 */
function mapQueryParams(query) {
  const mappedQuery = {}
  
  for (const [key, value] of Object.entries(query)) {
    const mappedKey = uriMapping.queryParams[key] || key
    mappedQuery[mappedKey] = value
  }
  
  return mappedQuery
}

/**
 * 移除不需要的查询参数
 * @param {Object} query - 查询参数
 * @returns {Object}
 */
function removeUnwantedParams(query) {
  const cleanQuery = { ...query }
  
  for (const param of uriMapping.special.removeParams) {
    delete cleanQuery[param]
  }
  
  return cleanQuery
}

/**
 * 构建完整的移动端URL
 * @param {string} mobileBaseUrl - 移动端基础URL
 * @param {string} desktopPath - 桌面端路径
 * @param {Object} query - 查询参数
 * @returns {string}
 */
export function buildMobileUrl(mobileBaseUrl, desktopPath, query = {}) {
  const resolved = resolveDesktopToMobile(desktopPath, query)
  
  let url = mobileBaseUrl
  
  // 确保基础URL不以/结尾
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  
  // 添加hash路由
  if (resolved.path && resolved.path !== '/') {
    url += '/#' + resolved.path
  } else {
    url += '/#/'
  }
  
  // 添加查询参数
  const queryString = buildQueryString(resolved.query)
  if (queryString) {
    url += '?' + queryString
  }
  
  return url
}

/**
 * 构建查询字符串
 * @param {Object} query - 查询参数对象
 * @returns {string}
 */
function buildQueryString(query) {
  const params = []
  
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }
  
  return params.join('&')
}

/**
 * 解析完整URL为路径和查询参数
 * @param {string} url - 完整URL
 * @returns {Object}
 */
export function parseUrl(url) {
  try {
    const urlObj = new URL(url)
    const query = {}
    
    // 解析查询参数
    for (const [key, value] of urlObj.searchParams.entries()) {
      query[key] = value
    }
    
    return {
      path: urlObj.pathname,
      query,
      hash: urlObj.hash
    }
  } catch (error) {
    // 如果不是完整URL，尝试解析为路径
    const [path, queryString] = url.split('?')
    const query = {}
    
    if (queryString) {
      const params = new URLSearchParams(queryString)
      for (const [key, value] of params.entries()) {
        query[key] = value
      }
    }
    
    return { path, query, hash: '' }
  }
}

/**
 * 验证URI映射配置
 * @returns {Object} 验证结果
 */
export function validateUriMapping() {
  const errors = []
  const warnings = []
  
  // 检查精确匹配规则
  for (const [from, to] of Object.entries(uriMapping.exact)) {
    if (!from.startsWith('/')) {
      errors.push(`精确匹配规则中的源路径必须以/开头: ${from}`)
    }
    if (!to.startsWith('/')) {
      errors.push(`精确匹配规则中的目标路径必须以/开头: ${to}`)
    }
  }
  
  // 检查参数匹配规则
  for (const rule of uriMapping.params) {
    if (!(rule.pattern instanceof RegExp)) {
      errors.push(`参数匹配规则的pattern必须是正则表达式: ${rule.pattern}`)
    }
    if (typeof rule.replacement !== 'string') {
      errors.push(`参数匹配规则的replacement必须是字符串: ${rule.replacement}`)
    }
  }
  
  // 检查前缀匹配规则
  for (const rule of uriMapping.prefix) {
    if (!rule.from.startsWith('/')) {
      errors.push(`前缀匹配规则的from必须以/开头: ${rule.from}`)
    }
    if (!rule.to.startsWith('/')) {
      errors.push(`前缀匹配规则的to必须以/开头: ${rule.to}`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export default {
  resolveDesktopToMobile,
  buildMobileUrl,
  parseUrl,
  validateUriMapping
}