export default function Card({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
      <h3 className="text-sm font-medium text-slate-500">
        {title}
      </h3>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}