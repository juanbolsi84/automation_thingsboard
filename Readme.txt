## Project Description

ThingsBoard is an open-source Internet of Things (IoT) platform that provides infrastructure for data collection, processing, visualization, and management of devices and assets.
This project automates tests of business flows within the ThingsBoard application using Playwright with JavaScript.

## Project
Automated testing of ThingsBoard device management features.
Tests include both API and UI flows.

## Setup Instructions
1️⃣ Prerequisites
Before running the tests, you need the following installed on your system:

Docker Desktop: https://www.docker.com/products/docker-desktop
Docker will run a local ThingsBoard instance.

Node.js (v18 or newer): https://nodejs.org/en/download/
Node.js includes npm, the Node package manager.

Playwright browsers: Open a terminal (Command Prompt, PowerShell, or macOS Terminal) and run:
npx playwright install

This downloads the browsers (Chromium, Firefox, WebKit) that Playwright uses to run tests.

2️⃣ Clone the repository
Pick a folder on your computer where you want the project.
Open a terminal in that folder and run:
git clone <your-repo-url>
cd <your-repo-folder>

Replace <your-repo-url> with your repository URL and <your-repo-folder> with the folder name.

3️⃣ Run the complete test flow
Run the following command in the project folder:
npm run test:local


Here’s what happens automatically:
Docker starts a local ThingsBoard instance.
Playwright runs all automated tests against this local instance.
After tests finish, Docker stops the ThingsBoard container.
You don’t need to start or stop ThingsBoard manually — it’s all handled by this single command.

4️⃣ Visual Flow
 ┌──────────────┐       ┌───────────────┐       ┌───────────────┐
 │   Docker     │──────▶│ ThingsBoard    │──────▶│ Playwright     │
 │ Desktop      │       │ Local Instance │       │ Tests          │
 └──────────────┘       └───────────────┘       └───────────────┘
       ▲                                          │
       │                                          ▼
       └───────────── Stops container after tests ┘

## Notes
Tests use both Playwright API & UI flows.
Custom waits are implemented to handle asynchronous table updates.
Tenant credentials: tenant@thingsboard.org / tenant
ThingsBoard local instance URL: http://localhost:8080
Test Plan and Bug Reports can be found inside /Additional Resources