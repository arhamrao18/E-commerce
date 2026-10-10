import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider } from "./context/AuthContext";
import { RequireCustomer, RequireAdmin } from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Toast from "./components/ui/Toast";
 
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
 
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminCoupons from "./pages/admin/Coupons";
import AdminReviews from "./pages/admin/Reviews";
import AdminCustomers from "./pages/admin/Customers";
import AdminAiAssistant from "./pages/admin/AiAssistant";
import AdminSalesIntelligence from "./pages/admin/SalesIntelligence";
import AdminInventoryPrediction from "./pages/admin/InventoryPrediction";
import AdminFraudDetection from "./pages/admin/FraudDetection";
import AdminNotifications from "./pages/admin/Notifications";
import AdminActivityLog from "./pages/admin/ActivityLog";
import AdminRoles from "./pages/admin/Roles";
import AdminSettings from "./pages/admin/Settings";
 
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
 
function StorefrontLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-porcelain">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
 
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <StoreProvider>
        <ScrollToTop />
        <Routes>
          {/* Storefront */}
          <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
          <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
          <Route path="/product/:slug" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
          <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
          <Route path="/wishlist" element={<StorefrontLayout><Wishlist /></StorefrontLayout>} />
          <Route path="/checkout" element={<StorefrontLayout><RequireCustomer><Checkout /></RequireCustomer></StorefrontLayout>} />
          <Route path="/login" element={<StorefrontLayout><Auth mode="login" /></StorefrontLayout>} />
          <Route path="/register" element={<StorefrontLayout><Auth mode="register" /></StorefrontLayout>} />
          <Route path="/account" element={<StorefrontLayout><RequireCustomer><Account /></RequireCustomer></StorefrontLayout>} />
          <Route path="/account/orders" element={<StorefrontLayout><RequireCustomer><Account /></RequireCustomer></StorefrontLayout>} />
 
          {/* Admin login (separate page, not linked anywhere on the storefront) */}
          <Route path="/admin/login" element={<AdminLogin />} />
 
          {/* Admin (staff roles only) */}
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="ai-assistant" element={<AdminAiAssistant />} />
            <Route path="sales-intelligence" element={<AdminSalesIntelligence />} />
            <Route path="inventory-prediction" element={<AdminInventoryPrediction />} />
            <Route path="fraud-detection" element={<AdminFraudDetection />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="activity-log" element={<AdminActivityLog />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        <Toast />
      </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
 