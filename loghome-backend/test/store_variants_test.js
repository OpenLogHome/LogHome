const assert = require('assert');
const express = require('express');
const { normalizeProduct } = require('../bin/pddProduct');
let fixture;
let inserted;
let charge;
let stockWrites;
let variantWrites;
let rollbackCount = 0;
let productWrites = [];
let serviceMode = false;
const clone = value => JSON.parse(JSON.stringify(value));
const sql = require('../sql');
sql.query = async (query) => {
	if (query.includes('store_product_variants')) return [{ id: 22, product_id: 1, label: '30个', price: 816, stock: 2, status: 'on' }];
	throw new Error('Unexpected query');
};
sql.withTransaction = async work => {
	const before = clone(fixture || {});
	try {
		return await work(async (query, values) => {
			if (serviceMode) {
				productWrites.push({ query, values });
				if (query.startsWith('SELECT * FROM store_products')) return [{ id:1,title:'old',type:'physical',price:336,stock:1,status:'on' }];
				if (query.startsWith('SELECT id FROM store_product_variants')) return [{id:22}];
				return { insertId:1,affectedRows:1 };
			}
			if (query.startsWith('INSERT INTO store_order_requests')) {
				if (fixture.replay) { const error = new Error(); error.code = 'ER_DUP_ENTRY'; throw error; }
				return { affectedRows: 1 };
			}
			if (query.includes('FROM store_order_requests')) return [fixture.replay];
			if (query.includes('FROM store_orders')) return [{ id:77,order_no:'existing',status:'completed',pay_log:316,pay_cropped_log:500 }];
			if (query.startsWith('INSERT IGNORE')) return { affectedRows: 1 };
			if (query.includes('FROM store_products')) { assert(query.includes('FOR UPDATE')); return [fixture.product]; }
			if (query.includes('FROM store_product_variants')) {
				assert(query.includes('FOR UPDATE'));
				return fixture.variant && Number(values[0]) === fixture.variant.id && Number(values[1]) === fixture.variant.product_id ? [fixture.variant] : [];
			}
			if (query.includes('FROM user_bank')) return [fixture.bank];
			if (query.startsWith('UPDATE user_bank')) {
				charge = values;
				fixture.bank.log -= values[0]; fixture.bank.cropped_log -= values[1];
				return { affectedRows:1 };
			}
			if (query.startsWith('UPDATE store_products')) { stockWrites++;fixture.product.stock--;return {affectedRows:1}; }
			if (query.startsWith('UPDATE store_product_variants')) { variantWrites++;fixture.variant.stock--;return {affectedRows:fixture.stockFailure ? 0 : 1}; }
			if (query.startsWith('INSERT INTO store_orders')) {
				const names = query.match(/store_orders \((.*?)\)/)[1].split(',').map(value=>value.trim());
				assert.equal(names.length,values.length);
				inserted = Object.fromEntries(names.map((name,index)=>[name,values[index]]));
				return {insertId:88};
			}
			if (query.startsWith('UPDATE store_order_requests')) return {affectedRows:1};
			throw new Error('Unexpected statement: '+query);
		});
	} catch (error) { fixture = before;rollbackCount++;throw error; }
};
const authPath = require.resolve('../bin/auth');
require.cache[authPath] = { id:authPath,filename:authPath,loaded:true,exports:(req,res,next)=>{req.user=[{user_id:99}];next();} };
const { buildPddProduct, normalizeVariants, aggregate, saveProduct, attachVariants } = require('../bin/storeProducts');
const app = express();app.use(express.json());app.use('/store',require('../routes/store'));
function reset() {
	fixture = { product:{id:1,title:'Minecraft',type:'virtual',price:336,stock:3,status:'on',has_variants:1},
		variant:{id:22,product_id:1,label:'混装30个',price:816,stock:2,status:'on',source_metadata:'{"goods_id":"665425217046","sku_id":"30","cost_cny":6.8}'},bank:{log:1000,cropped_log:500} };
	inserted=null;charge=null;stockWrites=0;variantWrites=0;
}
async function run() {
	const product=normalizeProduct({goods:{goods_id:665425217046,goods_name:'Minecraft',skus:[
		{sku_id:1,group_price:280,normal_price:400,specs:[{spec_value:'随机1个'}]},
		{sku_id:30,group_price:680,normal_price:1000,specs:[{spec_value:'混装30个'}]},
	]}});
	const body=buildPddProduct(product);
	assert.equal(body.status,'off');assert.equal(body.variants.length,2);
	assert.deepStrictEqual(body.variants.map(v=>[v.source.cost_cny,v.price,v.stock]),[[2.8,336,999],[6.8,816,999]]);
	assert.equal(body.variants[1].source.price_type,'group_before_coupon');
	assert.deepStrictEqual(aggregate(normalizeVariants(body.variants)), {price:336,stock:1998});
	assert.throws(()=>buildPddProduct({...product,skus:[{...product.skus[0],price:null}]}),/券前拼单价/);
	assert.throws(()=>buildPddProduct({...product,warnings:['部分规格未读取']}),/不完整/);
	assert.deepStrictEqual(aggregate(normalizeVariants([{label:'a',price:336,stock:3},{label:'b',price:816,stock:4},{label:'off',price:1,stock:99,status:'off'}])),{price:336,stock:7});
	assert.throws(()=>normalizeVariants([{label:'a',price:1,stock:-1}]),/库存/);
	assert.throws(()=>normalizeVariants([{label:'a',price:1,stock:1},{label:'a',price:2,stock:1}]),/重复/);
	const publicProducts=await attachVariants([{id:1}]);assert(!JSON.stringify(publicProducts).includes('cost_cny'));
	serviceMode=true;productWrites=[];
	await saveProduct(body);
	assert.equal(productWrites.filter(row=>row.query.startsWith('INSERT INTO store_product_variants')).length,2);
	const parent=productWrites.find(row=>row.query.startsWith('INSERT INTO store_products'));
	assert(parent.values.includes(336));assert.equal(JSON.parse(parent.values[11]).goods_id,'665425217046');
	await assert.rejects(()=>saveProduct({...body,variants:[{...body.variants[0],id:999}]},1),/不属于/);
	serviceMode=false;
	console.log('PASS multi-SKU import, before-coupon pricing, aggregate stock, source metadata, transactional save and ownership checks');
	const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
	async function submit(body){const response=await fetch('http://127.0.0.1:'+server.address().port+'/store/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:1,...body})});return {status:response.status,body:await response.json()};}
	try {
		reset();let response=await submit({variant_id:22});assert.equal(response.body.code,200);assert.equal(inserted.price,816);assert.equal(inserted.variant_id,22);assert.equal(inserted.variant_label,'混装30个');assert.equal(JSON.parse(inserted.source_snapshot).cost_cny,6.8);assert.deepStrictEqual(charge.slice(0,2),[316,500]);assert.equal(stockWrites,1);assert.equal(variantWrites,1);
		reset();response=await submit({});assert.equal(response.status,400);assert(response.body.msg.includes('规格'));assert.equal(charge,null);
		reset();response=await submit({variant_id:999});assert.equal(response.status,400);assert.equal(charge,null);
		reset();fixture.variant.status='off';response=await submit({variant_id:22});assert.equal(response.status,400);assert.equal(charge,null);
		reset();fixture.variant.stock=0;response=await submit({variant_id:22});assert.equal(response.status,400);assert.equal(charge,null);
		reset();fixture.stockFailure=true;const before=clone(fixture);response=await submit({variant_id:22});assert.equal(response.status,400);assert.deepStrictEqual(fixture,before);
		reset();fixture.product.has_variants=0;response=await submit({});assert.equal(response.body.code,200);assert.equal(inserted.price,336);assert.equal(inserted.variant_id,null);assert.equal(variantWrites,0);
		reset();fixture.replay={user_id:99,product_id:1,variant_id:22,status:'succeeded',order_id:77};response=await submit({variant_id:22,client_request_id:'existing'});assert.equal(response.body.data.id,77);assert.equal(charge,null);
		reset();fixture.replay={user_id:99,product_id:1,variant_id:23,status:'succeeded',order_id:77};response=await submit({variant_id:22,client_request_id:'existing'});assert.equal(response.status,409);assert.equal(charge,null);
		assert(rollbackCount>=6);
		console.log('PASS selected-SKU charges and snapshots, missing/foreign/disabled/out-of-stock rejection, rollback, legacy checkout, SKU-bound idempotency');
	} finally {server.close();}
}
run().catch(error=>{console.error(error);process.exitCode=1});
