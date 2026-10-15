import { responseList, responseObject } from "~/utils/social-response";
import { socialRequest } from "./social";
const get = (path, params = {}) =>
  socialRequest(path, params, "GET", null, true);
const post = (path, body, method = "POST") =>
  socialRequest(path, {}, method, body, true);
const data = (promise) =>
  promise.then((result) => {
    if (!result || result.data === undefined || result.data === null)
      throw new Error("账户服务返回数据异常，请刷新重试");
    return result.data;
  });
export default {
  profile: () =>
    get("/users/userprofile").then((value) => {
      if (!value || !value.user_id)
        throw new Error("用户资料加载异常，请重新登录");
      return value;
    }),
  balances: () =>
    get("/resource/get_resources").then((rows) => {
      responseList(rows, "账户资源");
      if (!rows.length) throw new Error("资源余额读取失败，请刷新重试");
      return responseObject(rows[0], "账户资源");
    }),
  membershipPlans: () =>
    data(socialRequest("/membership/plans")).then((value) =>
      responseList(value, "通行证方案")
    ),
  membership: () => data(get("/membership/subscription")),
  subscribe: (body) => data(post("/membership/subscribe", body)),
  gift: (body) => data(post("/membership/gift", body)),
  giftFriends: () =>
    data(get("/membership/gift-friends")).then((result) => result.list),
  autoRenew: (enabled) =>
    data(post("/membership/auto-renew", { enabled }, "PATCH")),
  redeem: (code) => data(post("/membership/redeem", { code })),
  redeemHistory: (page = 1) =>
    data(get("/membership/redeem-history", { page, pageSize: 20 })),
  achievements: () => get("/users/achievements"),
  achievementSummary: () => get("/users/achievements_summary"),
  achievementDefinitions: () => get("/users/achievements_definitions"),
  achievementProgress: (id) =>
    get("/users/achievement_progress", { achievement_id: id }),
  selectBadge: (id) => post("/users/select_badge", { achievement_id: id }),
  saveTitle: (body) => post("/users/title_profile", body),
  frames: () => data(get("/avatar-frames")),
  selectFrame: (id) =>
    data(post("/avatar-frames/selection", { frame_id: id }, "PUT")),
  credit: () => get("/credit/history"),
  invite: () => get("/app/get_invite_code"),
  useInvite: (body) => post("/app/use_invite_code", body),
  lab: () => data(socialRequest("/lab")),
  faqs: () => socialRequest("/app/get_typical_faqs"),
  newestFaqs: () => socialRequest("/app/get_newest_faqs"),
  feedback: (body) => post("/app/post_faq", body),
};
export function accountRequestId(prefix = "account") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
