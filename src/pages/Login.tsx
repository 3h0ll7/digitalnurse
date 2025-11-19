import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  fullName: z.string().optional(),
  organization: z.string().optional(),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Min 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, register: registerUser, user, isSessionLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      fullName: "",
      organization: "",
      email: "",
      password: "",
    },
  });

  if (isSessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#04070f] text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/70 px-6 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-xs uppercase tracking-[0.3em]">Securing channel…</span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!isSessionLoading && user) {
      const redirectTo = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/home";
      navigate(redirectTo, { replace: true });
    }
  }, [isSessionLoading, user, location, navigate]);

  const onSubmit = async (values: LoginForm) => {
    try {
      setError(null);
      if (mode === "login") {
        await login({ email: values.email, password: values.password });
      } else {
        if (!values.fullName) {
          setError("Full name is required for registration");
          return;
        }
        await registerUser({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          organization: values.organization,
        });
      }
      const redirectTo = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/home";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to authenticate");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#04070f] px-4 py-10 text-white">
      <Card className="w-full max-w-md border border-white/10 bg-card/80 p-8 text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/50 bg-primary/20">
            <ShieldCheck className="text-primary" />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Digital Nurse Buddy</p>
          <h1 className="text-2xl font-semibold">Secure Clinical Access</h1>
          <p className="text-sm text-muted-foreground">
            Authenticate to unlock hospital-grade workflows, AI triage, and shared care plans.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === "register" && (
            <>
              <div>
                <label className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Full name</label>
                <Input type="text" {...register("fullName")} className="mt-1 bg-white/5" />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-medical-red">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Organization</label>
                <Input type="text" {...register("organization")} className="mt-1 bg-white/5" />
              </div>
            </>
          )}
          <div>
            <label className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Email</label>
            <Input type="email" {...register("email")} className="mt-1 bg-white/5" />
            {errors.email && <p className="mt-1 text-xs text-medical-red">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Password</label>
            <Input type="password" {...register("password")} className="mt-1 bg-white/5" />
            {errors.password && (
              <p className="mt-1 text-xs text-medical-red">{errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-xs text-medical-red">{error}</p>}
          <Button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-primary via-[#5F5CFF] to-[#8C79FF]">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "Login" : "Create account"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <button onClick={() => setMode("register")} className="text-primary underline">
              Need an account? Register team lead access
            </button>
          ) : (
            <button onClick={() => setMode("login")} className="text-primary underline">
              Already onboarded? Sign in
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Login;
