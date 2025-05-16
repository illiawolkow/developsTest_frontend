# Spy Cat Agency (SCA) Management Application

This project is a management application for the Spy Cat Agency (SCA), allowing them to manage spy cats, missions, and targets.

## Frontend (Next.js)

(Details for the Next.js frontend will be added here once that part is developed.)

The frontend is a Next.js application for managing Spy Cats.

**Spy Cats Management Page Requirements:**
- List all spy cats.
- Form to add a new spy cat (Name, Years of Experience, Breed, Salary).
- Edit option to update a cat's Salary.
- Delete option to remove a spy cat.

### Setup and Running the Frontend

(Instructions will be provided here.)

1.  **Navigate to the frontend directory:**
    ```bash
    cd spy_cat_agency/frontend
    ```

2.  **Install dependencies:**
    If you have Node.js and npm installed, run:
    ```bash
    npm install
    ```
    Or, if you use Yarn:
    ```bash
    yarn install
    ```

3.  **Set up environment variables (optional):**
    The frontend will try to connect to the backend API at `http://localhost:8000` by default.
    If your backend runs on a different URL, create a `.env.local` file in the `frontend` directory and add:
    ```
    NEXT_PUBLIC_API_URL=http://your-backend-api-url
    ```

4.  **Run the Next.js development server:**
    ```bash
    npm run dev
    ```
    Or, if you use Yarn:
    ```bash
    yarn dev
    ```
    The application will typically be available at `http://localhost:3000`.

---

This README provides a basic outline. Further details on specific configurations, deployment, or more complex aspects would be added for a production application. 
