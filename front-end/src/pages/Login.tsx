import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { Fingerprint } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
export type FormValues = z.infer<typeof formSchema>;
const LoginPage = () => {
  const { user, login, loginWithGoogle } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: FormValues) {
    await login(values);
  }
  if (user) return <Navigate to="/" />;
  return (
    <div className="flex items-center justify-center h-screen bg-background mx-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Task Master</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account.</p>
        </div>
        <div className="space-y-4">
          <Form {...form}>
            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" className="flex-1" onClick={loginWithGoogle}>
            <Fingerprint className="mr-2 h-5 w-5" />
            Log in with Google
          </Button>
          <div className="px-4 text-muted-foreground">or</div>
          <Link to="/signup" className="flex-1 text-right underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
