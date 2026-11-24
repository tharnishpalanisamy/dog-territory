import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Search,
  Stethoscope,
  MapPin,
  BriefcaseMedical,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardList,
  Filter,
  RefreshCw,
  Building2,
  FileText,
  Upload,
  Pencil,
  ShieldAlert,
} from "lucide-react";

import api from "../../lib/api";
import "./UserVeterinariansPage.css";

// --------------------------------------------------
// Types
// --------------------------------------------------

type ApprovalStatus = "pending" | "approved" | "rejected" | "suspended";

interface Veterinarian {
  id: number;
  user_id: number;
  clinic_id: number;
  full_name: string;
  phone: string;
  qualification: string;
  license_number: string;
  specialization: string | null;
  years_of_experience: number | null;
  license_document_path: string | null;
  approval_status: ApprovalStatus;
  reviewed_by: number | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

interface Clinic {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

interface VeterinarianForm {
  clinic_id: string;
  full_name: string;
  phone: string;
  qualification: string;
  license_number: string;
  specialization: string;
  years_of_experience: string;
}

type Tab = "discover" | "application";

const VETERINARIANS_PER_PAGE = 9;
const CLINICS_LIMIT = 100;

const initialForm: VeterinarianForm = {
  clinic_id: "",
  full_name: "",
  phone: "",
  qualification: "",
  license_number: "",
  specialization: "",
  years_of_experience: "",
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getErrorMessage(error: any): string {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item: any) => item.msg)
      .filter(Boolean)
      .join(", ");
  }

  return "Something went wrong. Please try again.";
}

function getStatusLabel(status: ApprovalStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const styles: Record<ApprovalStatus, string> = {
    pending: "veterinarians-status-pending",
    approved: "veterinarians-status-approved",
    rejected: "veterinarians-status-rejected",
    suspended: "veterinarians-status-suspended",
  };

  const Icon = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
    suspended: ShieldAlert,
  }[status];

  return (
    <span className={`veterinarians-status-badge ${styles[status]}`}>
      <Icon size={13} />
      {getStatusLabel(status)}
    </span>
  );
}

function getClinicLabel(clinic: Clinic): string {
  return `${clinic.name} — ${clinic.city}`;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// --------------------------------------------------
// Main Component
// --------------------------------------------------

export default function UserVeterinariansPage() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");

  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [myApplication, setMyApplication] = useState<Veterinarian | null>(null);

  const [loading, setLoading] = useState(true);
  const [clinicsLoading, setClinicsLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");
  const [clinicError, setClinicError] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [form, setForm] = useState<VeterinarianForm>(initialForm);
  const [licenseDocument, setLicenseDocument] = useState<File | null>(null);

  const clinicById = useMemo(
    () => new Map(clinics.map((clinic) => [clinic.id, clinic])),
    [clinics],
  );

  const specializations = useMemo(() => {
    const values = veterinarians
      .map((vet) => vet.specialization?.trim())
      .filter((value): value is string => Boolean(value));

    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  }, [veterinarians]);

  // --------------------------------------------------
  // Fetch active clinics
  // --------------------------------------------------

  const fetchClinics = useCallback(async () => {
    try {
      setClinicsLoading(true);
      setClinicError("");

      const response = await api.get<Clinic[]>("/clinics/", {
        params: {
          limit: CLINICS_LIMIT,
          offset: 0,
          is_active: true,
        },
      });

      const rows = Array.isArray(response.data) ? response.data : [];
      setClinics(rows.filter((clinic) => clinic.is_active));
    } catch (err) {
      setClinicError(getErrorMessage(err));
    } finally {
      setClinicsLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // Fetch approved veterinarians
  // --------------------------------------------------

  const fetchVeterinarians = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // This public endpoint should return approved veterinarians only.
      // Fetch one extra row to determine whether another page exists.
      const response = await api.get<Veterinarian[]>("/veterinarians/nearby", {
        params: {
          limit: VETERINARIANS_PER_PAGE + 1,
          offset,
          ...(search.trim() ? { search: search.trim() } : {}),
          ...(specializationFilter !== "all"
            ? { specialization: specializationFilter }
            : {}),
        },
      });

      const rows = Array.isArray(response.data) ? response.data : [];
      setHasNextPage(rows.length > VETERINARIANS_PER_PAGE);
      setVeterinarians(rows.slice(0, VETERINARIANS_PER_PAGE));
    } catch (err) {
      setError(getErrorMessage(err));
      setVeterinarians([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  }, [offset, search, specializationFilter]);

  // --------------------------------------------------
  // Fetch my application
  // --------------------------------------------------

  const fetchMyApplication = useCallback(async () => {
    try {
      setApplicationLoading(true);
      setApplicationError("");

      const response = await api.get<Veterinarian>("/veterinarians/me");
      setMyApplication(response.data);
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
      fetchVeterinarians();
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [fetchVeterinarians]);

  useEffect(() => {
    fetchClinics();
    fetchMyApplication();
  }, [fetchClinics, fetchMyApplication]);

  // --------------------------------------------------
  // Form handling
  // --------------------------------------------------

  function updateForm(field: keyof VeterinarianForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function openNewApplicationForm() {
    setForm(initialForm);
    setLicenseDocument(null);
    setIsEditing(false);
    setShowApplicationForm(true);
    setApplicationError("");
    setSuccessMessage("");
  }

  function openEditApplicationForm() {
    if (!myApplication) return;

    setForm({
      clinic_id: String(myApplication.clinic_id),
      full_name: myApplication.full_name,
      phone: myApplication.phone,
      qualification: myApplication.qualification,
      license_number: myApplication.license_number,
      specialization: myApplication.specialization ?? "",
      years_of_experience:
        myApplication.years_of_experience != null
          ? String(myApplication.years_of_experience)
          : "",
    });
    setLicenseDocument(null);
    setIsEditing(true);
    setShowApplicationForm(true);
    setApplicationError("");
    setSuccessMessage("");
  }

  async function handleApplicationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApplicationError("");
    setSuccessMessage("");

    if (!form.clinic_id) {
      setApplicationError("Please select a veterinary clinic.");
      return;
    }

    if (!/^\d{7,20}$/.test(form.phone.replace(/[\s+-]/g, ""))) {
      setApplicationError("Enter a valid phone number.");
      return;
    }

    if (
      form.years_of_experience.trim() &&
      (!Number.isInteger(Number(form.years_of_experience)) ||
        Number(form.years_of_experience) < 0)
    ) {
      setApplicationError(
        "Years of experience must be a non-negative whole number.",
      );
      return;
    }

    if (licenseDocument) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(licenseDocument.type)) {
        setApplicationError(
          "Upload your license as a PDF, JPG, PNG or WEBP file.",
        );
        return;
      }
      if (licenseDocument.size > 10 * 1024 * 1024) {
        setApplicationError("The license document must be 10 MB or smaller.");
        return;
      }
    }

    const payload = {
      clinic_id: Number(form.clinic_id),
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      qualification: form.qualification.trim(),
      license_number: form.license_number.trim(),
      specialization: form.specialization.trim() || null,
      years_of_experience: form.years_of_experience.trim()
        ? Number(form.years_of_experience)
        : null,
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null) formData.append(key, String(value));
    });
    if (licenseDocument) {
      formData.append("license_document", licenseDocument);
    }

    try {
      setSubmitting(true);

      const response = isEditing
        ? await api.patch<Veterinarian>("/veterinarians/me", formData)
        : await api.post<Veterinarian>("/veterinarians/", formData);

      setMyApplication(response.data);
      setShowApplicationForm(false);
      setIsEditing(false);
      setLicenseDocument(null);
      setSuccessMessage(
        isEditing
          ? "Your veterinarian application has been updated successfully."
          : "Your veterinarian application has been submitted successfully!",
      );
      setActiveTab("application");
    } catch (err) {
      setApplicationError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // --------------------------------------------------
  // Application status
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
            type="button"
            onClick={fetchMyApplication}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!myApplication) {
      if (showApplicationForm) return renderApplicationForm();

      return (
        <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <ClipboardList size={26} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            You haven't applied yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Register your veterinary credentials to help provide trusted medical
            care for animals in your community.
          </p>
          <button
            type="button"
            onClick={openNewApplicationForm}
            className="veterinarians-action-button mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition"
          >
            Start application
            <ArrowRight size={17} />
          </button>
        </div>
      );
    }

    const clinic = clinicById.get(myApplication.clinic_id);

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Your veterinarian application
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Application #{myApplication.id}
              </h2>
            </div>
            <StatusBadge status={myApplication.approval_status} />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Professional details
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                {myApplication.full_name}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {myApplication.qualification}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                License: {myApplication.license_number}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Phone: {myApplication.phone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Specialization & experience
              </p>
              <p className="mt-2 font-medium text-slate-800">
                {myApplication.specialization || "General veterinary care"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {myApplication.years_of_experience == null
                  ? "Experience not specified"
                  : `${myApplication.years_of_experience} ${
                      myApplication.years_of_experience === 1 ? "year" : "years"
                    } of experience`}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Associated clinic
              </p>
              <div className="mt-2 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <Building2
                  size={19}
                  className="mt-0.5 shrink-0 text-indigo-500"
                />
                <div>
                  <p className="font-semibold text-slate-800">
                    {clinic?.name ?? `Clinic #${myApplication.clinic_id}`}
                  </p>
                  {clinic && (
                    <p className="mt-1 text-sm text-slate-500">
                      {clinic.address}, {clinic.city}, {clinic.state} —{" "}
                      {clinic.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                License document
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <FileText size={17} className="text-indigo-500" />
                {myApplication.license_document_path
                  ? "License document submitted"
                  : "No license document on record"}
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
                    Your credentials have been submitted. Our administration
                    team will review your application and update its status.
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
                    Your application is approved!
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    Your veterinarian profile has been verified.
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
                    {myApplication.rejection_reason ||
                      "Your application was not approved. Please review your details or contact the administration team."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {myApplication.approval_status === "suspended" && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <ShieldAlert
                  className="mt-0.5 shrink-0 text-slate-600"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Profile temporarily suspended
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Your veterinarian profile is currently suspended. Please
                    contact the administration team for further information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {myApplication.approval_status !== "suspended" && (
            <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={openEditApplicationForm}
                className="veterinarians-secondary-button inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
              >
                <Pencil size={15} />
                Edit application
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Application form
  // --------------------------------------------------

  function renderApplicationForm() {
    const inputClass =
      "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => {
              setShowApplicationForm(false);
              setApplicationError("");
            }}
            className="mb-4 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            ← Back to application overview
          </button>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing
              ? "Update veterinarian application"
              : "Register as a veterinarian"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Provide your professional details and select the clinic you are
            associated with. Your credentials will be reviewed by our team.
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

          <div>
            <h3 className="font-semibold text-slate-900">
              Personal information
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Full name *
                <input
                  required
                  minLength={2}
                  maxLength={150}
                  value={form.full_name}
                  onChange={(e) => updateForm("full_name", e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Phone number *
                <input
                  required
                  type="tel"
                  minLength={7}
                  maxLength={20}
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Associated clinic *
                <select
                  required
                  value={form.clinic_id}
                  onChange={(e) => updateForm("clinic_id", e.target.value)}
                  className={inputClass}
                  disabled={clinicsLoading || clinics.length === 0}
                >
                  <option value="">
                    {clinicsLoading ? "Loading clinics..." : "Select a clinic"}
                  </option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {getClinicLabel(clinic)}
                    </option>
                  ))}
                </select>
                {clinicError ? (
                  <span className="mt-2 block text-xs text-red-600">
                    {clinicError}
                  </span>
                ) : clinics.length === 0 && !clinicsLoading ? (
                  <span className="mt-2 block text-xs text-amber-700">
                    No active clinics are available. Please try again later.
                  </span>
                ) : null}
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-slate-900">
              Professional credentials
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Qualification *
                <input
                  required
                  minLength={2}
                  maxLength={150}
                  value={form.qualification}
                  onChange={(e) => updateForm("qualification", e.target.value)}
                  placeholder="e.g. BVSc & AH"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                License number *
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.license_number}
                  onChange={(e) => updateForm("license_number", e.target.value)}
                  placeholder="Enter your registration number"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Specialization
                <input
                  maxLength={150}
                  value={form.specialization}
                  onChange={(e) => updateForm("specialization", e.target.value)}
                  placeholder="e.g. Surgery, Dermatology"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Years of experience
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.years_of_experience}
                  onChange={(e) =>
                    updateForm("years_of_experience", e.target.value)
                  }
                  placeholder="e.g. 5"
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-slate-900">
              License verification
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload a clear copy of your professional license or registration
              certificate. Accepted formats: PDF, JPG, PNG and WEBP (maximum 10
              MB).
            </p>

            {isEditing && myApplication?.license_document_path && (
              <p className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 size={15} />A license document is already on file.
                Upload another to replace it.
              </p>
            )}

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
              <Upload size={24} className="text-indigo-500" />
              <span className="mt-3 text-sm font-semibold text-slate-700">
                {licenseDocument
                  ? licenseDocument.name
                  : "Choose license document"}
              </span>
              <span className="mt-1 text-xs text-slate-400">
                {licenseDocument
                  ? `${(licenseDocument.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Click to browse your files"}
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) =>
                  setLicenseDocument(e.target.files?.[0] ?? null)
                }
              />
            </label>

            {licenseDocument && (
              <button
                type="button"
                onClick={() => setLicenseDocument(null)}
                className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Remove selected file
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || clinicsLoading || clinics.length === 0}
            className="veterinarians-action-button flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isEditing
                  ? "Updating application..."
                  : "Submitting application..."}
              </>
            ) : (
              <>
                {isEditing ? "Save changes" : "Submit application"}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="text-center text-xs leading-5 text-slate-400">
            By submitting, you confirm that the professional information and
            documents provided are accurate and may be verified by our team.
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
            <Stethoscope size={17} />
            Veterinary network
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Veterinarians
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Discover veterinary professionals and connect with trusted medical
            care providers for animals in your community.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchVeterinarians();
            fetchMyApplication();
            fetchClinics();
          }}
          className="veterinarians-action-button inline-flex items-center justify-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition sm:self-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-[#f5f5ff] p-6 text-[#20234a] sm:p-8">
        <div className="relative z-10 max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#5555b8]">
            <BriefcaseMedical size={14} />
            Professional veterinary care
          </div>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            Better care starts with the right people.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
            Find verified veterinary professionals, explore their expertise and
            help make quality animal healthcare more accessible.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("application");
              setShowApplicationForm(false);
              setSuccessMessage("");
              setApplicationError("");
            }}
            className="veterinarians-action-button mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition"
          >
            {myApplication ? "View my application" : "Join as a veterinarian"}
            <ArrowRight size={17} />
          </button>
        </div>
        <Stethoscope
          className="absolute -bottom-10 -right-6 hidden text-indigo-200/60 sm:block"
          size={220}
          strokeWidth={1}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("discover")}
          className={`relative px-5 py-3 text-sm font-semibold transition ${
            activeTab === "discover"
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <Stethoscope size={17} />
            Discover veterinarians
          </span>
          {activeTab === "discover" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
          )}
        </button>

        <button
          type="button"
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
          {/* Search and filters */}
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
                  setOffset(0);
                }}
                placeholder="Search by name, qualification or specialization..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>

            <div className="relative">
              <Filter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={specializationFilter}
                onChange={(e) => {
                  setSpecializationFilter(e.target.value);
                  setOffset(0);
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              >
                <option value="all">All specializations</option>
                {specializations.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900">
                Veterinary professionals
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {veterinarians.length} veterinarian
                {veterinarians.length !== 1 ? "s" : ""} on this page
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="mt-4 text-sm text-slate-500">
                Finding veterinarians...
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
                type="button"
                onClick={fetchVeterinarians}
                className="mt-4 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && veterinarians.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Stethoscope size={30} />
              </div>
              <h3 className="mt-5 font-bold text-slate-900">
                No veterinarians found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search.trim() || specializationFilter !== "all"
                  ? "No veterinarians match your current search. Try adjusting your filters."
                  : "There are no approved veterinarians available in the directory yet. Check back soon."}
              </p>
              {(search.trim() || specializationFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSpecializationFilter("all");
                    setOffset(0);
                  }}
                  className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Veterinarian cards */}
          {!loading && !error && veterinarians.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {veterinarians.map((vet) => {
                const clinic = clinicById.get(vet.clinic_id);

                return (
                  <div
                    key={vet.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-600/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-bold uppercase text-indigo-600">
                        {getInitials(vet.full_name) || "DR"}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={13} />
                        Verified
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      Dr. {vet.full_name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-indigo-600">
                      {vet.qualification}
                    </p>

                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <BriefcaseMedical
                          size={16}
                          className="shrink-0 text-slate-400"
                        />
                        {vet.specialization || "General veterinary care"}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={16} className="shrink-0 text-slate-400" />
                        {vet.years_of_experience == null
                          ? "Experience not specified"
                          : `${vet.years_of_experience} ${
                              vet.years_of_experience === 1 ? "year" : "years"
                            } experience`}
                      </p>
                      <p className="flex items-start gap-2 text-sm text-slate-500">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />
                        <span>
                          {clinic
                            ? `${clinic.city}, ${clinic.state}`
                            : `Clinic #${vet.clinic_id}`}
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Associated clinic
                      </p>
                      <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                        <Building2
                          size={16}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />
                        <span className="font-medium">
                          {clinic?.name ?? `Clinic #${vet.clinic_id}`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-medium text-emerald-600">
                        Licensed professional
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                        Verified profile
                        <CheckCircle2 size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && veterinarians.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row">
              <p className="text-sm text-slate-500">
                Showing {offset + 1}–{offset + veterinarians.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setOffset((value) =>
                      Math.max(0, value - VETERINARIANS_PER_PAGE),
                    )
                  }
                  disabled={offset === 0 || loading}
                  className="veterinarians-secondary-button rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setOffset((value) => value + VETERINARIANS_PER_PAGE)
                  }
                  disabled={!hasNextPage || loading}
                  className="veterinarians-secondary-button rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My application */}
      {activeTab === "application" &&
        (showApplicationForm
          ? renderApplicationForm()
          : renderApplicationStatus())}
    </div>
  );
}
