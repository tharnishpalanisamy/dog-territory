import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Dog,
  Heart,
  MapPin,
  PawPrint,
  Search,
  ShieldCheck,
  Syringe,
  X,
} from "lucide-react";

import api from "../../../lib/api";
import Button from "../../ui/Button";

interface StoredUser {
  id: number;
  location?: {
    pincode?: string;
    area_name?: string;
    district?: string;
    state?: string;
  };
}

interface DogItem {
  id: number;
  dog_code: string;
  estimated_age: number | null;
  color: string | null;
  status: string;
  vaccination_status: string;
  is_sterilized?: boolean | null;
  area_name?: string | null;
  image_url?: string | null;
}

interface DogFilters {
  vaccination_status: string;
  is_sterilized: string;
}

const PAGE_SIZE = 12;

function getStoredUser(): StoredUser | null {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? (JSON.parse(rawUser) as StoredUser) : null;
  } catch {
    return null;
  }
}

function getVaccinationLabel(status: string) {
  const normalized = status?.toLowerCase();

  if (normalized === "vaccinated") return "Vaccinated";
  if (normalized === "partially_vaccinated") return "Partially vaccinated";
  if (normalized === "not_vaccinated") return "Not vaccinated";

  return status?.replaceAll("_", " ") || "Unknown";
}

function DogImage({ src }: { src?: string | null }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-orange-50 text-stone-400">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
          <Dog size={42} strokeWidth={1.4} />
        </div>
        <span className="mt-3 text-xs font-medium text-stone-400">
          Photo unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Community dog"
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

function StatusPill({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "success" | "warning" | "neutral";
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    warning: "bg-amber-50 text-amber-700 ring-amber-100",
    neutral: "bg-stone-100 text-stone-600 ring-stone-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export default function ExploreDogs() {
  const navigate = useNavigate();

  const [pincode, setPincode] = useState(() => getStoredUser()?.location?.pincode);
  const [locationVersion, setLocationVersion] = useState(0);
  const [dogs, setDogs] = useState<DogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<DogFilters>({
    vaccination_status: "",
    is_sterilized: "",
  });

  const fetchDogs = useCallback(async () => {
    if (!pincode) {
      setDogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params: Record<string, string | number | boolean> = {
        pincode,
        status: "active",
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        sort_by: "created_at",
        order: "desc",
      };

      if (filters.vaccination_status) {
        params.vaccination_status = filters.vaccination_status;
      }

      if (filters.is_sterilized !== "") {
        params.is_sterilized = filters.is_sterilized === "true";
      }

      const response = await api.get<DogItem[]>("/dogs/", { params });

      const results = Array.isArray(response.data) ? response.data : [];

      setDogs(results);
      setHasNextPage(results.length === PAGE_SIZE);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "We couldn't load the dogs in your area. Please try again.",
      );
      setDogs([]);
    } finally {
      setLoading(false);
    }
  }, [pincode, page, filters]);

  useEffect(() => {
    const syncLocation = () => {
      setPincode(getStoredUser()?.location?.pincode);
      setLocationVersion((version) => version + 1);
    };
    window.addEventListener("focus", syncLocation);
    window.addEventListener("dog-territory:user-updated", syncLocation);
    return () => {
      window.removeEventListener("focus", syncLocation);
      window.removeEventListener("dog-territory:user-updated", syncLocation);
    };
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs, locationVersion]);

  const visibleDogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return dogs;

    return dogs.filter((dog) => dog.dog_code.toLowerCase().includes(query));
  }, [dogs, search]);

  const updateFilter = (key: keyof DogFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      vaccination_status: "",
      is_sterilized: "",
    });
    setSearch("");
    setPage(1);
  };

  const reportDog = (dog: DogItem, type: "concern" | "sighting") => {
    navigate(
      type === "concern"
        ? `/user/reports/create?dog_id=${dog.id}`
        : `/user/reports/create?dog_id=${dog.id}&report_type=uncollared`,
    );
  };

  const hasFilters =
    Boolean(search) ||
    Boolean(filters.vaccination_status) ||
    filters.is_sterilized !== "";

  if (!pincode) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <MapPin className="mx-auto h-10 w-10 text-amber-600" />
          <h2 className="mt-4 text-xl font-bold text-stone-900">
            Add your location to explore dogs
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            We use your profile pincode to show community dogs in your area. Add
            your location to get started.
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => navigate("/user/profile")}
          >
            Update profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page heading */}
      <section className="mb-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
              <PawPrint size={14} />
              COMMUNITY DIRECTORY
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Explore Dogs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
              Meet the dogs in your neighbourhood. Explore their profiles and
              help your community keep them safe.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3">
            <MapPin size={17} className="text-orange-600" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
                Your area pincode
              </p>
              <p className="text-sm font-bold text-stone-800">{pincode}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting banner */}
      <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
            <Heart size={22} />
          </div>
          <div>
            <h2 className="font-bold text-stone-900">
              Help a dog in your neighbourhood
            </h2>
            <p className="mt-1 text-sm leading-5 text-stone-600">
              Spotted a dog that needs help, or want to register a new sighting?
              Let your community know.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          className="shrink-0"
          onClick={() =>
            navigate("/user/reports/create?report_type=uncollared")
          }
        >
          Report a sighting
        </Button>
      </section>

      {/* Filters */}
      <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by dog code..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <select
                value={filters.vaccination_status}
                onChange={(event) =>
                  updateFilter("vaccination_status", event.target.value)
                }
                className="min-w-0 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none focus:border-orange-400"
              >
                <option value="">All vaccination</option>
                <option value="vaccinated">Vaccinated</option>
                <option value="not_vaccinated">Not vaccinated</option>
                <option value="partially_vaccinated">
                  Partially vaccinated
                </option>
              </select>

              <select
                value={filters.is_sterilized}
                onChange={(event) =>
                  updateFilter("is_sterilized", event.target.value)
                }
                className="min-w-0 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none focus:border-orange-400"
              >
                <option value="">All sterilization</option>
                <option value="true">Sterilized</option>
                <option value="false">Not sterilized</option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
              <p className="text-xs text-stone-500">
                Search and filters applied
              </p>
              <Button
                variant="secondary"
                onClick={clearFilters}
                className="min-h-9 gap-1.5 px-3 text-xs"
              >
                <X size={14} />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Results heading */}
      <section className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900 sm:text-xl">
            Dogs around you
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {loading
              ? "Finding dogs in your area..."
              : `${visibleDogs.length} dogs shown on this page`}
          </p>
        </div>

        <Button
          variant="secondary"
          size="small"
          onClick={fetchDogs}
          disabled={loading}
        >
          Refresh
        </Button>
      </section>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-7">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <div className="aspect-[16/10] animate-pulse bg-stone-100" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-1/3 animate-pulse rounded bg-stone-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100" />
                <div className="h-10 animate-pulse rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <h3 className="mt-3 font-bold text-stone-900">Couldn't load dogs</h3>
          <p className="mt-1 text-sm text-stone-600">{error}</p>
          <button
            onClick={fetchDogs}
            className="mt-4 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && visibleDogs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone-400 shadow-sm">
            <PawPrint size={30} />
          </div>
          <h3 className="mt-5 text-lg font-bold text-stone-900">
            {hasFilters ? "No matching dogs found" : "No dogs registered yet"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
            {hasFilters
              ? "Try changing your search or filters to find what you're looking for."
              : "There are no active registered dogs for your pincode yet. You can help by reporting a sighting."}
          </p>
          {hasFilters ? (
            <Button variant="secondary" className="mt-5" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            <Button
              variant="primary"
              className="mt-5"
              onClick={() =>
                navigate("/user/reports/create?report_type=uncollared")
              }
            >
              Report a sighting
            </Button>
          )}
        </div>
      )}

      {/* Dog cards */}
      {!loading && !error && visibleDogs.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-7">
          {visibleDogs.map((dog) => (
            <article
              key={dog.id}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <DogImage src={dog.image_url} />

                <div className="absolute left-4 top-4">
                  <StatusPill variant="success">{dog.status}</StatusPill>
                </div>

                <div className="absolute bottom-4 left-4 rounded-lg bg-black/65 px-3 py-2 text-sm font-bold tracking-wide text-white backdrop-blur-sm">
                  {dog.dog_code}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-500">
                  {dog.area_name && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} className="text-orange-600" />
                      {dog.area_name}
                    </span>
                  )}

                  {dog.estimated_age !== null &&
                    dog.estimated_age !== undefined && (
                      <span>
                        {dog.estimated_age === 0
                          ? "Under 1 year"
                          : `Approx. ${dog.estimated_age} years`}
                      </span>
                    )}

                  {dog.color && <span className="capitalize">{dog.color}</span>}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-stone-50 p-3">
                    <div className="flex items-center gap-2 text-stone-500">
                      <Syringe size={16} />
                      <span className="text-xs font-medium">Vaccination</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold capitalize text-stone-800">
                      {getVaccinationLabel(dog.vaccination_status)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-stone-50 p-3">
                    <div className="flex items-center gap-2 text-stone-500">
                      <ShieldCheck size={16} />
                      <span className="text-xs font-medium">Sterilization</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-stone-800">
                      {dog.is_sterilized === true
                        ? "Sterilized"
                        : dog.is_sterilized === false
                          ? "Not sterilized"
                          : "Not recorded"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => navigate(`/user/dogs/${dog.id}`)}
                  >
                    View profile
                    <ArrowRight size={16} />
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => reportDog(dog, "concern")}
                  >
                    <Heart size={16} />
                    Report concern
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && dogs.length > 0 && (
        <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-5">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <span className="text-sm font-medium text-stone-500">
            Page {page}
          </span>

          <button
            onClick={() => setPage((current) => current + 1)}
            disabled={!hasNextPage}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
