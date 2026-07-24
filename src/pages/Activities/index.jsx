import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { subscribeActivities } from "../../services/activityService";

function formatDate(timestamp) {
  if (!timestamp) return "";

  const date =
    typeof timestamp?.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);

  return date.toLocaleString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const filters = [
  { value: "all", label: "Vše" },
  { value: "visit", label: "Návštěvy" },
  { value: "guest-room", label: "Pokoj" },
  { value: "work", label: "Brigády" },
  { value: "finance", label: "Finance" },
];

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    return subscribeActivities(setActivities);
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const text = (
        (activity.title ?? "") +
        " " +
        (activity.description ?? "") +
        " " +
        (activity.user ?? "")
      ).toLowerCase();

      const matchesSearch =
        search === "" ||
        text.includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        activity.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [activities, search, filter]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            📜 Historie aktivit
          </h1>

          <p className="mt-1 text-slate-500">
            Přehled všech změn v aplikaci.
          </p>
        </div>

        <div className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
          Celkem aktivit: {filteredActivities.length}
        </div>

      </div>

      <div className="rounded-xl bg-white p-5 shadow">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hledat aktivitu..."
              className="w-full rounded-lg border pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border px-4 py-2"
          >
            {filters.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

        </div>

      </div>

      <div className="space-y-4">

        {filteredActivities.length === 0 && (

          <div className="rounded-xl bg-white p-10 text-center shadow">

            <div className="text-5xl">
              📭
            </div>

            <p className="mt-4 text-slate-500">
              Nebyly nalezeny žádné aktivity.
            </p>

          </div>

        )}

        {filteredActivities.map((activity) => (

          <div
            key={activity.id}
            className="rounded-xl bg-white p-5 shadow transition hover:shadow-lg"
          >

            <div className="flex gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
                {activity.icon || "📌"}
              </div>

              <div className="flex-1">

                <div className="flex flex-wrap items-center justify-between gap-2">

                  <h2 className="font-semibold text-lg">
                    {activity.title}
                  </h2>

                  <span className="text-sm text-slate-500">
                    {formatDate(activity.createdAt)}
                  </span>

                </div>

                {activity.user && (

                  <div className="mt-1 font-medium text-blue-700">
                    {activity.user}
                  </div>

                )}

                {activity.description && (

                  <div className="mt-2 text-slate-600">
                    {activity.description}
                  </div>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}