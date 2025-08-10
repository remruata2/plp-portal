# Changelog

All notable changes to the PLP Portal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2024-12-20

### Added
- **Field-Based Auto-Calculation System**: Complete overhaul of the health data management system
  - Facilities now submit raw field values instead of calculated indicators
  - Automatic indicator calculation using field-based formulas
  - Real-time performance metrics and incentive calculations
- **Comprehensive Health Data Form**: Dynamic form generation based on facility types
  - 41 standardized fields across all healthcare categories
  - Smart conditional logic for TB-related indicators
  - Binary fields with toggle switches for Yes/No responses
  - Numeric counter fields with increment/decrement controls
- **Enhanced Field Mapping System**: 
  - Facility-type specific field assignments
  - Proper display order configuration
  - Required field validation
  - Field descriptions and tooltips
- **Worker Management Integration**:
  - Worker selection during data submission
  - Worker allocation per facility type
  - Integration with remuneration calculations
- **Automated Formula Calculator**:
  - Support for percentage ranges, numeric ranges, and binary targets
  - Conditional calculations with NA handling
  - Linear incentive distribution
  - Cap and minimum threshold support
- **Quality Assurance Features**:
  - Form validation and error handling
  - Data integrity checks
  - Submission confirmation workflows
  - Comprehensive test coverage

### Changed
- **Database Schema**: Major restructuring for field-based system
  - New FieldValue table for raw field data
  - Enhanced MonthlyHealthData for calculated indicators
  - Improved relationships and constraints
- **API Architecture**: Complete API redesign
  - Field value submission endpoints
  - Automatic calculation triggers
  - Enhanced error handling and validation
- **User Interface**: Modernized form interface
  - Grouped indicators by category
  - Improved accessibility and user experience
  - Real-time validation feedback
  - Mobile-responsive design
- **Authentication System**: Enhanced security
  - Role-based access controls
  - Facility-specific permissions
  - Session management improvements

### Fixed
- **Data Consistency**: Eliminated manual calculation errors
- **Form Validation**: Comprehensive field validation
- **Performance Issues**: Optimized database queries and form rendering
- **User Experience**: Improved form navigation and feedback

### Technical Improvements
- TypeScript implementation across the codebase
- Enhanced testing framework with unit, integration, and E2E tests
- Improved error logging and monitoring
- Database migration scripts and seeding utilities
- Comprehensive API documentation

## [2.1.0] - 2024-11-15

### Added
- Basic indicator management system
- Manual data entry forms
- Simple reporting dashboard

### Fixed
- Initial database connection issues
- Basic authentication problems

## [2.0.0] - 2024-10-01

### Added
- Next.js framework implementation
- Prisma ORM integration
- Basic user authentication

### Changed
- Migrated from legacy PHP system
- Updated to modern React components

## [1.0.0] - 2024-08-01

### Added
- Initial project setup
- Basic facility management
- Simple data collection forms
- PostgreSQL database setup

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
