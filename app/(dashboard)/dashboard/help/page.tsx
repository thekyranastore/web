import Link from "next/link";
import { EnvelopeSimpleIcon as Mail } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WhatsappIcon } from "@/components/shared/whatsapp-icon";

const SUPPORT_WHATSAPP_NUMBER = "919434414677";

const faqs = [
  {
    question: "How do customers pay for orders?",
    answer:
      "For now, customers pay on delivery or you arrange payment directly with them — card and UPI checkout are coming soon.",
  },
  {
    question: "How do I share my storefront?",
    answer: "Copy your store link from Settings and share it anywhere — WhatsApp, Instagram, or your business card.",
  },
  {
    question: "Can I change my shop details later?",
    answer: "Yes, everything except your GSTIN can be updated anytime from Settings.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Help & Support" />

      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Need a hand?</CardTitle>
            <CardDescription>We usually reply within a few hours.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="w-full rounded-full sm:w-auto">
              <Link
                href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappIcon className="size-4" />
                Chat on WhatsApp
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full sm:w-auto">
              <Link href="mailto:support@kirana.app">
                <Mail className="size-4" />
                Email support
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common questions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {faqs.map((faq) => (
              <div key={faq.question} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
                <p className="text-sm font-medium">{faq.question}</p>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
