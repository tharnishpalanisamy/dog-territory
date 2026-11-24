import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Search,
  Users,
  MapPin,
  Clock,
  Heart,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Filter,
  RefreshCw,
} from "lucide-react";

import api from "../../lib/api";
import "./UserVolunteersPage.css";

// --------------------------------------------------
// Types
// --------------------------------------------------

type Availability =
  | "weekdays"
  | "weekends"
  | "everyday"
  | "flexible"
  | "unavailable";

type ApprovalStatus = "pending" | "approved" | "rejected";

interface Volunteer {
  id: number;
  user_id: number;
  state: string;
  district: string;
  area_name: string;
  pincode: string;
  availability: Availability;
  service_pincodes?: string[] | null;
  approval_status: ApprovalStatus;
  created_at?: string;
}

interface VolunteerApplication {
  id: number;
  user_id: number;
  phone_number: string;
  state: string;
  district: string;
  area_name: string;
  pincode: string;
  availability: Availability;
  service_pincodes?: string[] | null;
  approval_status: ApprovalStatus;
}

interface VolunteerForm {
  phone_number: string;
  state: string;
  district: string;
  area_name: string;
  pincode: string;
  availability: Availability;
  service_pincodes: string;
}

interface StoredUser {
  phone_number?: string | null;
  location?: {
    state?: string | null;
    district?: string | null;
    area_name?: string | null;
    pincode?: string | number | null;
  } | null;
}

type Tab = "discover" | "application";

function getInitialVolunteerForm(): VolunteerForm {
  const form = { ...initialForm };

  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return form;

    const user = JSON.parse(storedUser) as StoredUser;
    const location = user.location ?? {};

    return {
      ...form,
      phone_number: user.phone_number ?? "",
      state: location.state ?? "",
      district: location.district ?? "",
      area_name: location.area_name ?? "",
      pincode: location.pincode != null ? String(location.pincode) : "",
    };
  } catch {
    // If local storage is missing or malformed, keep the form blank.
    return form;
  }
}

// --------------------------------------------------
// Constants
// --------------------------------------------------

const VOLUNTEERS_PER_PAGE = 9;

const availabilityLabels: Record<Availability, string> = {
  weekdays: "Weekdays",
  weekends: "Weekends",
  everyday: "Every day",
  flexible: "Flexible",
  unavailable: "Currently unavailable",
};

const initialForm: VolunteerForm = {
  phone_number: "",
  state: "",
  district: "",
  area_name: "",
  pincode: "",
  availability: "weekends",
  service_pincodes: "",
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getErrorMessage(error: any): string {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail.map((item: any) => item.msg).join(", ");
  }

  return "Something went wrong. Please try again.";
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const styles: Record<ApprovalStatus, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const Icon = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

// --------------------------------------------------
// Main Component
// --------------------------------------------------

export default function UserVolunteersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [myApplication, setMyApplication] =
    useState<VolunteerApplication | null>(null);

  const [loading, setLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const [error, setError] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    Availability | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [form, setForm] = useState<VolunteerForm>(getInitialVolunteerForm);

  // --------------------------------------------------
  // Fetch Volunteers
  // --------------------------------------------------

  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Volunteer[]>("/volunteers/nearby", {
        params: {
          // Fetch one extra row so we can determine whether another page exists.
          limit: VOLUNTEERS_PER_PAGE + 1,
          offset: currentPage * VOLUNTEERS_PER_PAGE,
          ...(search.trim() ? { search: search.trim() } : {}),
          ...(availabilityFilter !== "all"
            ? { availability: availabilityFilter }
            : {}),
        },
      });

      const rows = Array.isArray(response.data) ? response.data : [];
      setHasNextPage(rows.length > VOLUNTEERS_PER_PAGE);

      setVolunteers(
        rows.slice(0, VOLUNTEERS_PER_PAGE).map((volunteer) => ({
          ...volunteer,
          service_pincodes: Array.isArray(volunteer.service_pincodes)
            ? volunteer.service_pincodes
            : [],
        })),
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, availabilityFilter, currentPage]);

  // --------------------------------------------------
  // Fetch My Application
  // --------------------------------------------------

  const fetchMyApplication = useCallback(async () => {
    try {
      setApplicationLoading(true);
      setApplicationError("");

      const response = await api.get<VolunteerApplication>("/volunteers/me");

      setMyApplication({
        ...response.data,
        service_pincodes: Array.isArray(response.data.service_pincodes)
          ? response.data.service_pincodes
          : [],
      });
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setMyApplication(null);
      } else {
        setApplicationError(getErrorMessage(err));
      }
    } finally {
      setApplicationLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchVolunteers();
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [fetchVolunteers]);

  useEffect(() => {
    fetchMyApplication();
  }, [fetchMyApplication]);

  // --------------------------------------------------
  // Form Handling
  // --------------------------------------------------

  function updateForm(field: keyof VolunteerForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleApplicationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setApplicationError("");
    setSuccessMessage("");

    if (!/^\d{6}$/.test(form.pincode)) {
      setApplicationError("Enter a valid 6-digit pincode.");
      return;
    }

    if (!/^\d{10,20}$/.test(form.phone_number.replace(/[\s+-]/g, ""))) {
      setApplicationError("Enter a valid phone number.");
      return;
    }

    const servicePincodes = form.service_pincodes
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean);

    if (servicePincodes.some((code) => !/^\d{6}$/.test(code))) {
      setApplicationError(
        "Every service pincode must contain exactly 6 digits.",
      );
      return;
    }

    const payload = {
      phone_number: form.phone_number,
      state: form.state.trim(),
      district: form.district.trim(),
      area_name: form.area_name.trim(),
      pincode: form.pincode,
      availability: form.availability,
      service_pincodes: servicePincodes,
    };

    try {
      setSubmitting(true);

      const response = await api.post<VolunteerApplication>(
        "/volunteers/",
        payload,
      );

      setMyApplication({
        ...response.data,
        service_pincodes: Array.isArray(response.data.service_pincodes)
          ? response.data.service_pincodes
          : [],
      });
      setShowApplicationForm(false);
      setSuccessMessage(
        "Your volunteer application has been submitted successfully!",
      );

      setActiveTab("application");
    } catch (err) {
      setApplicationError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // --------------------------------------------------
  // Status View
  // --------------------------------------------------

  function renderApplicationStatus() {
    if (applicationLoading) {
      return (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={30} />
        </div>
      );
    }

    if (applicationError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {applicationError}
          <button
            onClick={fetchMyApplication}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!myApplication) {
      if (showApplicationForm) {
        return renderApplicationForm();
      }

      return (
        <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <ClipboardList size={26} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            You haven&apos;t applied yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your volunteer application will appear here once you submit it. You
            can help coordinate care and support for street dogs in your
            community by joining as a volunteer.
          </p>
          <button
            type="button"
            onClick={() => setShowApplicationForm(true)}
            className="volunteers-action-button mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition"
          >
            Start application
            <ArrowRight size={17} />
          </button>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Your volunteer application
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Application #{myApplication.id}
              </h2>
            </div>

            <StatusBadge status={myApplication.approval_status} />
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Location
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {myApplication.area_name}, {myApplication.district},{" "}
                {myApplication.state}
              </p>
              <p className="text-sm text-slate-500">
                Pincode: {myApplication.pincode}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Availability
              </p>
              <p className="mt-1 font-medium capitalize text-slate-800">
                {availabilityLabels[myApplication.availability] ??
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Service areas
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(myApplication.service_pincodes ?? []).length > 0 ? (
                  (myApplication.service_pincodes ?? []).map((code) => (
                    <span
                      key={code}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                    >
                      {code}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No additional service areas.
                  </span>
                )}
              </div>
            </div>
          </div>

          {myApplication.approval_status === "pending" && (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <Clock className="mt-0.5 shrink-0 text-amber-600" size={20} />
                <div>
                  <h3 className="font-semibold text-amber-900">
                    Application under review
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    Your application has been received. Our team will review
                    your details and update your application status.
                  </p>
                </div>
              </div>
            </div>
          )}

          {myApplication.approval_status === "approved" && (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-emerald-600"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-emerald-900">
                    Congratulations!
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    Your volunteer application has been approved. You can now
                    access your volunteer workspace.
                  </p>
                </div>
              </div>
            </div>
          )}

          {myApplication.approval_status === "rejected" && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <XCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
                <div>
                  <h3 className="font-semibold text-red-900">
                    Application not approved
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-red-800">
                    Unfortunately, your application was not approved. Please
                    contact the administration team for more information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Application Form
  // --------------------------------------------------

  function renderApplicationForm() {
    const inputClass =
      "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowApplicationForm(false)}
            className="mb-4 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            ← Back to application overview
          </button>
          <h2 className="text-xl font-bold text-slate-900">
            Become a volunteer
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your existing profile details have been filled in where available.
            Review them, complete anything missing, and submit your application.
          </p>
        </div>

        <form
          onSubmit={handleApplicationSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {applicationError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {applicationError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-slate-900">
              Contact information
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Your contact details are used for application verification and
              will not appear in the public directory.
            </p>

            <label className="mt-5 block text-sm font-medium text-slate-700">
              Phone number *
              <input
                required
                type="tel"
                minLength={10}
                maxLength={20}
                value={form.phone_number}
                onChange={(e) => updateForm("phone_number", e.target.value)}
                placeholder="Enter your phone number"
                className={inputClass}
              />
            </label>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-slate-900">
              Location information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                State *
                <input
                  required
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                District *
                <input
                  required
                  value={form.district}
                  onChange={(e) => updateForm("district", e.target.value)}
                  placeholder="e.g. Coimbatore"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Area / Locality *
                <input
                  required
                  value={form.area_name}
                  onChange={(e) => updateForm("area_name", e.target.value)}
                  placeholder="Your locality"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Pincode *
                <input
                  required
                  inputMode="numeric"
                  maxLength={6}
                  pattern="\d{6}"
                  value={form.pincode}
                  onChange={(e) =>
                    updateForm("pincode", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="6-digit pincode"
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-slate-900">
              Volunteer availability
            </h3>

            <label className="mt-4 block text-sm font-medium text-slate-700">
              When are you available? *
              <select
                required
                value={form.availability}
                onChange={(e) => updateForm("availability", e.target.value)}
                className={inputClass}
              >
                {Object.entries(availabilityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium text-slate-700">
              Additional service pincodes
              <input
                value={form.service_pincodes}
                onChange={(e) => updateForm("service_pincodes", e.target.value)}
                placeholder="641025, 641011, 641012"
                className={inputClass}
              />
              <span className="mt-2 block text-xs font-normal text-slate-400">
                Separate multiple six-digit pincodes using commas.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="volunteers-action-button flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting application...
              </>
            ) : (
              <>
                Submit application
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="text-center text-xs leading-5 text-slate-400">
            By submitting, you agree to provide accurate information. Your
            application will be reviewed by our administration team.
          </p>
        </form>
      </div>
    );
  }

  // --------------------------------------------------
  // Page UI
  // --------------------------------------------------

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Users size={17} />
            Community
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Volunteers
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Discover animal welfare volunteers in your community or become one
            yourself. Every helping hand makes a difference.
          </p>
        </div>

        <button
          onClick={() => {
            fetchVolunteers();
            fetchMyApplication();
          }}
          className="volunteers-action-button inline-flex items-center justify-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition sm:self-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-[#f5f5ff] p-6 text-[#20234a] sm:p-8">
        <div className="relative z-10 max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#5555b8]">
            <Heart size={14} />
            Community of caring people
          </div>

          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            Small acts. Bigger impact.
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
            Connect with people who care about street dogs. Find volunteers
            around you and be part of something meaningful.
          </p>

          <button
            onClick={() => {
              setActiveTab("application");
              setShowApplicationForm(false);
              setSuccessMessage("");
              setApplicationError("");
            }}
            className="volunteers-action-button mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition"
          >
            Become a volunteer
            <ArrowRight size={17} />
          </button>
        </div>

        <Users
          className="absolute -bottom-10 -right-6 hidden text-indigo-200/60 sm:block"
          size={220}
          strokeWidth={1}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("discover")}
          className={`relative px-5 py-3 text-sm font-semibold transition ${
            activeTab === "discover"
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users size={17} />
            Discover volunteers
          </span>

          {activeTab === "discover" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("application");
            setShowApplicationForm(false);
            setSuccessMessage("");
            setApplicationError("");
          }}
          className={`relative px-5 py-3 text-sm font-semibold transition ${
            activeTab === "application"
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <ClipboardList size={17} />
            My Application
          </span>

          {activeTab === "application" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
          )}
        </button>
      </div>

      {/* Discover */}
      {activeTab === "discover" && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_280px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="Search volunteers in your area..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>

            <div className="relative">
              <Filter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={availabilityFilter}
                onChange={(e) => {
                  setAvailabilityFilter(e.target.value as Availability | "all");
                  setCurrentPage(0);
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              >
                <option value="all">All availability</option>
                {Object.entries(availabilityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900">Local volunteers</h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {volunteers.length} volunteer
                {volunteers.length !== 1 ? "s" : ""} on this page
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="mt-4 text-sm text-slate-500">
                Finding volunteers...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle size={22} />
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={fetchVolunteers}
                className="mt-4 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && volunteers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Users size={30} />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                No volunteers found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search.trim() || availabilityFilter !== "all"
                  ? "No volunteers match your current search. Try adjusting your filters."
                  : "There are no approved volunteers serving your pincode yet. Check back soon as more people join your community."}
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setAvailabilityFilter("all");
                  setCurrentPage(0);
                }}
                className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Volunteer Cards */}
          {!loading && !error && volunteers.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {volunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-600/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-bold uppercase text-indigo-600">
                      CV
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={13} />
                      Verified
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    Community volunteer
                  </h3>

                  <div className="mt-3 space-y-2">
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="shrink-0 text-slate-400" />
                      {volunteer.area_name}, {volunteer.district}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="font-medium text-slate-400">PIN</span>
                      {volunteer.pincode}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={16} className="shrink-0 text-slate-400" />
                      {availabilityLabels[volunteer.availability] ??
                        "Not specified"}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Service areas
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {(volunteer.service_pincodes ?? []).length > 0 ? (
                        (volunteer.service_pincodes ?? [])
                          .slice(0, 4)
                          .map((code) => (
                            <span
                              key={code}
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {code}
                            </span>
                          ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          Primary location only
                        </span>
                      )}

                      {(volunteer.service_pincodes ?? []).length > 4 && (
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                          +{(volunteer.service_pincodes ?? []).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-medium text-emerald-600">
                      Community volunteer
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                      Verified profile
                      <CheckCircle2 size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && volunteers.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row">
              <p className="text-sm text-slate-500">Page {currentPage + 1}</p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setCurrentPage((page) => Math.max(0, page - 1));
                  }}
                  disabled={currentPage === 0 || loading}
                  className="volunteers-secondary-button rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setCurrentPage((page) => page + 1);
                  }}
                  disabled={!hasNextPage || loading}
                  className="volunteers-secondary-button rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Application */}
      {activeTab === "application" && renderApplicationStatus()}
    </div>
  );
}
