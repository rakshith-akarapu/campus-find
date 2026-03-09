import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logoutUser } from "../services/authService";
import { LogOut, PlusCircle, LayoutDashboard, FolderHeart, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <img 
                src={logo} 
                alt="CampusFind Logo" 
                className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <span className="font-bold text-xl text-gray-900 tracking-tight">CampusFind</span>
            </Link>
            
            {user && (
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                <Link
                  to="/"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/") ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/my-posts"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/my-posts") ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FolderHeart className="h-4 w-4" />
                  My Posts
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/post"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Post Item
                  </Link>
                  <div className="h-6 w-px bg-gray-200 mx-1"></div>
                  <span className="text-sm text-gray-500 font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 active:scale-95 focus:outline-none transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Mobile menu button */}
                <div className="flex items-center md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMobileMenuOpen ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white hover:bg-gray-800 active:scale-95 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {user && isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/") ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/my-posts"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/my-posts") ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderHeart className="h-5 w-5" />
                My Posts
              </div>
            </Link>
            <Link
              to="/post"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/post") ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Post Item
              </div>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-100">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-gray-800">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="h-5 w-5" />
                  Log out
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
