# 🧩 Form Builder – Built with Remix

A dynamic and responsive form builder built using **Remix**, **React**, **Tailwind CSS**, featuring drag-and-drop field configuration, localStorage persistence, and form response handling – all in the browser.

## Form Builder
![Screenshot 2025-05-31 193549](https://github.com/user-attachments/assets/037e9c5d-8474-4a91-9dc2-64d91c2297c9)
![Screenshot 2025-05-31 193732](https://github.com/user-attachments/assets/e3c2cebb-e917-419d-a307-9d48fafb5852)


## 📚 Documentation

- 🔗 Remix Docs: [https://remix.run/docs](https://remix.run/docs)
- 🔗 Tailwind CSS: [https://tailwindcss.com](https://tailwindcss.com)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

App will be available at: [http://localhost:3000](http://localhost:5173)

---

## 🛠 Available Scripts

### 🔨 Build for production

```bash
npm run build
```

### 🔧 Run in production mode

```bash
npm start
```

---


## 🎨 Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for modern utility-first styling.

To customize styles:

- Edit `tailwind.config.ts`
- Use utility classes directly in JSX/TSX
- Global styles can be edited in `app/tailwind.css`

---

## 📁 Project Structure

```
app/
├── components/        # UI and functional components
├── routes/            # Remix routes: index, form, responses
├── utils/             # LocalStorage & data utilities
├── types/             # TypeScript interfaces/types
├── contexts/          # Theme and other global contexts
├── hooks/             # Contains custom hooks
├── entry.client.tsx   # Remix client entry
├── entry.server.tsx   # Remix server entry
├── root.tsx           # Remix root file
```

---

## ✨ Features

- 🧱 Drag-and-drop form builder
- 💾 LocalStorage persistence
- ✍️ Form filler preview & submission
- 📊 Response viewer with CSV export
- 🌙 Dark/light mode toggle
- ⚡ Fully client-side and lightweight
- ✨And many more Features

---
### Deployed Link

- [Form-Builder](https://form-builder-ten-cyan.vercel.app/)

Hosted on Vercel.

---
