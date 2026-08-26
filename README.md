# MobileHub V1

## Stage 1: Create the Project and Set Up the Starter Files

### 1. Install the pnpm package

    npm install -g pnpm

### 2. Create the Next.js project

    pnpm create next-app@latest mobileHub_v1 --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

### 3. Run the project

Enter the project directory and run:

    cd mobileHub_v1
    pnpm dev

### 4. Install lucide-react

Install the `lucide-react` package for using icons:

    pnpm add lucide-react

### 5. Set up the folder structure

Delete the default `layout.tsx` and `page.tsx` files from the `src/app/` folder.

Create the `public` and `admin` directories.

Create a `layout.tsx` file inside each directory and temporarily create a `page.tsx` file inside the `public` directory.

The folder structure should look like this:

    src/
    └── app/
        ├── public/
        │   ├── layout.tsx
        │   └── page.tsx
        │
        └── admin/
            ├── layout.tsx
            └── page.tsx

---

## Stage 2: Types & Validation Layer

### 1. Install Form and Validation Packages

Install `react-hook-form`, `@hookform/resolvers`, and `zod`:

    pnpm add react-hook-form @hookform/resolvers zod

These packages will be used for:

- Form handling with `react-hook-form`
- Connecting form validation with Zod using `@hookform/resolvers`
- Schema validation using `zod`

---

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- pnpm

You can verify the installed versions using:

    node -v
    npm -v
    pnpm -v

## Running the Project

Start the development server with:

    pnpm dev

Then open the local development URL displayed in the terminal.
