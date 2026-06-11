-- Migration 006: Add tanggal column to jadwal table
ALTER TABLE jadwal ADD COLUMN IF NOT EXISTS tanggal DATE;
