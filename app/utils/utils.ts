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
export function orderStatusText(status?: string) {
  if (!status) return "";
  switch (status.toUpperCase()) {
    case "UNPAID":
      return "待支付";
    case "PAID":
      return "已支付";
    case "REFUNDED":
      return "已退款";
    case "CLOSED":
      return "已关闭";
    default:
      return status;
  }
}
export function orderStatusClass(status?: string) {
  if (!status) return "text-muted";
  return status.toUpperCase() !== "PAID" ? "text-red-600" : "text-green-600";
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
