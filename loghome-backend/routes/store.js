// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');

let router = express.Router();

// 获取商店商品列表
router.get('/products', async function (req, res) {
    try {
        const { page = 1, limit = 20, category, search } = req.query;
        const offset = (page - 1) * limit;
        
        let sql = `SELECT * FROM store_products WHERE status = 'active'`;
        let params = [];
        
        // 添加分类筛选
        if (category) {
            sql += ` AND category = ?`;
            params.push(category);
        }
        
        // 添加搜索功能
        if (search) {
            sql += ` AND (name LIKE ? OR description LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }
        
        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));
        
        const products = await query(sql, params);
        
        // 获取总数
        let countSql = `SELECT COUNT(*) as total FROM store_products WHERE status = 'active'`;
        let countParams = [];
        
        if (category) {
            countSql += ` AND category = ?`;
            countParams.push(category);
        }
        
        if (search) {
            countSql += ` AND (name LIKE ? OR description LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`);
        }
        
        const countResult = await query(countSql, countParams);
        const total = countResult[0].total;
        
        res.json({
            code: 200,
            message: '获取商品列表成功',
            data: {
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('获取商品列表失败:', error);
        res.json({
            code: 500,
            message: '获取商品列表失败',
            error: error.message
        });
    }
});

// 获取商品详情
router.get('/products/:id', async function (req, res) {
    try {
        const { id } = req.params;
        
        const sql = `SELECT * FROM store_products WHERE id = ? AND status = 'active'`;
        const products = await query(sql, [id]);
        
        if (products.length === 0) {
            return res.json({
                code: 404,
                message: '商品不存在'
            });
        }
        
        res.json({
            code: 200,
            message: '获取商品详情成功',
            data: products[0]
        });
    } catch (error) {
        console.error('获取商品详情失败:', error);
        res.json({
            code: 500,
            message: '获取商品详情失败',
            error: error.message
        });
    }
});

// 获取商品分类
router.get('/categories', async function (req, res) {
    try {
        const sql = `SELECT DISTINCT category FROM store_products WHERE status = 'active' AND category IS NOT NULL`;
        const categories = await query(sql);
        
        res.json({
            code: 200,
            message: '获取分类成功',
            data: categories.map(item => item.category)
        });
    } catch (error) {
        console.error('获取分类失败:', error);
        res.json({
            code: 500,
            message: '获取分类失败',
            error: error.message
        });
    }
});

// 添加到购物车 (需要登录)
router.post('/cart/add', auth, async function (req, res) {
    try {
        const { product_id, quantity = 1 } = req.body;
        const user_id = req.user[0].user_id;
        
        console.log(req.user)
        if (!product_id) {
            return res.json({
                code: 400,
                message: '商品ID不能为空'
            });
        }
        
        // 检查商品是否存在
        const productSql = `SELECT * FROM store_products WHERE id = ? AND status = 'active'`;
        const products = await query(productSql, [product_id]);
        
        if (products.length === 0) {
            return res.json({
                code: 404,
                message: '商品不存在'
            });
        }
        
        // 检查购物车中是否已有该商品
        const cartSql = `SELECT * FROM store_cart WHERE user_id = ? AND product_id = ?`;
        const cartItems = await query(cartSql, [user_id, product_id]);
        
        if (cartItems.length > 0) {
            // 更新数量
            const updateSql = `UPDATE store_cart SET quantity = quantity + ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?`;
            await query(updateSql, [quantity, user_id, product_id]);
        } else {
            // 添加新项
            const insertSql = `INSERT INTO store_cart (user_id, product_id, quantity, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`;
            await query(insertSql, [user_id, product_id, quantity]);
        }
        
        res.json({
            code: 200,
            message: '添加到购物车成功'
        });
    } catch (error) {
        console.error('添加到购物车失败:', error);
        res.json({
            code: 500,
            message: '添加到购物车失败',
            error: error.message
        });
    }
});

// 获取购物车 (需要登录)
router.get('/cart', auth, async function (req, res) {
    try {
        const user_id = req.user[0].user_id;
        
        const sql = `
            SELECT c.*, p.name, p.price, p.image_url, p.status as product_status
            FROM store_cart c
            JOIN store_products p ON c.product_id = p.id
            WHERE c.user_id = ? AND p.status = 'active'
            ORDER BY c.updated_at DESC
        `;
        
        const cartItems = await query(sql, [user_id]);
        
        // 计算总价
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        res.json({
            code: 200,
            message: '获取购物车成功',
            data: {
                items: cartItems,
                totalPrice,
                totalItems: cartItems.length
            }
        });
    } catch (error) {
        console.error('获取购物车失败:', error);
        res.json({
            code: 500,
            message: '获取购物车失败',
            error: error.message
        });
    }
});

// 更新购物车商品数量 (需要登录)
router.put('/cart/:id', auth, async function (req, res) {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const user_id = req.user[0].user_id;
        
        if (!quantity || quantity < 1) {
            return res.json({
                code: 400,
                message: '数量必须大于0'
            });
        }
        
        const sql = `UPDATE store_cart SET quantity = ?, updated_at = NOW() WHERE id = ? AND user_id = ?`;
        const result = await query(sql, [quantity, id, user_id]);
        
        if (result.affectedRows === 0) {
            return res.json({
                code: 404,
                message: '购物车项目不存在'
            });
        }
        
        res.json({
            code: 200,
            message: '更新购物车成功'
        });
    } catch (error) {
        console.error('更新购物车失败:', error);
        res.json({
            code: 500,
            message: '更新购物车失败',
            error: error.message
        });
    }
});

// 删除购物车商品 (需要登录)
router.delete('/cart/:id', auth, async function (req, res) {
    try {
        const { id } = req.params;
        const user_id = req.user[0].user_id;
        
        const sql = `DELETE FROM store_cart WHERE id = ? AND user_id = ?`;
        const result = await query(sql, [id, user_id]);
        
        if (result.affectedRows === 0) {
            return res.json({
                code: 404,
                message: '购物车项目不存在'
            });
        }
        
        res.json({
            code: 200,
            message: '删除购物车项目成功'
        });
    } catch (error) {
        console.error('删除购物车项目失败:', error);
        res.json({
            code: 500,
            message: '删除购物车项目失败',
            error: error.message
        });
    }
});

// 创建订单 (需要登录)
router.post('/orders', auth, async function (req, res) {
    try {
        const { items, shipping_address, payment_method = 'online' } = req.body;
        const user_id = req.user[0].user_id;
        
        if (!items || items.length === 0) {
            return res.json({
                code: 400,
                message: '订单商品不能为空'
            });
        }
        
        if (!shipping_address) {
            return res.json({
                code: 400,
                message: '收货地址不能为空'
            });
        }
        
        // 计算订单总价
        let totalPrice = 0;
        for (const item of items) {
            const productSql = `SELECT price FROM store_products WHERE id = ? AND status = 'active'`;
            const products = await query(productSql, [item.product_id]);
            
            if (products.length === 0) {
                return res.json({
                    code: 404,
                    message: `商品ID ${item.product_id} 不存在`
                });
            }
            
            totalPrice += products[0].price * item.quantity;
        }
        
        // 生成订单号
        const orderNo = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // 创建订单
        const orderSql = `
            INSERT INTO store_orders (order_no, user_id, total_price, shipping_address, payment_method, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())
        `;
        const orderResult = await query(orderSql, [orderNo, user_id, totalPrice, JSON.stringify(shipping_address), payment_method]);
        const orderId = orderResult.insertId;
        
        // 创建订单项目
        for (const item of items) {
            const productSql = `SELECT * FROM store_products WHERE id = ? AND status = 'active'`;
            const products = await query(productSql, [item.product_id]);
            const product = products[0];
            
            const orderItemSql = `
                INSERT INTO store_order_items (order_id, product_id, product_name, product_price, quantity, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())
            `;
            await query(orderItemSql, [orderId, item.product_id, product.name, product.price, item.quantity]);
        }
        
        res.json({
            code: 200,
            message: '创建订单成功',
            data: {
                order_id: orderId,
                order_no: orderNo,
                total_price: totalPrice
            }
        });
    } catch (error) {
        console.error('创建订单失败:', error);
        res.json({
            code: 500,
            message: '创建订单失败',
            error: error.message
        });
    }
});

// 获取用户订单列表 (需要登录)
router.get('/orders', auth, async function (req, res) {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const user_id = req.user[0].user_id;
        const offset = (page - 1) * limit;
        
        let sql = `SELECT * FROM store_orders WHERE user_id = ?`;
        let params = [user_id];
        
        if (status) {
            sql += ` AND status = ?`;
            params.push(status);
        }
        
        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));
        
        const orders = await query(sql, params);
        
        // 获取订单项目
        for (const order of orders) {
            const itemsSql = `SELECT * FROM store_order_items WHERE order_id = ?`;
            order.items = await query(itemsSql, [order.id]);
            
            // 解析地址
            try {
                order.shipping_address = JSON.parse(order.shipping_address);
            } catch (e) {
                order.shipping_address = {};
            }
        }
        
        res.json({
            code: 200,
            message: '获取订单列表成功',
            data: orders
        });
    } catch (error) {
        console.error('获取订单列表失败:', error);
        res.json({
            code: 500,
            message: '获取订单列表失败',
            error: error.message
        });
    }
});

// 获取订单详情 (需要登录)
router.get('/orders/:id', auth, async function (req, res) {
    try {
        const { id } = req.params;
        const user_id = req.user[0].user_id;
        
        const orderSql = `SELECT * FROM store_orders WHERE id = ? AND user_id = ?`;
        const orders = await query(orderSql, [id, user_id]);
        
        if (orders.length === 0) {
            return res.json({
                code: 404,
                message: '订单不存在'
            });
        }
        
        const order = orders[0];
        
        // 获取订单项目
        const itemsSql = `SELECT * FROM store_order_items WHERE order_id = ?`;
        order.items = await query(itemsSql, [order.id]);
        
        // 解析地址
        try {
            order.shipping_address = JSON.parse(order.shipping_address);
        } catch (e) {
            order.shipping_address = {};
        }
        
        res.json({
            code: 200,
            message: '获取订单详情成功',
            data: order
        });
    } catch (error) {
        console.error('获取订单详情失败:', error);
        res.json({
            code: 500,
            message: '获取订单详情失败',
            error: error.message
        });
    }
});

module.exports = router;