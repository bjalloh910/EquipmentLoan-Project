# 📦 EquipmentLoan-Project

This is a full-stack web application for managing equipment checkouts and returns within the Smith College SAL Lab. The system allows users to loan out equipment to people, track return dates, and monitor equipment status—all in one place.

## 🌟 Features

- 🔍 Search equipment by model, type, or serial code
- 📅 Track current loans and return status
- 🗂️ View detailed history of past loans
- 🧑 Manage users with unique personnel numbers
- 🔧 Admin dashboard to add, edit, or remove equipment
- ⏱ View total days in use and firmware update dates

## 🛠️ Tech Stack

**Frontend**
- HTML, CSS, JavaScript

**Backend**
- Node.js + Express
- Sequelize ORM
- MySQL Database


## 🗃️ Database Schema

### Tables:
- **Users**
  - `id` (PK)
  - `personnel_number` (unique)
  - `name`, `email`, etc.

- **Equipment**
  - `id` (PK)
  - `serial_code` (unique)
  - `model`, `make`, `equip_type`, `checkout_status`
  - `purchase_date`, `firmware_update`, `total_days_inuse`
 
  - **Loans**
  - `id` (PK)
  - `user_id` (FK)
  - `equipment_id` (FK)
  - `checkout_date`, `return_date`, `loan_status`

 
## 🧱 Set Up the Database
```bash
mysql -u root -p -e "CREATE DATABASE equipment_loan_db;"
```

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/EquipmentLoan-Project.git
cd EquipmentLoan-Project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```env
Create a .env file in the root:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=equipment_loan_db
```

### 3. Run migrations and seeders
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 3. Start the server
```bash
npm start
```

✨ UI Screenshots


## 📁 Project Structure:
EquipmentLoan-Project/
├── client/ # Frontend files
| ├── css folder
| ├── JS folder which includes frontend logic
| ├── Views
│     ├── index.html # Login/signup homepage
│     └── home.html  # Main homepage
├── server/ # Backend and API logic
│ ├── models/ # Sequelize models (Users, Equipment, Loans)
│ ├── routes/ # Express route handlers
│ ├── controllers/ # Logic for handling each route
│ ├── data/ # csv files that contains sample data
│ ├── dynamic_views/ # contains ejs views
      ├── currentLoans.ejs # active loans management and creation loans page
│     ├── equipmentInventory.ejs # Equipment listing and management page
│     ├── loanHistory.ejs # History loans display
│     └── usersList.ejs # User creation and management page
│ ├── migrations/ # Sequelize DB migrations
│ ├── seeders/ # files to populate the database with sample data
│ └── server.js # Entry point for backend server
├── .env # Environment variables
├── README.md # Project documentation
└── package.json # Project dependencies

🧑‍💻 How to Use the Prototype

1. Visit Homepage: Navigate to the home page where you can view general information and access links to equipment and loans pages.
2. Search Equipment: On the equipment page, use the search bar to filter equipment by model, type, or serial code.
3. Add New Equipment (Admin): Admins can add, update, or delete equipment using the form at the bottom of the equipment page.
4. Loan Equipment: Select equipment and assign it to a user by filling in the loan form.
5. Return Equipment: On the loans page, mark items as returned and view loan history.

🔗 Presentation

📽️ [View Project Presentation](https://docs.google.com/presentation/d/1HnBogkXBVnkO6J22Bnmijkn6eQb6-pgmB9FQunmOr1c/edit?usp=sharing)
 




