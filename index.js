// server.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Đăng ký
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ user: data.user, message: "Registration successful. Please check your email for verification." });
});

// Đăng nhập
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ user: data.user, session: data.session });
});

// Đăng xuất
app.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: "Logout successful" });
});

// Lấy thông tin người dùng hiện tại
app.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));