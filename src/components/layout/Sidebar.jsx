import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Home,
  Hammer,
  Wallet,
  BarChart3,
  Settings
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Kalendář",
    icon: CalendarDays,
    url: "/calendar",
  },
  {
    title: "Návštěvy",
    icon: Home,
    url: "/visits",
  },
  {
    title: "Brigády",
    icon: Hammer,
    url: "/visits", // zatím
  },
  {
    title: "Finance",
    icon: Wallet,
    url: "/finance",
  },
  {
    title: "Reporty",
    icon: BarChart3,
    url: "/reports",
  },
  {
    title: "Nastavení",
    icon: Settings,
    url: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col">

      <div className="h-16 flex items-center px-6 border-b border-slate-700">

        <h1 className="text-xl font-bold">
          Chalupa Manager
        </h1>

      </div>

      <nav className="flex-1 py-4">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                `mx-3 mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              {item.title}

            </NavLink>

          );

        })}

      </nav>

    </aside>
  );
}