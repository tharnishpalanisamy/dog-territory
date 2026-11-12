import { Routes, Route } from "react-router-dom";
import AppLayout from '../../components/layout/AppLayout'
import AdminOverview from '../admin/OverviewPage.tsx'

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/user"
        element={
          <AppLayout
            role="USER"
            name="Tharnish"
          />
        }
      >
        <Route index element={<AdminOverview />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;