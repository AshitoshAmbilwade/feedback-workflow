# 📝 Feedback Workflow System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A full-stack feedback management system that enables HR users to send feedback requests and clients to securely submit responses via unique email links.

---

## 🚀 Deployment

🔗 **Live Demo:** [https://feedback-workflow-alpha.vercel.app/](https://feedback-workflow-alpha.vercel.app/)

Hosted on **Vercel**.

---

## 🧰 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB (via Mongoose)
- **Email Service:** EmailJS  I am using free version so for that two account needed
- **UI Components:** shadcn/ui + Tailwind CSS
- **Hosting:** Vercel

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/feedback-workflow.git
cd feedback-workflow
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create Environment File

Create a new file named `.env.local` in the root directory and add:

```env
MONGODB_URI=your_mongodb_connection_string
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
NEXT_PUBLIC_APP_URL=https://feedback-workflow-alpha.vercel.app
```

> ⚠️ For local development, use `NEXT_PUBLIC_APP_URL=http://localhost:3000`.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## 🧪 Demo Credentials

**HR User (existing record in MongoDB):**

```
Email: ashitoshambilwade1289@gmail.com
Password: Ashitosh
Role: HR
```

**Sample Feedback Record:**

```
_id: 6909dc0c9850464f397cdbe3
HR Email: ashitoshambilwade1289@gmail.com
Client Email: kajalambilwade231@gmail.com
Client Name: Ashitosh
Token: cca1c526-b6ab-4143-b1f7-8aed27e5e21b
Status: submitted
```

---

## 📧 Email API Setup (EmailJS)

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/).
2. Create a free account.
3. Set up:

   * **Email Service ID**
   * **Template ID**
   * **Public Key**
4. Add these values to your `.env.local` file.
5. In your EmailJS template, include placeholders:

   * `client_name`
   * `client_email`
   * `feedback_link`

---

## 📂 Folder Structure

```
📦 feedback-workflow
├── app/
│   ├── api/              # API routes (Mongo, EmailJS, etc.)
│   ├── dashboard/        # HR dashboard pages
│   ├── feedback/         # Feedback submission pages
│   └── layout.tsx        # App layout
├── components/           # Reusable UI components
├── lib/                  # Utilities (DB connect, email helpers, etc.)
├── public/               # Static assets
├── .env.local.example    # Example environment file
├── package.json
└── README.md
```

---

## 🧩 Key Features

✅ Secure, token-based feedback submission
✅ Email-based feedback requests (EmailJS)
✅ HR dashboard for managing requests and responses
✅ MongoDB data persistence
✅ Clean modern UI (shadcn/ui + Tailwind CSS)
✅ Fully deployed and live on Vercel

---

## 🧑‍💻 Developer

**Developed by:** Ashitosh Vilas Ambilwade

---

## 📄 License

This project is open-source and free to use for educational or portfolio purposes.



