import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

/**
 * The Navbar component renders the top navigation bar of the application.
 *
 * It contains the following elements:
 * - A link to the home page with the application name and logo.
 * - A link to the settings page.
 * - A profile link if a user is logged in.
 * - A logout button if a user is logged in.
 *
 * It uses the useAuthStore hook to get the authUser state and the logout function.
 */
const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-base-100 border-base-300 backdrop-blur-lg bg-base-100/80">
      <div className="container h-16 px-4 mx-auto">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            {/* The Chatty logo and link to the home page */}
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="flex items-center justify-center rounded-lg size-9 bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* The settings link */}
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* The profile link and logout button if a user is logged in */}
            {authUser && (
              <>
                {/* The profile link */}
                <Link to={"/profile"} className="gap-2 btn btn-sm">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* The logout button */}
                <button className="flex items-center gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
