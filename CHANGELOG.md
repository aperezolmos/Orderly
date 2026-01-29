# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.9.0-beta] - 2026-01-29

### Added
- Open Food Facts integration for food search (full text) and import via barcode.
- Allergen tracking with EU-regulated allergen icons and Nutri-Score/NOVA labels.
- Interactive nutrition charts (macros, vitamins, minerals) in product view.
- Order history page with detailed read-only views.
- Role-based UI filtering for sidebar, navbar, and action buttons.
- Profile edit page for users to update their info and password.
- Status management for orders, tables, and reservations from listing pages.
- Allergen filtering in the dashboard.
- `useUniqueCheck` and `usePagination` custom hooks.
- `StatusButton` reusable component for state changes.
- Hero section on the landing page.

### Changed
- Refactored navigation and permission handling in React.
- Improved session persistence in Spring Boot.
- Enhanced form performance with memoization (`FoodForm`, `RoleForm`).
- Updated `DataTable` to support pagination and permission-based action disabling.
- Replaced order detail page with a modal in history view.
- Styled management pages with module-based icons and colors.

### Fixed
- Checkbox and TransferList inconsistencies in `FoodForm`, `RoleForm`, and `UserForm`.
- Dark theme color adjustments.
- Duplicate labels in nutrition charts.
- API auto-fetching in create/edit pages.
- Allergen list submission in food updates.
- Role ID mismatches in `UserForm`.


## [0.8.0-beta] - 2025-12-19

### Added
- Initial functional release of the restaurant management application
- CRUD management for core domain entities
- Orders dashboard for bar and dining orders
- Role-based access control
- Internationalization (EN / ES)


[0.9.0-beta]: https://github.com/aperezolmos/Orderly/compare/v0.8.0-beta...v0.9.0-beta
[0.8.0-beta]: https://github.com/aperezolmos/Orderly/commits/v0.8.0-beta
