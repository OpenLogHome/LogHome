// API 基础配置
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://loghomeservice.codesocean.top' 
  : 'http://127.0.0.1:9000'

// 通用请求函数
async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // 添加认证token（如果存在）
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// GET 请求
export function get(url, params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url
  
  return request(fullUrl, {
    method: 'GET',
  })
}

// POST 请求
export function post(url, data = {}) {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PUT 请求
export function put(url, data = {}) {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// DELETE 请求
export function del(url) {
  return request(url, {
    method: 'DELETE',
  })
}

// 商品相关API
export const productAPI = {
  // 获取商品列表
  getProducts(params = {}) {
    return get('/store/products', params)
  },
  
  // 获取商品详情
  getProductDetail(id) {
    return get(`/store/products/${id}`)
  },
  
  // 获取商品分类
  getCategories() {
    return get('/store/categories')
  },
  
  // 获取相关商品
  getRelatedProducts(id) {
    return get(`/store/products/${id}/related`)
  }
}

// 购物车相关API
export const cartAPI = {
  // 获取购物车
  getCart() {
    return get('/store/cart')
  },
  
  // 添加到购物车
  addToCart(data) {
    return post('/store/cart/add', data)
  },
  
  // 更新购物车商品数量
  updateCart(data) {
    return put('/store/cart/update', data)
  },
  
  // 删除购物车商品
  removeFromCart(cartId) {
    return del(`/store/cart/${cartId}`)
  },
  
  // 批量删除购物车商品
  batchRemoveFromCart(cartIds) {
    return post('/store/cart/batch-delete', { cart_ids: cartIds })
  }
}

// 订单相关API
export const orderAPI = {
  // 获取订单列表
  getOrders(params = {}) {
    return get('/store/orders', params)
  },
  
  // 获取订单详情
  getOrderDetail(id) {
    return get(`/store/orders/${id}`)
  },
  
  // 创建订单
  createOrder(data) {
    return post('/store/orders/create', data)
  },
  
  // 取消订单
  cancelOrder(id) {
    return put(`/store/orders/${id}/cancel`)
  },
  
  // 确认收货
  confirmOrder(id) {
    return put(`/store/orders/${id}/confirm`)
  }
}

// 用户相关API
export const userAPI = {
  // 用户登录
  login(data) {
    return post('/users/login', data)
  },
  
  // 用户注册
  register(data) {
    return post('/users/register', data)
  },
  
  // 获取用户信息
  getUserInfo() {
    return get('/users/profile')
  },
  
  // 更新用户信息
  updateUserInfo(data) {
    return put('/users/profile', data)
  }
}

// 认证相关工具函数
export const auth = {
  // 设置token
  setToken(token) {
    localStorage.setItem('auth_token', token)
  },
  
  // 获取token
  getToken() {
    return localStorage.getItem('auth_token')
  },
  
  // 移除token
  removeToken() {
    localStorage.removeItem('auth_token')
  },
  
  // 检查是否已登录
  isLoggedIn() {
    return !!this.getToken()
  }
}

// 错误处理工具
export const errorHandler = {
  // 处理API错误
  handleError(error) {
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          auth.removeToken()
          window.location.href = '/login'
          break
        case 403:
          alert('没有权限访问此资源')
          break
        case 404:
          alert('请求的资源不存在')
          break
        case 500:
          alert('服务器内部错误，请稍后重试')
          break
        default:
          alert(data.message || '请求失败，请稍后重试')
      }
    } else if (error.request) {
      // 网络错误
      alert('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      alert(error.message || '发生未知错误')
    }
  }
}

// 数据格式化工具
export const formatter = {
  // 格式化价格
  formatPrice(price) {
    return `¥${parseFloat(price).toFixed(2)}`
  },
  
  // 格式化日期
  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  },
  
  // 格式化订单状态
  formatOrderStatus(status) {
    const statusMap = {
      pending: '待支付',
      paid: '已支付',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消'
    }
    return statusMap[status] || status
  }
}

export default {
  get,
  post,
  put,
  del,
  productAPI,
  cartAPI,
  orderAPI,
  userAPI,
  auth,
  errorHandler,
  formatter
}