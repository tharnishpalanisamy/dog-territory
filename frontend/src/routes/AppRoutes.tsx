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
  CreateReportPage as AdminCreateReportPage,
} from "../pages/reports/ReportsPages";

import {
  VolunteersPage,
  VolunteerDetailsPage,
} from "../pages/volunteer/VolunteersPages";

import ProfilePage from "../pages/profile/ProfilePage";
import RabiesAwarenessPage from "../pages/awareness/RabiesAwarenessPage";
import CreateReportPage, {
  UserReportsPage,
  UserReportDetailsPage,
} from "../pages/reports/CreateReportPage";
import ExploreDogs from "../components/app/dogs/ExploreDogs";
import DogDetail from "../components/app/dogs/DogDetail";
import UserVolunteersPage from "../pages/user/UserVolunteersPage";
import UserVeterinariansPage from "../pages/user/UserVeterinarianPages";

function AppRoutes() {
  return (
    <Routes>
      {/* Shared community resource */}
      <Route
        path="/rabies-awareness"
        element={
          <AppLayout
            role="USER"
            allowedRoles={["USER", "VOLUNTEER", "VETERINARIAN", "ADMIN"]}
          />
        }
      >
        <Route index element={<RabiesAwarenessPage />} />
      </Route>

      {/* ADMIN */}

      <Route path="/admin" element={<AppLayout role="ADMIN" />}>
        <Route index element={<AdminOverview />} />

        <Route path="dogs" element={<DogsPage />} />
        <Route path="dogs/create" element={<DogCreatePage />} />
        <Route path="dogs/:id" element={<DogDetailsPage />} />
        <Route path="dogs/:id/edit" element={<DogEditPage />} />

        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/create" element={<AdminCreateReportPage />} />
        <Route path="reports/:id" element={<ReportDetailsPage />} />

        <Route path="volunteers" element={<VolunteersPage />} />
        <Route path="volunteers/:id" element={<VolunteerDetailsPage />} />

        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* VOLUNTEER */}
      <Route path="/volunteer" element={<AppLayout role="VOLUNTEER" />}>
        <Route index element={<VolunteerOverview />} />

        <Route path="dogs" element={<DogsPage />} />
        <Route path="reports" element={<ReportsPage />} />

        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/veterinarian" element={<AppLayout role="VETERINARIAN" />}>
        <Route index element={<VeterinarianOverview />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/user" element={<AppLayout role="USER" />}>
        <Route index element={<UserOverview />} />

        <Route path="reports" element={<UserReportsPage />} />
        <Route path="reports/create" element={<CreateReportPage />} />
        <Route path="reports/:id" element={<UserReportDetailsPage />} />

        <Route path="dogs" element={<ExploreDogs />} />
        <Route path="dogs/:dog_id" element={<DogDetail />} />
        <Route path="volunteers" element={<UserVolunteersPage />} />
        <Route path="veterinarians" element={<UserVeterinariansPage />} />

        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
