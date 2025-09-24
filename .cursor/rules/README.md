# Cursor Rules for Bihar Election Analysis Dashboard

This directory contains Cursor Rules that help the AI understand the project structure, coding standards, and development patterns.

## Rule Files

### 1. `project-structure.mdc`
- **Always Applied**: Yes
- **Purpose**: Provides overview of project architecture and key components
- **Covers**: Authentication system, file organization, main entry points

### 2. `typescript-standards.mdc`
- **Applied To**: `*.ts`, `*.tsx` files
- **Purpose**: TypeScript coding standards and conventions
- **Covers**: Code style, type definitions, component standards

### 3. `authentication.mdc`
- **Applied To**: Manual application
- **Purpose**: Authentication system guidelines and patterns
- **Covers**: Login system, user management, role-based access

### 4. `component-patterns.mdc`
- **Applied To**: `src/components/**/*.tsx` files
- **Purpose**: Component development patterns and standards
- **Covers**: Component structure, UI standards, state management

### 5. `styling-guidelines.mdc`
- **Applied To**: `*.css`, `*.tsx`, `*.ts` files
- **Purpose**: Styling and design system guidelines
- **Covers**: Tailwind CSS usage, dark mode, responsive design

### 6. `development-workflow.mdc`
- **Applied To**: Manual application
- **Purpose**: Development workflow and best practices
- **Covers**: Project setup, commands, code quality, deployment

### 7. `state-management.mdc`
- **Applied To**: Manual application
- **Purpose**: State management patterns and Redux guidelines
- **Covers**: Redux store structure, authentication state, serialization

### 8. `nextjs-patterns.mdc`
- **Applied To**: `src/app/**/*.tsx`, `src/app/**/*.ts` files
- **Purpose**: Next.js App Router patterns and conventions
- **Covers**: App router structure, layouts, client/server components

## How to Use

These rules are automatically applied based on their configuration:
- **Always Applied**: Rules that apply to every request
- **File-based**: Rules that apply to specific file types
- **Manual**: Rules that can be referenced when needed

## Key Project Features

- **Authentication**: Unique ID-based login system
- **User Management**: SUPER ADMIN can create/manage users
- **Role-Based Access**: Different roles with specific permissions
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Dark Mode**: Theme switching support
- **Protected Routes**: Automatic authentication checks

## Technology Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4.0
- **State**: Redux Toolkit + React Context
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: ECharts
