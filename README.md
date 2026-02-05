# ⏱️ Focus Timer – Daily Work Focus Tracker

A modern **focus & productivity tracker** built with **React, Zustand, and date-fns**.  
This app helps users track focused work sessions, manage tasks, and stay consistent with daily goals.

---

## 🚀 Features

- ✅ Create, edit, delete focus tasks
- ⏱️ Start / pause a countdown timer per task
- 🔄 Timer is **refresh-proof** (persists across reloads)
- 📅 Daily focus progress tracking
- 🔍 Search & filter tasks (All / Active / Completed)
- 📝 Edit task name, notes, and duration inline
- 🗑️ Delete confirmation using alert dialog
- 💾 State persistence with **Zustand + localStorage**
- 🎯 Auto-complete task when timer ends
- ⚡ Instant UI updates (no 1-second lag)

---

## 🧠 How It Works

- Each task has a fixed focus duration (in minutes)
- When a timer starts, an `endTime` is saved in `localStorage`
- On refresh, remaining time is recalculated using `date-fns`
- Daily focused time resets automatically every new day
- Zustand manages global state with persistence middleware

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **State Management:** Zustand
- **Date Utilities:** date-fns
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Persistence:** localStorage

---

## 📂 Project Structure

src/
├── components/
│ └── ui/ # Reusable UI components
│ └── Navbar.jsx
├── store/
│ └── useTaskStore.js
├── pages/
│ └── FocusTimer.jsx
├── utils/
└── main.jsx


---

## 🧪 Core Concepts Used

- React hooks (`useState`, `useEffect`, `useCallback`)
- Derived state & effect ordering
- LocalStorage synchronization
- Timer logic with real-world time (`endTime`)
- Controlled inputs & inline editing
- Defensive UI state handling

---

## ▶️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/focus-timer.git
cd focus-timer
