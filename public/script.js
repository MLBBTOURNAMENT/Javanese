// Global variables
let currentUser = null
let authToken = null
let currentPage = "aksara"
const translatorMode = "latin-aksara"

// Aksara Jawa data - Complete with all pasangan and sandhangan
const aksaraData = [
  // Basic Aksara (20 characters)
  { char: "ꦲ", latin: "ha", type: "aksara" },
  { char: "ꦤ", latin: "na", type: "aksara" },
  { char: "ꦕ", latin: "ca", type: "aksara" },
  { char: "ꦫ", latin: "ra", type: "aksara" },
  { char: "ꦏ", latin: "ka", type: "aksara" },
  { char: "ꦢ", latin: "da", type: "aksara" },
  { char: "ꦠ", latin: "ta", type: "aksara" },
  { char: "ꦱ", latin: "sa", type: "aksara" },
  { char: "ꦮ", latin: "wa", type: "aksara" },
  { char: "ꦭ", latin: "la", type: "aksara" },
  { char: "ꦥ", latin: "pa", type: "aksara" },
  { char: "ꦝ", latin: "dha", type: "aksara" },
  { char: "ꦗ", latin: "ja", type: "aksara" },
  { char: "ꦪ", latin: "ya", type: "aksara" },
  { char: "ꦚ", latin: "nya", type: "aksara" },
  { char: "ꦩ", latin: "ma", type: "aksara" },
  { char: "ꦒ", latin: "ga", type: "aksara" },
  { char: "ꦧ", latin: "ba", type: "aksara" },
  { char: "ꦛ", latin: "tha", type: "aksara" },
  { char: "ꦔ", latin: "nga", type: "aksara" },

  // Complete Pasangan (20 characters)
  { char: "꧀ꦲ", latin: "_ha", type: "pasangan" },
  { char: "꧀ꦤ", latin: "_na", type: "pasangan" },
  { char: "꧀ꦕ", latin: "_ca", type: "pasangan" },
  { char: "꧀ꦫ", latin: "_ra", type: "pasangan" },
  { char: "꧀ꦏ", latin: "_ka", type: "pasangan" },
  { char: "꧀ꦢ", latin: "_da", type: "pasangan" },
  { char: "꧀ꦠ", latin: "_ta", type: "pasangan" },
  { char: "꧀ꦱ", latin: "_sa", type: "pasangan" },
  { char: "꧀ꦮ", latin: "_wa", type: "pasangan" },
  { char: "꧀ꦭ", latin: "_la", type: "pasangan" },
  { char: "꧀ꦥ", latin: "_pa", type: "pasangan" },
  { char: "꧀ꦝ", latin: "_dha", type: "pasangan" },
  { char: "꧀ꦗ", latin: "_ja", type: "pasangan" },
  { char: "꧀ꦪ", latin: "_ya", type: "pasangan" },
  { char: "꧀ꦚ", latin: "_nya", type: "pasangan" },
  { char: "꧀ꦩ", latin: "_ma", type: "pasangan" },
  { char: "꧀ꦒ", latin: "_ga", type: "pasangan" },
  { char: "꧀ꦧ", latin: "_ba", type: "pasangan" },
  { char: "꧀ꦛ", latin: "_tha", type: "pasangan" },
  { char: "꧀ꦔ", latin: "_nga", type: "pasangan" },

  // Complete Sandhangan (vowel marks)
  { char: "ꦶ", latin: "i", type: "sandhangan" },
  { char: "ꦸ", latin: "u", type: "sandhangan" },
  { char: "ꦺ", latin: "e", type: "sandhangan" },
  { char: "ꦺꦴ", latin: "o", type: "sandhangan" },
  { char: "ꦄ", latin: "a", type: "sandhangan" },
  { char: "ꦁ", latin: "i", type: "sandhangan" },
  { char: "ꦈ", latin: "u", type: "sandhangan" },
  { char: "ꦊ", latin: "e", type: "sandhangan" },
  { char: "ꦌ", latin: "o", type: "sandhangan" },
  { char: "ꦽ", latin: "re", type: "sandhangan" },
  { char: "ꦾ", latin: "le", type: "sandhangan" },
  { char: "꧀", latin: "pangkon", type: "sandhangan" },
  { char: "ꦁ", latin: "cecak", type: "sandhangan" },
  { char: "ꦂ", latin: "layar", type: "sandhangan" },
  { char: "ꦃ", latin: "wignyan", type: "sandhangan" },
]

// Dictionary data
const dictionaryData = [
  // Greetings
  { id: 1, javanese: "sugeng", indonesian: "selamat", category: "greeting", example: "Sugeng enjing (Selamat pagi)" },
  { id: 2, javanese: "rawuh", indonesian: "datang", category: "greeting", example: "Sugeng rawuh (Selamat datang)" },
  {
    id: 3,
    javanese: "matur nuwun",
    indonesian: "terima kasih",
    category: "greeting",
    example: "Matur nuwun sanget (Terima kasih banyak)",
  },
  {
    id: 4,
    javanese: "nuwun sewu",
    indonesian: "permisi/maaf",
    category: "greeting",
    example: "Nuwun sewu, badhe takon (Permisi, mau tanya)",
  },
  {
    id: 5,
    javanese: "sugeng dalu",
    indonesian: "selamat malam",
    category: "greeting",
    example: "Sugeng dalu, turu sing nyenyak",
  },

  // Basic words
  { id: 6, javanese: "sampun", indonesian: "sudah", category: "basic", example: "Sampun mangan (Sudah makan)" },
  { id: 7, javanese: "dereng", indonesian: "belum", category: "basic", example: "Dereng mangan (Belum makan)" },
  { id: 8, javanese: "menapa", indonesian: "apa", category: "basic", example: "Menapa kabar? (Apa kabar?)" },
  {
    id: 9,
    javanese: "sinten",
    indonesian: "siapa",
    category: "basic",
    example: "Sinten nami panjenengan? (Siapa nama Anda?)",
  },
  {
    id: 10,
    javanese: "pundi",
    indonesian: "mana/dimana",
    category: "basic",
    example: "Pundi griyanipun? (Dimana rumahnya?)",
  },

  // Family
  {
    id: 11,
    javanese: "bapak",
    indonesian: "ayah",
    category: "family",
    example: "Bapak tindak kantor (Ayah pergi ke kantor)",
  },
  {
    id: 12,
    javanese: "ibu",
    indonesian: "ibu",
    category: "family",
    example: "Ibu masak ing pawon (Ibu memasak di dapur)",
  },
  { id: 13, javanese: "anak", indonesian: "anak", category: "family", example: "Anak sekolah (Anak sekolah)" },
  { id: 14, javanese: "mbah", indonesian: "nenek/kakek", category: "family", example: "Mbah turu (Nenek/kakek tidur)" },
  { id: 15, javanese: "sedulur", indonesian: "saudara", category: "family", example: "Sedulur teka (Saudara datang)" },

  // Time
  { id: 16, javanese: "enjing", indonesian: "pagi", category: "time", example: "Enjing iki adhem (Pagi ini dingin)" },
  { id: 17, javanese: "awan", indonesian: "siang", category: "time", example: "Awan iki panas (Siang ini panas)" },
  { id: 18, javanese: "sore", indonesian: "sore", category: "time", example: "Sore iki adem (Sore ini sejuk)" },
  { id: 19, javanese: "bengi", indonesian: "malam", category: "time", example: "Bengi iki peteng (Malam ini gelap)" },
  { id: 20, javanese: "dina", indonesian: "hari", category: "time", example: "Dina iki Senin (Hari ini Senin)" },
]

// Ngoko-Krama translation data
const tuturData = {
  "ngoko-krama": [
    { ngoko: "aku", krama: "kula" },
    { ngoko: "kowe", krama: "panjenengan" },
    { ngoko: "mangan", krama: "nedha" },
    { ngoko: "turu", krama: "tilem" },
    { ngoko: "lunga", krama: "tindak" },
    { ngoko: "mulih", krama: "wangsul" },
    { ngoko: "omah", krama: "griya" },
    { ngoko: "arep", krama: "badhe" },
    { ngoko: "wis", krama: "sampun" },
    { ngoko: "durung", krama: "dereng" },
    { ngoko: "apa", krama: "menapa" },
    { ngoko: "sapa", krama: "sinten" },
    { ngoko: "ngendi", krama: "pundi" },
    { ngoko: "kapan", krama: "kapan" },
    { ngoko: "piye", krama: "pripun" },
  ],
  examples: [
    { ngoko: "Aku arep mangan", krama: "Kula badhe nedha", translation: "Saya akan makan" },
    { ngoko: "Kowe wis mulih", krama: "Panjenengan sampun wangsul", translation: "Anda sudah pulang" },
    {
      ngoko: "Apa kowe lagi turu?",
      krama: "Menapa panjenengan saweg tilem?",
      translation: "Apakah Anda sedang tidur?",
    },
    { ngoko: "Aku lunga menyang omah", krama: "Kula tindak dhateng griya", translation: "Saya pergi ke rumah" },
    { ngoko: "Sapa jenengmu?", krama: "Sinten nami panjenengan?", translation: "Siapa nama Anda?" },
  ],
}

// Stage/Quiz data
let currentQuiz = null
let currentQuestionIndex = 0
let quizScore = 0
const userStats = {
  level: 1,
  points: 0,
  rank: "bronze",
  completedStages: [],
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus()
  setupEventListeners()
  checkVerificationStatus()
  initializeDictionary()
  initializeStages()
  initializeTutur()
})

function checkVerificationStatus() {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("verified") === "true") {
    showNotification("Email berhasil diverifikasi! Silakan login.", "success")
    // Clear URL parameter
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

function checkAuthStatus() {
  authToken = localStorage.getItem("authToken")
  currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")

  if (authToken && currentUser) {
    showMainContent()
  } else {
    showLandingPage()
  }
}

function setupEventListeners() {
  // Modal controls
  const modal = document.getElementById("authModal")
  const closeBtn = document.querySelector(".close")

  closeBtn.onclick = () => {
    modal.style.display = "none"
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  }

  // Form submissions
  document.getElementById("loginFormElement").addEventListener("submit", handleLogin)
  document.getElementById("registerFormElement").addEventListener("submit", handleRegister)

  // Initialize aksara grid
  initializeAksara()
}

function openAuthModal() {
  document.getElementById("authModal").style.display = "block"
  switchToLogin()
}

function switchToLogin() {
  document.getElementById("loginForm").classList.add("active")
  document.getElementById("registerForm").classList.remove("active")
}

function switchToRegister() {
  document.getElementById("registerForm").classList.add("active")
  document.getElementById("loginForm").classList.remove("active")
}

async function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      authToken = data.token
      currentUser = data.user

      localStorage.setItem("authToken", authToken)
      localStorage.setItem("currentUser", JSON.stringify(currentUser))

      document.getElementById("authModal").style.display = "none"
      showMainContent()
      showNotification("Login berhasil! Sugeng rawuh!", "success")
    } else {
      showNotification(data.error || "Login gagal", "error")
    }
  } catch (error) {
    console.error("Login error:", error)
    showNotification("Terjadi kesalahan saat login", "error")
  }
}

async function handleRegister(e) {
  e.preventDefault()

  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value
  const repeatPassword = document.getElementById("repeatPassword").value

  console.log("[v0] Registration attempt for:", email) // Debug log

  if (password !== repeatPassword) {
    showNotification("Password tidak sama!", "error")
    return
  }

  if (password.length < 6) {
    showNotification("Password minimal 6 karakter!", "error")
    return
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, repeatPassword }),
    })

    const data = await response.json()
    console.log("[v0] Registration response:", data) // Debug log

    if (response.ok && data.success) {
      showVerificationSuccessPopup(email)
      switchToLogin()
      // Clear form
      document.getElementById("registerFormElement").reset()
    } else {
      showNotification(data.error || "Registrasi gagal", "error")
    }
  } catch (error) {
    console.error("[v0] Registration error:", error)
    showNotification("Terjadi kesalahan saat registrasi", "error")
  }
}

function showVerificationSuccessPopup(email) {
  const popup = document.createElement("div")
  popup.className = "verification-popup"
  popup.innerHTML = `
    <div class="verification-popup-content">
      <div class="verification-header">
        <h2>✅ Registrasi Berhasil!</h2>
        <button class="close-popup" onclick="closeVerificationPopup()">&times;</button>
      </div>
      <div class="verification-body">
        <p><strong>Email verifikasi telah dikirim ke:</strong></p>
        <p class="email-address">${email}</p>
        <div class="verification-steps">
          <h3>Langkah selanjutnya:</h3>
          <ol>
            <li>Buka email Anda</li>
            <li>Cari email dari "Sinau Basa Jawa"</li>
            <li>Klik tombol "Verifikasi Email"</li>
            <li>Kembali ke sini untuk login</li>
          </ol>
        </div>
        <div class="verification-note">
          <p><em>Tidak menerima email? Cek folder spam/junk Anda.</em></p>
        </div>
      </div>
    </div>
  `

  popup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10001;
  `

  document.body.appendChild(popup)
}

function closeVerificationPopup() {
  const popup = document.querySelector(".verification-popup")
  if (popup) {
    popup.remove()
  }
}

function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("currentUser")
  authToken = null
  currentUser = null
  showLandingPage()
  showNotification("Logout berhasil", "success")
}

function showLandingPage() {
  document.getElementById("landingPage").style.display = "block"
  document.getElementById("mainContent").style.display = "none"
}

function showMainContent() {
  document.getElementById("landingPage").style.display = "none"
  document.getElementById("mainContent").style.display = "block"

  // Update user info
  document.getElementById("userEmail").textContent = currentUser.email

  // Show default page
  showPage("aksara")
}

function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })

  // Remove active class from nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })

  // Show selected page
  document.getElementById(pageName + "Page").classList.add("active")

  // Add active class to corresponding nav link
  event.target.classList.add("active")

  currentPage = pageName
}

function initializeAksara() {
  initializeAksaraGrid()
}

function initializeAksaraGrid() {
  const grid = document.getElementById("aksaraGrid")

  aksaraData.forEach((aksara) => {
    const item = document.createElement("div")
    item.className = "aksara-item"
    item.innerHTML = `
            <div class="aksara-char">${aksara.char}</div>
            <div class="aksara-latin">${aksara.latin}</div>
            <div class="aksara-type">${aksara.type}</div>
        `

    item.addEventListener("click", () => playAksaraAudio(aksara.latin))
    grid.appendChild(item)
  })
}

function playAksaraAudio(latin) {
  // Create audio using Web Speech API
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(latin)
    utterance.lang = "id-ID" // Use Indonesian with Javanese-style pronunciation settings
    utterance.rate = 0.7
    utterance.pitch = 0.9

    // Try to find Indonesian voice for better Javanese accent
    const voices = speechSynthesis.getVoices()
    const indonesianVoice = voices.find(
      (voice) => voice.lang.includes("id") || voice.name.toLowerCase().includes("indonesia"),
    )

    if (indonesianVoice) {
      utterance.voice = indonesianVoice
    }

    speechSynthesis.speak(utterance)

    // Visual feedback
    showNotification(`Melafalkan: ${latin}`, "info")
  } else {
    showNotification("Browser tidak mendukung audio", "error")
  }
}

function initializeDictionary() {
  displayDictionary(dictionaryData)

  // Add search event listener
  document.getElementById("dictionarySearch").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    const filtered = dictionaryData.filter(
      (item) =>
        item.javanese.toLowerCase().includes(searchTerm) ||
        item.indonesian.toLowerCase().includes(searchTerm) ||
        item.example.toLowerCase().includes(searchTerm),
    )
    displayDictionary(filtered)
  })
}

function displayDictionary(data) {
  const grid = document.getElementById("dictionaryGrid")
  grid.innerHTML = ""

  data.forEach((item) => {
    const card = document.createElement("div")
    card.className = "dictionary-card"
    card.innerHTML = `
            <div class="word-pair">
                <div class="javanese-word">${item.javanese}</div>
            </div>
            <div class="word-category">${getCategoryName(item.category)}</div>
            <div class="word-example">${item.example}</div>
            <button onclick="playWordAudio('${item.javanese}')" class="audio-btn">🔊</button>
        `
    grid.appendChild(card)
  })
}

function getCategoryName(category) {
  const names = {
    greeting: "Salam",
    basic: "Dasar",
    family: "Keluarga",
    time: "Waktu",
  }
  return names[category] || category
}

function filterDictionary(category) {
  // Update active filter button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  event.target.classList.add("active")

  // Filter and display
  const filtered = category === "all" ? dictionaryData : dictionaryData.filter((item) => item.category === category)
  displayDictionary(filtered)
}

function searchDictionary() {
  const searchTerm = document.getElementById("dictionarySearch").value
  if (searchTerm.trim()) {
    document.getElementById("dictionarySearch").dispatchEvent(new Event("input"))
  }
}

function playWordAudio(word) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "id-ID" // Use Indonesian with slower rate for Javanese pronunciation
    utterance.rate = 0.6
    utterance.pitch = 0.9

    // Try to find Indonesian voice for better Javanese pronunciation
    const voices = speechSynthesis.getVoices()
    const indonesianVoice = voices.find(
      (voice) => voice.lang.includes("id") || voice.name.toLowerCase().includes("indonesia"),
    )

    if (indonesianVoice) {
      utterance.voice = indonesianVoice
    }

    speechSynthesis.speak(utterance)
    showNotification(`Melafalkan: ${word}`, "info")
  } else {
    showNotification("Browser tidak mendukung audio", "error")
  }
}

// Stage functions
function initializeStages() {
  displayStages()
  updateUserProgress()
}

function displayStages() {
  const grid = document.getElementById("stagesGrid")
  grid.innerHTML = ""

  for (let i = 1; i <= 100; i++) {
    const stage = document.createElement("div")
    const isCompleted = userStats.completedStages.includes(i)
    const isLocked = i > userStats.level && !isCompleted

    stage.className = `stage-item ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`
    stage.innerHTML = `
            <div class="stage-number">${i}</div>
            <div class="stage-status">
                ${isCompleted ? "✅" : isLocked ? "🔒" : "▶️"}
            </div>
        `

    if (!isLocked) {
      stage.addEventListener("click", () => startQuiz(i))
    }

    grid.appendChild(stage)
  }
}

function startQuiz(level) {
  currentQuiz = generateQuiz(level)
  currentQuestionIndex = 0
  quizScore = 0

  document.getElementById("quizTitle").textContent = `Level ${level}`
  document.getElementById("totalQuestions").textContent = currentQuiz.questions.length
  document.getElementById("quizModal").style.display = "block"

  showQuestion()
}

function generateQuiz(level) {
  const questions = []
  const questionTypes = ["translate", "choose", "complete"]

  for (let i = 0; i < 5; i++) {
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    const word = dictionaryData[Math.floor(Math.random() * dictionaryData.length)]

    let question
    switch (type) {
      case "translate":
        const wrongOptions = getUniqueRandomWords(word.javanese, 3)
        question = {
          question: `Terjemahkan: "${word.indonesian}"`,
          options: [word.javanese, ...wrongOptions],
          correct: 0,
        }
        break
      case "choose":
        const wrongIndonesian = getUniqueRandomIndonesian(word.indonesian, 3)
        question = {
          question: `Apa arti dari "${word.javanese}"?`,
          options: [word.indonesian, ...wrongIndonesian],
          correct: 0,
        }
        break
      case "complete":
        question = {
          question: `Lengkapi kalimat: "Sugeng ___" (Selamat datang)`,
          options: ["rawuh", "enjing", "dalu", "sore"],
          correct: 0,
        }
        break
    }

    // Shuffle options
    const correctAnswer = question.options[0]
    question.options.sort(() => Math.random() - 0.5)
    question.correct = question.options.indexOf(correctAnswer)

    questions.push(question)
  }

  return { level, questions }
}

function getUniqueRandomWords(excludeWord, count) {
  const availableWords = dictionaryData.filter((item) => item.javanese !== excludeWord).map((item) => item.javanese)

  const uniqueWords = []
  while (uniqueWords.length < count && uniqueWords.length < availableWords.length) {
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)]
    if (!uniqueWords.includes(randomWord)) {
      uniqueWords.push(randomWord)
    }
  }

  return uniqueWords
}

function getUniqueRandomIndonesian(excludeWord, count) {
  const availableWords = dictionaryData.filter((item) => item.indonesian !== excludeWord).map((item) => item.indonesian)

  const uniqueWords = []
  while (uniqueWords.length < count && uniqueWords.length < availableWords.length) {
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)]
    if (!uniqueWords.includes(randomWord)) {
      uniqueWords.push(randomWord)
    }
  }

  return uniqueWords
}

function showQuestion() {
  const question = currentQuiz.questions[currentQuestionIndex]

  document.getElementById("questionNumber").textContent = currentQuestionIndex + 1
  document.getElementById("questionText").textContent = question.question

  const container = document.getElementById("optionsContainer")
  container.innerHTML = ""

  question.options.forEach((option, index) => {
    const button = document.createElement("button")
    button.className = "option-btn"
    button.textContent = option
    button.onclick = () => selectAnswer(index)
    container.appendChild(button)
  })

  document.getElementById("nextQuestionBtn").style.display = "none"
  document.getElementById("finishQuizBtn").style.display = "none"
}

function selectAnswer(selectedIndex) {
  const question = currentQuiz.questions[currentQuestionIndex]
  const options = document.querySelectorAll(".option-btn")

  options.forEach((btn, index) => {
    btn.disabled = true
    if (index === question.correct) {
      btn.classList.add("correct")
    } else if (index === selectedIndex && index !== question.correct) {
      btn.classList.add("incorrect")
    }
  })

  if (selectedIndex === question.correct) {
    quizScore++
    showNotification("Benar! 🎉", "success")
  } else {
    showNotification("Salah! Jawaban yang benar: " + question.options[question.correct], "error")
  }

  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    document.getElementById("nextQuestionBtn").style.display = "block"
  } else {
    document.getElementById("finishQuizBtn").style.display = "block"
  }
}

function nextQuestion() {
  currentQuestionIndex++
  showQuestion()
}

function finishQuiz() {
  const percentage = (quizScore / currentQuiz.questions.length) * 100
  const passed = percentage >= 60

  if (passed) {
    userStats.points += quizScore * 10
    if (!userStats.completedStages.includes(currentQuiz.level)) {
      userStats.completedStages.push(currentQuiz.level)
      userStats.level = Math.max(userStats.level, currentQuiz.level + 1)
    }
    updateRank()
    showNotification(
      `Selamat! Skor: ${quizScore}/${currentQuiz.questions.length} (${percentage.toFixed(0)}%)`,
      "success",
    )
  } else {
    showNotification(
      `Belum lulus. Skor: ${quizScore}/${currentQuiz.questions.length} (${percentage.toFixed(0)}%). Coba lagi!`,
      "error",
    )
  }

  updateUserProgress()
  displayStages()
  closeQuiz()
}

function closeQuiz() {
  document.getElementById("quizModal").style.display = "none"
}

function updateUserProgress() {
  document.getElementById("userLevel").textContent = userStats.level
  document.getElementById("userPoints").textContent = userStats.points
  document.getElementById("userRank").textContent = getRankName(userStats.rank, userStats.level)
}

function updateRank() {
  const points = userStats.points
  if (points >= 5000) userStats.rank = "sesepuh"
  else if (points >= 2000) userStats.rank = "grandmaster"
  else if (points >= 1000) userStats.rank = "master"
  else if (points >= 500) userStats.rank = "silver"
  else userStats.rank = "bronze"
}

function getRankName(rank, level) {
  const rankLevel = Math.min(Math.floor(level / 10) + 1, rank === "sesepuh" ? 5 : 4)
  const rankNames = {
    bronze: `Bronze ${rankLevel}`,
    silver: `Silver ${rankLevel}`,
    master: `Master ${rankLevel}`,
    grandmaster: `Grandmaster ${rankLevel}`,
    sesepuh: `Sesepuh ${rankLevel}`,
  }
  return rankNames[rank] || "Bronze 1"
}

function toggleLeaderboard() {
  const section = document.getElementById("leaderboardSection")
  section.style.display = section.style.display === "none" ? "block" : "none"

  if (section.style.display === "block") {
    displayLeaderboard()
  }
}

function displayLeaderboard() {
  // Mock leaderboard data
  const leaderboard = [
    { name: "Budi Santoso", points: 2500, rank: "Grandmaster 2" },
    { name: "Siti Nurhaliza", points: 2200, rank: "Master 4" },
    { name: "Ahmad Wijaya", points: 1800, rank: "Master 2" },
    { name: "Dewi Sartika", points: 1500, rank: "Silver 3" },
    { name: "Rudi Hartono", points: 1200, rank: "Silver 2" },
  ]

  const list = document.getElementById("leaderboardList")
  list.innerHTML = ""

  leaderboard.forEach((user, index) => {
    const item = document.createElement("div")
    item.className = "leaderboard-item"
    item.innerHTML = `
            <div class="rank-position">${index + 1}</div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-rank">${user.rank}</div>
            </div>
            <div class="user-points">${user.points} pts</div>
        `
    list.appendChild(item)
  })
}

// Tutur functions
let tuturMode = "ngoko-krama"

function initializeTutur() {
  displayExamples()

  document.getElementById("tuturInput").addEventListener("input", translateTutur)
}

function setTuturMode(mode) {
  tuturMode = mode

  // Update button states
  document.getElementById("ngokoKramaBtn").classList.toggle("active", mode === "ngoko-krama")
  document.getElementById("kramaNgokoBtn").classList.toggle("active", mode === "krama-ngoko")

  // Update labels
  if (mode === "ngoko-krama") {
    document.getElementById("inputLabel").textContent = "Ngoko (Informal)"
    document.getElementById("outputLabel").textContent = "Krama (Formal)"
    document.getElementById("tuturInput").placeholder = "Ketik kalimat dalam bahasa Ngoko..."
  } else {
    document.getElementById("inputLabel").textContent = "Krama (Formal)"
    document.getElementById("outputLabel").textContent = "Ngoko (Informal)"
    document.getElementById("tuturInput").placeholder = "Ketik kalimat dalam bahasa Krama..."
  }

  // Clear and retranslate
  document.getElementById("tuturInput").value = ""
  document.getElementById("tuturOutput").value = ""
}

function translateTutur() {
  const input = document.getElementById("tuturInput").value.toLowerCase()
  const output = document.getElementById("tuturOutput")

  if (!input.trim()) {
    output.value = ""
    return
  }

  let result = input

  tuturData["ngoko-krama"].forEach((pair) => {
    if (tuturMode === "ngoko-krama") {
      result = result.replace(new RegExp(pair.ngoko, "g"), pair.krama)
    } else {
      result = result.replace(new RegExp(pair.krama, "g"), pair.ngoko)
    }
  })

  output.value = result
}

function displayExamples() {
  const grid = document.getElementById("examplesGrid")
  grid.innerHTML = ""

  tuturData.examples.forEach((example) => {
    const card = document.createElement("div")
    card.className = "example-card"
    card.innerHTML = `
            <div class="example-ngoko">
                <strong>Ngoko:</strong> ${example.ngoko}
            </div>
            <div class="example-krama">
                <strong>Krama:</strong> ${example.krama}
            </div>
            <div class="example-translation">
                <em>${example.translation}</em>
            </div>
            <button onclick="useExample('${example.ngoko}', '${example.krama}')" class="use-example-btn">Gunakan Contoh</button>
        `
    grid.appendChild(card)
  })
}

function useExample(ngoko, krama) {
  if (tuturMode === "ngoko-krama") {
    document.getElementById("tuturInput").value = ngoko
    document.getElementById("tuturOutput").value = krama
  } else {
    document.getElementById("tuturInput").value = krama
    document.getElementById("tuturOutput").value = ngoko
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "#10b981"
      break
    case "error":
      notification.style.background = "#ef4444"
      break
    case "info":
      notification.style.background = "#3b82f6"
      break
    default:
      notification.style.background = "#6b7280"
  }

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Admin functions (will be expanded in admin dashboard task)
async function adminLogin(password) {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem("adminToken", data.token)
      window.location.href = "/admin.html"
    } else {
      showNotification("Password admin salah", "error")
    }
  } catch (error) {
    console.error("Admin login error:", error)
    showNotification("Terjadi kesalahan", "error")
  }
}
