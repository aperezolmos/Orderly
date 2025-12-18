import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './common/components/ProtectedRoute';
import ErrorBoundary from './common/components/ErrorBoundary';
import MainLayout from './common/layouts/MainLayout';
import LoadingFallback from './common/components/LoadingFallback';


// ------- PAGES ------------------------------------------
const MainPage = React.lazy(() => import('./common/pages/MainPage'));

// Orders
const OrdersDashboardPage = React.lazy(() => import('./modules/orders/pages/OrderDashboardPage'));

// Auth
const Login = React.lazy(() => import('./modules/auth/pages/LoginPage'));
const Register = React.lazy(() => import('./modules/auth/pages/RegisterPage'));
const Profile = React.lazy(() => import('./modules/auth/pages/ProfilePage'));

// Roles
const RoleList = React.lazy(() => import('./modules/roles/pages/RoleListPage'));
const RoleCreate = React.lazy(() => import('./modules/roles/pages/RoleCreatePage'));
const RoleEdit = React.lazy(() => import('./modules/roles/pages/RoleEditPage'));

// Users
const UserList = React.lazy(() => import('./modules/users/pages/UserListPage'));
const UserCreate = React.lazy(() => import('./modules/users/pages/UserCreatePage'));
const UserEdit = React.lazy(() => import('./modules/users/pages/UserEditPage'));

// Foods
const FoodList = React.lazy(() => import('./modules/foods/pages/FoodListPage'));
const FoodCreate = React.lazy(() => import('./modules/foods/pages/FoodCreatePage'));
const FoodEdit = React.lazy(() => import('./modules/foods/pages/FoodEditPage'));

// Products
const ProductList = React.lazy(() => import('./modules/products/pages/ProductListPage'));
const ProductView = React.lazy(() => import('./modules/products/pages/ProductViewPage'));
const ProductCreate = React.lazy(() => import('./modules/products/pages/ProductCreatePage'));
const ProductEdit = React.lazy(() => import('./modules/products/pages/ProductEditPage'));

// Dining Tables
const DiningTableList = React.lazy(() => import('./modules/diningTables/pages/DiningTableListPage'));
const DiningTableCreate = React.lazy(() => import('./modules/diningTables/pages/DiningTableCreatePage'));
const DiningTableEdit = React.lazy(() => import('./modules/diningTables/pages/DiningTableEditPage'));

// Reservations
const ReservationList = React.lazy(() => import('./modules/reservations/pages/ReservationListPage'));
const ReservationCreate = React.lazy(() => import('./modules/reservations/pages/ReservationCreatePage'));
const ReservationEdit = React.lazy(() => import('./modules/reservations/pages/ReservationEditPage'));


// --------------------------------------------------------


//TODO: role_admin constante?


// Wrapper component for pages that need layout
const WithLayout = ({ children }) => (
  <MainLayout>
    {children}
  </MainLayout>
);

// Wrapper for auth pages (without layout)
const WithoutLayout = ({ children }) => (
  <>{children}</>
);


const AppRouter = () => {
  
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={ <WithLayout><MainPage /></WithLayout> }
            />
            <Route
              path="/home"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? 
                <WithoutLayout><Login /></WithoutLayout> : 
                <Navigate to="/" replace />
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? 
                <WithoutLayout><Register /></WithoutLayout> : 
                <Navigate to="/" replace />
              }
            />


            {/* Protected USER routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <WithLayout>
                    <Profile />
                  </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <WithLayout><OrdersDashboardPage /></WithLayout>
                </ProtectedRoute>
              }
            />


            {/* Protected ADMIN routes */}
            <Route
              path="/roles"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <RoleList />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/new"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <RoleCreate />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/:id/edit"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <RoleEdit />
                  </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <UserList />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/new"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <UserCreate />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <UserEdit />
                  </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/foods"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <FoodList />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/foods/new"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <FoodCreate />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/foods/:id/edit"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <FoodEdit />
                  </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <ProductList />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/view"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <ProductView />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <ProductCreate />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <ProductEdit />
                  </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tables"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <DiningTableList />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables/new"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <DiningTableCreate />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables/:id/edit"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <DiningTableEdit />
                  </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservations"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <ReservationList />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations/new"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <ReservationCreate />
                  </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations/:id/edit"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <WithLayout>
                    <ReservationEdit />
                  </WithLayout>
                </ProtectedRoute>
              }
            />


            {/* Default route */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
            />
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;
