# 🌱 Personal Carbon Footprint Tracker
### DBMS Mini Project - Semester 4

A database-centric web application designed to record, organize, and analyze personal carbon-emission-related activities.

---

## 📌 Project Description

The Personal Carbon Footprint Tracker is a Semester 4 DBMS Mini Project focused on structured data management using a relational database.

This project captures user activities (such as transport, energy use, and lifestyle actions), maps them to emission factors, calculates carbon impact, and stores the results for reporting and analysis.

While the frontend and backend are already implemented using HTML/CSS/JavaScript and Node.js/Express, the core learning objective of this project is the **database design, normalization, relationship modeling, and query-based analytics** using MySQL.

---

## ✅ Features

- 👤 User profile and activity data management
- 📝 Activity tracking with categorized records
- ⚙️ Emission calculation using predefined emission factors
- 🗄️ Persistent storage of user activities and emission records in MySQL
- 📊 Dashboard-ready reporting support with query-based summaries
- 🔍 Analytical queries for totals, trends, and category-wise emissions

---

## 🧰 Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL

---

## 📁 Project Structure

```text
Carbonfootprint-main/
├── index.html
├── dashboard.html
├── style.css
├── dashboard.css
├── script.js
├── dashboard.js
├── server.js
├── package.json
└── README.md
```

---

## 🗃️ Database Design

This project uses a relational schema designed to ensure data integrity, minimize redundancy, and support efficient analytics.

### Tables

1. **User**
- Stores user identity and profile-level information.

2. **Activity**
- Stores master activity definitions (for example: Car Travel, Electricity Usage, Flight).

3. **Emission_Factor**
- Stores emission conversion factors for each activity type or unit.

4. **User_Activity**
- Stores actual activity logs entered by users with quantity, date, and references to activity.

5. **Emission_Record**
- Stores calculated carbon emissions for each user activity entry.

### Relationships (Conceptual)

- One **User** can have many **User_Activity** records.
- One **Activity** can be referenced by many **User_Activity** records.
- One **Activity** can have one or many **Emission_Factor** entries (based on category/unit/time).
- Each **User_Activity** generates one corresponding **Emission_Record**.
- **Emission_Record** enables historical reporting and aggregate analysis per user.

---

## 🧩 ER Diagram

Add your ER diagram image here:

```markdown
![ER Diagram](./assets/er-diagram.png)
```

> Replace the path with your actual ER diagram file location.

---

## 🧪 Sample SQL Queries

### 1) Insert a User

```sql
INSERT INTO User (user_id, full_name, email)
VALUES (1, 'Nidhi Sharma', 'nidhi@example.com');
```

### 2) Insert a User Activity

```sql
INSERT INTO User_Activity (user_activity_id, user_id, activity_id, activity_value, activity_date)
VALUES (101, 1, 3, 12.5, '2026-03-20');
```

### 3) Fetch Activity Log for a User

```sql
SELECT ua.user_activity_id,
	   a.activity_name,
	   ua.activity_value,
	   ua.activity_date
FROM User_Activity ua
JOIN Activity a ON ua.activity_id = a.activity_id
WHERE ua.user_id = 1
ORDER BY ua.activity_date DESC;
```

### 4) Join with Emission Records

```sql
SELECT u.full_name,
	   a.activity_name,
	   er.emission_kg_co2,
	   ua.activity_date
FROM Emission_Record er
JOIN User_Activity ua ON er.user_activity_id = ua.user_activity_id
JOIN User u ON ua.user_id = u.user_id
JOIN Activity a ON ua.activity_id = a.activity_id
WHERE u.user_id = 1;
```

### 5) Aggregate: Total Emission by User

```sql
SELECT u.user_id,
	   u.full_name,
	   SUM(er.emission_kg_co2) AS total_emission_kg_co2
FROM Emission_Record er
JOIN User_Activity ua ON er.user_activity_id = ua.user_activity_id
JOIN User u ON ua.user_id = u.user_id
GROUP BY u.user_id, u.full_name
ORDER BY total_emission_kg_co2 DESC;
```

### 6) Aggregate: Category-wise Emissions

```sql
SELECT a.activity_category,
	   SUM(er.emission_kg_co2) AS category_emission
FROM Emission_Record er
JOIN User_Activity ua ON er.user_activity_id = ua.user_activity_id
JOIN Activity a ON ua.activity_id = a.activity_id
GROUP BY a.activity_category
ORDER BY category_emission DESC;
```

---

## ⚙️ Installation & Setup

Follow these steps to run the existing project implementation (without modifying source structure):

1. Clone the repository

```bash
git clone <your-repository-url>
cd Carbonfootprint-main
```

2. Install backend dependencies

```bash
npm install
```

3. Configure MySQL database
- Create a MySQL database for the project.
- Create required tables: User, Activity, Emission_Factor, User_Activity, Emission_Record.
- Ensure database connection settings match your local MySQL configuration used by the existing backend.

4. Start the backend server

```bash
node server.js
```

5. Open frontend
- Open `index.html` in a browser (or use your local static server setup).
- Navigate to the dashboard page as implemented.

---

## 🚀 Usage

- Enter or track user activities through the web interface.
- Store activity details in the database through backend APIs.
- Calculate carbon emissions using mapped emission factors.
- View dashboard-level summaries and records.
- Run SQL queries for deeper reporting and DBMS analysis.

---

## 🔮 Future Scope

- Add authentication and role-based access for multi-user environments.
- Introduce monthly/weekly trend analytics and benchmark comparisons.
- Add data visualization enhancements for category-wise emission trends.
- Support goal setting, recommendations, and reduction tracking.
- Enable CSV/PDF report export for academic and compliance use.
- Extend architecture for scalability with modular services and API versioning.
- Prepare deployment-ready roadmap for cloud hosting and production-grade monitoring.
- Integrate AI-assisted suggestions for personalized sustainability actions.

---

## 👥 Contributors

- Contributor 1 - Yash Patil
- Contributor 2 - Nidhi Nikam
- Contributor 3 - Vedant Sawant

---

## 📄 License

This project is developed for academic purposes as part of a Semester 4 DBMS Mini Project.

You may add a standard open-source license (for example, MIT) if required by your institution.