DROP DATABASE IF EXISTS auth_demo;
CREATE DATABASE auth_demo;
\c auth_demo
CREATE TABLE users
(
  username TEXT NOT NULL PRIMARY KEY,
  password TEXT NOT NULL
);

\q