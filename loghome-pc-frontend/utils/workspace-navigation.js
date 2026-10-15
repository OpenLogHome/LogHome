// Keep related tools one click apart without adding another navigation level.
export function workspaceNavigation(rawPath = "", circleRole = 0) {
  const path = String(rawPath).split("?")[0].replace(/\/$/, "") || "/";
  const section = (label, links, selected) => ({
    label,
    links: links.map(([to, name]) => ({
      to,
      label: name,
      current: to === (selected || path),
    })),
  });
  if (/^\/me\/(settings|security|notifications|storage)$/.test(path))
    return section("账号设置", [
      ["/me/settings", "个人资料"],
      ["/me/security", "账号安全"],
      ["/me/notifications", "消息推送"],
      ["/me/storage", "存储管理"],
    ]);
  if (/^\/me\/(achievements|frames)$/.test(path))
    return section("个性装扮", [
      ["/me/achievements", "勋章与称号"],
      ["/me/frames", "头像挂件"],
    ]);
  if (/^\/membership(?:\/|$)/.test(path))
    return section("原木通行证", [
      ["/membership", "通行证权益"],
      ["/membership/gift", "赠送好友"],
      ["/membership/redeem", "兑换通行证"],
      ["/membership/rules", "服务规则"],
    ]);
  if (/^\/store(?:\/|$)/.test(path))
    return section(
      "原木商城",
      [
        ["/store", "商品"],
        ["/store/orders", "我的订单"],
        ["/store/addresses", "收货地址"],
      ],
      /^\/store\/\d+$/.test(path) ? "/store" : path
    );
  const circle = path.match(/^\/community\/circle\/(?:(members|settings)\/)?([1-9]\d*)$/);
  if (circle) {
    const id = circle[2];
    return section("圈子", [
      [`/community/circle/${id}`, "动态"],
      [`/community/circle/members/${id}`, "成员"],
      ...(circleRole > 0 ? [[`/community/circle/settings/${id}`, "圈子设置"]] : []),
    ]);
  }
  if (/^\/community\/(chat|mail)(?:\/|$)/.test(path))
    return section("消息中心", [
      ["/me/messages", "消息中心"],
      ["/me/friends", "好友与关注"],
      ["/community/mail/new", "写信"],
    ]);
  return null;
}
export function showWorkspaceCompose(path = "") {
  return (
    /^\/community\/(circles|search)$/.test(path) ||
    /^\/community\/post\/[1-9]\d*$/.test(path)
  );
}
