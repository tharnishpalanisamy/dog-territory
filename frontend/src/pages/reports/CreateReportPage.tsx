import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import axios from "axios";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Bandage,
  Check,
  ChevronLeft,
  CircleHelp,
  Dog,
  MapPin,
  PawPrint,
  Plus,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react";
import api from "../../lib/api";
import { useToast } from "../../components/ui/Toast";

type ReportType =
  | "aggressive"
  | "sick"
  | "injured"
  | "uncollared"
  | "deceased"
  | "other";
interface UserLocation {
  state?: string | null;
  district?: string | null;
  area_name?: string | null;
  pincode?: string | null;
}
interface ProfileUser {
  location?: UserLocation | null;
  state?: string | null;
  district?: string | null;
  phone_number?: string | null;
}
interface DogDetails {
  id: number;
  dog_code: string;
  state: string | null;
  district: string | null;
  area_name: string | null;
  pincode: string | null;
}
interface ReportSummary {
  id: number;
  report_type: ReportType;
  description: string | null;
  pincode: string;
  location: string;
  status: string;
  created_at: string;
}
interface UserReport extends ReportSummary {
  state?: string;
  district?: string;
  area_name?: string;
  image_filename?: string | null;
}
type FieldName =
  | "report_type"
  | "description"
  | "state"
  | "district"
  | "area_name"
  | "pincode"
  | "landmark"
  | "dog_code"
  | "image"
  | "phone_number";
type FieldErrors = Partial<Record<FieldName, string>>;

const reportTypes: {
  value: ReportType;
  label: string;
  detail: string;
  Icon: typeof Dog;
}[] = [
  {
    value: "aggressive",
    label: "Aggressive",
    detail: "Dog showing threatening behavior",
    Icon: ShieldAlert,
  },
  {
    value: "sick",
    label: "Sick",
    detail: "Dog appears unwell or needs care",
    Icon: AlertTriangle,
  },
  {
    value: "injured",
    label: "Injured",
    detail: "Dog has a visible injury",
    Icon: Bandage,
  },
  {
    value: "uncollared",
    label: "Uncollared",
    detail: "Dog without a collar",
    Icon: Dog,
  },
  {
    value: "deceased",
    label: "Deceased",
    detail: "Dog found deceased",
    Icon: PawPrint,
  },
  {
    value: "other",
    label: "Other",
    detail: "Something else to report",
    Icon: CircleHelp,
  },
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function savedLocation(): { state: string; district: string } {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { state: "", district: "" };
    const user = JSON.parse(raw) as ProfileUser;
    return {
      state: user.location?.state ?? user.state ?? "",
      district: user.location?.district ?? user.district ?? "",
    };
  } catch {
    return { state: "", district: "" };
  }
}

export default function CreateReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [profileLocation, setProfileLocation] = useState(savedLocation);
  const [dogDetails, setDogDetails] = useState<DogDetails | null>(null);
  const [dogArea, setDogArea] = useState("");
  const [dogPincode, setDogPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const requestedDogId = new URLSearchParams(location.search).get("dog_id") ?? "";
  useEffect(() => {
    if (!/^\d+$/.test(requestedDogId)) return;
    let active = true;
    api
      .get<DogDetails>(`/dogs/${requestedDogId}`)
      .then(({ data }) => {
        if (!active) return;
        setDogDetails(data);
        setProfileLocation((current) => ({
          state: data.state || current.state,
          district: data.district || current.district,
        }));
        setDogArea(data.area_name || "");
        setDogPincode(data.pincode || "");
      })
      .catch(() => {
        /* Keep the report form available if dog details cannot be loaded. */
      });
    return () => {
      active = false;
    };
  }, [requestedDogId]);
  const [reportType, setReportType] = useState<ReportType | "">(() => {
    const requestedType = new URLSearchParams(location.search).get("report_type");
    return reportTypes.some(({ value }) => value === requestedType)
      ? (requestedType as ReportType)
      : "";
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get<ProfileUser>("/users/me")
      .then(({ data }) => {
        if (!active) return;
        setProfileLocation({
          state: data.location?.state ?? data.state ?? "",
          district: data.location?.district ?? data.district ?? "",
        });
        setPhoneNumber(data.phone_number ?? null);
      })
      .catch(() => {
        /* Use the cached profile location when offline. */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  function validateImage(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        image: "Choose a JPEG, PNG or WEBP image.",
      }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((current) => ({
        ...current,
        image: "Image must be 5 MB or smaller.",
      }));
      return;
    }
    setErrors((current) => ({ ...current, image: undefined }));
    setPreview(URL.createObjectURL(file));
    setImage(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    validateImage(event.target.files?.[0]);
    event.target.value = "";
  }
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    validateImage(event.dataTransfer.files[0]);
  }

  function validate(form: HTMLFormElement): { data: FormData; valid: boolean } {
    const data = new FormData(form);
    const next: FieldErrors = {};
    if (!reportType) next.report_type = "Choose a report type.";
    if (reportType === "other" && !String(data.get("description") ?? "").trim())
      next.description = "Add a description for an other report.";
    for (const field of [
      "state",
      "district",
      "area_name",
      "landmark",
    ] as const) {
      if (!String(data.get(field) ?? "").trim())
        next[field] = "This field is required.";
    }
    const pincode = String(data.get("pincode") ?? "").trim();
    if (!pincode) next.pincode = "Enter the dog's PIN code.";
    else if (!/^\d{6}$/.test(pincode))
      next.pincode = "Enter a valid six digit PIN code.";
    if (image && !ACCEPTED_TYPES.includes(image.type))
      next.image = "Choose a JPEG, PNG or WEBP image.";
    else if (!image && errors.image) next.image = errors.image;
    if (!phoneNumber) {
      const enteredPhone = String(data.get("phone_number") ?? "").trim();
      const compactPhone = enteredPhone.replace(/[\s()-]/g, "");
      if (enteredPhone && !/^(?:\+91)?[6-9]\d{9}$/.test(compactPhone))
        next.phone_number = "Enter a valid 10 digit Indian mobile number.";
    }
    setErrors(next);
    return { data, valid: Object.keys(next).length === 0 };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const { data, valid } = validate(event.currentTarget);
    if (!valid) {
      showToast("error", "Please complete the required report information before submitting.");
      return;
    }
    const body = new FormData();
    body.append("report_type", reportType);
    const description = String(data.get("description") ?? "").trim();
    if (description) body.append("description", description);
    for (const field of [
      "state",
      "district",
      "area_name",
      "pincode",
      "landmark",
    ] as const)
      body.append(field, String(data.get(field) ?? "").trim());
    const dogCode = String(data.get("dog_code") ?? "").trim();
    if (dogCode) body.append("dog_code", dogCode);
    const enteredPhone = String(data.get("phone_number") ?? "").trim();
    if (!phoneNumber && enteredPhone) {
      const digits = enteredPhone.replace(/\D/g, "");
      body.append("phone_number", `+91${digits.slice(-10)}`);
    }
    if (image) body.append("image", image);
    setSubmitting(true);
    try {
      const response = await api.post<ReportSummary>("/reports/create", body);
      showToast("success", "Your report has been submitted.");
      if (response.data?.id)
        navigate(`/user/reports/${response.data.id}`, {
          state: { report: response.data },
        });
      else navigate("/user");
    } catch (error) {
      const detail =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : "We couldn't submit your report. Please try again.";
      showToast("error", detail);
    } finally {
      setSubmitting(false);
    }
  }

  function fieldError(name: FieldName) {
    return errors[name] ? (
      <p className="mt-1.5 text-sm text-rose-600" role="alert">
        {errors[name]}
      </p>
    ) : null;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        to="/user/reports"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
      >
        <ChevronLeft size={17} /> Back to reports
      </Link>
      <header>
        <p className="text-xs font-bold tracking-[1.5px] text-indigo-500">
          COMMUNITY CARE
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          Report a dog
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Share what you noticed so the community can respond with care.
        </p>
      </header>
      <form
        onSubmit={submit}
        noValidate
        className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]"
      >
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                01
              </span>
              <div>
                <h2 className="font-bold text-slate-900">What did you see?</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the report type that best describes the dog.
                </p>
              </div>
            </div>
            <div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
              role="radiogroup"
              aria-label="Report type"
            >
              {reportTypes.map(({ value, label, detail, Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={reportType === value}
                  onClick={() => {
                    setReportType(value);
                    setErrors((current) => ({
                      ...current,
                      report_type: undefined,
                    }));
                  }}
                  className={`rounded-xl border p-4 text-left transition ${reportType === value ? "border-indigo-400 bg-indigo-50/70 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"}`}
                >
                  <span
                    className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${reportType === value ? "bg-white text-indigo-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    <Icon size={19} />
                  </span>
                  <span className="block text-sm font-bold text-slate-800">
                    {label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {detail}
                  </span>
                  {reportType === value && (
                    <Check className="absolute" size={0} aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
            {fieldError("report_type")}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Dog code{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </span>
                <input
                  name="dog_code"
                  maxLength={50}
                  placeholder="e.g. 600001-101"
                  defaultValue={dogDetails?.dog_code ?? ""}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Description{" "}
                <span className="font-normal text-slate-400">
                  {reportType === "other" ? "(required)" : "(optional)"}
                </span>
              </span>
              <textarea
                name="description"
                rows={4}
                maxLength={255}
                placeholder="Describe what you noticed and any details that could help..."
                onChange={() =>
                  setErrors((current) => ({
                    ...current,
                    description: undefined,
                  }))
                }
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
              {fieldError("description")}
            </label>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                02
              </span>
              <div>
                <h2 className="font-bold text-slate-900">
                  Where did you spot the dog?
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Enter the dog's actual location. This may be different from
                  your home or profile location.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  State <b className="text-rose-500">*</b>
                </span>
                <input
                  name="state"
                  required
                  maxLength={100}
                  value={profileLocation.state}
                  onChange={(event) =>
                    setProfileLocation((current) => ({
                      ...current,
                      state: event.target.value,
                    }))
                  }
                  placeholder="State where spotted"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
                {fieldError("state")}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  District <b className="text-rose-500">*</b>
                </span>
                <input
                  name="district"
                  required
                  maxLength={100}
                  value={profileLocation.district}
                  onChange={(event) =>
                    setProfileLocation((current) => ({
                      ...current,
                      district: event.target.value,
                    }))
                  }
                  placeholder="District where spotted"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
                {fieldError("district")}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Area name <b className="text-rose-500">*</b>
                </span>
                <input
                  name="area_name"
                  required
                  maxLength={100}
                  value={dogArea}
                  onChange={(event) => setDogArea(event.target.value)}
                  placeholder="Neighborhood or area"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
                {fieldError("area_name")}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  PIN code <b className="text-rose-500">*</b>
                </span>
                <input
                  name="pincode"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={6}
                  value={dogPincode}
                  onChange={(event) => setDogPincode(event.target.value)}
                  placeholder="Six digit PIN code"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
                {fieldError("pincode")}
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Specific location or landmark <b className="text-rose-500">*</b>
              </span>
              <textarea
                name="landmark"
                required
                rows={3}
                maxLength={1000}
                placeholder="Street, nearby landmark, or directions to where the dog was seen"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
              {fieldError("landmark")}
            </label>
            {/* <p className="mt-3 flex gap-2 rounded-xl bg-indigo-50/70 p-3 text-xs leading-5 text-indigo-800">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              Your profile only fills in state and district for convenience.
              Please confirm or edit them and enter the dog's area, PIN code,
              and exact location above.
            </p> */}
          </section>
          {!phoneNumber && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Phone number <span className="font-normal text-slate-400">(optional)</span>
                </span>
                <input
                  name="phone_number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  maxLength={16}
                  placeholder="98765 43210"
                  onChange={() => setErrors((current) => ({ ...current, phone_number: undefined }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
                <p className="mt-1.5 text-xs text-slate-500">We’ll save this to your profile for future reports.</p>
                {errors.phone_number && <p className="mt-1.5 text-sm text-rose-600" role="alert">{errors.phone_number}</p>}
              </label>
            </section>
          )}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                03
              </span>
              <div>
                <h2 className="font-bold text-slate-900">Add a photo</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Optional · one image, up to 5 MB
                </p>
              </div>
            </div>
            {preview ? (
              <div className="relative overflow-hidden rounded-xl border border-slate-200">
                <img
                  src={preview}
                  alt="Selected report"
                  className="max-h-72 w-full object-contain bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview("");
                    setErrors((current) => ({ ...current, image: undefined }));
                  }}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-600 shadow hover:text-rose-600"
                  aria-label="Remove selected image"
                >
                  <X size={18} />
                </button>
                <p className="px-3 py-2 text-xs text-slate-500">
                  {image?.name}
                </p>
              </div>
            ) : (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`rounded-xl border border-dashed p-6 text-center transition ${dragging ? "border-indigo-400 bg-indigo-50" : "border-slate-300 bg-slate-50/70"}`}
              >
                <Upload className="mx-auto text-indigo-500" size={24} />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  Drop an image here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="text-indigo-600 underline underline-offset-2"
                  >
                    browse files
                  </button>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  JPEG, PNG or WEBP · max 5 MB
                </p>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Upload a report image"
                />
              </div>
            )}
            {fieldError("image")}
          </section>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/user/reports"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting report…" : "Submit report"}
              <Upload size={16} />
            </button>
          </div>
        </div>
        <aside className="h-fit rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-indigo-600">
            <PawPrint size={20} />
          </div>
          <h2 className="mt-4 font-bold text-slate-900">
            Thank you for looking out
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your report helps local people understand where a dog may need
            support.
          </p>
          <div className="mt-4 border-t border-indigo-100 pt-4 text-xs leading-5 text-slate-500">
            Please share the location where you actually saw the dog. Only state
            and district may be suggested from your profile.
          </div>
        </aside>
      </form>
    </div>
  );
}

const reportLabels: Record<ReportType, string> = {
  aggressive: "Aggressive",
  sick: "Sick",
  injured: "Injured",
  uncollared: "Uncollared",
  deceased: "Deceased",
  other: "Other",
};

export function UserReportsPage() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    api
      .get<UserReport[]>("/reports/me")
      .then(({ data }) => setReports(data))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[1.5px] text-indigo-500">
            COMMUNITY UPDATES
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            My reports
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Reports you have submitted to Dog Territory.
          </p>
        </div>
        <Link
          to="/user/reports/create"
          className="report-dog-action inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus size={17} strokeWidth={2.4} />
          Report a dog
          <ArrowRight size={16} />
        </Link>
      </header>
      {loading ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading your reports…
        </p>
      ) : loadError ? (
        <p
          role="alert"
          className="rounded-2xl border border-rose-200 bg-white p-8 text-center text-sm text-rose-700"
        >
          We couldn't load your reports. Please try again.
        </p>
      ) : reports.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <PawPrint className="mx-auto text-indigo-500" />
          <h2 className="mt-3 font-bold text-slate-900">No reports yet</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your submitted reports will appear here.
          </p>
          <Link
            to="/user/reports/create"
            className="report-dog-action mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <Plus size={17} strokeWidth={2.4} />
            Report a dog
            <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/user/reports/${report.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold text-slate-900">
                  {reportLabels[report.report_type]}
                </span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {report.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                {report.description || "No additional description"}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={14} />
                {report.location}, {report.pincode}
              </p>
              <p className="mt-3 text-xs text-slate-400">
                Submitted{" "}
                {new Date(report.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function UserReportDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [report, setReport] = useState<UserReport | null>(
    () => (location.state as { report?: UserReport } | null)?.report ?? null,
  );
  const [loading, setLoading] = useState(!report);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    if (!id || report?.id === Number(id)) return;
    api
      .get<UserReport[]>("/reports/me")
      .then(({ data }) => {
        const found = data.find((item) => item.id === Number(id)) ?? null;
        setReport(found);
        setNotFound(!found);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, report?.id]);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        to="/user/reports"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-indigo-600"
      >
        <ChevronLeft size={17} /> Back to reports
      </Link>
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading report…
        </div>
      ) : notFound || !report ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="font-bold text-slate-900">Report not found</h1>
          <Link
            to="/user/reports"
            className="mt-3 inline-block text-sm font-semibold text-indigo-600"
          >
            Return to your reports
          </Link>
        </div>
      ) : (
        <>
          <header>
            <p className="text-xs font-bold tracking-[1.5px] text-indigo-500">
              REPORT DT-R{String(report.id).padStart(4, "0")}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              {reportLabels[report.report_type]}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Submitted{" "}
              {new Date(report.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </header>
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Status
              </span>
              <p className="mt-1 inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold capitalize text-indigo-700">
                {report.status.replaceAll("_", " ")}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">Description</h2>
              <p className="mt-1 text-sm text-slate-600">
                {report.description || "No additional description provided."}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">
                Dog's reported location
              </h2>
              <p className="mt-1 flex items-start gap-2 text-sm text-slate-600">
                <MapPin size={16} className="mt-0.5 shrink-0 text-indigo-500" />
                {[
                  report.location,
                  report.area_name,
                  report.district,
                  report.state,
                  report.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
