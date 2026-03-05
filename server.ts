import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("edu_claw.db");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    skills TEXT,
    status TEXT DEFAULT 'active',
    price_per_month INTEGER DEFAULT 299
  );

  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    price INTEGER DEFAULT 0,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    item_id TEXT,
    item_type TEXT, -- 'agent' or 'skill'
    amount INTEGER,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_skills (
    user_id TEXT,
    skill_id TEXT,
    PRIMARY KEY (user_id, skill_id)
  );

  CREATE TABLE IF NOT EXISTS user_profile (
    id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 1000,
    quota INTEGER DEFAULT 2,
    hired_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT,
    performance_score INTEGER DEFAULT 0,
    learning_path TEXT,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS knowledge_base (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT,
    student_id TEXT,
    sender TEXT,
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data
const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)").run("user-1", "mike.ji2026@gmail.com", "password123", "Mike");
}

const agentCount = db.prepare("SELECT count(*) as count FROM agents").get() as { count: number };
if (agentCount.count === 0) {
  const insertAgent = db.prepare("INSERT INTO agents (id, name, role, description, avatar, skills, price_per_month) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertAgent.run("agent-1", "张老师", "数字班主任", "负责学生日常管理、出勤提醒与家长沟通。", "👨‍🏫", "出勤管理,家长报告,情绪监测", 299);
  insertAgent.run("agent-2", "李老师", "数学特级教师", "擅长K12数学知识点拆解与个性化辅导。", "📐", "自动批改,知识点诊断,教案生成", 499);
  insertAgent.run("agent-3", "王助理", "行政助理", "处理排课、缴费提醒与机构日常事务。", "📋", "排课管理,缴费提醒,会议纪要", 199);
}

const skillCount = db.prepare("SELECT count(*) as count FROM skills").get() as { count: number };
if (skillCount.count === 0) {
  const insertSkill = db.prepare("INSERT INTO skills (id, name, category, description, price, icon) VALUES (?, ?, ?, ?, ?, ?)");
  insertSkill.run("skill-1", "雅思口语模拟", "语言", "全真模拟雅思口语考试场景，实时评分与纠错。", 99, "🗣️");
  insertSkill.run("skill-2", "代码自动批改", "编程", "支持Python, Java, C++等主流语言的代码逻辑与风格检查。", 199, "💻");
  insertSkill.run("skill-3", "家长周报生成", "行政", "自动汇总学生一周表现，生成精美PDF报告。", 49, "📄");
  insertSkill.run("skill-4", "辍学风险预测", "数据", "基于出勤与成绩数据，提前预警潜在流失学生。", 299, "📈");
}

const profileCount = db.prepare("SELECT count(*) as count FROM user_profile").get() as { count: number };
if (profileCount.count === 0) {
  db.prepare("INSERT INTO user_profile (id, balance, quota, hired_count) VALUES (?, ?, ?, ?)").run("user-1", 5000, 5, 0);
}

const studentCount = db.prepare("SELECT count(*) as count FROM students").get() as { count: number };
if (studentCount.count === 0) {
  const insertStudent = db.prepare("INSERT INTO students (id, name, grade, performance_score) VALUES (?, ?, ?, ?)");
  insertStudent.run("std-1", "小明", "初一", 85);
  insertStudent.run("std-2", "小红", "初二", 92);
  insertStudent.run("std-3", "小华", "初三", 78);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    const id = `user-${Date.now()}`;
    try {
      db.prepare("INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)").run(id, email, password, name);
      db.prepare("INSERT INTO user_profile (id, balance, quota, hired_count) VALUES (?, ?, ?, ?)").run(id, 5000, 5, 0);
      res.json({ success: true, user: { id, email, name } });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // API Routes
  app.get("/api/agents", (req, res) => {
    const agents = db.prepare("SELECT * FROM agents").all();
    res.json(agents);
  });

  app.get("/api/students", (req, res) => {
    const students = db.prepare("SELECT * FROM students").all();
    res.json(students);
  });

  app.get("/api/stats", (req, res) => {
    const userId = req.query.userId as string || 'user-1';
    const profile = db.prepare("SELECT * FROM user_profile WHERE id = ?").get(userId) as any;
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    
    const stats = {
      totalStudents: db.prepare("SELECT count(*) as count FROM students").get(),
      activeAgents: db.prepare("SELECT count(*) as count FROM agents WHERE status = 'active'").get(),
      tasksCompleted: 1240,
      retentionRate: "92%",
      balance: profile.balance,
      quota: profile.quota,
      hiredCount: profile.hired_count
    };
    res.json(stats);
  });

  app.get("/api/skills", (req, res) => {
    const skills = db.prepare("SELECT * FROM skills").all();
    res.json(skills);
  });

  app.post("/api/skills", (req, res) => {
    const { name, category, description, price, icon } = req.body;
    const id = `skill-${Date.now()}`;
    try {
      db.prepare("INSERT INTO skills (id, name, category, description, price, icon) VALUES (?, ?, ?, ?, ?, ?)")
        .run(id, name, category, description, price, icon);
      res.json({ success: true, skillId: id });
    } catch (e) {
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  app.get("/api/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    res.json(orders);
  });

  app.get("/api/user-skills", (req, res) => {
    const userId = req.query.userId as string || 'user-1';
    const skills = db.prepare(`
      SELECT s.* FROM skills s
      JOIN user_skills us ON s.id = us.skill_id
      WHERE us.user_id = ?
    `).all(userId);
    res.json(skills);
  });

  app.post("/api/agents/:id/skills", (req, res) => {
    const { id } = req.params;
    const { skillName } = req.body;
    
    const agent = db.prepare("SELECT skills FROM agents WHERE id = ?").get(id) as any;
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    let currentSkills = agent.skills ? agent.skills.split(',') : [];
    if (!currentSkills.includes(skillName)) {
      currentSkills.push(skillName);
    }
    
    db.prepare("UPDATE agents SET skills = ? WHERE id = ?").run(currentSkills.join(','), id);
    res.json({ success: true, skills: currentSkills.join(',') });
  });

  app.post("/api/orders", (req, res) => {
    const { itemId, itemType, amount, userId = 'user-1' } = req.body;
    const orderId = `ord-${Date.now()}`;
    
    // Simple balance check
    const profile = db.prepare("SELECT balance FROM user_profile WHERE id = ?").get(userId) as any;
    if (!profile || profile.balance < amount) {
      return res.status(400).json({ error: "余额不足" });
    }

    db.prepare("INSERT INTO orders (id, user_id, item_id, item_type, amount, status) VALUES (?, ?, ?, ?, ?, ?)")
      .run(orderId, userId, itemId, itemType, amount, "completed");
    
    db.prepare("UPDATE user_profile SET balance = balance - ? WHERE id = ?").run(amount, userId);
    
    if (itemType === 'agent') {
      db.prepare("UPDATE user_profile SET hired_count = hired_count + 1 WHERE id = ?").run(userId);
    } else if (itemType === 'skill') {
      db.prepare("INSERT OR IGNORE INTO user_skills (user_id, skill_id) VALUES (?, ?)").run(userId, itemId);
    }

    res.json({ success: true, orderId });
  });

  app.post("/api/recharge", (req, res) => {
    const { amount, userId = 'user-1' } = req.body;
    db.prepare("UPDATE user_profile SET balance = balance + ? WHERE id = ?").run(amount, userId);
    res.json({ success: true, newBalance: amount });
  });

  app.post("/api/chat", async (req, res) => {
    const { agentId, message } = req.body;
    const agent = db.prepare("SELECT * FROM agents WHERE id = ?").get(agentId) as any;

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: `你是一个教育机构的AI助手，你的角色是：${agent.role}。你的名字是：${agent.name}。你的职责包括：${agent.description}。你的技能有：${agent.skills}。请以专业、亲切且高效的语气回答。`,
        },
      });

      const reply = response.text;
      res.json({ reply });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "AI generation failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
