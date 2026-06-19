import { KeyRound, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { signInWithRole } from "@/lib/actions/mutations";
import { users } from "@/lib/data/seed";
import { InsightMetric } from "@/components/insight-metric";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <Badge tone="privacy">Private access</Badge>
            <h1 className="mt-4 max-w-3xl break-words text-4xl font-semibold leading-tight sm:text-5xl">
              Enter the Railora One workspace
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Choose a demo role and step into the payment operations console
              with payments, routing, privacy, settlement, KYB, and risk controls.
            </p>
          </div>
          <div className="hidden size-12 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-ink text-brand shadow-[var(--shadow-soft)] sm:flex">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <InsightMetric
            label="Demo roles"
            value="4"
            detail="Merchant, beneficiary, business admin, and platform risk access."
            icon={<Sparkles className="size-4" aria-hidden />}
            tone="accent"
          />
          <InsightMetric
            label="Identity posture"
            value="Mock"
            detail="UAE PASS, email, privacy, and Turnstile are represented safely."
            icon={<LockKeyhole className="size-4" aria-hidden />}
            tone="brand"
          />
          <InsightMetric
            label="Workspace"
            value="Live seeded"
            detail="Payments, routing, invoices, disputes, scores, and audit events are ready."
            icon={<ShieldCheck className="size-4" aria-hidden />}
            tone="success"
          />
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="premium-panel">
            <CardHeader>
              <CardTitle>Mock UAE PASS</CardTitle>
              <CardDescription>
                A high-assurance entry point for exploring the operations console.
              </CardDescription>
            </CardHeader>
            <form action={signInWithRole} className="min-w-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Demo role</Label>
                <Select id="role" name="role" defaultValue="buyer">
                  <option value="buyer">Merchant operator</option>
                  <option value="seller">Beneficiary operator</option>
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
              <CardTitle>Email access</CardTitle>
              <CardDescription>
                A familiar path for switching roles during a sandbox demo.
              </CardDescription>
            </CardHeader>
            <form
              action={signInWithRole}
              className="grid min-w-0 gap-4 sm:grid-cols-2"
            >
              <div className="min-w-0 space-y-2 sm:col-span-2">
                <Label htmlFor="email">Business email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="mariam@alnoor.example"
                />
              </div>
              <div className="min-w-0 space-y-2">
                <Label htmlFor="role-email">Role</Label>
                <Select id="role-email" name="role" defaultValue="buyer">
                  <option value="buyer">Merchant operator</option>
                  <option value="seller">Beneficiary operator</option>
                  <option value="business_admin">Business admin</option>
                  <option value="platform_admin">Platform risk/admin</option>
                </Select>
              </div>
              <div className="min-w-0 space-y-2">
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

        <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {users
            .filter((user, index, list) => {
              return list.findIndex((item) => item.role === user.role) === index;
            })
            .map((user) => (
              <Card key={user.role} className="p-4">
                <p className="break-words text-sm font-semibold">{user.name}</p>
                <p className="mt-1 break-words text-xs text-muted">
                  {user.role.replaceAll("_", " ")} · {user.mobile}
                </p>
              </Card>
            ))}
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-5 text-muted">
          Sandbox only: this prototype does not create production sessions or run
          real identity, payment, provider routing, sanctions, or reconciliation integrations.
        </p>
      </div>
    </main>
  );
}
