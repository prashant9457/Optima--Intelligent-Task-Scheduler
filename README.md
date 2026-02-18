# Optima — Intelligent Task Scheduler

Optima is a high-end, professionally engineered task scheduling application designed to optimize project workflows based on varied algorithm protocols. It features a premium **Luxury Obsidian** UI with a permanent dark aesthetic and precise reactive logic.

---

## 🚀 Quick Start Guide

Follow these steps to set up Optima on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- **Java 17** or higher
- **Node.js** (v18+) & **npm**
- **PostgreSQL** (v14+)
- **Maven**: You can use the included `./mvnw` wrapper, or install it manually:
  - **Download**: Get the "Binary base zip" from the [Official Maven Website](https://maven.apache.org/download.cgi).
  - **Setup**: Unzip it to a directory (e.g., `D:\apache-maven-3.9.12`).
  - **Locate**: The executable is found at `[Your-Path]\bin\mvn.cmd` (on Windows). 
  - *Example path for manual execution:* `D:\lenovo\downloads\apache-maven-3.9.12\bin\mvn.cmd`

### 2. Database Configuration (Critical)
Optima requires a PostgreSQL database.

1.  **Create the Database**:
    Open your PostgreSQL terminal (psql) or a tool like pgAdmin and run:
    ```sql
    CREATE DATABASE promanage;
    ```
    *(Note: The internal service uses 'promanage' as the default identifier for compatibility).*

2.  **Configure Credentials**:
    Edit `src/main/resources/application.properties` with your local database username and password:
    ```properties
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    ```

### 3. Backend Setup (Spring Boot)
1.  Navigate to the project root directory.
2.  Run the backend using the Maven wrapper:
    ```bash
    ./mvnw clean spring-boot:run
    ```
    *Alternatively, use your manual Maven installation:*
    ```bash
    & "D:\Path\To\Maven\bin\mvn.cmd" spring-boot:run
    ```
    *The API will start at:* `http://localhost:8080`
    *Swagger Documentation:* `http://localhost:8080/swagger-ui.html`

### 4. Frontend Setup (Vite + React)
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The UI will open at:* `http://localhost:5173`

---

## 💾 Technical Schema
While Hibernate handles table creation automatically (`ddl-auto=update`), here is the manual schema for reference:

```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    deadline INTEGER NOT NULL,          -- Days until expiration
    expected_revenue NUMERIC(12, 2),    -- Projected profit
    status VARCHAR(50) DEFAULT 'PENDING', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

---

## 🧠 Core Systems

### 1. Protocol Intelligence (Simulation)
The dashboard features an **Intelligence: Yield Simulation** panel. This system runs all available algorithms against the current queue in real-time to predict which one will yield the highest profit *before* you execute the batch.

### 2. Scheduling Strategies
- **Greedy (Recommended)**: Optimizes for maximum revenue while respecting all deadlines.
- **EDF (Earliest Deadline First)**: Prioritizes urgency above all else.
- **Priority**: Sorts strictly by revenue magnitude.
- **FCFS**: Standard queue fairness (First Come, First Served).

### 3. Execution Constraints
- **Batch Limit**: The system processes exactly **5 projects** per execution slot to ensure operational focus.
- **Strategy Pattern**: Protocols can be swapped instantly via the dashboard without a server restart.

---

## 🎨 Design Language: "Luxury Obsidian"
The interface implements a high-end dark-only environment:
- **Foundations**: Ebonized Slate and Deep Void surfaces.
- **Texture**: High-fidelity grey noise overlay for a tactile, matte feel.
- **Lighting**: Razor-thin reflective borders ("Gloss Edges") that simulate light on polished metal.
- **Typography**: Inter & DM Sans calibrated for maximum pro-grade legibility.
