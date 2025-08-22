import pool from "../db.js";

const dummyUsers = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

// GET users
export const getUsers = (req, res) => {
  res.json(dummyUsers);
};

// POST user
export const addUser = (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: dummyUsers.length + 1, name, email };
  dummyUsers.push(newUser);
  res.status(201).json(newUser);
};
