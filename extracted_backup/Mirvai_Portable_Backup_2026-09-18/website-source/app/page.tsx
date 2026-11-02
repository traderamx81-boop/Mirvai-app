"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PropertyExploreMenu from "@/components/property-explore-menu";
import MirvaiBrand from "@/components/mirvai-brand";
import { buyerGuides } from "@/lib/buyer-guides";
import { featuredProperty, formatNaira, propertyCategories, type PublicProperty, withFeaturedProperty } from "@/lib/featured-property";

const WA = "2349011081436";
const propertyTypes = [
  "Fully detached duplex", "Semi-detached duplex", "Terrace duplex", "Luxury apartment",
  "Penthouse", "Bungalow", "Off-plan property", "Land", "Commercial property",
];
const services = ["Property search", "Property sales", "Investment advisory", "Documentation support", "Property management"];

function sessionId() {
  let id = localStorage.getItem("mirvai-session-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("mirvai-session-id", id);
  }
  return id;
}
function trackEvent(event: string) {
  try {
    void fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ event, path: location.pathname, sessionId: sessionId() }) });
  } catch { /* Analytics must never interrupt a visitor. */ }
}

export default function Home() {
  useEffect(() => { trackEvent("page_view"); }, []);
  return <main>
    <header className="nav-shell editorial-nav">
      <MirvaiBrand href="#top" />
      <div className="site-header-actions"><a className="nav-cta" onClick={() => trackEvent("whatsapp_click")} href={`https://wa.me/${WA}`}>WhatsApp us</a><PropertyExploreMenu/></div>
    </header>

    <section className="hero editorial-hero" id="top">
      <Image src="/mirvai-hero.png" alt="Contemporary luxury home at dusk" fill priority sizes="100vw" />
      <div className="hero-shade" />
      <div className="hero-signature" aria-hidden="true"><span>MIRVAI</span><small>FIND · OWN · GROW</small></div>
      <div className="hero-content">
        <div className="hero-kicker"><p className="eyebrow">Lagos · Nigeria · Diaspora</p><span>Buy · Sell · Invest</span></div>
        <h1>Property decisions,<br /><em>made with confidence.</em></h1>
        <p className="hero-copy">We help you find, evaluate and secure the right property in Lagos—wherever you are in the world.</p>
        <div className="hero-actions"><a className="button gold editorial-button" href="#properties">Explore properties <span aria-hidden="true">↗</span></a><a className="text-link" href="#enquire">Tell us what you need</a></div>
        <div className="trust-line"><span>Verified options</span><span>Clear guidance</span><span>End-to-end support</span></div>
      </div>
      <div className="hero-index" aria-hidden="true"><span>01</span><i/><small>Mirvai<br/>Lagos</small></div>
    </section>

    <PropertyGrid />
    <TrustProofSection />

    <section className="overview section" id="services">
      <div className="overview-head"><div><p className="section-label">Find. Own. Grow.</p><h2>Everything you need to move with confidence.</h2></div><p>Mirvai helps buyers and investors source carefully selected property across Lagos Mainland and Island, with honest guidance from the first conversation to completion.</p></div>
      <div className="service-chips">{services.map(service => <span key={service}>{service}</span>)}</div>
      <div className="value-grid"><article><b>01</b><h3>Verification first</h3><p>We prioritise genuine opportunities and coordinate the right professional checks.</p></article><article><b>02</b><h3>Honest budget guidance</h3><p>If there is no exact match, we explain what your budget can achieve and show the closest suitable options.</p></article><article><b>03</b><h3>Mainland and Island</h3><p>We source residential, land and investment opportunities across both sides of Lagos.</p></article><article><b>04</b><h3>End-to-end support</h3><p>From search and inspection to documentation coordination and after-sales guidance.</p></article></div>
      <div className="process-strip" id="process"><article><b>1</b><span><strong>Tell us what you need</strong>Location, property type, budget and timeline.</span></article><article><b>2</b><span><strong>Review suitable options</strong>We share carefully sourced matches.</span></article><article><b>3</b><span><strong>Inspect and decide</strong>We guide the important next steps.</span></article></div>
    </section>

    <BuyerStoriesSection />
    <BuyerGuidesSection />
    <DiasporaFaqSection />
    <ClientActionSection />

    <footer><MirvaiBrand/><p>Integrity. Professionalism. Results.</p><p>© 2026 Mirvai · <Link href="/guides">Buyer guides</Link> · <Link href="/privacy">Privacy</Link></p></footer>
    <WebsiteChat />
  </main>;
}

function BuyerStoriesSection() {
  const stories = [
    {
      quote: "I live in London and was terrified of buying land in Lagos remotely—too many horror stories. Mirvai walked me through every check before I sent a naira. The video inspection alone saved me from a bad deal.",
      profile: "Diaspora client",
      location: "UK",
    },
    {
      quote: "I told them my budget upfront, expecting to be pushed towards something I could not afford. Instead, they were honest about what it could get me and showed me options I had not even considered on the Mainland.",
      profile: "Local investor",
      location: "Lagos",
    },
    {
      quote: "First time buying property and I had no idea what documentation even meant. Mirvai explained everything in plain terms and coordinated the whole process end to end.",
      profile: "First-time buyer",
      location: "Verified client",
    },
    {
      quote: "What stood out was that they did not disappear after the sale. Documentation support continued until everything was fully sorted.",
      profile: "Property investor",
      location: "Canada",
    },
  ];

  return <section className="buyer-stories section" aria-labelledby="buyer-stories-title">
    <div className="buyer-stories-head">
      <div><p className="section-label">What clients say</p><h2 id="buyer-stories-title">Trusted by buyers at home and abroad.</h2></div>
      <p>Real experiences from clients who trusted Mirvai to guide their property journey with clarity, honesty and continued support.</p>
    </div>
    <div className="buyer-story-grid">{stories.map((story, index) => <article key={story.profile}>
      <span aria-hidden="true">“</span>
      <blockquote>{story.quote}</blockquote>
      <footer><div><strong>{story.profile}</strong><small>{story.location}</small></div><b>{String(index + 1).padStart(2, "0")}</b></footer>
    </article>)}</div>
  </section>;
}

function TrustProofSection() {
  const steps = [
    ["01", "Understand your brief", "We clarify the property, location, budget, purpose and timeline that should guide the search."],
    ["02", "Source and inspect", "We compare suitable options and coordinate physical or live video viewings of the property and surroundings."],
    ["03", "Prepare the review file", "We organise the available title documents, survey plan, seller or owner details, approvals and transaction terms that apply to the property."],
    ["04", "Coordinate specialist review", "A qualified Nigerian property lawyer reviews legal and title questions; a registered surveyor checks survey or boundary issues; and a building professional can assess physical condition when needed."],
    ["05", "Share findings before a decision", "We organise the feedback, flag open questions and help you understand the next step before commitment."],
  ];
  return <section className="trust-proof section" id="about"><div className="trust-identity"><p className="section-label">Who’s behind Mirvai</p><h2>Built on trust, not shortcuts.</h2><p>Buying property in Lagos should not mean guessing who to trust. After seeing how unclear information and distance make it difficult for buyers—especially Nigerians abroad—to find properties that match their needs and budgets, Osuwah Nkechi Racheal founded Mirvai to offer a clearer path through carefully sourced options, honest guidance and transparent communication.</p><div className="founder-card"><div><small>Founder</small><h3>Osuwah Nkechi Racheal</h3><p>Founder &amp; Chief Executive Officer</p></div></div><p className="founder-copy">Her vision is to bring a different, buyer-first approach to Nigeria’s real-estate market—one that helps clients understand the opportunity, the checks still required and what their budget can realistically achieve before they commit. Mirvai’s support continues through documentation coordination and after-sales guidance.</p></div><div className="trust-process"><p className="section-label">The Mirvai due-diligence journey</p>{steps.map(([number, title, copy]) => <article key={number}><b>{number}</b><div><h3>{title}</h3><p>{copy}</p></div></article>)}<div className="role-note"><strong>Clear responsibility at every step</strong><p>Mirvai manages the sourcing and communication journey. The appropriate independent professionals provide specialist findings, and you review those findings before deciding whether to proceed.</p></div></div></section>;
}

function BuyerGuidesSection() {
  return <section className="home-guides section"><div className="home-guides-head"><div><p className="section-label">Buyer knowledge</p><h2>Understand the process before you commit.</h2></div><p>Clear, practical guidance for Lagos buyers and Nigerians investing from abroad.</p></div><div className="home-guide-grid">{buyerGuides.map((guide, index) => <article key={guide.slug}><span>{String(index + 1).padStart(2, "0")}</span><small>{guide.kicker}</small><h3>{guide.title}</h3><p>{guide.description}</p><Link href={`/guides/${guide.slug}`}>Read guide <b aria-hidden="true">→</b></Link></article>)}</div><Link className="text-link dark home-guides-link" href="/guides">View all buyer guides</Link></section>;
}

function ClientActionSection() {
  const [mode, setMode] = useState<"enquiry" | "booking">("enquiry");
  return <section className="client-action section" id="enquire"><span className="anchor-target" id="book"/><div className="action-intro"><p className="section-label light">Start here</p><h2>Tell us your property goal.</h2><p>Send your requirements or request a consultation. Your details go directly to Mirvai’s protected CRM.</p><div className="contact"><small>OR CHAT ON WHATSAPP</small><a onClick={() => trackEvent("whatsapp_click")} href={`https://wa.me/${WA}`}>+234 901 108 1436</a></div></div><div className="action-card"><div className="action-tabs" role="tablist" aria-label="Choose a contact form"><button type="button" role="tab" aria-selected={mode === "enquiry"} className={mode === "enquiry" ? "active" : ""} onClick={() => setMode("enquiry")}>Property enquiry</button><button type="button" role="tab" aria-selected={mode === "booking"} className={mode === "booking" ? "active" : ""} onClick={() => setMode("booking")}>Book consultation</button></div>{mode === "enquiry" ? <EnquiryForm /> : <BookingForm />}</div></section>;
}

function EnquiryForm() {
  const [status, setStatus] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget, data = new FormData(form);
    setStatus("Sending your enquiry…");
    setWhatsappMessage("");
    const payload = { name: data.get("name"), contact: data.get("contact"), request: data.get("request"), location: String(data.get("location") || ""), propertyType: String(data.get("type") || "Not specified"), budget: String(data.get("budget") || ""), timeline: String(data.get("timeline") || "Not specified"), basedIn: String(data.get("base") || "Not specified"), website: data.get("website") };
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) { setStatus(await response.text()); return; }
      const message = ["Hello Mirvai, I just submitted a property enquiry on your website.", `Name: ${payload.name}`, `Request: ${payload.request}`, payload.location && `Location: ${payload.location}`, payload.propertyType !== "Not specified" && `Property type: ${payload.propertyType}`, payload.budget && `Budget: ${payload.budget}`, payload.timeline !== "Not specified" && `Timeline: ${payload.timeline}`, payload.basedIn !== "Not specified" && `Based in: ${payload.basedIn}`].filter(Boolean).join("\n");
      setWhatsappMessage(message);
      setStatus("Thank you. Mirvai has received your enquiry and will contact you shortly.");
      trackEvent("enquiry_submitted");
      form.reset();
    } catch { setStatus("We could not send your enquiry. Please try again or use WhatsApp."); }
  }
  return <form className="action-form" onSubmit={submit}><p className="short-form-note">Start with three quick details. Mirvai will contact you for the rest.</p><label>Full name<input required name="name" placeholder="Your name" /></label><label>Email or WhatsApp number<input required name="contact" placeholder="How should we reach you?" /></label><label>What are you looking for?<textarea required name="request" rows={3} placeholder="e.g. A 4-bedroom home in Ikeja for my family" /></label><button className="details-toggle" type="button" aria-expanded={showDetails} onClick={() => setShowDetails(value => !value)}>{showDetails ? "Hide additional details" : "Add location, budget and timeline (optional)"}<span aria-hidden="true">{showDetails ? "−" : "+"}</span></button>{showDetails && <div className="optional-enquiry-fields"><div className="form-row"><label>Preferred location<input name="location" placeholder="e.g. Ikeja, Lekki" /></label><label>Budget<input name="budget" placeholder="e.g. ₦80 million" /></label></div><label>Property type<select name="type" defaultValue=""><option value="">Not sure yet</option>{propertyTypes.map(type => <option key={type}>{type}</option>)}</select></label><div className="form-row"><label>When do you need it?<select name="timeline" defaultValue=""><option value="">Not specified</option><option>Immediately</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Just exploring</option></select></label><label>Where are you based?<select name="base" defaultValue=""><option value="">Not specified</option><option>Nigeria</option><option>United Kingdom</option><option>United States</option><option>Canada</option><option>Europe</option><option>Other</option></select></label></div></div>}<label className="hp-field" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" /></label><label className="consent"><input required type="checkbox" /> I agree that Mirvai may use these details to respond to my enquiry. <Link href="/privacy">Privacy notice</Link></label><button className="button gold" type="submit">Send property request</button>{status && <p className="form-status" aria-live="polite">{status}</p>}{whatsappMessage && <a className="after-submit" onClick={() => trackEvent("whatsapp_click")} href={`https://wa.me/${WA}?text=${encodeURIComponent(whatsappMessage)}`}>Continue on WhatsApp ↗</a>}</form>;
}

function BookingForm() {
  const [date, setDate] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const slots = [["09:00", "9:00 AM"], ["11:00", "11:00 AM"], ["13:00", "1:00 PM"], ["15:00", "3:00 PM"]];
  useEffect(() => { if (!date) return; fetch(`/api/appointments?date=${date}`).then(response => response.json()).then(data => setBooked(data.bookedTimes || [])).catch(() => setBooked([])); }, [date]);
  async function book(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget, data = new FormData(form); setStatus("Reserving your time…");
    try {
      const response = await fetch("/api/appointments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: data.get("name"), contact: data.get("contact"), purpose: data.get("purpose"), date: data.get("date"), time: data.get("time"), notes: data.get("notes"), website: data.get("website") }) });
      if (response.ok) { setStatus("Your appointment request has been received. Mirvai will confirm it with you shortly."); trackEvent("booking_submitted"); form.reset(); setDate(""); setBooked([]); } else setStatus(await response.text());
    } catch { setStatus("We could not request the appointment. Please try again or contact Mirvai on WhatsApp."); }
  }
  return <form className="action-form" onSubmit={book}><p className="form-note">Appointments are available Monday to Saturday. Times shown are West Africa Time.</p><div className="form-row"><label>Full name<input required name="name" placeholder="Your name" /></label><label>Email or phone number<input required name="contact" placeholder="How should we reach you?" /></label></div><label>What would you like to discuss?<select required name="purpose" defaultValue=""><option value="" disabled>Select one</option><option>Property search consultation</option><option>Investment discussion</option><option>Remote video consultation</option><option>Property inspection request</option></select></label><div className="form-row"><label>Preferred date<input required name="date" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={event => setDate(event.target.value)} /></label><label>Preferred time<select required name="time" defaultValue=""><option value="" disabled>Select a time</option>{slots.map(([value, label]) => <option key={value} value={value} disabled={booked.includes(value)}>{label}{booked.includes(value) ? " — unavailable" : ""}</option>)}</select></label></div><label>Anything else we should know?<textarea name="notes" rows={3} placeholder="Optional" /></label><label className="hp-field" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" /></label><label className="consent"><input required type="checkbox" /> I agree that Mirvai may use these details to arrange my appointment. <Link href="/privacy">Privacy notice</Link></label><button className="button gold" type="submit">Request appointment</button>{status && <p className="form-status" aria-live="polite">{status}</p>}</form>;
}

function DiasporaFaqSection() {
  const faqs = [
    ["How can I buy property in Lagos while living abroad?", "We turn your location, budget and goal into a focused shortlist, coordinate live video viewings and keep the documents, questions and next steps organised in one clear journey."],
    ["What happens after I choose a property?", "We follow the five-step Mirvai journey shown above: organise the information, coordinate the necessary reviews, collect open questions and present the findings clearly before you decide."],
    ["Can I inspect a property remotely?", "Yes. We can coordinate live video viewings, current photos and inspection updates so you can assess an option before travelling or appointing a representative."],
    ["How does Mirvai keep the process clear?", "We keep important requests and next steps in writing, organise the available information and tell you what remains unresolved instead of rushing you toward payment."],
    ["What if my budget does not match my preferred property?", "We will tell you honestly what the budget can achieve and show the closest suitable options in your preferred area or comparable locations."],
    ["Can someone represent me in Nigeria?", "Yes, where the transaction allows it. We can coordinate communication with your chosen representative and keep important instructions and updates in writing."],
  ];
  return <section className="diaspora-faq section" id="faq"><div className="diaspora-summary"><p className="section-label light">For Nigerians abroad</p><h2>Invest at home without feeling far away.</h2><p>We coordinate remote viewings, organise the information and keep you informed from enquiry to decision.</p><a className="button outline" href="#enquire">Start your enquiry</a></div><div className="compact-faq"><p className="section-label light">Diaspora FAQ</p>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}<p className="faq-role-note">Mirvai coordinates the transaction journey. Legal opinions, title searches, surveys and technical assessments are completed by the appropriate qualified professionals and relevant authorities.</p></div></section>;
}

function PropertyGrid() {
  const [items, setItems] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/properties")
      .then(response => response.ok ? response.json() as Promise<PublicProperty[]> : [])
      .then(properties => setItems(withFeaturedProperty(properties)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
  return <section className="listings editorial-listings section" id="properties"><div className="editorial-section-head"><div><p className="section-label">The Mirvai selection</p><h2>Homes and investments,<br/><em>carefully considered.</em></h2></div><div className="section-note"><span>01</span><p>Explore selected opportunities across Lagos Mainland and Island.</p></div></div><nav className="property-category-rail" aria-label="Browse featured property categories">{propertyCategories.slice(1, 7).map(category => <Link key={category.slug} href={`/properties?type=${category.slug}#browse`}>{category.label}<span aria-hidden="true">↗</span></Link>)}</nav>{loading ? <div className="editorial-listing-loading" aria-label="Checking available properties"><span/></div> : items.length === 0 ? <div className="editorial-empty-listing"><div><p className="section-label">Current availability</p><h3>No property is published until its details and availability are confirmed.</h3></div><div><p>There are no approved public listings at the moment. Share your preferred location, property type and budget, and Mirvai will check the closest suitable options.</p><Link className="button gold" href="#enquire">Start a tailored search <span aria-hidden="true">→</span></Link></div></div> : <div className="property-grid editorial-property-grid">{items.slice(0, 3).map(property => {
    const imageSource = property.image_url || (property.image_key ? `/api/images/${property.image_key}` : null);
    const isCurated = property.reference === featuredProperty.reference;
    return <article className="property-card" key={property.id}><div className="property-card-media">{imageSource && <Image src={imageSource} width={1600} height={1200} sizes="(max-width: 800px) 100vw, 66vw" alt={`${property.title} in ${property.location}`} />}<span className="property-number">{String(items.indexOf(property) + 1).padStart(2, "0")}</span></div><div className="property-card-copy"><small>{property.type} · {property.status}</small><h3>{property.title}</h3><p>{property.location}</p><div className="property-price-row"><b>{formatNaira(property.price)}</b>{property.verified ? <span className="verified">Verified</span> : null}</div>{isCurated ? <Link href={`/properties/${featuredProperty.slug}`}>View property and gallery <span aria-hidden="true">↗</span></Link> : <a onClick={() => trackEvent("whatsapp_click")} href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hello Mirvai, I am interested in ${property.title} in ${property.location}.`)}`}>Enquire on WhatsApp <span aria-hidden="true">↗</span></a>}</div></article>;
  })}</div>}<div className="listing-actions editorial-listing-actions"><Link className="button" href="/properties">View all properties <span aria-hidden="true">→</span></Link><Link className="text-link dark" href="#enquire">Request a tailored search</Link></div></section>;
}

type ChatMessage = { id: number; sender: "visitor" | "admin"; body: string; created_at: string };
function getChatToken() {
  if (typeof window === "undefined") return "";
  try {
    let value = localStorage.getItem("mirvai-chat-token");
    if (!value) { value = crypto.randomUUID(); localStorage.setItem("mirvai-chat-token", value); }
    return value;
  } catch { return crypto.randomUUID(); }
}
function WebsiteChat() {
  const [open, setOpen] = useState(false), [token] = useState(getChatToken), [messages, setMessages] = useState<ChatMessage[]>([]), [known, setKnown] = useState(false), [status, setStatus] = useState("");
  useEffect(() => { if (!open || !token) return; const load = () => fetch(`/api/chat?token=${encodeURIComponent(token)}`).then(response => response.json()).then(data => { setMessages(data.messages || []); setKnown(!!data.conversation); }).catch(() => {}); load(); const timer = setInterval(load, 10000); return () => clearInterval(timer); }, [open, token]);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget, data = new FormData(form); setStatus("Sending…");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, name: data.get("name"), contact: data.get("contact"), message: data.get("message"), website: data.get("website") }) });
      if (response.ok) { form.reset(); setKnown(true); setStatus("Sent to Mirvai."); trackEvent("chat_message"); const latest = await fetch(`/api/chat?token=${encodeURIComponent(token)}`).then(item => item.json()); setMessages(latest.messages || []); } else setStatus(await response.text());
    } catch { setStatus("We could not send your message. Please try again or use WhatsApp."); }
  }
  return <><button className="chat-launcher" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label={open ? "Close Mirvai chat" : "Open Mirvai chat"}>{open ? <span>Close</span> : <span>Chat<i> with Mirvai</i></span>}</button>{open && <aside className="chat-panel" aria-label="Chat with Mirvai"><div className="chat-head"><div><b>Mirvai</b><small>Website chat</small></div><button onClick={() => setOpen(false)} aria-label="Close chat">×</button></div><div className="chat-messages">{messages.length === 0 ? <p className="chat-welcome">Hello! Tell us what property you need. We’ll reply here as soon as possible.</p> : messages.map(message => <p className={`chat-bubble ${message.sender}`} key={message.id}>{message.body}</p>)}</div><form onSubmit={send}>{!known && <><input required name="name" placeholder="Your name" /><input required name="contact" placeholder="Email or phone number" /></>}<textarea required name="message" rows={3} placeholder="Type your message…" /><label className="hp-field" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" /></label><button type="submit">Send message</button>{status && <small>{status}</small>}</form></aside>}</>;
}
