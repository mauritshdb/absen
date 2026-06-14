export const dummyUser = {
  name: "John Smith",
  email: "johnsmith@mail.com",
  role: "SDM",
  schedule: {
    day: "Sel, 26 Mei 2026",
    start: "07:20",
    end: "14:00",
  },
  attendance: {
    clockIn: "07:09",
    clockOut: "-",
  },
  avatar:
    "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnSmith",
};

export const payrollHistory = [
  { month: "Mei 2026", amount: 5500000, status: "Dibayar", paidOn: "01 Jun 2026" },
  { month: "April 2026", amount: 5500000, status: "Dibayar", paidOn: "01 May 2026" },
  { month: "Maret 2026", amount: 5350000, status: "Dibayar", paidOn: "01 Apr 2026" },
  { month: "Februari 2026", amount: 5350000, status: "Dibayar", paidOn: "01 Mar 2026" },
  { month: "Januari 2026", amount: 5350000, status: "Dibayar", paidOn: "01 Feb 2026" },
  { month: "Desember 2025", amount: 5350000, status: "Dibayar", paidOn: "01 Jan 2026" },
];

export const attendanceLog = [
  { date: "26 Mei 2026", day: "Selasa", clockIn: "07:09", clockOut: "14:05", status: "Tepat waktu" },
  { date: "25 Mei 2026", day: "Senin", clockIn: "07:15", clockOut: "14:02", status: "Tepat waktu" },
  { date: "22 Mei 2026", day: "Jumat", clockIn: "07:32", clockOut: "14:00", status: "Terlambat" },
  { date: "21 Mei 2026", day: "Kamis", clockIn: "07:10", clockOut: "14:08", status: "Tepat waktu" },
  { date: "20 Mei 2026", day: "Rabu", clockIn: "07:08", clockOut: "14:01", status: "Tepat waktu" },
  { date: "19 Mei 2026", day: "Selasa", clockIn: "-", clockOut: "-", status: "Izin" },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function formatScheduleDate(date: Date): string {
  const day = DAY_NAMES[date.getDay()];
  const month = MONTH_NAMES[date.getMonth()];
  return `${day}, ${date.getDate()} ${month} ${date.getFullYear()}`;
}

export const schoolLocation = {
  name: "Sekolah Absence",
  latitude: -6.2037644, // Jakarta dummy coordinate
  longitude: 106.6614048,
  radiusMeters: 500,
};

// Haversine formula to calculate distance (in meters) between two coordinates
export function distanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
