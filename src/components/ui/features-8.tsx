import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users } from "lucide-react";

export function Features() {
  return (
    <section className="bg-gray-50 py-16 dark:bg-transparent md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          <Card className="col-span-full lg:col-span-2">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-56 items-center justify-center rounded-full border border-border/60">
                <span className="text-5xl font-semibold">100%</span>
              </div>
              <h3 className="text-2xl font-semibold">Customizable</h3>
              <p className="mt-2 text-muted-foreground">Flexible onboarding and controls for your values-driven banking preferences.</p>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-2">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-border/60">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold">Secure by default</h3>
              <p className="mt-2 text-muted-foreground">Built with transparent controls and reserve reporting from day one.</p>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-2">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-border/60">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold">Community-first</h3>
              <p className="mt-2 text-muted-foreground">Designed for families and communities looking for ethical alternatives.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
