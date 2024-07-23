import useAuth from "@/hooks/useAuth";

const NavBar = ({ children }: { children: React.ReactNode }) => {
  const { user, loginWithGoogle, logout } = useAuth();
  return (
    <div>
      <nav className="w-full h-16 bg-primary sticky top-0 flex justify-between items-center md:px-10 px-5">
        <div className="max-w-7xl w-11/12 mx-auto h-full flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Task Board</h1>
        </div>
        <div className="">
          {user ? (
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md">
              Logout
            </button>
          ) : (
            <button onClick={loginWithGoogle} className="bg-green-500 text-white px-4 py-2 rounded-md">
              Login
            </button>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
};

export default NavBar;
