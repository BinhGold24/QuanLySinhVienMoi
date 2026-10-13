
import * as SQLite from 'expo-sqlite';

let db;

export async function khoiTaoDB() {
  db = await SQLite.openDatabaseAsync('QuanLySinhVien.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS SinhVien (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      maSV TEXT NOT NULL UNIQUE,
      hoTen TEXT NOT NULL,
      email TEXT NOT NULL,
      avatar TEXT
    );
  `);
}

export async function layDanhSachSinhVien() {
  return await db.getAllAsync(
    'SELECT * FROM SinhVien ORDER BY id DESC'
  );
}

export async function themSinhVien(maSV, hoTen, email, avatar = '') {
  return await db.runAsync(
    'INSERT INTO SinhVien (maSV, hoTen, email, avatar) VALUES (?, ?, ?, ?)',
    [maSV, hoTen, email, avatar]
  );
}

export async function suaSinhVien(id, maSV, hoTen, email, avatar = '') {
  return await db.runAsync(
    'UPDATE SinhVien SET maSV = ?, hoTen = ?, email = ?, avatar = ? WHERE id = ?',
    [maSV, hoTen, email, avatar, id]
  );
}

export async function xoaSinhVien(id) {
  return await db.runAsync(
    'DELETE FROM SinhVien WHERE id = ?',
    [id]
  );
}
