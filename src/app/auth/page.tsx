import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { signInWithRole } from "@/lib/actions/mutations";
import { users } from "@/lib/data/seed";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Badge tone="brand">Railora demo access</Badge>
            <h1 className="mt-4 text-3xl font-semibold">Choose a sandbox role</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              UAE PASS, email magic links, and Turnstile are represented as
              placeholders. This prototype does not create production sessions.
            </p>
          </div>
          <div className="hidden size-12 items-center justify-center rounded-md bg-brand text-white sm:flex">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Mock UAE PASS</CardTitle>
              <CardDescription>
                Simulates a high-assurance identity assertion for demo users.
              </CardDescription>
            </CardHeader>
            <form action={signInWithRole} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Demo role</Label>
                <Select id="role" name="role" defaultValue="buyer">
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="business_admin">Business admin</option>
                  <option value="platform_admin">Platform risk/admin</option>
                </Select>
              </div>
              <input type="hidden" name="turnstile" value="demo-token" />
              <Button type="submit" className="w-full">
                <KeyRound className="size-4" aria-hidden />
                Continue with mock UAE PASS
              </Button>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email magic-link style form</CardTitle>
              <CardDescription>
                Uses the same demo role selector and a Turnstile placeholder.
              </CardDescription>
            </CardHeader>
            <form action={signInWithRole} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Business email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="mariam@alnoor.example"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-email">Role</Label>
                <Select id="role-email" name="role" defaultValue="buyer">
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="business_admin">Business admin</option>
                  <option value="platform_admin">Platform risk/admin</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="turnstile">Turnstile placeholder</Label>
                <Input
                  id="turnstile"
                  name="turnstile"
                  defaultValue="demo-turnstile-token"
                />
              </div>
              <Button type="submit" className="sm:col-span-2">
                <Mail className="size-4" aria-hidden />
                Send demo magic link
              </Button>
            </form>
          </Card>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {users
            .filter((user, index, list) => {
              return list.findIndex((item) => item.role === user.role) === index;
            })
            .map((user) => (
              <Card key={user.role} className="p-4">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {user.role.replaceAll("_", " ")} · {user.mobile}
                </p>
              </Card>
            ))}
        </div>
      </div>
    </main>
  );
}
