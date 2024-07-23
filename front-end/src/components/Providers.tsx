import { ReactNode } from "react";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      {children}
      <Toaster richColors closeButton />
    </main>
  );
};

export default Providers;
