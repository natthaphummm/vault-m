# vault-m

Item inventory simulation system and crafting system of FiveM RP. An Electron application built with modern web technologies.

## 🚀 Features

- **Inventory Management**: Simulate an RPG-style inventory system.
- **Crafting System**: Create new items from resources with recipes.
- **Settings**: Customizable application settings (Theming, etc.).
- **Modern UI**: Built with Shadcn UI and Tailwind CSS for a sleek look.

## 🛠️ Tech Stack

- **Runtime**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand)
- **Routing & Data**: [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query), [TanStack Form](https://tanstack.com/form)
- **Database**: [SQLite](https://www.sqlite.org/) with [Drizzle ORM](https://orm.drizzle.team/)

## 📦 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/natthaphummm/vault-m.git
cd vault-m
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Building

Build the application for your platform:

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 🗃️ Database

This project uses Drizzle ORM with SQLite.

- `npm run db:push`: Push schema changes to the database.
- `npm run db:studio`: Open Drizzle Studio to view/edit data.
- `npm run db:generate`: Generate migrations.
