import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dog, MapPin, ArrowRight, Loader2, AlertCircle } from "lucide-react";

import api from "../../lib/api";

type UserLocation = {
  pincode?: string | null;
};

type StoredUser = {
  location?: UserLocation | null;
  pincode?: string | null;
};

type SpottedDog = {
  id: number;
  dog_code: string;
  dog_number: number;
  color: string | null;
  estimated_age: number | null;
  area_name: string;
  status: string;
  vaccination_status: string;
  is_sterilized: boolean | null;
};

function getUserPincode(): string | null {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") ?? "null",
    ) as StoredUser | null;

    if (!user) return null;

    const location = user.location ?? user;
    return location.pincode?.trim() || null;
  } catch {
    return null;
  }
}

export default function RecentlySpottedDogs() {
  const [dogs, setDogs] = useState<SpottedDog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pincode = getUserPincode();

  useEffect(() => {
    let cancelled = false;

    async function fetchSpottedDogs() {
      if (!pincode) {
        setDogs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const response = await api.get("/dogs", {
          params: {
            pincode,
            sort_by: "created_at",
            order: "desc",
            limit: 3,
            offset: 0,
          },
        });

        if (!cancelled) {
          setDogs(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch nearby dogs:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSpottedDogs();

    return () => {
      cancelled = true;
    };
  }, [pincode]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recently spotted dogs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {pincode
              ? `Recently registered dogs in ${pincode}.`
              : "Add your location to discover dogs near you."}
          </p>
        </div>

        {pincode && (
          <Link
            to="/user/dogs"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Explore all <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* No location */}
      {!pincode ? (
        <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/60 px-5 py-6 text-center">
          <MapPin className="mx-auto mb-3 text-indigo-600" size={24} />

          <h3 className="text-sm font-semibold text-slate-900">
            Update your location
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Add your pincode to discover dogs near you.
          </p>

          <Link
            to="/user/profile"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Add location <ArrowRight size={16} />
          </Link>
        </div>
      ) : loading ? (
        /* Loading */
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="mb-3 animate-spin text-indigo-600" size={28} />
          <p className="text-sm text-slate-500">Finding dogs in your area...</p>
        </div>
      ) : error ? (
        /* Error */
        <div className="rounded-xl bg-red-50 px-5 py-6 text-center">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={24} />

          <h3 className="text-sm font-semibold text-slate-900">
            Couldn't load nearby dogs
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Something went wrong. Please try again later.
          </p>
        </div>
      ) : dogs.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
          <Dog className="mx-auto mb-3 text-slate-400" size={30} />

          <h3 className="text-sm font-semibold text-slate-900">
            No dogs spotted yet!
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            There are no registered dogs in your area yet. Help us build a safer
            community for street dogs.
          </p>
        </div>
      ) : (
        /* Actual dogs */
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dogs.map((dog) => (
            <Link
              key={dog.id}
              to={`/user/dogs/${dog.id}`}
              className="rounded-xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:shadow-sm"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Dog size={24} />
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                {dog.dog_code}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {dog.color || "Color not specified"}
                {dog.estimated_age !== null && ` • ${dog.estimated_age} years`}
              </p>

              <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                <MapPin size={13} />
                {dog.area_name}
              </div>

              <span className="mt-3 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700">
                {dog.status.replaceAll("_", " ")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
