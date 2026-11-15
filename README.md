This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


==========================================
# Survey Application

## Project Overview

This project is a web-based Survey Application developed using **Next.js, React, TypeScript and CSS**.

The application allows users to complete and submit a survey through a user-friendly interface.

Development is being approached in two phases:

1. **Frontend Development:** Building the survey interface, handling user input, form validation and submission.
2. **Backend Development:** To be implemented later. This will handle data storage, API integration and server-side processing.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | React framework used to build the application |
| React | Building reusable user interface components |
| TypeScript | Adding static typing to JavaScript |
| CSS | Styling and designing the application |
| Git | Version control |
| GitHub | Hosting and managing source code |
| GitHub Actions | Automating code checks and builds |

---

# 1. Project Setup

## Step 1: Install Prerequisites

Before starting, ensure the following tools are installed:

- Node.js (LTS version)
- npm (Node Package Manager)
- Visual Studio Code
- Git
- GitHub account

Verify the installations by running:

```bash
node -v
npm -v
git --version
```

## Step 2: Create the Next.js Project

I started the project using Next.js through its project creation command.

```bash
npx create-next-app@latest survey-app
```

During the setup, I selected the following configuration:

- TypeScript: Yes
- ESLint: Yes
- CSS: Standard CSS
- App Router: Yes
- Source directory: Based on project preference
- Import alias: Default

Navigate into the project directory:

```bash
cd survey-app
```

## Step 3: Open the Project in Visual Studio Code

```bash
code .
```

This opens the project in Visual Studio Code, where I can manage the application files and write the frontend code.

## Step 4: Start the Development Server

Run the following command:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

The development server allows me to see changes immediately while working on the application.

---

# 2. Frontend Development

The first development phase focuses on creating the survey interface and implementing its functionality.

## Step 1: Understand the Project Structure

The main files used in the frontend are:

```text
survey-app/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── public/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

### Understanding the Files

**page.tsx**

This is the main page of the application. It contains the survey interface, form fields, buttons and React functionality.

**layout.tsx**

Defines the shared layout of the application. It provides the root HTML structure and wraps the pages.

**globals.css**

Contains the global styling used throughout the application, including fonts, colours, spacing and general layout.

**public/**

Stores static assets such as images, icons and other files used by the application.

**package.json**

Contains project dependencies and scripts used to run, build and manage the application.

## Step 2: Build the Survey Interface

I created the survey interface inside `page.tsx` using React and JSX.

The interface includes:

- Survey heading and introduction.
- Input fields for collecting user information.
- Questions and answer options.
- Submit button.
- Submission confirmation message.

## Step 3: Implement React Functionality

React's `useState` hook is used to manage the application's state.

For example:

```tsx
const [submitted, setSubmitted] = useState(false);
```

This tracks whether the survey has been submitted.

I also implemented a form submission function using TypeScript's `FormEvent`:

```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setSubmitted(true);
}
```

This prevents the browser's default form submission behaviour and updates the application state.

## Step 4: Style the Application

I used `globals.css` to style the survey and make it user-friendly.

The styling covers:

- Page layout.
- Survey container.
- Form inputs.
- Buttons.
- Typography.
- Colours and spacing.
- Responsive design.

## Step 5: Test the Frontend

Run the development server:

```bash
npm run dev
```

Manually test the following:

- The survey loads correctly.
- All questions and input fields are displayed.
- Users can enter their responses.
- Required fields are validated.
- The submit button works.
- A confirmation message appears after submission.
- The layout works on different screen sizes.

---

# 3. Git and GitHub Setup

Git is used to track changes made to the project, while GitHub hosts the repository remotely.

## Step 1: Initialise Git

```bash


```
## create a branch for the frond end
```bash
git switch -c frontend-development
```

## Step 2: Add Project Files

```bash
git add .
```


## Step 3: Commit Changes

```bash
git commit -m "Initial survey frontend implementation"
```

## Step 4: Connect to GitHub

Create a new repository on GitHub.

Connect the local project to the remote repository:

```bash
git remote add origin <repository-url>
```

## Step 5: Push the Project to GitHub

```bash
git branch -M main
git push -u origin main
```


Step 6: Your daily Git workflow
Whenever you make changes, use:
# Check your changes
git status

# Stage your changes
git add .

# Commit your changes
git commit -m "Build survey frontend"

# Push changes to GitHub
git push

## Cloning the Project

To download the repository onto another machine:

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project directory
cd <project-directory>

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

# 4. GitHub Actions – Continuous Integration (CI)

GitHub Actions is used to automate development tasks whenever code is pushed to GitHub or a pull request is created.

For this project, GitHub Actions will automatically:

1. Check out the latest source code.
2. Set up the Node.js environment.
3. Install project dependencies.
4. Run ESLint to identify code-quality issues.
5. Build the Next.js application to identify build errors.

## Step 1: Create the GitHub Actions Directory

Inside the project root, create the following directory structure:

```text
.github/
└── workflows/
    └── frontend-ci.yml
```

## Step 2: Configure the GitHub Actions Workflow

Inside `frontend-ci.yml`, add:

```yaml
name: Frontend CI

on:
  push:
    branches:
      - main
      - develop

  pull_request:
    branches:
      - main
      - develop

jobs:
  build:
    name: Build and Validate Frontend
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set Up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Build Application
        run: npm run build
```

*Note: Node.js 22 is used as the CI environment. Ensure it is compatible with the Node.js version supported by your Next.js project.*

## Step 3: Push the Workflow to GitHub

```bash
git add .
git commit -m "Add GitHub Actions frontend CI workflow"
git push origin main
```

## Step 4: Verify the Workflow

1. Open the project repository on GitHub.
2. Navigate to the **Actions** tab.
3. Select **Frontend CI**.
4. Check the workflow execution.
5. Confirm that all steps complete successfully.

<end of writing block>

---

# 5. Backend Development (Coming Soon)

The backend phase will be introduced after completing the frontend.

Planned backend functionality:

- Create backend APIs.
- Handle survey submissions.
- Validate incoming data.
- Store survey responses in a database.
- Connect the frontend to the backend.
- Handle errors and API responses.
- Implement appropriate security measures.

# 6. Future Improvements

- Add automated frontend tests.
- Add backend integration.
- Implement database storage.
- Introduce automated deployment (CD).
- Improve form validation.
- Add reporting and survey response analytics.

---

## Final Development Workflow

<box border radius="lg" padding={3} gap={3}>
  <list connector="solid" marker="number" gap={2}>
    <list-item>
      **Project Setup**

      Create Next.js application and configure dependencies.
    </list-item>
    <list-item>
      **Frontend Development**

      Build survey interface using React, TypeScript and CSS.
    </list-item>
    <list-item>
      **Frontend Testing**

      Test form fields, validation and submission.
    </list-item>
    <list-item>
      **Git and GitHub**

      Commit changes and push code to the repository.
    </list-item>
    <list-item>
      **GitHub Actions**

      Automatically run linting and production builds.
    </list-item>
    <list-item>
      **Backend Development**

      Implement APIs, database and frontend integration.
    </list-item>
  </list>
</box>

**Current development focus:** Frontend implementation and GitHub Actions CI. Backend development will follow once the frontend is completed.






package.json
  // local dependencies contains name of the libraries installed 
  "devDependencies": 
    // glocal dependencies contains name of the libraries installed 
 
  
  "dependencies": 