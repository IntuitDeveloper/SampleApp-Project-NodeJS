# QuickBooks Projects API

A Node Js App for managing QuickBooks Projects using GraphQL and the Intuit SDK.

## Features

- **Complete CRUD Operations**: Full project lifecycle management
  - ✅ **Create**: Add new projects with comprehensive details
  - ✅ **Read**: Get individual projects or filter with advanced criteria
  - ✅ **Update**: Modify project details (name, description, status, dates, priority, completion rate, etc.)
  - ✅ **Delete**: Remove projects with confirmation
- **GraphQL Integration**: Uses QuickBooks GraphQL API for efficient data operations
  - **Single Project Query**: `projectManagementProject` for retrieving individual projects
  - **Filtered Projects Query**: `projectManagementProjects` with advanced filtering and pagination
  - **Update Mutations**: `projectManagementUpdateProject` with comprehensive field support
  - **Delete Mutations**: `projectManagementDeleteProject` with proper response handling
- **Advanced Filtering**: Query projects by multiple criteria including date ranges, status, priority
- **Intuit Node JS SDK**: Built with official Intuit Node JS SDK for QuickBooks API v3
- **OAuth 2.0**: Secure authentication with QuickBooks Online with configurable scopes
- **RESTful API**: Clean REST endpoints for easy integration

## Scope and Limitations

### ✅ **Currently Implemented**
This API focuses **exclusively on Project Management** using QuickBooks GraphQL API:
- ✅ **Project CRUD Operations**: Create, Read, Update, Delete projects
- ✅ **Project Filtering**: Advanced filtering by date, status, customer, etc.
- ✅ **Project Management**: Complete project lifecycle management

### ❌ **NOT Implemented (Future Enhancements)**
The following transaction-to-project linking use cases are **NOT currently implemented**:

- ❌ **Invoice Management**: Create invoices and link them to projects
- ❌ **Estimate Management**: Create estimates and associate them with projects  
- ❌ **Bill Management**: Create bills and attach them to projects
- ❌ **Sales Receipt Management**: Create sales receipts and link them to projects

**Note**: While QuickBooks GraphQL API supports these operations through `ProjectRef` linking in transaction line items, this implementation focuses solely on project management. Transaction management would require using QuickBooks Node JS SDK for creating Invoice, estimate, bill and sales receipt with corresponding service implementations.

## API Endpoints

### Projects
- `GET /api/quickbook/project/:id` - **Get single project by ID** (uses `projectManagementProject` query)
- `GET /api/quickbook/project/info` - **Get projects with advanced filtering** (uses `projectManagementProjects` query)
- `POST /api/quickbook/project` - Create a new project
- `PUT /api/quickbook/project` - Update an existing project
- `DELETE /api/quickbook/project/:id` - Delete a project

### OAuth
- `GET /api/auth/login` - Initiate OAuth authorization with QuickBooks
- `GET /api/auth/callback` - Handle OAuth callback from QuickBooks
- `GET /api/auth/retrieveToken` - Retrieve Token

## Configuration

Create a `.env` file with your QuickBooks app credentials:

```bash
PORT=3000

CLIENT_ID: PUT_YOUR_CLIENT_ID_HERE
CLIENT_SECRET: PUT_YOUR_CLIENT_SECRET_HERE
ENVIRONMENT: PUT_THE_ENVIRONMENT_HERE
REDIRECT_URI: http://localhost:3000/api/auth/
```

### Required OAuth Scopes

The API requires the following OAuth scopes for full functionality:

- `com.intuit.quickbooks.accounting` - Access to QuickBooks accounting data
- `project-management.project` - **Required for Projects API access**
- `openid`, `profile`, `email`, `phone`, `address` - User identity information

> **Note**: The `project-management.project` scope is essential for accessing QuickBooks Projects GraphQL API endpoints.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure QuickBooks App**
   - Create a QuickBooks app at https://developer.intuit.com
   - Update `.env` with your app credentials

3. **Run the Application**
   ```bash
   node index.js
   ```

4. **Complete OAuth Authentication**
   - Navigate to `http://localhost:3000`
   - Click on the 'Connect to Quickbooks' Button
   - Complete the QuickBooks OAuth flow
   - It Navigates you back to the Home Page where you can now have access to the Project UI.

5. **Test the API**
   - Navigate to `http://localhost:3000` for the web interface
   - Use the UI to perform the various operations.

## Authentication

This API requires OAuth 2.0 authentication with QuickBooks Online. The authentication flow includes:

1. **OAuth Authorization**: Visit `/api/auth/login` to start the flow
2. **Scope Configuration**: Configurable scopes
3. **Project Permissions**: Requires `project-management.project` scope for Projects API access

### Example OAuth Flow

```bash
# 1. Initiate OAuth
curl "http://localhost:3000/api/auth/login"

# 2. Complete authorization in browser, then test API
curl "http://localhost:3000/api/quickbook/project/123"
```

## API Usage Examples

### 1. Get Single Project by ID

```bash
curl -X GET "http://localhost:3000/api/quickbook/project/635" \
  -H "accept: application/json"
```

**GraphQL Query Used:**
```graphql
query projectManagementProject($id: ID!) {
  projectManagementProject(id: $id) {
    name,
    status,
    description,
    startDate,
    dueDate,
    account { id },
    customer { id }
  }
}
```

### 2. Get Projects with Advanced Filtering

```bash
# Date range filtering example
curl -X GET "http://localhost:3000/api/quickbook/project/info?first=5&dueDateFrom=2024-04-01T18:47:25.123456789-07:00&dueDateTo=2024-12-05T18:47:25.123456789-07:00&sort=DUE_DATE_DESC" \
  -H "accept: application/json"

# Multiple filter types example
curl -X GET "http://localhost:3000/api/quickbook/project/info?types=Development,Design&statuses=ACTIVE,OPEN&customerId=1,2&active=true&first=10" \
  -H "accept: application/json"

# ID-based filtering example
curl -X GET "http://localhost:3000/api/quickbook/project/info?id=635,636,637&sort=DUE_DATE_DESC" \
  -H "accept: application/json"
```

**GraphQL Query Used:**
```graphql
query projectManagementProjects(
  $first: PositiveInt!,
  $after: String,
  $filter: ProjectManagement_ProjectFilter!,
  $orderBy: [ProjectManagement_OrderBy!]
) {
  projectManagementProjects(
    first: $first,
    after: $after,
    filter: $filter,
    orderBy: $orderBy
  ) {
    edges {
      node {
        id, name, description, type, status, dueDate, startDate, completedDate,
        assignee { id }, priority, customer { id }, account { id },
        addresses { streetAddressLine1, streetAddressLine2, streetAddressLine3, state, postalCode }
      }
    },
    pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
  }
}
```

**Filter Variables:**
```json
{
  "first": 5,
  "filter": {
    "dueDate": {
      "between": {
        "minDate": "2024-04-01T18:47:25.123456789-07:00",
        "maxDate": "2024-12-05T18:47:25.123456789-07:00"
      }
    }
  },
  "orderBy": ["DUE_DATE_DESC"]
}
```

### 3. Create New Project

```bash
curl -X POST "http://localhost:3000/api/quickbook/project" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "type": "Development",
    "status": "ACTIVE",
    "priority": 5,
    "startDate": "2024-01-15T00:00:00Z",
    "dueDate": "2024-03-15T00:00:00Z"
  }'
```

### 4. Update Existing Project

```bash
curl -X PUT "http://localhost:3000/api/quickbook/project/123" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Updated Demo Project",
    "description": "This project has been updated via API",
    "status": "IN_PROGRESS",
    "startDate": "2024-07-25T00:00:00.000Z",
    "dueDate": "2024-07-31T00:00:00.000Z",
    "accountId": "9341452781483658",
    "customerId": "1",
    "priority": 2,
    "completionRate": 75.00,
    "pinned": true
  }'
```

**GraphQL Mutation Used:**
```graphql
mutation projectManagementUpdateProject(
    $id: ID!,
    $name: String,
    $description: String,
    $status: ProjectManagement_Status,
    $startDate: DateTime,
    $dueDate: DateTime,
    $customer: ProjectManagement_CustomerInput,
    $account: ProjectManagement_CompanyInput,
    $priority: Int,
    $completionRate: Decimal,
    $pinned: Boolean
) {
    projectManagementUpdateProject(input: {
        id: $id,
        name: $name,
        description: $description,
        status: $status,
        startDate: $startDate,
        dueDate: $dueDate,
        customer: $customer,
        account: $account,
        priority: $priority,
        completionRate: $completionRate,
        pinned: $pinned
    }) {
        ... on ProjectManagement_Project {
            id, name, description, status,
            startDate, dueDate, priority,
            completionRate, pinned,
            customer { id },
            account { id }
        }
    }
}
```

### 5. Delete Project

```bash
curl -X DELETE "http://localhost:3000/api/quickbook/project/123" \
  -H "Accept: application/json"
```

**GraphQL Mutation Used:**
```graphql
mutation projectManagementDeleteProject($id: ID!) {
    projectManagementDeleteProject(input: {
        id: $id,
    }) {
        ... on ProjectManagement_Project {
            id,
            deleted
        }
    }
}
```

### 6. Get Projects Not Started (Filter Example)

```bash
# Get projects with future start dates (not started yet)
curl -X GET "http://localhost:3000/api/quickbook/project/info?startDateFrom=2024-12-01T00:00:00.000Z&startDateTo=2025-12-31T23:59:59.000Z&first=10" \
  -H "accept: application/json"
```

### Available Query Parameters for Advanced Filtering

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| **ID Filters** | | | |
| `id` | string | Filter by specific project IDs (comma-separated) | `"635,636,637"` |
| `active` | boolean | Filter by active status | `true`, `false` |
| **Date Range Filters** | | | |
| `startDateFrom` | DateTime | Filter by start date from | `2024-01-01T00:00:00Z` |
| `startDateTo` | DateTime | Filter by start date to | `2024-12-31T23:59:59Z` |
| **Other Filters** | | | |
| `customerId` | string | Filter by customer IDs (comma-separated) | `"1,2,3"` |
| `types` | string | Filter by project types (comma-separated) | `"Development,Design"` |
| `status` | string | Filter by project statuses (comma-separated) | `"ACTIVE,OPEN"` |
| `priority` | int | Minimum priority level | `1,2,3` |
| **Pagination & Sorting** | | | |
| `first` | int | Number of projects to return | `5` |
| `after` | string | Cursor for pagination | `"cursor_string"` |
| `sort` | string | Field to order by | `DUE_DATE_ASC`, `DUE_DATE_DESC` |

## Project Structure

```
├── graphql/project
│   ├── createProject.js                # GraphQL query and variables for creating projects
│   ├── deleteProject.js                # GraphQL query and variables for deleting projects
│   ├── getProjectById.js               # GraphQL query and variables for getting projects by id
│   ├── getProjectsByFilter.js          # GraphQL query and variables for getting projects by filter
│   └── updateProject.cs                # GraphQL query and variables for updating projects
├── pages/
│   ├── index.html                      # HTML for web UI
│   └── style.css                       # Styling for the UI
├── routes/
│   ├── oauth.js                        # routes for authentication flow
│   ├── project.cs                      # routes for project
├── services/                       
│   ├── auth-service.js                 # service for authentication
│   └── project-service.js              # service for project
├── env                                 # Configs
├── index.js                            # Application startup
```

## GraphQL Implementation Details

This API implements multiple GraphQL strategies for different operations:

### Queries

#### 1. Single Project Query (`projectManagementProject`)
- **Purpose**: Retrieve individual project details by ID
- **Method**: `GetProjectByIdAsync()`
- **Endpoint**: `GET /api/quickbook/project/:id`
- **GraphQL Type**: Simple query with direct field access

#### 2. Filtered Projects Query (`projectManagementProjects`)
- **Purpose**: Advanced filtering, pagination, and batch operations
- **Method**: `GetProjectsWithFilterAsync()`
- **Endpoint**: `GET /api/quickbook/project/info`
- **GraphQL Type**: Connection-based query with edges/nodes pattern
- **Features**: Multiple filter types (date ranges only - ID, status filters not supported by QuickBooks API), pagination, multiple sort options

### Mutations

#### 3. Create Project Mutation (`projectManagementCreateProject`)
- **Purpose**: Create new projects with comprehensive details
- **Method**: `CreateProjectAsync()`
- **Endpoint**: `POST /api/quickbook/project`
- **GraphQL Type**: Mutation with `ProjectManagement_CreateProjectInput` input type

#### 4. Update Project Mutation (`projectManagementUpdateProject`)
- **Purpose**: Update existing projects with comprehensive field support
- **Method**: `UpdateProjectAsync()`
- **Endpoint**: `PUT /api/quickbook/projects/:id`
- **GraphQL Type**: Mutation with inline input object
- **Supported Fields**: id, name, description, status, startDate, dueDate, customer, account, priority, completionRate, pinned

#### 5. Delete Project Mutation (`projectManagementDeleteProject`)
- **Purpose**: Delete projects with confirmation response
- **Method**: `DeleteProjectAsync()`
- **Endpoint**: `DELETE /api/projects/:id`
- **GraphQL Type**: Mutation with simple input object containing project ID
- **Response**: Returns project ID and deleted status confirmation

## Dependencies

- **GraphQL.Client** - GraphQL client for Node Js (graphql-request)
- **IntuitNodeSDK** - Official Intuit Node JS SDK for OAuth
- **Express** - Node Express

## Troubleshooting

### Common Issues

1. **"Forbidden" Error**
   - Ensure `project-management.project` scope is included in OAuth authorization

2. **"Invalid URI or environment" Error**
   - Verify `Environment` is set to `"Sandbox"` or `"Production"`
   - Check that `RedirectUri` matches your QuickBooks app configuration

3. **GraphQL Query Errors**
   - Single project queries use `projectManagementProject` (no 's')
   - Filtered queries use `projectManagementProjects` (with 's')
   - Ensure proper variable types: `ID!` for single project, `ProjectManagement_ProjectFilter!` for filtered

4. **Filter Limitations**
   - ✅ **Date Range Filters**: `startDate` filters work correctly
   - ❌ **Other Filters**: `id`, `type`, `status`, `customerId` filters are not supported by QuickBooks GraphQL schema
   - The API accepts these parameters but they will not affect the results
   - Use date range filtering as the primary filtering mechanism


### Environment Setup

- **Sandbox**: Use `qb-sandbox.api.intuit.com` endpoints
- **Production**: Use `qb.api.intuit.com` endpoints
- **Port**: Default is `3000`, configurable in `env`

## License

This project is for demonstration purposes and follows QuickBooks API terms of service.