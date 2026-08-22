# 🌐 Dayflow – Human Resource Management System

> **Every workday, perfectly aligned.**

Dayflow is a modern **Human Resource Management System (HRMS)** designed to digitize and simplify everyday HR operations. It provides a centralized platform for managing employees, attendance, leave, payroll visibility, and approval workflows.

## 🚀 Features

### 🔐 Authentication

* Secure Sign Up and Sign In
* Role-based access control
* Admin and HR officer management

### 👨‍💼 Employee Management

* Employee profile management
* Employee onboarding
* Department and role information
* Employee records management

### 🕒 Attendance Management

* Daily attendance tracking
* Check-in / check-out
* Attendance history
* Attendance status monitoring

### 🏖️ Leave Management

* Leave request submission
* Leave approval / rejection
* Leave history
* Leave balance tracking

### 💰 Payroll Visibility

* Salary information
* Payroll records
* Salary breakdown
* Payroll visibility for authorized users

### ✅ Approval Workflows

* Leave approval
* Employee-related approvals
* HR workflow management
* Role-based permissions

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Axios

### Backend

* Spring Boot
* Java
* REST API
* Maven

### Database

* PostgreSQL

### Development Tools

* Git
* GitHub
* Visual Studio Code

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │      Dayflow UI     │
                 │   React + Vite      │
                 └──────────┬──────────┘
                            │
                            │ REST API
                            ▼
                 ┌─────────────────────┐
                 │    Spring Boot      │
                 │      Backend        │
                 └──────────┬──────────┘
                            │
                            │ JPA / Hibernate
                            ▼
                 ┌─────────────────────┐
                 │     PostgreSQL      │
                 │      Database       │
                 └─────────────────────┘
```

## 📁 Project Structure

```text
Human-Resource-Management-System/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── README.md
└── .gitignore
```

> Update the folder names above if your actual project structure is different.

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/velavan1817/Human-Resource-Management-System.git
```

```bash
cd Human-Resource-Management-System
```

### 2. Backend Setup

Make sure you have:

* Java 21+
* Maven
* PostgreSQL

Configure your PostgreSQL database and update the backend configuration.

Then run:

```bash
mvn spring-boot:run
```

The backend will start on the configured Spring Boot port.

### 3. Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL shown in your terminal, usually:

```text
http://localhost:5173
```

## 🔑 User Roles

| Role       | Responsibilities                                        |
| ---------- | ------------------------------------------------------- |
| Admin      | Manage users, employees and system settings             |
| HR Officer | Manage employees, attendance, leave and HR workflows    |
| Employee   | View profile, attendance, leave and payroll information |

## 🔒 Security

The system is designed with:

* Authentication and authorization
* Role-based access control
* Secure REST APIs
* Protected user information
* Database-level data management

**Never commit passwords, API keys, JWT secrets, or `.env` files to GitHub.**

## 🎯 Project Goals

Dayflow aims to:

* Reduce manual HR work
* Centralize employee information
* Improve attendance tracking
* Simplify leave management
* Provide transparent payroll visibility
* Streamline HR approval workflows
* Improve overall workplace efficiency

## 🔮 Future Enhancements

* 📊 Advanced HR analytics dashboard
* 🤖 AI-powered HR insights
* 📱 Mobile application
* 📧 Email notifications
* 🔔 Real-time notifications
* 📄 Automated HR reports
* 📈 Employee performance analytics
* ☁️ Cloud deployment

## 👥 Team

**Dayflow – Human Resource Management System**

Developed as a collaborative software project to build a modern and efficient HR management platform.

## 📄 License

This project is developed for educational and project purposes.

---

### ⭐ Dayflow

**Every workday, perfectly aligned.**
