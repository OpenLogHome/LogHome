export default function toFriendlyTime(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const secondsAgo = Math.floor((now - date) / 1000);

  // 判断是否在今天
  if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
    // 小于1分钟，显示刚刚
    if (secondsAgo < 60) {
      return '刚刚';
    }

    // 大于1分钟小于60分钟，显示具体几分钟前
    if (secondsAgo < 60 * 60) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes}分钟前`;
    }

    // 大于60分钟小于2小时，显示具体几小时+分钟前
    if (secondsAgo < 60 * 60 * 2) {
      const hours = Math.floor(secondsAgo / (60 * 60));
      const minutes = Math.floor((secondsAgo - hours * 60 * 60) / 60);
      return `${hours}小时 ${minutes}分钟前`;
    }

    // 超过2小时，显示具体的几点几分
    const ampm = date.getHours() >= 12 ? '下午' : '上午';
    const hour = date.getHours() % 12 || 12;
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${ampm} ${hour}:${minute}`;
  }

  // 不在今天，判断是否在两天内
  const oneDayMs = 24 * 60 * 60 * 1000;
  if (now - date < oneDayMs * 2) {
    if (date.getDate() === now.getDate() - 1 && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
      // 昨天
      const ampm = date.getHours() >= 12 ? '下午' : '上午';
      const hour = date.getHours() % 12 || 12;
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `昨天 ${ampm} ${hour}:${minute}`;
    } else {
      // 前天
      const ampm = date.getHours() >= 12 ? '下午' : '上午';
      const hour = date.getHours() % 12 || 12;
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `前天 ${ampm} ${hour}:${minute}`;
    }
  }

  // 不在两天内，判断是否在同一周
  const oneWeekMs = oneDayMs * 7;
  const diffMs = now - date;
  if (diffMs < oneWeekMs) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const ampm = date.getHours() >= 12 ? '下午' : '上午';
    const hour = date.getHours() % 12 || 12;
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${days[date.getDay()]} ${ampm} ${hour}:${minute}`;
  }

  // 不在同一周，显示具体年月日+时间
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? '下午' : '上午';
  const hour = date.getHours() % 12 || 12;
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${ampm} ${hour}:${minute}`;
}
