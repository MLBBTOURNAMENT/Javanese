// Admin Dashboard JavaScript
let adminToken = null
let currentSection = "users"
let usersData = []

// Initialize admin dashboard
document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth()
  setupEventListeners()
  updateLastLoginTime()
})

function checkAdminAuth() {
  adminToken = localStorage.getItem("adminToken")

  if (adminToken) {
    // Verify token is still valid by making a test request
    verifyAdminToken()
  } else {
    showAdminLogin()
  }
}

async function verifyAdminToken() {
  try {
    const response = await fetch("/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })

    if (response.ok) {
      showAdminDashboard()
      loadDashboardData()
    } else {
      // Token is invalid, remove it and show login
      localStorage.removeItem("adminToken")
      adminToken = null
      showAdminLogin()
    }
  } catch (error) {
    console.error("[v0] Token verification failed:", error)
    localStorage.removeItem("adminToken")
    adminToken = null
    showAdminLogin()
  }
}

function setupEventListeners() {
  // Admin login form
  document.getElementById("adminLoginForm").addEventListener("submit", handleAdminLogin)

  // Search functionality
  document.getElementById("userSearch").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    filterUsersTable(searchTerm)
  })
}

function showAdminLogin() {
  document.getElementById("adminLoginModal").style.display = "flex"
  document.getElementById("adminDashboard").style.display = "none"
}

function showAdminDashboard() {
  document.getElementById("adminLoginModal").style.display = "none"
  document.getElementById("adminDashboard").style.display = "block"
}

async function handleAdminLogin(e) {
  e.preventDefault()

  const password = document.getElementById("adminPassword").value

  console.log("[v0] Admin login attempt with password:", password)

  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Logging in..."
  submitBtn.disabled = true

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })

    const data = await response.json()
    console.log("[v0] Admin login response:", data)

    if (response.ok) {
      adminToken = data.token
      localStorage.setItem("adminToken", adminToken)
      showAdminDashboard()
      loadDashboardData()
      showNotification("Admin login successful", "success")
    } else {
      console.log("[v0] Admin login failed:", data.error)
      showNotification("Invalid admin password", "error")
      document.getElementById("adminPassword").value = ""
    }
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    showNotification("Login failed. Please try again.", "error")
  } finally {
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
}

function logoutAdmin() {
  localStorage.removeItem("adminToken")
  adminToken = null
  showAdminLogin()
  showNotification("Logged out successfully", "success")
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.classList.remove("active")
  })

  // Remove active class from nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Show selected section
  document.getElementById(sectionName + "Section").classList.add("active")

  // Add active class to corresponding nav item
  document.querySelector(`[data-section="${sectionName}"]`).classList.add("active")

  currentSection = sectionName

  // Load section-specific data
  if (sectionName === "users") {
    loadUsersData()
  } else if (sectionName === "analytics") {
    loadAnalyticsData()
  }
}

async function loadDashboardData() {
  await loadUsersData()
  await loadSystemStats()
  updateDashboardStats()
}

async function loadUsersData() {
  try {
    const response = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      usersData = data.users
      displayUsersTable(usersData)
      updateUserStats(data)
    } else {
      showNotification("Failed to load user data", "error")
    }
  } catch (error) {
    console.error("Error loading users:", error)
    showNotification("Error loading user data", "error")
  }
}

async function loadSystemStats() {
  try {
    const response = await fetch("/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      updateSystemStats(data)
    }
  } catch (error) {
    console.error("Error loading system stats:", error)
  }
}

function updateSystemStats(stats) {
  document.getElementById("totalUsers").textContent = stats.totalUsers
  document.getElementById("verifiedUsers").textContent = stats.verifiedUsers
  document.getElementById("activeToday").textContent = stats.activeToday

  // Update additional stats if elements exist
  const avgLevelEl = document.getElementById("averageLevel")
  if (avgLevelEl) avgLevelEl.textContent = stats.averageLevel

  const completionEl = document.getElementById("completionRate")
  if (completionEl) completionEl.textContent = stats.completionRate + "%"
}

function displayUsersTable(users) {
  const tbody = document.getElementById("usersTableBody")
  tbody.innerHTML = ""

  users.forEach((user) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${user.email}</td>
            <td>${formatDate(user.registrationTime)}</td>
            <td>
                <span class="status-badge ${user.verified ? "status-verified" : "status-pending"}">
                    ${user.verified ? "Verified" : "Pending"}
                </span>
            </td>
            <td>${user.level || 1}</td>
            <td>
                <span class="rank-badge">${user.rank || "Bronze 1"}</span>
            </td>
            <td>
                <button class="action-btn" onclick="viewUser('${user.email}')">View</button>
                <button class="action-btn" onclick="editUser('${user.email}')">Edit</button>
                <button class="action-btn" onclick="deleteUser('${user.email}')">Delete</button>
            </td>
        `
    tbody.appendChild(row)
  })
}

function updateUserStats(data) {
  document.getElementById("totalUsers").textContent = data.count
  document.getElementById("verifiedUsers").textContent = data.users.filter((u) => u.verified).length
  document.getElementById("activeToday").textContent = Math.floor(data.count * 0.3) // Mock data

  // Find highest rank
  const ranks = ["Bronze", "Silver", "Master", "Grandmaster", "Sesepuh"]
  let highestRank = "Bronze"
  data.users.forEach((user) => {
    if (user.rank) {
      const userRankBase = user.rank.split(" ")[0]
      if (ranks.indexOf(userRankBase) > ranks.indexOf(highestRank)) {
        highestRank = userRankBase
      }
    }
  })
  document.getElementById("topRank").textContent = highestRank
}

function updateDashboardStats() {
  // Animate stat numbers
  animateNumber("totalUsers", 0, Number.parseInt(document.getElementById("totalUsers").textContent))
  animateNumber("verifiedUsers", 0, Number.parseInt(document.getElementById("verifiedUsers").textContent))
  animateNumber("activeToday", 0, Number.parseInt(document.getElementById("activeToday").textContent))
}

function animateNumber(elementId, start, end) {
  const element = document.getElementById(elementId)
  const duration = 1000
  const increment = (end - start) / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= end) {
      current = end
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 16)
}

function filterUsersTable(searchTerm) {
  const filteredUsers = usersData.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm) || (user.rank && user.rank.toLowerCase().includes(searchTerm)),
  )
  displayUsersTable(filteredUsers)
}

function searchUsers() {
  const searchTerm = document.getElementById("userSearch").value
  filterUsersTable(searchTerm.toLowerCase())
}

function refreshUserData() {
  showNotification("Refreshing user data...", "info")
  loadUsersData()
}

function exportUserData() {
  // Create CSV content
  const headers = ["Email", "Registration Time", "Verified", "Level", "Rank", "Points", "Completed Stages"]
  const csvContent = [
    headers.join(","),
    ...usersData.map((user) =>
      [
        user.email,
        user.registrationTime,
        user.verified,
        user.level || 1,
        user.rank || "Bronze 1",
        user.points || 0,
        user.completedStages || 0,
      ].join(","),
    ),
  ].join("\n")

  // Download CSV
  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)

  showNotification("User data exported successfully", "success")
}

function viewUser(email) {
  const user = usersData.find((u) => u.email === email)
  if (user) {
    const lastLogin = user.lastLogin ? formatDate(user.lastLogin) : "Never"
    alert(
      `User Details:\n\nEmail: ${user.email}\nRegistered: ${formatDate(user.registrationTime)}\nLast Login: ${lastLogin}\nVerified: ${user.verified ? "Yes" : "No"}\nLevel: ${user.level || 1}\nRank: ${user.rank || "Bronze 1"}\nPoints: ${user.points || 0}\nCompleted Stages: ${user.completedStages || 0}`,
    )
  }
}

function editUser(email) {
  showNotification("Edit user functionality coming soon", "info")
}

function deleteUser(email) {
  if (confirm(`Are you sure you want to delete user: ${email}?`)) {
    showNotification("Delete user functionality coming soon", "info")
  }
}

function loadAnalyticsData() {
  // Mock analytics data loading
  showNotification("Loading analytics data...", "info")

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll(".progress-fill").forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0%"
      setTimeout(() => {
        bar.style.width = width
      }, 100)
    })
  }, 500)
}

function addNewContent() {
  showNotification("Add content functionality coming soon", "info")
}

function changeAdminPassword() {
  const newPassword = prompt("Enter new admin password:")
  if (newPassword && newPassword.length >= 6) {
    showNotification("Password change functionality coming soon", "info")
  } else if (newPassword) {
    showNotification("Password must be at least 6 characters", "error")
  }
}

async function testEmailService() {
  try {
    showNotification("Testing email service...", "info")

    const response = await fetch("/api/admin/test-email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (response.ok) {
      showNotification("Test email sent successfully! Check jasondariuschandra@gmail.com", "success")
    } else {
      showNotification(`Email test failed: ${data.error}`, "error")
    }
  } catch (error) {
    console.error("Email test error:", error)
    showNotification("Email test failed. Check console for details.", "error")
  }
}

function updateLastLoginTime() {
  const now = new Date()
  const timeString = now.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  document.getElementById("lastLoginTime").textContent = timeString
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
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
      notification.style.background = "#15803d"
      break
    case "error":
      notification.style.background = "#dc2626"
      break
    case "info":
      notification.style.background = "#164e63"
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

// Auto-refresh data every 5 minutes
setInterval(() => {
  if (adminToken && currentSection === "users") {
    loadUsersData()
  }
}, 300000)
