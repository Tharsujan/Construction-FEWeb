const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LABELS: Record<string, string> = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  OutForDelivery: "Out for delivery",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
  Unpaid: "Unpaid",
  Paid: "Paid",
  Requested: "Requested",
  Active: "Active",
  Returned: "Returned",
  Available: "Available",
  Rented: "Rented",
  Maintenance: "Maintenance",
  Planned: "Upcoming",
  InProgress: "Ongoing",
  Completed: "Completed",
  OnHold: "On hold",
  Client: "Customer",
  Admin: "Admin",
};

export function label(value: string) {
  return LABELS[value] ?? value;
}

export function money(value: number) {
  const formatted = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `Rs ${formatted}`;
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function roundQty(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function formatQty(value: number) {
  return new Intl.NumberFormat("en-LK", { maximumFractionDigits: 3 }).format(value);
}

export function priceWithUnit(price: number, unitName: string) {
  const unit = unitName.trim();
  return unit ? `${money(price)} / ${unit}` : money(price);
}

export function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  const monthIndex = Number(month) - 1;
  const monthName = MONTHS[monthIndex] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = date.getDate();
  const monthName = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${monthName} ${year}, ${hours}:${minutes}`;
}

export function safeNext(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith("/login") || value.startsWith("/register")) return "/";
  return value;
}
