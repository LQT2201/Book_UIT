# BOOK UIT 📚

**BOOK UIT** is a responsive web application designed for small bookstores. It allows customers to browse book categories, search for books, place orders, and track deliveries. The platform also includes an admin panel for managing product listings, processing orders, and handling customer data.

## Main Functionalities 🚀

-   **Book Browsing & Search**: Customers can easily browse different book categories and search for specific titles.
-   **Order Placement & Tracking**: Users can place orders and track their deliveries in real-time.
-   **Admin Panel**: Allows administrators to manage product listings, process orders, and manage customer data.
-   **Responsive Design**: Ensures an optimal user experience across desktop and mobile devices.

## Technologies 💻

-   **Frontend**:

    -   Next.js
    -   Material-UI (MUI)

-   **Backend**:

    -   Spring Boot (Gradle)

-   **Database**:

    -   MongoDB

## Setup & Installation ⚙️

### Prerequisites

-   **Node.js**: Make sure Node.js is installed for the frontend.
    [Install Node.js](https://nodejs.org/)
-   **Java 8 or later**: Required for running Spring Boot backend.
    [Install Java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
-   **MongoDB**: A NoSQL database for storing data.
    [Install MongoDB](https://www.mongodb.com/try/download/community)

### Frontend Setup

1.  Clone this repository:

    ```bash
    git clone [https://github.com/LQT2201/bookweb.git](https://github.com/LQT2201/bookweb.git)
    ```

2.  Navigate to the frontend directory:

    ```bash
    cd bookweb/IE303-FE
    ```

3.  Install the required dependencies:

    ```bash
    npm install
    ```

4.  Run the frontend development server:

    ```bash
    npm run dev
    ```

    This will start the frontend application on http://localhost:3000.

### Backend Setup (Spring Boot with Gradle)

1.  Navigate to the backend directory where the Spring Boot project is located:

2.  Ensure you have Gradle installed. If not, follow the instructions to install it:

    *(https://docs.gradle.org/current/userguide/installation.html)*

3.  Build the backend application using Gradle:

    ```bash
    gradle build
    ```

4.  Run the backend server using Gradle:

    ```bash
    gradle bootRun
    ```

    This will start the backend server on http://localhost:8080.

5.  **Make sure you have MongoDB running locally or use a cloud instance.** Configure the `application.properties` file in `backend/src/main/resources` for database connection details (e.g., MongoDB URI).
