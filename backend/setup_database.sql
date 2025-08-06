-- Quicacademy Database Setup Script
-- Run this after PostgreSQL installation

-- Create database
CREATE DATABASE quicacademy;

-- Connect to the database
\c quicacademy;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Database is ready!
-- The application will create tables automatically when started
