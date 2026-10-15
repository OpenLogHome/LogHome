import {
  responseList,
  responsePage,
  responseObject,
} from "~/utils/social-response";
import { readingRequest, readingToken } from "./reading";
export function socialRequest(
  path,
  params = {},
  method = "GET",
  body,
  auth = false
) {
  const token = readingToken();
  if (auth && !token) return Promise.reject(new Error("请先登录"));
  return readingRequest(path, params, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }).then((data) => {
    if (auth && readingToken() !== token)
      throw new Error("账号已切换，请刷新后重试");
    if (
      data &&
      ((typeof data.code === "number" &&
        data.code !== 0 &&
        data.code !== 200) ||
        data.success === false)
    )
      throw new Error(data.message || data.msg || "操作失败");
    return data;
  });
}
const circle = (id) => `/community/circles/${encodeURIComponent(id)}`;
export default {
  sharePost: (id, message) =>
    socialRequest(
      "/community/posts/create_share_code",
      {},
      "POST",
      { post_id: id, share_message: message, expires_hours: 720 },
      true
    ).then((result) => {
      if (
        !result ||
        result.success !== true ||
        typeof result.share_text !== "string" ||
        !result.share_text.trim()
      )
        throw new Error("分享口令创建失败，请重试");
      return result.share_text;
    }),
  posts: (params) =>
    socialRequest("/community/posts/recommend", params).then((value) =>
      responsePage(value, "帖子列表")
    ),
  circlePosts: (params) =>
    socialRequest("/community/posts/list", params).then((value) =>
      responsePage(value, "圈子帖子")
    ),
  circleStatus: (id) =>
    socialRequest(`${circle(id)}/my-status`, {}, "GET", null, true),
  joinCircle: (body) =>
    socialRequest("/community/circles/join", {}, "POST", body, true),
  quitCircle: (id) =>
    socialRequest(
      "/community/circles/quit",
      {},
      "POST",
      { circle_id: Number(id) },
      true
    ),
  verification: (id) => socialRequest(`${circle(id)}/verification-questions`),
  circles: (params) =>
    socialRequest("/community/circles/list", params).then((value) =>
      responsePage(value, "圈子列表")
    ),
  recommendedCircles: () =>
    socialRequest("/community/circles/recommend", {
      pageSize: 4,
      sort: "random",
    }),
  myCircles: () =>
    socialRequest("/community/circles/my-circles", {}, "GET", null, true).then(
      (value) => responseList(value, "我的圈子")
    ),
  categories: () =>
    socialRequest("/community/circles/categories").then((value) =>
      responseList(value, "圈子分类")
    ),
  circle: (id) =>
    socialRequest(`/community/circles/detail/${encodeURIComponent(id)}`),
  circleSettings: (id) =>
    socialRequest(`${circle(id)}/settings`, {}, "GET", null, true),
  saveCircle: (id, data) =>
    socialRequest(
      id ? circle(id) : "/community/circles/create",
      {},
      id ? "PUT" : "POST",
      data,
      true
    ),
  saveCircleSettings: (id, data) =>
    socialRequest(`${circle(id)}/settings`, {}, "PUT", data, true),
  members: (id, params) => socialRequest(`${circle(id)}/members`, params),
  requests: (id, params) =>
    socialRequest(
      `${circle(id)}/join-requests`,
      { status: 0, ...params },
      "GET",
      null,
      true
    ),
  banned: (id, params) =>
    socialRequest(`${circle(id)}/banned-users`, params, "GET", null, true),
  memberAction: (id, action, data) =>
    socialRequest(
      action === "set-admin"
        ? "/community/circles/set-admin"
        : `${circle(id)}/${action}`,
      {},
      "POST",
      { circle_id: Number(id), ...data },
      true
    ),
  search: (params) => socialRequest("/community/search", params),
  hotSearch: (type) =>
    socialRequest("/community/search/hot", { type }).then((value) =>
      responseList(value, "热门搜索")
    ),
  likeStatuses: (ids) =>
    socialRequest(
      "/community/interactions/like/status/batch",
      {},
      "POST",
      { target_ids: ids, target_type: 1 },
      true
    ),
  like: (id) =>
    socialRequest(
      "/community/interactions/like",
      {},
      "POST",
      { target_id: id, target_type: 1 },
      true
    ),
  messages: () =>
    socialRequest("/users/get_history_message", {}, "GET", null, true).then(
      (value) => responseList(value, "消息列表")
    ),
  archive: (id) =>
    socialRequest("/users/hide_message", {}, "POST", { message_id: id }, true),
  deduplicateMessages: () =>
    socialRequest("/users/hide_duplicate_messages", {}, "POST", {}, true),
  conversations: () =>
    socialRequest("/community/chat_friends", {}, "GET", null, true),
  unread: () =>
    socialRequest("/community/unread_messages_count", {}, "GET", null, true),
};
