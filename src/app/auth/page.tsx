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
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <Badge tone="privacy" className="animate-railora-rise">Private access</Badge>
            <h1
              className="animate-railora-rise mt-5 max-w-3xl break-words text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
              style={{ animationDelay: "80ms" }}
            >
              Enter the Railora One workspace
            </h1>
            <p
              className="animate-railora-rise mt-3 max-w-2xl text-sm leading-6 text-muted"
              style={{ animationDelay: "160ms" }}
            >
              Choose a demo role and step into the payment operations console
              with payments, routing, privacy, settlement, KYB, and risk controls.
            </p>
          </div>
          <div className="animate-railora-pop hidden size-12 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-brand/30 bg-ink text-brand shadow-[var(--shadow-float)] sm:flex">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <InsightMetric
            label="Demo roles"
            value="4"
            detail="Merchant, beneficiary, business admin, and platform risk access."
            icon={<Sparkles className="size-4" aria-hidden />}
            tone="accent"
            className="hover-lift animate-railora-rise"
            style={{ animationDelay: "120ms" }}
          />
          <InsightMetric
            label="Identity posture"
            value="Mock"
            detail="UAE PASS, email, privacy, and Turnstile are represented safely."
            icon={<LockKeyhole className="size-4" aria-hidden />}
            tone="brand"
            className="hover-lift animate-railora-rise"
            style={{ animationDelay: "200ms" }}
          />
          <InsightMetric
            label="Workspace"
            value="Live seeded"
            detail="Payments, routing, invoices, disputes, scores, and audit events are ready."
            icon={<ShieldCheck className="size-4" aria-hidden />}
            tone="success"
            className="hover-lift animate-railora-rise"
            style={{ animationDelay: "280ms" }}
          />
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="premium-panel animate-railora-rise" style={{ animationDelay: "200ms" }}>
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

          <Card className="animate-railora-rise" style={{ animationDelay: "280ms" }}>
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

        <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {users
            .filter((user, index, list) => {
              return list.findIndex((item) => item.role === user.role) === index;
            })
            .map((user, index) => (
              <Card
                key={user.role}
                className="hover-lift animate-railora-rise p-4"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <p className="break-words text-sm font-semibold">{user.name}</p>
                <p className="eyebrow mt-2 break-words text-muted">
                  {user.role.replaceAll("_", " ")}
                </p>
                <p className="amount-mono mt-1 break-words text-xs text-muted">{user.mobile}</p>
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
