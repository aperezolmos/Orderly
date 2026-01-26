import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './common/components/ProtectedRoute';
import ErrorBoundary from './common/components/feedback/ErrorBoundary';
import MainLayout from './common/layouts/MainLayout';
import LoadingFallback from './common/components/feedback/LoadingFallback';
import { PERMISSIONS } from './utils/permissions';


// ------- PAGES ------------------------------------------
const MainPage = React.lazy(() => import('./common/pages/MainPage'));

// Orders
const OrdersDashboardPage = React.lazy(() => import('./modules/orders/pages/OrderDashboardPage'));
const OrderHistoryPage = React.lazy(() => import('./modules/orders/pages/OrderHistoryPage'));
const OrderViewPage = React.lazy(() => import('./modules/orders/pages/OrderViewPage'));

// Auth
const Login = React.lazy(() => import('./modules/auth/pages/LoginPage'));
const Register = React.lazy(() => import('./modules/auth/pages/RegisterPage'));
const Profile = React.lazy(() => import('./modules/auth/pages/ProfilePage'));
const ProfileEdit = React.lazy(() => import('./modules/auth/pages/ProfileEditPage'));

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
            <Route path="/"
              element={ <WithLayout><MainPage /></WithLayout> }
            />
            <Route path="/home"
              element={<Navigate to="/" replace />}
            />
            <Route path="/login"
              element={
                !isAuthenticated ? 
                <WithoutLayout> <Login /> </WithoutLayout> : 
                <Navigate to="/" replace />
              }
            />
            <Route path="/register"
              element={
                !isAuthenticated ? 
                <WithoutLayout> <Register /> </WithoutLayout> : 
                <Navigate to="/" replace />
              }
            />


            {/* Protected USER routes */}
            <Route path="/profile"
              element={
                <ProtectedRoute>
                  <WithLayout> <Profile /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/profile/edit"
              element={
                <ProtectedRoute>
                  <WithLayout> <ProfileEdit /> </WithLayout>
                </ProtectedRoute>
              }
            />

            {/* TODO: poner permisos requeridos */}
            <Route path="/orders"
              element={
                <ProtectedRoute>
                  <WithLayout> <OrdersDashboardPage /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/orders/history"
              element={
                <ProtectedRoute>
                  <WithLayout> <OrderHistoryPage /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/orders/:id/view"
              element={
                <ProtectedRoute>
                  <WithLayout> <OrderViewPage /> </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/roles"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.ROLE_VIEW]}>
                  <WithLayout> <RoleList /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/roles/new"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.ROLE_CREATE]}>
                  <WithLayout> <RoleCreate /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/roles/:id/edit"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.ROLE_EDIT]}>
                  <WithLayout> <RoleEdit /> </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/users"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.USER_VIEW]}>
                  <WithLayout> <UserList /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/users/new"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.USER_CREATE]}>
                  <WithLayout> <UserCreate /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/users/:id/edit"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.USER_EDIT_MYSELF, PERMISSIONS.USER_EDIT_OTHERS]}>
                  <WithLayout> <UserEdit /> </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/foods"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.FOOD_VIEW]}>
                  <WithLayout> <FoodList /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/foods/new"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.FOOD_CREATE]}>
                  <WithLayout> <FoodCreate /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/foods/:id/edit"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.FOOD_EDIT]}>
                  <WithLayout> <FoodEdit /> </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/products"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.PRODUCT_VIEW]}>
                  <WithLayout> <ProductList /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/products/:id/view"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.PRODUCT_VIEW]}>
                  <WithLayout> <ProductView /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/products/new"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.PRODUCT_CREATE]}>
                  <WithLayout> <ProductCreate /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/products/:id/edit"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.PRODUCT_EDIT]}>
                  <WithLayout> <ProductEdit /> </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/tables"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.TABLE_VIEW]}>
                  <WithLayout> <DiningTableList /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/tables/new"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.TABLE_CREATE]}>
                  <WithLayout> <DiningTableCreate /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/tables/:id/edit"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.TABLE_EDIT]}>
                  <WithLayout> <DiningTableEdit /> </WithLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/reservations"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.RESERVATION_VIEW]}>
                  <WithLayout> <ReservationList /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/reservations/new"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.RESERVATION_CREATE]}>
                  <WithLayout> <ReservationCreate /> </WithLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/reservations/:id/edit"
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.RESERVATION_EDIT]}>
                  <WithLayout> <ReservationEdit /> </WithLayout>
                </ProtectedRoute>
              }
            />


            {/* Default route */}
            <Route path="*"
              element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
            />
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;
