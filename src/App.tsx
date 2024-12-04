import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Businesses from "./pages/Businesses";
import ServiceList from "./pages/ServiceList";
import RouteGuard from "./components/RouteGuard";
import { Route, Routes } from "react-router-dom";
import AppPanelServices from "./pages/AppPanelServices";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/*" element={<Layout />}>
        <Route
          index
          element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          }
        />
        <Route
          path="bookings"
          element={
            <RouteGuard>
              <Bookings />
            </RouteGuard>
          }
        />
        <Route
          path="services"
          element={
            <RouteGuard>
              <ServiceList />
            </RouteGuard>
          }
        />
        <Route
          path="categories"
          element={
            <RouteGuard>
              <Categories />
            </RouteGuard>
          }
        />
        <Route
          path="companies"
          element={
            <RouteGuard>
              <Companies />
            </RouteGuard>
          }
        />
        <Route
          path="businesses"
          element={
            <RouteGuard>
              <Businesses />
            </RouteGuard>
          }
        />
        <Route
          path="app/services"
          element={
            <RouteGuard>
              <AppPanelServices />
            </RouteGuard>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
