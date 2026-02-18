# Optima: Intelligent Task Scheduler

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

**Optima** is an enterprise-grade project scheduling engine designed to maximize revenue and optimize workflow efficiency. Built with a robust **Spring Boot** backend and a high-performance **React** frontend, it leverages the **Strategy Design Pattern** to allow runtime switching between different scheduling algorithms.

The interface features an **"Arctic Minimalist"** design language—clean, precise, and professional.

---

## 🚀 Key Features

### 🧠 Intelligent Scheduling Algorithms
The core engine supports multiple scheduling strategies, hot-swappable at runtime:
*   **Greedy (Revenue-Deadline)**: *Recommended*. Sorts by revenue and schedules as late as possible to free up early slots for tighter deadlines. Maximizes total revenue.
*   **Priority (Highest Revenue)**: *Simple*. strict revenue-first approach. Good for loose deadlines.
*   **EDF (Earliest Deadline First)**: *Urgent*. Prioritizes the most time-critical tasks. Minimizes missed deadlines.
*   **FCFS (First Come, First Served)**: *Fair*. The classic queue model based on arrival time.

### 📊 Real-Time Analytics
*   **Yield Analytics**: Interactive Area Chart visualizing revenue trends over the last 30 days.
*   **Live Metrics**: Instant updates for Weekly/Monthly Yield and Project Completion counts.
*   **Execution Stream**: visualizes the computed schedule before you commit to execution.

### 🎨 Modern UI/UX
*   **Arctic Minimalism**: A cold, rational aesthetic with frosted glass effects (backdrop-filter).
*   **Responsive Dashboard**: A 3-column layout optimized for desktop operations.
*   **Archive View**: Detailed history of all completed and verified projects.

---

## 🛠️ Technology Stack

### Backend (Server)
*   **Framework**: Spring Boot 3.2.2
*   **Language**: Java 17
*   **Database**: PostgreSQL
*   **ORM**: Spring Data JPA / Hibernate
*   **API Documentation**: SpringDoc OpenAPI (Swagger UI)

### Frontend (Client)
*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Custom CSS (Glassmorphism & CSS Variables)
*   **Visualization**: Recharts
*   **HTTP Client**: Axios

---

## ⚙️ Prerequisites

Before running the application, ensure you have the following installed:
*   **Java Development Kit (JDK) 17** or higher
*   **Node.js 18+** and **npm**
*   **PostgreSQL** (running locally)

---

## 📥 Installation & Setup

### 1. Database Setup
Create a PostgreSQL database named `optima`.
```sql
CREATE DATABASE optima;
```
*Note: The application is configured to use the default `postgres` user with password `945713`. You can modify these credentials in `src/main/resources/application.properties`.* 

**Important:** By default, the application is configured to connect to a database named `promanage` for backward compatibility. To use the new `optima` database, update the `spring.datasource.url` property in `src/main/resources/application.properties`.

### 2. Backend Setup
Navigate to the root directory and run the Spring Boot application using the Maven Wrapper.

**Windows:**
```powershell
./mvnw spring-boot:run
```

**Mac/Linux:**
```bash
./mvnw spring-boot:run
```

The server will start on `http://localhost:8080`.
*   **Swagger API Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory, install dependencies, and start the dev server.

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port shown in your terminal, e.g., 5174 if 5173 is busy).

**Running Status:**
*   The Backend is currently running in one terminal (port 8080).
*   The Frontend is currently running in another terminal (port 5174).
*   The application logs are viewable in `app_utf8.log` and `frontend_utf8.log`.

---

## 📖 Usage Guide

1.  **Enqueue Projects**: Use the "Enqueue Asset" form on the dashboard to add new projects with a Title, Deadline (in days from today), and Expected Revenue.
2.  **Select Strategy**: Use the "Algorithm Protocol" panel to switch between scheduling strategies (Greedy, Priority, etc.). The system will instantly recalculate the optimal schedule.
3.  **Review Schedule**: Check the "Execution Stream" panel to see which projects are scheduled for which days.
4.  **Execute**: Click **"Authorize & Execute"** to commit the schedule.
    *   Scheduled projects will be marked as `COMPLETED`.
    *   Revenue will be added to your total stats.
    *   The "Yield Analytics" graph will update.
5.  **View History**: Switch to the "Archive" tab to view a table of all completed projects.

---

## 📂 Project Structure

```
optima-scheduler/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── App.tsx           # Main Dashboard Logic
│   │   ├── App.css           # Global Styles & Theme
│   │   └── ...
│   ├── vite.config.js        # Vite Configuration
│   └── ...
├── src/                      # Java Backend
│   ├── main/java/com/optima
│   │   ├── config/           # App Configuration (CORS, Data Seeding)
│   │   ├── controller/       # REST API Endpoints
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # Database Entities
│   │   ├── exception/        # Global Exception Handling
│   │   ├── repository/       # JPA Repositories
│   │   ├── service/          # Business Logic
│   │   ├── strategy/         # Scheduling Algorithms (Strategy Pattern)
│   │   └── OptimaApplication.java # Main Class
│   └── main/resources/
│       └── application.properties # App & DB Config
├── pom.xml                   # Maven Dependencies
└── README.md                 # Project Documentation
```

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

**© 2026 Optima Systems**
