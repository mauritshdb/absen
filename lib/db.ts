import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export type Attendance = {
  date: string;
  clockIn: string;
  clockOut: string;
};

export type Schedule = {
  start: string;
  end: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  birthDate: string;
  role: string;
  avatar: string;
  schedule: Schedule;
  attendance: Attendance;
};

export type DB = {
  users: User[];
};

export function readDB(): DB {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

export function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function findUserByEmail(email: string): User | undefined {
  const db = readDB();
  return db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserById(id: string): User | undefined {
  const db = readDB();
  return db.users.find((u) => u.id === id);
}

export function sanitizeUser(user: User) {
  const { password, ...rest } = user;
  return rest;
}

export function generateId(): string {
  return Date.now().toString();
}
