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
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});
export type FormValues = z.infer<typeof formSchema>;

const SignUpPage = () => {
  const { user, signup, loginWithGoogle } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: FormValues) {
    await signup(values);
  }
  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="flex items-center justify-center h-screen bg-background mx-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Task Master</h1>
          <p className="text-muted-foreground">
            Create an account or login to access your account.
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>
        </div>
        <div className="space-y-4">
          <Form {...form}>
            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                Sign up
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" className="flex-1" onClick={loginWithGoogle}>
            <Fingerprint className="mr-2 h-5 w-5" />
            Sign up with Google
          </Button>
          <div className="px-4 text-muted-foreground">or</div>
          <Link to="/login" className="flex-1 text-right underline underline-offset-4 hover:text-primary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
