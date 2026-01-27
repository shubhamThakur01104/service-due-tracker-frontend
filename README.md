# HVAC Service Tracker - Comprehensive Management System

A modern web application built with React and Node.js to help HVAC business owners efficiently track and manage customer units, service schedules, and maintenance workflows.

## Architecture Overview

### Backend (Node.js + Express + MongoDB)
- RESTful API with comprehensive CRUD operations for customers and HVAC units
- MongoDB database with proper data modeling and relationships
- Automated service date calculations and overdue status determination
- Robust file import functionality supporting Excel (.xlsx/.xls) and CSV formats
- Advanced pagination with customizable page sizes
- Precise overdue day calculations for accurate urgency assessment
- Customer-unit relationship management with data population
- API response standardization with consistent data structures

### Frontend (React + Mantine UI)
- Modern React application with responsive design and component-based architecture
- Interactive dashboard with real-time service status monitoring
- Comprehensive customer and unit management interfaces
- Advanced filtering by service due dates and customer information
- Intuitive forms for adding/editing customers and units
- Bulk import functionality with Excel/CSV file support
- Professional pagination controls with customizable page sizes
- Urgency dashboard showing real-time status summaries
- Detailed modal views for unit and customer information
- Clear visual indicators for service status with color-coded badges
- "Days Overdue" column for immediate visibility of urgent services
- Customer detail pages with comprehensive information and unit listings
- Clickable navigation between related entities (customers ↔ units)
- Consistent styling with Tailwind CSS and Mantine UI components
- Real-time notifications based on actual data showing overdue/due soon units
- Responsive design optimized for desktop and mobile devices

## Data Model

### Customer Entity
```javascript
{
  _id: ObjectId,               // Unique customer identifier
  name: String,                // Customer full name
  phone: String,               // Contact phone number
  email: String,               // Email address (optional)
  address: String,             // Physical address (optional)
  createdAt: Date,             // Creation timestamp
  updatedAt: Date              // Last update timestamp
}
```

### Unit Entity
```javascript
{
  _id: ObjectId,               // Unique unit identifier
  customerId: ObjectId,        // Reference to customer
  displayName: String,         // Unit display name/identifier
  type: String,                // Unit type (AC, Heater, Machine, Generator)
  lastServiceDate: Date,       // When last serviced
  nextServiceDate: Date,       // Next scheduled service date
  serviceIntervalDays: Number, // Days between services
  createdAt: Date,             // Creation timestamp
  updatedAt: Date              // Last update timestamp
}
```

## Core Logic

A unit is considered **OVERDUE** when:
```
today > next_service_date
```

Status classifications:
- **OVERDUE**: Past due date (next_service_date < today) - Displayed in red
- **DUE TODAY**: Service is due on the current date - Displayed in orange
- **DUE SOON**: Due within next 7 days - Displayed in yellow
- **SCHEDULED**: Due more than 7 days away - Displayed in green

Units are sorted by urgency with overdue items appearing first, followed by due today, due soon, and scheduled items.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional):
   ```env
   MONGODB_URI=mongodb://localhost:27017/hvac-service
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev  # Development with nodemon
   # or
   npm start    # Production
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## Features

### Core Functionality
- ✅ **Customer Management**: Add, edit, view, and delete customer information
- ✅ **Unit Management**: Comprehensive HVAC unit tracking with detailed information
- ✅ **Smart Scheduling**: Automatic calculation of next service dates based on intervals
- ✅ **Real-time Monitoring**: Dashboard showing current service status and urgency levels
- ✅ **Advanced Filtering**: Filter units by service due dates (today, this week, this month)
- ✅ **Bulk Import**: Import customer and unit data from Excel (.xlsx/.xls) and CSV files
- ✅ **Professional Forms**: Intuitive forms for adding/editing customers and units
- ✅ **Data Relationships**: Proper customer-unit relationships with automatic population
- ✅ **Responsive Design**: Optimized for desktop and mobile devices

### Dashboard Features
- ✅ **Interactive Cards**: Clickable summary cards showing key metrics
- ✅ **Unified View**: Single table displaying all units sorted by service urgency
- ✅ **Status Indicators**: Color-coded badges for service status (Overdue, Due Today, Due Soon, Scheduled)
- ✅ **Overdue Tracking**: Days overdue calculation with descending sort order
- ✅ **Customer Navigation**: Clickable customer names linking to detailed customer pages
- ✅ **Real-time Alerts**: Prominent notifications for overdue services

### Customer Management
- ✅ **Detailed Views**: Comprehensive customer detail pages showing all information
- ✅ **Unit Listings**: View all units associated with each customer
- ✅ **Navigation**: Easy navigation between customers and their units
- ✅ **Clean Interface**: Professional styling without unnecessary elements

### Unit Management
- ✅ **Comprehensive Data**: Track unit type, service history, and scheduling
- ✅ **Smart Sorting**: Units automatically sorted by service urgency
- ✅ **Customer Association**: Clear display of customer information for each unit
- ✅ **Form Pre-population**: Customer field automatically selected when editing units
- ✅ **Type Classification**: Support for AC, Heater, Machine, and Generator unit types

### Technical Features
- ✅ **Modern Stack**: Built with React, Node.js, Express, and MongoDB
- ✅ **API Standardization**: Consistent API response formats with proper error handling
- ✅ **Data Population**: Automatic population of related customer data
- ✅ **Performance**: Efficient data fetching with React Query caching
- ✅ **Validation**: Form validation and error handling
- ✅ **Accessibility**: Proper accessibility attributes and keyboard navigation
- ✅ **Security**: Proper data sanitization and secure API practices

### API Endpoints

#### Customer Endpoints
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get specific customer with units
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

#### Unit Endpoints
- `GET /api/units` - Get all units (with customer population)
- `GET /api/units/today` - Get units due today
- `GET /api/units/week` - Get units due this week
- `GET /api/units/month` - Get units due this month
- `GET /api/units/customer/:customerId` - Get units for specific customer
- `POST /api/units` - Create new unit
- `POST /api/units/import` - Import units from Excel/CSV file
- `PUT /api/units/:id` - Update unit
- `DELETE /api/units/:id` - Delete unit

## Pagination Feature

### Controls Available
- Page size selector (5, 10, 25, 50 items per page)
- Previous/Next page navigation
- Direct page number selection
- Ellipsis for large page ranges
- Current page indicator

### API Integration
- Backend supports `page` and `limit` query parameters
- Response includes pagination metadata:
  - Current page
  - Total pages
  - Total items
  - Items per page
  - Navigation flags (hasNextPage, hasPrevPage)

## File Import Feature

### Supported Formats
- Excel files (.xlsx, .xls)
- CSV files (.csv)

### Required Columns
The import file must contain these columns (column names are case-insensitive):
- `customer_name` or `Customer Name` or `Customer`
- `unit_name` or `Unit Name` or `Unit`
- `last_service_date` or `Last Service Date`
- `service_interval_days` or `Service Interval Days` or `Interval`

### Date Formats
- Standard date formats (YYYY-MM-DD, MM/DD/YYYY, etc.)
- Excel date numbers are automatically converted

### Import Process
1. Click "Import Data" button
2. Select your Excel or CSV file
3. Review the import results including:
   - Number of successfully imported units
   - Total rows processed
   - Any errors or warnings with specific row numbers

### Sample Template
Click "Download sample template" to get a CSV template with the correct format.

## Usage Example

1. Start both backend and frontend servers
2. Navigate to the application in your browser (`http://localhost:3000`)
3. **Dashboard Overview**: View the main dashboard showing all units sorted by service urgency
4. **Customer Management**:
   - Click "Add Customer" to create new customer records
   - View customer list with contact information
   - Click on customer names to view detailed customer pages
5. **Unit Management**:
   - Click "Add Unit" to create new HVAC units
   - Associate units with existing customers
   - View all units in the main table with service status
6. **Navigation**:
   - Click on customer names anywhere in the application to view customer details
   - Navigate between related customers and units seamlessly
7. **Service Monitoring**:
   - Use dashboard cards to filter units by due dates
   - View real-time alerts for overdue services
   - Check color-coded status badges for quick assessment
8. **Bulk Operations**:
   - Import customer and unit data using Excel/CSV files
   - Download sample templates for proper formatting
9. **Editing**:
   - Edit existing customers and units with pre-populated forms
   - Customer fields automatically selected when editing units

## Business Value

This comprehensive HVAC service tracker addresses key operational challenges:

**Primary Benefits**:
- Eliminates missed service appointments through automated tracking
- Reduces administrative overhead with bulk import capabilities
- Improves customer satisfaction through proactive service scheduling
- Provides real-time visibility into service obligations
- Enables data-driven decision making for service planning

**Target Users**:
- HVAC business owners and managers
- Service coordinators and schedulers
- Field technicians needing customer/unit information
- Small to medium HVAC companies seeking affordable solutions

**Competitive Advantages**:
- Simple, intuitive interface requiring minimal training
- Comprehensive feature set at competitive pricing point
- Flexible deployment options (cloud or on-premise)
- Regular updates and feature enhancements
- Strong focus on user experience and workflow efficiency

## Future Enhancements

### Planned Features
- **User Authentication**: Secure login system with role-based access control
- **Multi-tenancy**: Support for multiple HVAC companies on single platform
- **Advanced Notifications**: Email/SMS reminders for upcoming services
- **Reporting Dashboard**: Comprehensive analytics and reporting features
- **Mobile Application**: Dedicated mobile app for field technicians
- **Integration Capabilities**: API for third-party system integration
- **Advanced Scheduling**: Complex scheduling algorithms and conflict resolution
- **Payment Processing**: Integrated billing and payment collection
- **Inventory Management**: Parts and inventory tracking
- **Work Order System**: Comprehensive work order creation and tracking

### Technical Improvements
- **Performance Optimization**: Enhanced database queries and caching strategies
- **Scalability**: Horizontal scaling capabilities for large deployments
- **Backup & Recovery**: Automated backup systems and disaster recovery
- **Monitoring**: Comprehensive system monitoring and alerting
- **Documentation**: Complete API documentation and user guides