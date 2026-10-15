import {
  responseObject,
  responseList,
  responsePage,
} from "~/utils/social-response";
import { socialRequest } from "./social";
const request = (path, params = {}, method = "GET", body, auth = false) =>
  socialRequest(`/store${path}`, params, method, body, auth).then((result) => {
    if (!result || result.data == null)
      throw new Error("商城数据异常，请刷新重试");
    return result.data;
  });
export default {
  products: (params) =>
    request("/products", params).then((value) =>
      responsePage(value, "商品列表")
    ),
  product: (id) =>
    request(`/products/${encodeURIComponent(id)}`).then((value) => {
      responseObject(value, "商品详情");
      if (!value.id || !value.title)
        throw new Error("商品详情数据异常，请刷新重试");
      return value;
    }),
  addresses: () =>
    request("/addresses", {}, "GET", null, true).then((value) =>
      responseList(value, "收货地址")
    ),
  saveAddress: (id, body) =>
    request(
      id ? `/addresses/${id}` : "/addresses",
      {},
      id ? "PUT" : "POST",
      body,
      true
    ),
  defaultAddress: (id) =>
    request(`/addresses/${id}/default`, {}, "POST", {}, true),
  deleteAddress: (id) => request(`/addresses/${id}`, {}, "DELETE", null, true),
  createOrder: (body) => request("/orders", {}, "POST", body, true),
  orders: (params) =>
    request("/orders", params, "GET", null, true).then((value) =>
      responsePage(value, "订单列表")
    ),
  confirm: (id) => request(`/orders/${id}/confirm`, {}, "POST", {}, true),
  logistics: (id) => request(`/orders/${id}/logistics`, {}, "GET", null, true),
};
