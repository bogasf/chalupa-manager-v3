import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
export default function AppLayout() { const [menuOpen, setMenuOpen] = useState(false); return <div className="flex min-h-[100dvh] bg-slate-100"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="flex min-w-0 flex-1 flex-col"><Header onMenuClick={() => setMenuOpen(true)} /><main className="flex-1 overflow-auto p-4 md:p-6"><Outlet /></main></div></div>; }
