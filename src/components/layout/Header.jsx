export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8">

      <div>

        <h2 className="text-2xl font-bold">

          Dashboard

        </h2>

      </div>

      <div className="flex items-center gap-3">

        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">

          B

        </div>

        <div>

          Bohouš

        </div>

      </div>

    </header>
  );
}