# 📝 Task Management App

A simple **Task Management Application** that allows users to **add, update, delete, and list tasks**.  
The app supports both **admin** and **user** roles, with authentication and role-based navigation.

---

## Tech Stack

### **Frontend**
- React.js  
- React Router  
- Axios  
- Tailwind CSS and Bootstrap  
- SweetAlert2

### **Backend**
- Node.js  
- Express.js  
- PostgreSQL  
- Sequelize ORM  
- JWT Authentication  
- CORS, bcrypt, dotenv

---

## Setup Instructions

### **1. Clone the repository**
git clone https://github.com/nisargabd/MyTaskManagerApp.git
cd TaskManagementApp
```

---

### **2. Backend Setup**
```bash
cd backend
npm install
```

- Run database migrations or sync models:
  ```bash
  npm run dev
  ```

Backend will run on:  
**http://localhost:5000**


### **3. Frontend Setup**
cd ../task-frontend
npm install
npm start
```

Frontend will run on:  
**http://localhost:3000**
