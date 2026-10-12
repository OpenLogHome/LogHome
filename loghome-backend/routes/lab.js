const express = require('express');
const {createLabRegistry} = require('../bin/lab');
function createRouter({registry, adminAuth} = {}) {
  registry ||= createLabRegistry(require('../sql').query);
  adminAuth ||= require('../bin/adminAuth');
  const router = express.Router();
  const handle = fn => async (req,res) => { try { await fn(req,res); } catch(e) { if (!e.status) console.error('原木实验室配置错误:',e.code || e.name); res.status(e.status || 500).json({message:e.status ? e.message : '实验室服务暂不可用'}); } };
  router.get('/manage',adminAuth,handle(async(req,res) => res.json({data:await registry.all(true)})));
  router.post('/manage',adminAuth,handle(async(req,res) => res.status(201).json({data:await registry.save(req.body)})));
  router.put('/manage/:id',adminAuth,handle(async(req,res) => res.json({data:await registry.save(req.body,req.params.id)})));
  router.delete('/manage/:id',adminAuth,handle(async(req,res) => { await registry.remove(req.params.id); res.json({message:'已删除实验室入口'}); }));
  router.get('/',handle(async(req,res) => { res.set('Cache-Control','no-store'); res.json({data:await registry.catalog()}); }));
  return router;
}
module.exports = createRouter();
module.exports.createRouter = createRouter;
