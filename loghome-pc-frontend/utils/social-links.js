import { readingMessageTarget } from "./reader-comment-links";
export function socialMessageTarget(raw) {
  if (typeof raw !== "string" || !raw || raw === "None") return null;
  const value = raw.replace(/^\.?\/?(?:pages\/)?/, "");
  if (/^(?:https?:|javascript:|data:|\/\/)/i.test(raw)) return null;
  const [path, query = ""] = value.split("?"),
    params = new URLSearchParams(query);
  const id =
    params.get("id") || params.get("product_id") || params.get("owner_id");
  const numeric = id && /^\d+$/.test(id) ? id : null;
  const exact = {
    "community/index": "/community",
    "community/circles": "/community/circles",
    "community/search": "/community/search",
    "community/message": "/me/messages",
    "community/privateMessages": "/me/messages?tab=private",
    "community/notifications": "/me/messages?tab=notification",
    "community/activityMessages": "/me/messages?tab=activity",
    "community/friends": "/me/friends",
    "community/createCircle": "/community/circle/create",
    "community/postEdit": "/community/post/edit",
    "community/send_mail": "/community/mail/new",
    me: "/me",
    "users/achievements": "/me/achievements",
    "users/avatar_frames": "/me/frames",
    "users/badgeDetail": "/me/achievements",
    "users/user_credit": "/me/credit",
    "users/clientSet": "/me/settings",
    "settings/privacySettings": "/me/settings",
    "settings/pushSettings": "/me/notifications",
    "users/storageManage": "/me/storage",
    "users/change_user_info": "/me/settings",
    "users/activateAccount": "/me/security",
    "users/activateAccount_email": "/me/security",
    "users/changePwd": "/me/security",
    "users/top_pic_upload": "/me/settings",
    "users/avater_upload": "/me/settings",
    "treePlant/treeplant": "/me/tree",
    "treePlant/treeSceneSettings": "/me/tree",
    "apps/lab": "/me/lab",
    "apps/inviteCard": "/me/invite",
    "apps/enterInviteCode": "/me/invite",
    "apps/about": "/about/open-source",
    "apps/faqs/faq": "/me/help",
    "apps/faqs/user_feedback": "/me/help",
    "membership/index": "/membership",
    "membership/redeem": "/membership/redeem",
    "membership/gift": "/membership/gift",
    "membership/rules": "/membership/rules",
    "payments/recharge": "/me/wallet",
    "payments/earnings": "/me/wallet?tab=earnings",
    "payments/order_history": "/me/wallet?tab=orders",
    "payments/exchange": "/me/wallet?tab=exchange",
    "payments/gift_code": "/me/wallet?tab=gift",
    "store/index": "/store",
    "store/orders": "/store/orders",
    "store/address_list": "/store/addresses",
    "store/address_form": "/store/addresses",
  };
  if (
    path === "users/badgeDetail" &&
    params.get("owner_id") &&
    /^\d+$/.test(params.get("owner_id"))
  )
    return { path: `/users/${params.get("owner_id")}?badge=1` };
  if (
    path === "apps/miniapp" &&
    /^[a-z][a-z0-9-]*$/.test(params.get("id") || "")
  )
    return { path: `/community/miniapp/${params.get("id")}` };
  if (exact[path]) {
    const forwarded = new URLSearchParams();
    const fields = {
      "community/postEdit": ["post_id", "circle_id"],
      "community/friends": ["id"],
      "community/search": ["keyword", "type"],
      "membership/index": ["tier"],
      "membership/gift": ["tier"],
      "community/send_mail": ["to_id"],
    };
    for (const key of fields[path] || []) {
      const entry = params.get(key);
      if (
        entry &&
        (!/^(?:id|post_id|circle_id|to_id)$/.test(key) ||
          /^[1-9]\d*$/.test(entry))
      )
        forwarded.set(key, entry);
    }
    if (path === "store/address_form") {
      const edit = params.get("address_id");
      if (edit && /^[1-9]\d*$/.test(edit)) forwarded.set("edit", edit);
      else forwarded.set("new", "1");
    }
    const suffix = forwarded.toString();
    return {
      path:
        exact[path] +
        (suffix ? `${exact[path].includes("?") ? "&" : "?"}${suffix}` : ""),
    };
  }
  if (numeric) {
    const dynamic = {
      "community/chat": `/community/chat?id=${numeric}`,
      "community/read_mail": `/community/mail/${numeric}`,
      "community/postDetail": `/community/post/${numeric}`,
      "community/postView": `/community/post/${numeric}`,
      "community/circle": `/community/circle/${numeric}`,
      "community/editCircle": `/community/circle/settings/${numeric}`,
      "community/circleMembers": `/community/circle/members/${numeric}`,
      "users/personalPage": `/users/${numeric}`,
      "store/detail": `/store/${numeric}`,
      "store/checkout": `/store/${numeric}`,
    };
    if (dynamic[path]) {
      const forwarded = new URLSearchParams();
      if (path === "store/detail" || path === "store/checkout") {
        const variant = params.get("variant_id");
        if (variant && /^[1-9]\d*$/.test(variant))
          forwarded.set("variant_id", variant);
        if (path === "store/checkout") forwarded.set("checkout", "1");
      }
      return {
        path: dynamic[path] + (forwarded.toString() ? `?${forwarded}` : ""),
      };
    }
  }
  const reading = readingMessageTarget(value);
  if (reading && !reading.mobile) return reading;
  if (
    !/^[a-zA-Z][a-zA-Z0-9_/-]*(?:\?[^\r\n]*)?$/.test(value) ||
    value.includes("..")
  )
    return null;
  return { path: `/pages/${value}`, mobile: true };
}
