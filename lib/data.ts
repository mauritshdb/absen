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
    "https://api.dicebear.com/7.x/avataaars/svg?seed=mortysmith",
};

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
  latitude: -6.2072242, // Jakarta dummy coordinate
  longitude: 106.6614679,
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
