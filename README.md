# Narco: Chemical Field Test Platform

A secure, full-stack web platform and image analysis pipeline designed for capturing, processing, and authenticating chemical test cards and evidence securely from the field.

## 🚀 Features

- **Live Camera Integration:** Native HTML5 video capture for seamlessly scanning test cards on mobile and desktop devices.
- **Advanced Image Pipeline (`core`):** Real-time colour maths (CIEDE2000), homography/warping algorithms, and quality assessment.
- **Cryptographic Integrity:** Built-in hashing, signing, canonicalization, and strict record verification to ensure evidence cannot be tampered with.
- **Evidence Vault:** A beautiful, responsive dashboard to view, manage, and verify test certificates securely.

## 🏗️ Architecture & Tech Stack

This project is structured as a **Monorepo** using npm workspaces. 

- **`apps/web`**: Frontend built with **React**, **Vite**, and **Tailwind CSS**. Features a polished design system and dynamic UI/UX.
- **`apps/server`**: High-performance backend powered by **Fastify**, using **Drizzle ORM** with **SQLite** for secure data storage.
- **`packages/core`**: The isolated engine that handles all the heavy lifting (colour mathematics, integrity hashing, synthetic pipeline).

## 🛠️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vshriwas051-code/drug-field-test.git
   cd drug-field-test
