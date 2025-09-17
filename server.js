const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const path = require("path")
const fs = require("fs").promises

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = "javanese_learning_secret_key_2024"

// Middleware
app.use(express.json())
app.use(express.static("public"))

// In-memory database (replace with real database in production)
const users = []
let dictionary = []
const stages = []
const leaderboard = []

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jasondariuschandra@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD || "bxwz cgxd mmxt siwc", // Use environment variable
  },
})

// Test email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("Email configuration error:", error)
  } else {
    console.log("Email service ready:", success)
  }
})

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"))
})

// Authentication routes
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, repeatPassword } = req.body

    if (password !== repeatPassword) {
      return res.status(400).json({ error: "Passwords do not match" })
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" })

    // Create user
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      registrationTime: new Date().toISOString(),
      rank: "bronze",
      level: 1,
      points: 0,
      lastLogin: null,
      completedStages: [],
    }

    users.push(user)

    const verificationUrl = `http://localhost:${PORT}/verify-email?token=${verificationToken}`

    try {
      await transporter.sendMail({
        from: "jasondariuschandra@gmail.com",
        to: email,
        subject: "Verifikasi Email - Sinau Basa Jawa",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #8B4513, #A0522D); color: white; border-radius: 10px; overflow: hidden;">
          <div style="background: #654321; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #F4E4BC;">🏛️ Sinau Basa Jawa</h1>
            <p style="margin: 5px 0 0 0; color: #D2B48C;">Platform Pembelajaran Bahasa Jawa</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #F4E4BC; margin-bottom: 20px;">Sugeng Rawuh! 🙏</h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Matur nuwun sampun daftar ing platform Sinau Basa Jawa. Kanggo nglengkapi registrasi, monggo klik tombol ing ngisor iki:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: #F4E4BC; color: #654321; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                ✅ Verifikasi Email
              </a>
            </div>
            
            <div style="background: rgba(244, 228, 188, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #F4E4BC; margin-top: 0;">Apa sing bakal sampeyan entuk:</h3>
              <ul style="color: #D2B48C; line-height: 1.8;">
                <li>🔤 Sinau Aksara Jawa lengkap karo audio</li>
                <li>📚 Kamus Basa Jawa sing komplit</li>
                <li>🎮 Stage pembelajaran kaya Duolingo</li>
                <li>🗣️ Translator Ngoko ↔ Krama</li>
                <li>🏆 Sistem ranking lan leaderboard</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; color: #D2B48C; margin-top: 30px;">
              Link iki aktif 24 jam. Yen ora bisa klik, copy paste link ing ngisor:<br>
              <span style="word-break: break-all; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 3px; display: inline-block; margin-top: 5px;">${verificationUrl}</span>
            </p>
          </div>
          
          <div style="background: #654321; padding: 15px; text-align: center; font-size: 12px; color: #D2B48C;">
            Sinau Basa Jawa - Nglestarekake Budaya Jawa<br>
            © 2024 jasondariuschandra@gmail.com
          </div>
        </div>
      `,
      })

      console.log(`Verification email sent to ${email}`)
      res.json({ message: "Registration successful. Please check your email for verification." })
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Still allow registration even if email fails
      res.json({
        message: "Registration successful, but email verification could not be sent. Please contact admin.",
        warning: "Email service temporarily unavailable",
      })
    }
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    if (!user.verified) {
      return res.status(400).json({ error: "Please verify your email first" })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    user.lastLogin = new Date().toISOString()

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        rank: user.rank,
        level: user.level,
        points: user.points,
        completedStages: user.completedStages,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

app.get("/verify-email", (req, res) => {
  try {
    const { token } = req.query

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = users.find((u) => u.email === decoded.email)

    if (!user) {
      return res.status(400).send(`
        <html>
          <head><title>Verification Failed</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #d97706;">❌ Verification Failed</h1>
            <p>Invalid verification token. Please try registering again.</p>
            <a href="/" style="background: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Back to Home</a>
          </body>
        </html>
      `)
    }

    user.verified = true
    user.verificationToken = null

    res.send(`
      <html>
        <head><title>Email Verified</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #8B4513, #A0522D); color: white;">
          <h1 style="color: #F4E4BC;">✅ Email Verified Successfully!</h1>
          <p style="font-size: 18px; margin: 20px 0;">Matur nuwun! Your email has been verified.</p>
          <p>You can now login to start learning Javanese.</p>
          <a href="/?verified=true" style="background: #F4E4BC; color: #654321; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin-top: 20px; display: inline-block;">
            🏛️ Start Learning
          </a>
        </body>
      </html>
    `)
  } catch (error) {
    console.error("Verification error:", error)
    res.status(400).send(`
      <html>
        <head><title>Verification Failed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #d97706;">❌ Verification Failed</h1>
          <p>Invalid or expired verification token.</p>
          <a href="/" style="background: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Back to Home</a>
        </body>
      </html>
    `)
  }
})

app.post("/api/user/progress", authenticateToken, (req, res) => {
  try {
    const { level, points, completedStages, rank } = req.body
    const user = users.find((u) => u.id === req.user.userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update user progress
    if (level) user.level = Math.max(user.level, level)
    if (points) user.points = Math.max(user.points, points)
    if (completedStages) user.completedStages = [...new Set([...user.completedStages, ...completedStages])]
    if (rank) user.rank = rank

    res.json({
      message: "Progress updated successfully",
      user: {
        level: user.level,
        points: user.points,
        completedStages: user.completedStages,
        rank: user.rank,
      },
    })
  } catch (error) {
    console.error("Progress update error:", error)
    res.status(500).json({ error: "Failed to update progress" })
  }
})

app.get("/api/leaderboard", authenticateToken, (req, res) => {
  try {
    const leaderboardData = users
      .filter((u) => u.verified && u.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        email: user.email.replace(/(.{3}).*(@.*)/, "$1***$2"), // Mask email for privacy
        points: user.points,
        level: user.level,
        rank: user.rank,
      }))

    res.json({ leaderboard: leaderboardData })
  } catch (error) {
    console.error("Leaderboard error:", error)
    res.status(500).json({ error: "Failed to get leaderboard" })
  }
})

// Admin routes
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body

  if (password === "525252") {
    const adminToken = jwt.sign({ admin: true }, JWT_SECRET)
    res.json({ token: adminToken })
  } else {
    res.status(401).json({ error: "Invalid admin password" })
  }
})

app.get("/api/admin/users", authenticateToken, (req, res) => {
  // Verify admin token
  if (!req.user.admin) {
    return res.status(403).json({ error: "Admin access required" })
  }

  const userData = users.map((user) => ({
    email: user.email,
    password: "***hidden***", // Don't expose actual passwords
    registrationTime: user.registrationTime,
    verified: user.verified,
    level: user.level,
    points: user.points,
    rank: user.rank,
    lastLogin: user.lastLogin,
    completedStages: user.completedStages?.length || 0,
  }))

  res.json({
    users: userData,
    count: users.length,
  })
})

app.post("/api/admin/test-email", authenticateToken, async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ error: "Admin access required" })
  }

  try {
    await transporter.sendMail({
      from: "jasondariuschandra@gmail.com",
      to: "jasondariuschandra@gmail.com",
      subject: "Test Email - Sinau Basa Jawa Admin",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0;">
          <h2 style="color: #164e63;">🧪 Email Service Test</h2>
          <p>This is a test email from the Sinau Basa Jawa admin panel.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Status:</strong> Email service is working correctly!</p>
        </div>
      `,
    })

    res.json({ message: "Test email sent successfully" })
  } catch (error) {
    console.error("Test email error:", error)
    res.status(500).json({ error: "Failed to send test email", details: error.message })
  }
})

app.get("/api/admin/stats", authenticateToken, (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ error: "Admin access required" })
  }

  const now = new Date()
  const today = now.toDateString()
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter((u) => u.verified).length,
    activeToday: users.filter((u) => u.lastLogin && new Date(u.lastLogin).toDateString() === today).length,
    newThisWeek: users.filter((u) => new Date(u.registrationTime) > thisWeek).length,
    totalPoints: users.reduce((sum, u) => sum + (u.points || 0), 0),
    averageLevel: users.length > 0 ? (users.reduce((sum, u) => sum + (u.level || 1), 0) / users.length).toFixed(1) : 0,
    completionRate:
      users.length > 0
        ? ((users.filter((u) => u.completedStages?.length > 0).length / users.length) * 100).toFixed(1)
        : 0,
  }

  res.json(stats)
})

// Initialize sample data
const initializeData = () => {
  // Sample dictionary data
  dictionary = [
    { id: 1, javanese: "sugeng", indonesian: "selamat", category: "greeting" },
    { id: 2, javanese: "rawuh", indonesian: "datang", category: "greeting" },
    { id: 3, javanese: "matur nuwun", indonesian: "terima kasih", category: "greeting" },
    { id: 4, javanese: "sampun", indonesian: "sudah", category: "basic" },
    { id: 5, javanese: "dereng", indonesian: "belum", category: "basic" },
  ]

  // Sample stages
  for (let i = 1; i <= 100; i++) {
    stages.push({
      id: i,
      level: i,
      title: `Level ${i}`,
      questions: [
        {
          question: "Translate: Selamat datang",
          options: ["Sugeng rawuh", "Matur nuwun", "Sampun", "Dereng"],
          correct: 0,
        },
      ],
    })
  }

  console.log("Sample data initialized")
}

app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({ error: "Internal server error" })
})

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Tambahkan middleware debug sebelum app.use(express.static("public"))
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`)
  next()
})

// Static files dengan error handling
app.use(express.static("public", {
  setHeaders: (res, path) => {
    console.log(`Serving static file: ${path}`)
  }
}))

// Tambahkan route khusus untuk debugging admin assets
app.get('/admin-styles.css', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'admin-styles.css')
  console.log('Attempting to serve admin-styles.css from:', filePath)
  
  fs.access(filePath)
    .then(() => {
      res.sendFile(filePath)
    })
    .catch(err => {
      console.error('admin-styles.css not found:', err)
      res.status(404).send('CSS file not found')
    })
})

app.get('/admin-script.js', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'admin-script.js')
  console.log('Attempting to serve admin-script.js from:', filePath)
  
  fs.access(filePath)
    .then(() => {
      res.sendFile(filePath)
    })
    .catch(err => {
      console.error('admin-script.js not found:', err)
      res.status(404).send('JS file not found')
    })
})

// Route untuk melihat isi folder public
app.get('/api/debug/files', async (req, res) => {
  try {
    const publicPath = path.join(__dirname, 'public')
    const files = await fs.readdir(publicPath)
    res.json({ 
      publicPath, 
      files,
      adminFilesExist: {
        'admin.html': files.includes('admin.html'),
        'admin-styles.css': files.includes('admin-styles.css'),
        'admin-script.js': files.includes('admin-script.js')
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

initializeData()

app.listen(PORT, () => {
  console.log(`🏛️ Sinau Basa Jawa Server running on port ${PORT}`)
  console.log(`📧 Email service configured for jasondariuschandra@gmail.com`)
  console.log(`🔐 Admin panel available at http://localhost:${PORT}/admin`)
  console.log(`🌐 Main site available at http://localhost:${PORT}`)
})
