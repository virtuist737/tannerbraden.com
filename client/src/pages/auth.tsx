import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthFormValues = {
  username: string;
  password: string;
};

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/admin/loop-machine");
    }
  }, [user, setLocation]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLogin = (data: AuthFormValues) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div className="container flex h-screen">
      <div className="grid grid-cols-2 place-content-center w-full gap-12">
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Loop Machine Admin</h1>
            <p className="text-muted-foreground">
              Access the Loop Machine preset management system
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onLogin)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    Login
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col justify-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">
              Loop Machine Preset System
            </h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center gap-2">
                🎵 Manage custom sound presets
              </li>
              <li className="flex items-center gap-2">
                🎛️ Configure default BPM and volume settings
              </li>
              <li className="flex items-center gap-2">
                🎹 Create custom melody and rhythm patterns
              </li>
              <li className="flex items-center gap-2">
                🌟 Set default presets for all users
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}