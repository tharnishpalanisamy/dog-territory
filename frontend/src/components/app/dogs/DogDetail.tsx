import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Dog,
  Heart,
  MapPin,
  PawPrint,
  ShieldCheck,
  Syringe,
  AlertCircle,
  RefreshCw,
  FileText,
} from "lucide-react";

import api from "../../../lib/api";

interface DogImageItem {
  id: number;
  image_url: string | null;
  is_primary: boolean;
}

interface DogDetail {
  id: number;
  dog_code: string;
  estimated_age: number | null;
  color: string | null;
  description: string | null;
  is_sterilized: boolean | null;
  status: string;
  vaccination_status: string;
  vaccination_date: string | null;
  next_booster_due_date: string | null;
  state: string | null;
  district: string | null;
  area_name: string | null;
  pincode: string | null;
  created_at: string | null;
  updated_at: string | null;
  images?: DogImageItem[];
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not recorded";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not recorded";

  return value.replaceAll("_", " ");
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const styles =
    normalized === "active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : normalized === "inactive"
        ? "bg-stone-100 text-stone-600 ring-stone-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${styles}`}
    >
      {formatLabel(status)}
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-center gap-2 text-stone-500">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>

      <p className="mt-3 text-lg font-bold capitalize text-stone-900">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-stone-500">{description}</p>
      )}
    </div>
  );
}

function PhotoPlaceholder() {
  return (
    <div className="flex h-full min-h-[300px] w-full flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-orange-50 text-stone-400">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
        <Dog size={52} strokeWidth={1.3} />
      </div>
      <p className="mt-4 text-sm font-medium">No photo available</p>
    </div>
  );
}

export default function DogDetail() {
  const { dog_id } = useParams<{ dog_id: string }>();
  const navigate = useNavigate();

  const [dog, setDog] = useState<DogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDog = useCallback(async () => {
    if (!dog_id || !/^\d+$/.test(dog_id)) {
      setError("Invalid dog profile.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get<DogDetail>(`/dogs/${dog_id}`);
      setDog(response.data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError("This dog profile could not be found.");
      } else {
        setError(
          err?.response?.data?.detail ||
            "Unable to load this dog profile. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [dog_id]);

  useEffect(() => {
    fetchDog();
  }, [fetchDog]);

  const reportDog = () => {
    if (!dog) return;

    navigate(`/user/reports/create?dog_id=${dog.id}`);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-stone-200" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-stone-200" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded bg-stone-200" />
            <div className="h-24 animate-pulse rounded-2xl bg-stone-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-stone-100" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !dog) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-stone-900">
            Dog profile unavailable
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            {error || "We couldn't find this dog."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700"
            >
              Go back
            </button>
            <button
              onClick={fetchDog}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const primaryImage =
    dog.images?.find((image) => image.is_primary && image.image_url)
      ?.image_url || dog.images?.find((image) => image.image_url)?.image_url;

  const location = [dog.area_name, dog.district, dog.state]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-stone-900"
      >
        <ArrowLeft size={17} />
        Back to dogs
      </button>

      {/* Main profile */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Image */}
        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 lg:aspect-auto lg:min-h-[430px]">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={`Dog ${dog.dog_code}`}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <PhotoPlaceholder />
          )}

          <div className="absolute bottom-4 left-4 rounded-xl bg-black/70 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
              Dog identification code
            </p>
            <p className="mt-1 text-lg font-bold tracking-wide text-white">
              {dog.dog_code}
            </p>
          </div>
        </div>

        {/* Basic details */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={dog.status} />
            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
              Community dog
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Dog profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            View the available information and health records for this community
            dog.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <InfoCard
              icon={<CalendarDays size={17} />}
              label="Estimated age"
              value={
                dog.estimated_age === null
                  ? "Unknown"
                  : dog.estimated_age === 0
                    ? "Under 1 year"
                    : `${dog.estimated_age} years`
              }
            />

            <InfoCard
              icon={<PawPrint size={17} />}
              label="Coat colour"
              value={dog.color || "Unknown"}
            />
          </div>

          {/* Location */}
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-2 text-stone-500">
              <MapPin size={18} className="text-orange-600" />
              <span className="text-sm font-semibold">Registered location</span>
            </div>

            <p className="mt-3 font-semibold text-stone-900">
              {location || "Location not recorded"}
            </p>

            {dog.pincode && (
              <p className="mt-1 text-sm text-stone-500">
                Pincode: {dog.pincode}
              </p>
            )}
          </div>

          {/* Actions
          <div className="mt-auto flex justify-end pt-6">
            <button
              onClick={reportDog}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700 sm:w-auto"
            >
              <Heart size={17} />
              Report a concern
            </button>
          </div> */}
        </div>
      </section>

      {/* Health information */}
      <section className="mt-10">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-orange-600" size={21} />
            <h2 className="text-xl font-bold text-stone-900">
              Health information
            </h2>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            Available vaccination and sterilization records.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<Syringe size={18} />}
            label="Vaccination status"
            value={formatLabel(dog.vaccination_status)}
          />

          <InfoCard
            icon={<CalendarDays size={18} />}
            label="Last vaccination"
            value={formatDate(dog.vaccination_date)}
          />

          <InfoCard
            icon={<Clock3 size={18} />}
            label="Next booster due"
            value={formatDate(dog.next_booster_due_date)}
          />

          <InfoCard
            icon={<ShieldCheck size={18} />}
            label="Sterilization"
            value={
              dog.is_sterilized === null
                ? "Not recorded"
                : dog.is_sterilized
                  ? "Sterilized"
                  : "Not sterilized"
            }
          />
        </div>
      </section>

      {/* Description */}
      <section className="mt-10">
        <div className="mb-5 flex items-center gap-2">
          <FileText className="text-orange-600" size={21} />
          <h2 className="text-xl font-bold text-stone-900">About this dog</h2>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          {dog.description ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-stone-600">
              {dog.description}
            </p>
          ) : (
            <p className="text-sm text-stone-400">
              No additional description has been provided.
            </p>
          )}
        </div>
      </section>

      {/* Record information */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900">Record information</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Registered on
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-700">
              {formatDate(dog.created_at)}
            </p>
          </div>

          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Last profile update
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-700">
              {formatDate(dog.updated_at)}
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-10 rounded-2xl border border-orange-100 bg-orange-50 p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Notice something about this dog?
            </h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Share an update with the community so this dog can receive the
              care it needs.
            </p>
          </div>

          <button
            onClick={reportDog}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <Heart size={16} />
            Submit a report
          </button>
        </div>
      </section>
    </main>
  );
}
