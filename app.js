const STORAGE_KEY = "careerup-state-v1";

const initialState = {
  points: 280,
  spentPoints: 0,
  streak: 4,
  profile: {
    roles: "Product design, Software engineering, Data analysis",
    skills: "React, Python, SQL, Figma, user research, dashboards, APIs",
    location: "Remote",
    minMatch: 65
  },
  applications: [
    {
      company: "Northstar Labs",
      role: "Product Design Intern",
      status: "Interviewing",
      deadline: "2026-06-22",
      createdAt: "2026-06-15"
    },
    {
      company: "SummitGrid",
      role: "Software Engineering Intern",
      status: "Applied",
      deadline: "2026-06-28",
      createdAt: "2026-06-14"
    }
  ],
  unlockedPrep: ["resume-scorecard"],
  friends: [
    { name: "Maya", points: 520 },
    { name: "Jordan", points: 410 },
    { name: "Theo", points: 230 }
  ],
  completedChallenges: []
};

const postings = [
  {
    company: "Northstar Labs",
    role: "Product Design Intern",
    location: "Remote",
    deadlineDays: 4,
    skills: ["Figma", "user research", "dashboards"],
    type: "Design",
    source: "Handshake"
  },
  {
    company: "SummitGrid",
    role: "Software Engineering Intern",
    location: "Remote",
    deadlineDays: 9,
    skills: ["React", "APIs", "Python"],
    type: "Engineering",
    source: "Company feed"
  },
  {
    company: "BrightMetric",
    role: "Data Analyst Intern",
    location: "New York",
    deadlineDays: 2,
    skills: ["SQL", "dashboards", "Python"],
    type: "Analytics",
    source: "LinkedIn"
  },
  {
    company: "CivicByte",
    role: "UX Research Intern",
    location: "Boston",
    deadlineDays: 12,
    skills: ["user research", "Figma", "SQL"],
    type: "Research",
    source: "WayUp"
  },
  {
    company: "LaunchLedger",
    role: "Product Management Intern",
    location: "Chicago",
    deadlineDays: 6,
    skills: ["APIs", "dashboards", "user research"],
    type: "Product",
    source: "Startup list"
  },
  {
    company: "SignalForge",
    role: "Machine Learning Intern",
    location: "San Francisco",
    deadlineDays: 15,
    skills: ["Python", "SQL", "APIs"],
    type: "Engineering",
    source: "Company feed"
  }
];

const challenges = [
  {
    id: "apply-three",
    title: "Apply to 3 strong matches",
    reward: 90,
    target: 3,
    getProgress: (state) => state.applications.length
  },
  {
    id: "prep-one",
    title: "Unlock 1 prep tool",
    reward: 45,
    target: 1,
    getProgress: (state) => state.unlockedPrep.length
  },
  {
    id: "interview-stage",
    title: "Move one role to interviewing",
    reward: 60,
    target: 1,
    getProgress: (state) => state.applications.filter((item) => item.status === "Interviewing").length
  }
];

const prepTools = [
  {
    id: "resume-scorecard",
    name: "Resume scorecard",
    cost: 120,
    description: "Compare your resume against selected roles and surface missing keywords."
  },
  {
    id: "behavioral-drills",
    name: "Behavioral question drills",
    cost: 260,
    description: "Practice STAR answers with prompts matched to your target roles."
  },
  {
    id: "mock-interview",
    name: "Role-specific mock interview",
    cost: 520,
    description: "A full interview path for technical, product, design, or analyst roles."
  }
];

const ranks = [
  { name: "Rookie Applicant", min: 0 },
  { name: "Trailblazer", min: 350 },
  { name: "Opportunity Hunter", min: 750 },
  { name: "Interview Ace", min: 1250 },
  { name: "Offer Champion", min: 2000 }
];

let state = loadState();
let activeFilter = "all";
let sortNewestFirst = true;

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(initialState);

  try {
    return { ...structuredClone(initialState), ...JSON.parse(saved) };
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeList(value) {
  return value
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function calculateMatch(posting) {
  const skills = normalizeList(state.profile.skills);
  const roles = normalizeList(state.profile.roles);
  const skillHits = posting.skills.filter((skill) => skills.includes(skill.toLowerCase())).length;
  const roleHit = roles.some((role) => posting.role.toLowerCase().includes(role.split(" ")[0]));
  const locationBonus = state.profile.location === "Remote" && posting.location === "Remote" ? 12 : 0;
  const score = 48 + skillHits * 12 + (roleHit ? 10 : 0) + locationBonus - Math.max(0, posting.deadlineDays - 10);
  return Math.min(98, Math.max(42, score));
}

function currentRank() {
  return ranks.reduce((current, rank) => (state.points >= rank.min ? rank : current), ranks[0]);
}

function nextRank() {
  return ranks.find((rank) => rank.min > state.points);
}

function updateStats() {
  const rank = currentRank();
  const next = nextRank();
  const weekCount = state.applications.filter((item) => {
    const created = new Date(item.createdAt);
    const diff = Date.now() - created.getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  qs("#pointsTotal").textContent = state.points.toLocaleString();
  qs("#walletPoints").textContent = Math.max(0, state.points - state.spentPoints).toLocaleString();
  qs("#rankName").textContent = rank.name;
  qs("#streakCount").textContent = state.streak;
  qs("#applicationCount").textContent = state.applications.length;
  qs("#weekCount").textContent = `${weekCount} this week`;
  qs("#nextRank").textContent = next ? next.name : "Max rank";
  qs("#pointsToNext").textContent = next ? `${next.min - state.points} points away` : "Top of the board";
}

function renderPostings() {
  const grid = qs("#postingGrid");
  const template = qs("#postingTemplate");
  grid.innerHTML = "";

  postings
    .map((posting) => ({ ...posting, match: calculateMatch(posting) }))
    .filter((posting) => posting.match >= state.profile.minMatch)
    .filter((posting) => {
      if (activeFilter === "remote") return posting.location === "Remote";
      if (activeFilter === "high") return posting.match >= 82;
      if (activeFilter === "deadline") return posting.deadlineDays <= 6;
      return true;
    })
    .sort((a, b) => b.match - a.match)
    .forEach((posting) => {
      const node = template.content.firstElementChild.cloneNode(true);
      node.querySelector(".company-logo").textContent = posting.company.slice(0, 2).toUpperCase();
      node.querySelector(".company-logo").style.background = logoColor(posting.company);
      node.querySelector(".match-score").textContent = `${posting.match}% match`;
      node.querySelector("h3").textContent = posting.role;
      node.querySelector(".company-line").textContent = `${posting.company} • ${posting.location} • ${posting.source}`;
      node.querySelector(".deadline-text").textContent = `Closes in ${posting.deadlineDays} days`;
      node.querySelector(".tag-row").innerHTML = posting.skills
        .map((skill) => `<span class="tag">${skill}</span>`)
        .join("");
      node.querySelector(".apply-button").addEventListener("click", () => trackPosting(posting));
      grid.appendChild(node);
    });

  if (!grid.children.length) {
    grid.innerHTML = `<article class="posting-card"><h3>No matches yet</h3><p class="company-line">Lower the match threshold or broaden your roles to discover more internships.</p></article>`;
  }
}

function logoColor(value) {
  const colors = ["#2e7d55", "#3278a8", "#c9861a", "#d8644a", "#5d6b63"];
  return colors[[...value].reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length];
}

function trackPosting(posting) {
  state.applications.unshift({
    company: posting.company,
    role: posting.role,
    status: "Applied",
    deadline: toDateString(posting.deadlineDays),
    createdAt: toDateString(0)
  });
  state.points += 40;
  state.streak += 1;
  saveAndRender();
  location.hash = "#applications";
}

function toDateString(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

function renderApplications() {
  const list = qs("#applicationList");
  const applications = [...state.applications].sort((a, b) => {
    const first = new Date(a.createdAt).getTime();
    const second = new Date(b.createdAt).getTime();
    return sortNewestFirst ? second - first : first - second;
  });

  list.innerHTML = applications
    .map((item) => {
      const statusClass = item.status.toLowerCase();
      return `
        <article class="application-item">
          <div>
            <strong>${item.role}</strong>
            <div class="meta-line">${item.company} • deadline ${item.deadline || "not set"} • added ${item.createdAt}</div>
          </div>
          <span class="status-pill ${statusClass}">${item.status}</span>
        </article>
      `;
    })
    .join("");
}

function renderChallenges() {
  qs("#challengeList").innerHTML = challenges
    .map((challenge) => {
      const progress = Math.min(challenge.target, challenge.getProgress(state));
      const percent = Math.round((progress / challenge.target) * 100);
      const completed = state.completedChallenges.includes(challenge.id);
      const claimable = progress >= challenge.target && !completed;
      return `
        <article class="challenge-item">
          <div class="challenge-row">
            <div>
              <strong>${challenge.title}</strong>
              <div class="meta-line">${progress}/${challenge.target} complete • ${challenge.reward} pts</div>
            </div>
            <button class="unlock-button" data-challenge="${challenge.id}" ${claimable ? "" : "disabled"}>
              ${completed ? "Claimed" : "Claim"}
            </button>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
        </article>
      `;
    })
    .join("");

  qsa("[data-challenge]").forEach((button) => {
    button.addEventListener("click", () => claimChallenge(button.dataset.challenge));
  });
}

function claimChallenge(id) {
  const challenge = challenges.find((item) => item.id === id);
  if (!challenge || state.completedChallenges.includes(id)) return;
  if (challenge.getProgress(state) < challenge.target) return;

  state.completedChallenges.push(id);
  state.points += challenge.reward;
  saveAndRender();
}

function renderPrepShop() {
  const wallet = state.points - state.spentPoints;
  qs("#prepShop").innerHTML = prepTools
    .map((tool) => {
      const unlocked = state.unlockedPrep.includes(tool.id);
      const canUnlock = wallet >= tool.cost;
      return `
        <article class="prep-item ${unlocked ? "" : "locked"}">
          <div class="prep-row">
            <div>
              <strong>${tool.name}</strong>
              <div class="meta-line">${tool.description}</div>
            </div>
            <button class="unlock-button" data-prep="${tool.id}" ${unlocked || !canUnlock ? "disabled" : ""}>
              ${unlocked ? "Unlocked" : `${tool.cost} pts`}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  qsa("[data-prep]").forEach((button) => {
    button.addEventListener("click", () => unlockPrep(button.dataset.prep));
  });
}

function unlockPrep(id) {
  const tool = prepTools.find((item) => item.id === id);
  const wallet = state.points - state.spentPoints;
  if (!tool || state.unlockedPrep.includes(id) || wallet < tool.cost) return;

  state.unlockedPrep.push(id);
  state.spentPoints += tool.cost;
  saveAndRender();
}

function renderLeaderboard() {
  const competitors = [{ name: "You", points: state.points }, ...state.friends].sort((a, b) => b.points - a.points);
  qs("#leaderboard").innerHTML = competitors
    .map(
      (friend, index) => `
        <article class="leaderboard-item">
          <span class="leaderboard-rank">${index + 1}</span>
          <div>
            <strong>${friend.name}</strong>
            <div class="meta-line">${friend.name === "You" ? currentRank().name : "Classmate"}</div>
          </div>
          <span class="leaderboard-score">${friend.points.toLocaleString()} pts</span>
        </article>
      `
    )
    .join("");
}

function saveAndRender() {
  saveState();
  render();
}

function render() {
  updateStats();
  renderPostings();
  renderApplications();
  renderChallenges();
  renderPrepShop();
  renderLeaderboard();
}

function bindEvents() {
  qs("#profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.profile = {
      roles: qs("#rolesInput").value,
      skills: qs("#skillsInput").value,
      location: qs("#locationInput").value,
      minMatch: Number(qs("#matchInput").value)
    };
    qs("#feedStamp").textContent = "Updated from your profile";
    saveAndRender();
  });

  qs("#matchInput").addEventListener("input", (event) => {
    qs("#matchValue").textContent = event.target.value;
  });

  qsa(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      qsa(".filter-chip").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter;
      renderPostings();
    });
  });

  qs("#applicationForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.applications.unshift({
      company: qs("#companyInput").value,
      role: qs("#roleInput").value,
      status: qs("#statusInput").value,
      deadline: qs("#deadlineInput").value || "not set",
      createdAt: toDateString(0)
    });
    state.points += 40;
    state.streak += 1;
    event.target.reset();
    saveAndRender();
  });

  qs("#sortApplications").addEventListener("click", () => {
    sortNewestFirst = !sortNewestFirst;
    renderApplications();
  });

  qs("#addFriend").addEventListener("click", () => {
    const names = ["Anika", "Luis", "Priya", "Sam", "Nora"];
    const nextName = names[state.friends.length % names.length];
    state.friends.push({ name: nextName, points: 180 + Math.floor(Math.random() * 650) });
    saveAndRender();
  });

  qs("#resetDemo").addEventListener("click", () => {
    state = structuredClone(initialState);
    qs("#rolesInput").value = state.profile.roles;
    qs("#skillsInput").value = state.profile.skills;
    qs("#locationInput").value = state.profile.location;
    qs("#matchInput").value = state.profile.minMatch;
    qs("#matchValue").textContent = state.profile.minMatch;
    saveAndRender();
  });
}

function hydrateForm() {
  qs("#rolesInput").value = state.profile.roles;
  qs("#skillsInput").value = state.profile.skills;
  qs("#locationInput").value = state.profile.location;
  qs("#matchInput").value = state.profile.minMatch;
  qs("#matchValue").textContent = state.profile.minMatch;
}

hydrateForm();
bindEvents();
render();
