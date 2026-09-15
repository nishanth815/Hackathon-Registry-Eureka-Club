// ---------- Config ----------
const ADMIN_PASSWORD = "admin123"; // change this before deploying for real use
const STORAGE_KEY = "hackathon_teams";
const AUTH_KEY = "hackathon_is_admin";

// ---------- Seed data (used only the first time, if storage is empty) ----------
const seedTeams = [
  { id: "t1", name: "Byte Busters", leader: "Aditi Sharma", idea: "AI-based attendance system using face recognition", status: "In Progress" },
  { id: "t2", name: "Code Crusaders", leader: "Rohan Mehta", idea: "Campus lost-and-found web app", status: "Registered" },
  { id: "t3", name: "Neural Ninjas", leader: "Sara Khan", idea: "Chatbot for mental health first-aid", status: "Submitted" },
  { id: "t4", name: "Stack Overloaded", leader: "Kabir Nair", idea: "Peer-to-peer notes marketplace for the campus", status: "In Progress" }
];

// ---------- State helpers ----------
function loadTeams() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTeams));
    return [...seedTeams];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTeams(teams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
}

function isAdmin() {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

function setAdmin(value) {
  sessionStorage.setItem(AUTH_KEY, value ? "true" : "false");
}

// ---------- Elements ----------
const modeBadge = document.getElementById("modeBadge");
const adminToggleBtn = document.getElementById("adminToggleBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginPanel = document.getElementById("loginPanel");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");

const formPanel = document.getElementById("formPanel");
const formTitle = document.getElementById("formTitle");
const teamForm = document.getElementById("teamForm");
const teamIdInput = document.getElementById("teamId");
const teamNameInput = document.getElementById("teamName");
const leaderNameInput = document.getElementById("leaderName");
const projectIdeaInput = document.getElementById("projectIdea");
const statusInput = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const addTeamBtn = document.getElementById("addTeamBtn");
const teamGrid = document.getElementById("teamGrid");
const boardSub = document.getElementById("boardSub");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

const statTotal = document.getElementById("statTotal");
const statProgress = document.getElementById("statProgress");
const statDone = document.getElementById("statDone");

let teams = loadTeams();
let searchQuery = "";

// ---------- Rendering ----------
function render() {
  const admin = isAdmin();

  modeBadge.textContent = admin ? "you're in — admin mode" : "watching, not touching";
  modeBadge.classList.toggle("mode-admin", admin);

  adminToggleBtn.classList.toggle("hidden", admin);
  logoutBtn.classList.toggle("hidden", !admin);
  addTeamBtn.classList.toggle("hidden", !admin);

  if (!admin) {
    loginPanel.classList.add("hidden");
    formPanel.classList.add("hidden");
  }

  // stats
  statTotal.textContent = teams.length;
  statProgress.textContent = teams.filter(t => t.status === "In Progress").length;
  statDone.textContent = teams.filter(t => t.status === "Submitted").length;

  // filter by search
  const q = searchQuery.trim().toLowerCase();
  const visible = q
    ? teams.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.leader.toLowerCase().includes(q) ||
        t.idea.toLowerCase().includes(q)
      )
    : teams;

  boardSub.textContent = q
    ? `showing ${visible.length} of ${teams.length} teams`
    : `${teams.length} team${teams.length === 1 ? "" : "s"} on the board right now`;

  emptyState.classList.toggle("hidden", visible.length > 0);
  teamGrid.classList.toggle("hidden", visible.length === 0);

  teamGrid.innerHTML = visible.map(team => `
    <div class="team-card">
      <div class="team-card-top">
        <div>
          <p class="team-name">${escapeHtml(team.name)}</p>
          <p class="team-leader">led by ${escapeHtml(team.leader)}</p>
        </div>
      </div>
      <p class="team-idea">${escapeHtml(team.idea)}</p>
      <span class="status-tag ${team.status === "Submitted" ? "status-submitted" : ""}">${statusLabel(team.status)}</span>
      ${admin ? `
      <div class="row-actions">
        <button class="btn btn-outline btn-small" onclick="startEdit('${team.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteTeam('${team.id}')">Delete</button>
      </div>` : ""}
    </div>
  `).join("");
}

function statusLabel(status) {
  if (status === "Registered") return "just registered";
  if (status === "In Progress") return "mid-build";
  if (status === "Submitted") return "submitted";
  return status;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Search ----------
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  render();
});

// ---------- Auth actions ----------
adminToggleBtn.addEventListener("click", () => {
  loginPanel.classList.remove("hidden");
  passwordInput.focus();
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (passwordInput.value === ADMIN_PASSWORD) {
    setAdmin(true);
    loginError.classList.add("hidden");
    loginPanel.classList.add("hidden");
    passwordInput.value = "";
    render();
  } else {
    loginError.classList.remove("hidden");
  }
});

logoutBtn.addEventListener("click", () => {
  setAdmin(false);
  render();
});

// ---------- CRUD actions ----------
addTeamBtn.addEventListener("click", () => {
  resetForm();
  formTitle.textContent = "New team on the board";
  submitBtn.textContent = "Add to the board";
  formPanel.classList.remove("hidden");
  formPanel.scrollIntoView({ behavior: "smooth", block: "center" });
});

cancelEditBtn.addEventListener("click", () => {
  formPanel.classList.add("hidden");
  resetForm();
});

function resetForm() {
  teamIdInput.value = "";
  teamForm.reset();
}

teamForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = teamIdInput.value;
  const teamData = {
    name: teamNameInput.value.trim(),
    leader: leaderNameInput.value.trim(),
    idea: projectIdeaInput.value.trim(),
    status: statusInput.value
  };

  if (id) {
    teams = teams.map(t => t.id === id ? { ...t, ...teamData } : t);
  } else {
    teams.push({ id: "t" + Date.now(), ...teamData });
  }

  saveTeams(teams);
  formPanel.classList.add("hidden");
  resetForm();
  render();
});

function startEdit(id) {
  const team = teams.find(t => t.id === id);
  if (!team) return;
  teamIdInput.value = team.id;
  teamNameInput.value = team.name;
  leaderNameInput.value = team.leader;
  projectIdeaInput.value = team.idea;
  statusInput.value = team.status;
  formTitle.textContent = `Editing ${team.name}`;
  submitBtn.textContent = "Save changes";
  formPanel.classList.remove("hidden");
  formPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteTeam(id) {
  const team = teams.find(t => t.id === id);
  if (!team) return;
  const confirmed = confirm(`Remove "${team.name}" from the board? Can't be undone.`);
  if (!confirmed) return;
  teams = teams.filter(t => t.id !== id);
  saveTeams(teams);
  render();
}

// ---------- Init ----------
render();
