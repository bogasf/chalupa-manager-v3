import { useEffect, useState } from "react";
import { subscribeActivities } from "../../../services/activityService";

function formatDate(timestamp) {
  if (!timestamp) return "";

  const date =
    typeof timestamp.toDate === "function"
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

export default function ActivityCard() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    return subscribeActivities(setActivities);
  }, []);

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          🔔 Poslední aktivita
        </h2>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
          {activities.length}
        </span>
      </div>

      {activities.length === 0 ? (
        <p className="text-slate-500">
          Zatím nejsou žádné aktivity.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  {activity.icon || "📌"}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">
                      {activity.title}
                    </h3>

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
      )}
    </section>
  );
}