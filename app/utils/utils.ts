import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

// 扩展插件
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

export function formatPrice(v: any) {
  const n = Number(v ?? 0);
  if (Number.isNaN(n)) return "0.00";
  return n.toFixed(2);
}
export function formatDate(ts?: number) {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}
export function orderStatusText(
  payStatus: string,
  shipStatus?: string,
  refundStatus?: string
) {
  // 优先显示退款/退货状态
  switch (refundStatus) {
    case "pending":
      return "退款申请中";
    case "agreed":
      return "等待退货";
    case "returning":
      return "退货中，等待商家确认";
    case "returned":
      return "已退货，待退款";
    case "completed":
      return "退款完成";
    case "rejected":
      return "退款被拒";
  }

  // 否则显示支付+发货状态
  switch (payStatus) {
    case "unpaid":
      return "待支付";
    case "paid":
      switch (shipStatus) {
        case "pending":
          return "待发货";
        case "shipped":
          return "待收货";
        case "received":
          return "已收货";
        default:
          return "已支付";
      }
    case "closed":
      return "已关闭";
    default:
      return "未知状态";
  }
}
// 订单状态颜色

export function orderStatusClass(payStatus: string, refundStatus?: string) {
  if (refundStatus) {
    switch (refundStatus) {
      case "pending":
      case "agreed":
        return "text-orange-500";
      case "returning":
      case "returned":
        return "text-blue-500";
      case "completed":
        return "text-green-600";
      case "rejected":
        return "text-red-500";
      default:
        return "text-muted";
    }
  }

  // 主状态颜色
  switch (payStatus) {
    case "unpaid":
      return "text-red-600";
    case "paid":
      return "text-green-600";
    case "closed":
      return "text-muted";
    default:
      return "text-muted";
  }
}

export function orderShippingText(shipStatus?: string) {
  if (!shipStatus) return "";
  switch (shipStatus.toUpperCase()) {
    case "PENDING":
      return "待发货";
    case "SHIPPED":
      return "已发货";
    case "RECEIVED":
      return "已收货";
    default:
      return shipStatus;
  }
}
export function formatExpire(sec: number) {
  if (!sec || sec <= 0) return "00:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0)
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
/**
 * 将秒级时间戳或毫秒级时间戳转为“几小时前/几天前”等格式
 * @param timestamp 秒级或毫秒级时间戳
 * @returns 相对时间字符串
 */
export function timeAgo(timestamp: number | string): string {
  if (!timestamp) return "";

  let time: dayjs.Dayjs;

  // 判断是秒级还是毫秒级
  const t = Number(timestamp);
  if (t < 1_000_000_000_000) {
    // 秒级 -> 转为毫秒
    time = dayjs(t * 1000);
  } else {
    time = dayjs(t);
  }

  return time.fromNow(); // 输出 "3 天前"、"2 小时前" 等
}
export function refundStatusText(status?: string) {
  switch (status) {
    case "pending":
      return "退款申请中";
    case "agreed":
      return "等待退货";
    case "returning":
      return "退货中，等待商家确认";
    case "returned":
      return "已退货，待退款";
    case "completed":
      return "退款完成";
    case "rejected":
      return "退款被拒";
    default:
      return "";
  }
}
export function refundStatusClass(status?: string) {
  switch (status) {
    case "pending":
    case "agreed":
      return "text-orange-500";
    case "returning":
    case "returned":
      return "text-blue-500";
    case "completed":
      return "text-green-600";
    case "rejected":
      return "text-red-500";
    default:
      return "text-muted";
  }
}
