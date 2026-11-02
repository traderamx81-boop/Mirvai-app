import Link from "next/link";
import MirvaiBrand from "@/components/mirvai-brand";

export const metadata = { title: "Privacy Notice" };

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <MirvaiBrand />
      <p className="section-label">Privacy notice</p>
      <h1>How Mirvai uses your information</h1>
      <p>Last updated: 2 September 2026</p>
      <h2>Information we collect</h2>
      <p>When you submit an enquiry, request an appointment or use website chat, we collect the details you provide, such as your name, contact details, property preferences, budget and message.</p>
      <h2>Why we use it</h2>
      <p>We use this information to respond to you, recommend suitable property options, arrange consultations and inspections, maintain our client records and improve the website.</p>
      <p>We also count basic website activity, such as page visits and button use, with a random browser identifier. This helps us understand which parts of the website are useful; it is not used to advertise to you across other websites.</p>
      <h2>How it is protected</h2>
      <p>Your submissions are stored in Mirvai’s protected website system. The administration area requires authorised sign-in. We do not sell your personal information.</p>
      <h2>Retention and your choices</h2>
      <p>We retain client information only for as long as it is reasonably needed for the enquiry, our business records and applicable legal obligations. You may ask Mirvai to correct or delete your information, subject to any lawful retention requirement.</p>
      <h2>Contact</h2>
      <p>To ask a privacy question or make a request, contact Mirvai on <a href="https://wa.me/2349011081436">+234 901 108 1436</a>.</p>
      <Link className="button gold" href="/">Return to the website</Link>
    </main>
  );
}
