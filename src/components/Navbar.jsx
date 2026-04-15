import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userName = user?.name ? user.name.split(" ")[0] : null;
  const dynamicPages = []; // TODO: fetch dynamic pages from server

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="fixed w-full top-0 left-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-3">
          <img
            src="logo.png"
            alt="logo"
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Explore Pakistan</p>
            <p className="text-xs text-slate-500">Travel simplified.</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/tours", label: "Tours" },
              ].map((item) => (
                <NavigationMenuItem key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) => cn(
                      navigationMenuTriggerStyle(),
                      "hover:bg-accent/40 rounded-full px-4 py-2",
                      isActive && "bg-green-100 text-green-700"
                    )}
                  >
                    {item.label}
                  </NavLink>
                </NavigationMenuItem>
              ))}

              {dynamicPages.map((page) => (
                <NavigationMenuItem key={page.slug}>
                  <NavLink
                    to={`/${page.slug}`}
                    className={({ isActive }) => cn(
                      navigationMenuTriggerStyle(),
                      "hover:bg-accent/40 rounded-full px-4 py-2",
                      isActive && "bg-green-100 text-green-700"
                    )}
                  >
                    {page.title}
                  </NavLink>
                </NavigationMenuItem>
              ))}

              {user && (
                <NavigationMenuItem>
                  <NavLink
                    to="/booking"
                    className={({ isActive }) => cn(
                      navigationMenuTriggerStyle(),
                      "hover:bg-accent/40 rounded-full px-4 py-2",
                      isActive && "bg-green-100 text-green-700"
                    )}
                  >
                    Bookings
                  </NavLink>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => cn(
                    navigationMenuTriggerStyle(),
                    "hover:bg-accent/40 rounded-full px-4 py-2",
                    isActive && "bg-green-100 text-green-700"
                  )}
                >
                  Contact
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {userName && (
            <span className="hidden rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 md:inline-flex">
              Hi, {userName}
            </span>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Button variant="secondary" onClick={() => navigate("/signup")}>Register</Button>
              <Button
                onClick={() => navigate("/login")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Login
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-sm px-6 py-4 space-y-4">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/tours", label: "Tours" },
            { to: "/contact", label: "Contact" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                "block rounded-xl px-3 py-2 text-lg font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
                isActive && "bg-green-100 text-green-700"
              )}
            >
              {item.label}
            </NavLink>
          ))}

          {user && (
            <NavLink
              to="/booking"
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                "block rounded-xl px-3 py-2 text-lg font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
                isActive && "bg-green-100 text-green-700"
              )}
            >
              Bookings
            </NavLink>
          )}

          <div className="pt-2 flex flex-col gap-3">
            {!user ? (
              <>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    navigate("/signup");
                    setOpen(false);
                  }}
                >
                  Register
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                >
                  Login
                </Button>
              </>
            ) : (
              <Button
                className="bg-red-600 hover:bg-red-700 text-white w-full"
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
