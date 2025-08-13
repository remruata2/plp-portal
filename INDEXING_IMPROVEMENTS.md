# Database Indexing Improvements

## Overview

This document outlines the comprehensive indexing strategy implemented to improve query performance across the PLP Portal database schema.

## Indexing Strategy

### 1. High-Volume Tables (Primary Focus)

#### FieldValue Table

- **Composite Indexes**: `[facility_id, report_month]`, `[field_id, report_month]`, `[facility_id, field_id]`
- **Single Column Indexes**: `[uploaded_by]`, `[created_at]`, `[report_month, is_override]`
- **Rationale**: This table handles the most data volume and is queried frequently for reporting and analysis

#### FacilityRemunerationRecord Table

- **Composite Indexes**: `[facility_id, report_month]`, `[facility_id, status]`
- **Single Column Indexes**: `[report_month]`, `[indicator_id]`, `[calculation_version]`, `[status]`, `[calculation_date]`
- **Rationale**: Critical for remuneration calculations and performance tracking

### 2. Foreign Key Relationships

#### User Table

- **Indexes**: `[facility_id]`, `[role, is_active]`, `[email]`, `[last_login]`
- **Rationale**: Users are frequently queried by facility and role combinations

#### Facility Table

- **Indexes**: `[district_id]`, `[facility_type_id]`, `[is_active]`, `[district_id, is_active]`, `[facility_type_id, is_active]`
- **Rationale**: Facilities are queried by district and type combinations

#### HealthWorker Table

- **Indexes**: `[facility_id]`, `[worker_type]`, `[is_active]`
- **Rationale**: Health workers are frequently filtered by facility and type

### 3. Reporting and Analytics Tables

#### RemunerationCalculation Table

- **Indexes**: `[facility_id]`, `[report_month]`, `[calculated_at]`
- **Rationale**: Essential for monthly remuneration reports and calculations

#### FacilityTarget Table

- **Indexes**: `[facility_id, report_month]`, `[indicator_id, report_month]`, `[created_at]`
- **Rationale**: Critical for target tracking and performance analysis

#### WorkerRemuneration Table

- **Indexes**: `[facility_id, report_month]`, `[worker_type]`
- **Rationale**: Key for worker-specific remuneration calculations

### 4. Configuration and Mapping Tables

#### Field Table

- **Indexes**: `[field_type]`, `[is_active]`, `[user_type]`, `[field_category]`, `[sort_order]`
- **Rationale**: Fields are frequently filtered by type and category

#### Indicator Table

- **Indexes**: `[type]`, `[formula_type]`, `[target_type]`, `[denominator_field_id]`, `[numerator_field_id]`, `[target_field_id]`, `[created_at]`
- **Rationale**: Indicators are queried by various criteria for calculations

#### FacilityFieldMapping Table

- **Indexes**: `[field_id]`, `[facility_type_id]`, `[is_required]`, `[display_order]`
- **Rationale**: Essential for dynamic form generation and field validation

### 5. Worker Allocation Tables

#### WorkerAllocationConfig Table

- **Indexes**: `[facility_type_id]`, `[worker_type]`, `[worker_role]`, `[is_active]`, `[facility_type_id, is_active]`
- **Rationale**: Critical for worker allocation calculations and configurations

#### IndicatorWorkerAllocation Table

- **Indexes**: `[indicator_id]`, `[worker_type]`
- **Rationale**: Used for worker allocation per indicator

## Performance Benefits

### Query Optimization

- **Faster JOINs**: Foreign key indexes improve relationship queries
- **Efficient Filtering**: Composite indexes optimize multi-column WHERE clauses
- **Better Sorting**: Indexes on sortable fields improve ORDER BY performance

### Reporting Performance

- **Monthly Reports**: `[facility_id, report_month]` indexes speed up monthly data retrieval
- **Analytics**: Date-based indexes improve time-series analysis
- **Aggregations**: Facility and type combinations optimize summary queries

### User Experience

- **Faster Page Loads**: Reduced query execution time
- **Responsive Search**: Better performance on filtered data
- **Real-time Updates**: Improved performance for dynamic content

## Maintenance Considerations

### Index Size

- Monitor index sizes, especially for high-volume tables
- Consider partial indexes for large tables if specific filters are common

### Write Performance

- Indexes slightly impact INSERT/UPDATE performance
- Monitor write performance and adjust if necessary

### Query Plan Analysis

- Use `EXPLAIN ANALYZE` to verify index usage
- Monitor slow query logs for optimization opportunities

## Monitoring Recommendations

### Key Metrics

- Query execution time
- Index usage statistics
- Table scan vs index scan ratios
- Index size and fragmentation

### Tools

- PostgreSQL's built-in monitoring views
- pg_stat_statements extension
- Database performance monitoring tools

## Future Considerations

### Adaptive Indexing

- Monitor query patterns and adjust indexes accordingly
- Consider adding indexes based on actual usage patterns

### Partitioning

- For very large tables, consider table partitioning by date
- Implement partitioning strategies for historical data

### Materialized Views

- Consider materialized views for complex, frequently-run reports
- Implement refresh strategies for real-time data requirements
