# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.0.0] - 2026-02-13

### Added

- Introduced `APP_INIT_DEMO_DATA` environment variable to toggle default database population on startup.
- Replaced automatic home redirects with a dedicated _"Not Found"_ page.
- Added translated error messages for common API issues and new system notifications.

### Changed

- Dynamic visibility for dashboard views, and action buttons based on user roles (e.g., Dining vs. Bar permissions).
- Implemented text truncation with Tooltips for order notes and role descriptions to improve mobile responsiveness.
- Standardized nutrients table formats with horizontal scrolling and color-coded nutritional warnings (Red for exceeding intake, Yellow for >80%).
- Orders in history are now sorted by _most recent first_.
- Editing a username now triggers an automatic logout with a notification to re-authenticate.
- Implemented a 30-second cache for pending orders to reduce API overhead when switching dashboard views.

### Fixed

- Moved nutritional API searches from the frontend to Spring Boot to resolve CORS issues and improve response times.
- Refactored logic into a custom `useIngredientSearch` hook for better user feedback and decoupled service calls.


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


[1.0.0]: https://github.com/aperezolmos/Orderly/compare/v0.9.0-beta...v1.0.0
[0.9.0-beta]: https://github.com/aperezolmos/Orderly/compare/v0.8.0-beta...v0.9.0-beta
[0.8.0-beta]: https://github.com/aperezolmos/Orderly/commits/v0.8.0-beta
