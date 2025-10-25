# Project Manager

A full-stack project management application built with .NET Core Web API and React. This application provides user authentication, project management, and task tracking capabilities with a modern, responsive web interface.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **Project Management**: Create, read, update, and delete projects with descriptions
- **Task Management**: Add, edit, and delete tasks within projects
- **Task Status Tracking**: Mark tasks as completed or pending
- **User-Specific Data**: Each user can only access their own projects and tasks
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Dynamic project and task management
- **Secure API**: Protected endpoints with JWT authorization

## 🌐 Live Application

- **Frontend**: [https://mini-project-manager-lake.vercel.app/register](https://mini-project-manager-lake.vercel.app)
- **Backend API**: [https://mini-project-manager-wr5q.onrender.com](https://mini-project-manager-wr5q.onrender.com)

## 🏗️ Architecture

The project consists of two main components:

### Backend (.NET Core Web API)

- **Framework**: .NET Core 8.0 with Entity Framework Core
- **Database**: SQLite with Entity Framework migrations
- **Authentication**: JWT Bearer tokens with BCrypt password hashing
- **Port**: 5000 (configurable via launchSettings.json)

### Frontend (React Application)

- **Framework**: React 19 with TypeScript
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks with localStorage for token persistence
- **HTTP Client**: Axios with JWT token authentication

## 📋 Data Models

### User Model

```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public List<Project> Projects { get; set; }
}
```

### Project Model

```csharp
public class Project
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public List<TaskItem> Tasks { get; set; }
}
```

### Task Model

```csharp
public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public int ProjectId { get; set; }
    public Project? Project { get; set; }
}
```

## 🛠️ Installation & Setup

### Prerequisites

- .NET Core 8.0 SDK
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd project-manager/backend
```

2. Restore NuGet packages:

```bash
dotnet restore
```

3. Update the database:

```bash
dotnet ef database update
```

4. Run the application:

```bash
dotnet run
```

The API will be available at `http://localhost:5089`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd project-manager/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`

Register a new user.

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`

Login with existing credentials.

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Project Endpoints (Requires Authentication)

#### GET `/api/projects`

Get all projects for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "id": 1,
    "title": "My Project",
    "description": "Project description",
    "createdAt": "2024-01-15T10:30:00Z",
    "userId": 1,
    "tasks": []
  }
]
```

#### POST `/api/projects`

Create a new project.

**Request Body:**

```json
{
  "title": "New Project",
  "description": "Project description"
}
```

#### PUT `/api/projects/{id}`

Update an existing project.

**Request Body:**

```json
{
  "title": "Updated Project",
  "description": "Updated description"
}
```

#### DELETE `/api/projects/{id}`

Delete a project.

### Task Endpoints (Requires Authentication)

#### GET `/api/tasks/project/{projectId}`

Get all tasks for a specific project.

#### POST `/api/tasks`

Create a new task.

**Request Body:**

```json
{
  "title": "New Task",
  "dueDate": "2024-01-20T00:00:00Z",
  "projectId": 1
}
```

#### PUT `/api/tasks/{id}`

Update an existing task.

**Request Body:**

```json
{
  "title": "Updated Task",
  "dueDate": "2024-01-25T00:00:00Z",
  "isCompleted": true
}
```

#### DELETE `/api/tasks/{id}`

Delete a task.

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt for secure password storage
- **Authorization**: User-specific data access control
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs

## 🎯 Usage Examples

### User Registration and Login

1. Navigate to the application
2. Click "Register" to create a new account
3. Fill in username and password (minimum 6 characters)
4. After successful registration, you'll be automatically logged in

### Project Management

1. **Create Project**: Click "Add Project" and enter title and description
2. **Edit Project**: Click the edit button to modify project details
3. **Delete Project**: Click the delete button to remove a project
4. **View Projects**: All your projects are displayed on the dashboard

### Task Management

1. **View Project Details**: Click on a project to see its tasks
2. **Add Task**: Enter task title and due date
3. **Mark Complete**: Check the checkbox to mark tasks as completed
4. **Edit Task**: Click the edit button to modify task details
5. **Delete Task**: Click the delete button to remove tasks

### Project Status Display

The application automatically displays project completion status:

- **Project Completed**: Shows when all tasks are marked as completed
- **Tasks Pending**: Shows when some tasks are still pending/incomplete
- **No Status**: Displays nothing when no tasks exist for the project

## 🧪 Testing

### Backend Testing

Test the API endpoints using tools like Postman or curl:

**Local Testing:**

```bash
curl -X POST http://localhost:5089/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

**Live API Testing:**

```bash
curl -X POST https://mini-project-manager-wr5q.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

**Login:**

```bash
curl -X POST https://mini-project-manager-wr5q.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

**Create Project (with token):**

```bash
curl -X POST https://mini-project-manager-wr5q.onrender.com/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Test Project", "description": "Test Description"}'
```

### Frontend Testing

```bash
npm test
```

## 🚀 Deployment


### Backend Deployment

The .NET Core application can be deployed to:

- Azure App Service
- AWS Elastic Beanstalk
- Docker containers
- Any hosting platform supporting .NET Core

### Frontend Deployment

Build the production version:

```bash
npm run build
```

The built files will be in the `build/` directory, ready for deployment to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## 🔧 Configuration

### Environment Variables

- `Jwt:Key`: JWT signing key (required for production)
- `Jwt:Issuer`: JWT issuer (required for production)
- `ConnectionStrings:DefaultConnection`: Database connection string

### Database Configuration

The application uses SQLite by default. For production, consider:

- SQL Server
- PostgreSQL
- MySQL

## 📝 Dependencies

### Backend Dependencies

- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.Sqlite
- BCrypt.Net-Next

### Frontend Dependencies

- React 19.2.0
- React Router DOM 7.9.4
- TypeScript 4.9.5
- Tailwind CSS 3.4.18
- Axios 1.12.2

## 🐛 Known Issues

- No password strength validation on the frontend
- No email verification for user registration
- No password reset functionality


