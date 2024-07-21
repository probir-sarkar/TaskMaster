import useAuth from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { loginWithGoogle, user } = useAuth();
  if (user) {
    return <Navigate to="/task" />;
  }
  return (
    <main>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1>Login</h1>
        <p>Login page content</p>
        <button
          onClick={() => {
            loginWithGoogle();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Login with Google
        </button>
      </section>
    </main>
  );
};

export default LoginPage;
