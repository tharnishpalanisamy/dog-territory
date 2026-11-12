
import { Routes, Route } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import AdminOverview from "../pages/admin/OverviewPage";
import VolunteerOverview from "../pages/volunteer/OverviewPage";
import VeterinarianOverview from "../pages/veterinarian/OverviewPage";
import UserOverview from "../pages/user/OverviewPage";

import {
  DogsPage,
  DogDetailsPage,
  DogCreatePage,
  DogEditPage,
} from "../pages/dogs/DogsPages";

import {
  ReportsPage,
  ReportDetailsPage,
  CreateReportPage,
} from "../pages/reports/ReportsPages";

import {
  VolunteersPage,
  VolunteerDetailsPage,
} from "../pages/volunteer/VolunteersPages";

import ProfilePage from "../pages/profile/ProfilePage";
import RabiesAwarenessPage from "../pages/awareness/RabiesAwarenessPage";

function AppRoutes() {
  return (
    <Routes>
      {/* ADMIN */}
      <Route path="/admin" element={<AppLayout role="ADMIN" />}>
        <Route index element={<AdminOverview />} />

        <Route path="dogs" element={<DogsPage />} />
        <Route path="dogs/create" element={<DogCreatePage />} />
        <Route path="dogs/:id" element={<DogDetailsPage />} />
        <Route path="dogs/:id/edit" element={<DogEditPage />} />

        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/create" element={<CreateReportPage />} />
        <Route path="reports/:id" element={<ReportDetailsPage />} />

        <Route path="volunteers" element={<VolunteersPage />} />
        <Route path="volunteers/:id" element={<VolunteerDetailsPage />} />

        <Route path="profile" element={<ProfilePage />} />
        <Route path="rabies-awareness" element={<RabiesAwarenessPage />} />
      </Route>

      {/* VOLUNTEER */}
      <Route path="/volunteer" element={<AppLayout role="VOLUNTEER" />}>
        <Route index element={<VolunteerOverview />} />

        <Route path="dogs" element={<DogsPage />} />
        <Route path="reports" element={<ReportsPage />} />

        <Route path="profile" element={<ProfilePage />} />
        <Route path="rabies-awareness" element={<RabiesAwarenessPage />} />
      </Route>


       <Route
        path="/veterinarian"
        element={<AppLayout role="VETERINARIAN" />}
        >
            <Route index element={<VeterinarianOverview />} />
        </Route>


        <Route
        path="/user"
        element={<AppLayout role="USER" />}
        >
            <Route index element={<UserOverview />} />
        </Route>
    </Routes>


    
  );
}

export default AppRoutes;
