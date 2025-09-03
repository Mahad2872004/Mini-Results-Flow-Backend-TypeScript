# Mini Results Flow - Backend API

This is the backend API for the **Mini Results Flow** project. It handles multi-input form submissions, stores user data, and computes results for dynamic result cards displayed in the React frontend.

---

## Project Overview

**Objective:**  
Provide a backend that supports a multi-card quiz experience where users:

1. Submit health and lifestyle data via a multi-input form.
2. See personalized results across six dynamic cards.
3. Finally reach a salespage card with personalized plan and CTA.

The backend generates **anonymous IDs** for submissions, validates inputs, computes results, and makes them available for the frontend to render.

---

## What I Did & How I Did It

**1. Form Submission Backend**
- Created `/api/form` endpoint using **Express.js**.
- Used **Joi** for input validation to ensure proper numeric ranges and required fields.
- Generated unique `anonymousId` for each submission using **nanoid**.
- Stored submissions in **MongoDB** via **Mongoose**.
- Added validation and clamping for numeric inputs to ensure safe and realistic values (e.g., body fat %, BMI, calorie target).

**2. Results Computation**
- Built `/api/results` endpoint to compute results based on the latest submission.
- Used a **compute service** to process inputs into meaningful labels and metrics.
- Endpoint automatically fetches the most recent submission, so frontend doesn’t need to pass an ID.
- Computed values include labels such as "Almost Healthy," "Obese," etc., based on ranges for Body Fat, BMI, Calorie Intake, etc.

**3. Middleware & Security**
- Configured **Helmet** for security headers.
- Added **CORS** configuration to allow requests from frontend.
- Used **Compression** to optimize response size.
- Integrated **Morgan** for request logging in development.
- Added custom `notFound` and `errorHandler` middleware for better error handling.

**4. Testing**
- Verified endpoints using **Postman**:
  - `POST /api/form` – submits form data.
  - `GET /api/results` – fetches computed results automatically for the latest submission.
- Ensured that invalid or out-of-range inputs are clamped to safe values.

---

## Tech Stack

- **TypeScript** 
- **Node.js** (v22+)
- **Express.js**
- **MongoDB** with **Mongoose**
- **Joi** for validation
- **Nanoid** for unique IDs
- **Helmet, CORS, Compression, Morgan** for security and performance

---


Installation

git clone <URL>

cd Server

npm install


Create a .env file:

MONGO_URI=<your-mongodb-uri>

CORS_ORIGIN=http://localhost:3000

NODE_ENV=development

PORT=5000

Running the Server

npm run dev


Server runs on: http://localhost:5000
