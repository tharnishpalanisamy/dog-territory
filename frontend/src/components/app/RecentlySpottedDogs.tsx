
import { Link } from "react-router-dom";
import { Dog, MapPin, ArrowRight } from "lucide-react";

type SpottedDog = {
  id: number;
  dogCode: string;
  breed: string;
  area: string;
  status: "healthy" | "needs_attention";
};

const dogs: SpottedDog[] = [
  {
    id: 1,
    dogCode: "641025-001",
    breed: "Indie",
    area: "Edayarpalayam",
    status: "healthy",
  },
  {
    id: 2,
    dogCode: "641025-002",
    breed: "Indie",
    area: "TVS Nagar",
    status: "needs_attention",
  },
  {
    id: 3,
    dogCode: "641034-001",
    breed: "Indie",
    area: "Thudiyalur",
    status: "healthy",
  },
];

export default function RecentlySpottedDogs() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recently spotted dogs
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Street dogs registered in your community.
          </p>
        </div>

        <Link
          to="/user/dogs"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Explore all <ArrowRight size={16} />
        </Link>
      </div>

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
              {dog.dogCode}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {dog.breed}
            </p>

            <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={13} />
              {dog.area}
            </div>

            <span
              className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                dog.status === "healthy"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {dog.status === "healthy"
                ? "No concerns reported"
                : "Needs attention"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
