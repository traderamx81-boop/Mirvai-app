"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
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
      <div className="site-header-actions">
        <a className="nav-cta" onClick={() => trackEvent("whatsapp_click")} href={`https://wa.me/${WA}`}>WhatsApp us</a>
        <PropertyExploreMenu/>
      </div>
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
      location: "United Kingdom",
      tag: "Remote Acquisition",
      initials: "DC",
    },
    {
      quote: "I told them my budget upfront, expecting to be pushed towards something I could not afford. Instead, they were honest about what it could get me and showed me options I had not even considered on the Mainland.",
      profile: "Local investor",
      location: "Lagos, Nigeria",
      tag: "Budget Sourcing",
      initials: "LI",
    },
    {
      quote: "First time buying property and I had no idea what documentation even meant. Mirvai explained everything in plain terms and coordinated the whole process end to end.",
      profile: "First-time buyer",
      location: "Lekki, Lagos",
      tag: "First Purchase",
      initials: "FB",
    },
    {
      quote: "What stood out was that they did not disappear after the sale. Documentation support continued until everything was fully sorted and title registered.",
      profile: "Property investor",
      location: "Toronto, Canada",
      tag: "Documentation Support",
      initials: "PI",
    },
  ];

  return <section className="buyer-stories section" aria-labelledby="buyer-stories-title" id="stories">
    <div className="buyer-stories-head">
      <div><p className="section-label">What clients say</p><h2 id="buyer-stories-title">Trusted by buyers at home and abroad.</h2></div>
      <p>Real experiences from clients who trusted Mirvai to guide their property journey with clarity, honesty and continued support.</p>
    </div>
    <div className="buyer-story-grid">{stories.map((story, index) => (
      <article className="story-card" key={story.profile + index}>
        <div className="story-card-header">
          <div className="story-stars" aria-label="5 stars rating">★★★★★</div>
          <span className="story-number">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p className="story-quote">“{story.quote}”</p>
        <div className="story-card-footer">
          <div className="story-avatar">{story.initials}</div>
          <div className="story-info">
            <strong className="story-name">{story.profile}</strong>
            <span className="story-location">{story.location} · {story.tag}</span>
          </div>
        </div>
      </article>
    ))}</div>
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

type ChatMessage = { id: string; sender: "visitor" | "advisor"; body: string; time: string };
function getChatToken() {
  if (typeof window === "undefined") return "";
  try {
    let value = localStorage.getItem("mirvai-chat-token");
    if (!value) { value = crypto.randomUUID(); localStorage.setItem("mirvai-chat-token", value); }
    return value;
  } catch { return crypto.randomUUID(); }
}
function WebsiteChat() {
  const [open, setOpen] = useState(false);
  const [token] = useState(getChatToken);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("mirvai_chat_history");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "msg-init",
        sender: "advisor",
        body: "Hello! Welcome to Mirvai Senior Advisory. How can our team assist your Lagos property search, title verification, or diaspora investment plans today?",
        time: "Just now",
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [known, setKnown] = useState(() => {
    try {
      return !!localStorage.getItem("mirvai_client_contact");
    } catch {
      return false;
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [open, messages, isTyping]);

  useEffect(() => {
    try {
      localStorage.setItem("mirvai_chat_history", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    if (name && contact) {
      try {
        localStorage.setItem("mirvai_client_contact", JSON.stringify({ name, contact }));
        setKnown(true);
      } catch {}
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "visitor",
      body: text,
      time: timeString,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);
    setStatus("Connecting to Senior Desk…");

    try {
      void fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, name, contact, message: text, website: "" }),
      });
    } catch {}

    setTimeout(() => {
      setIsTyping(false);
      setStatus("");
      let reply = "Thank you for reaching out. A senior Mirvai advisor has received your request and will review the available registry documents. We can also coordinate a live 4K drone viewing.";
      const lower = text.toLowerCase();
      if (lower.includes("title") || lower.includes("consent") || lower.includes("c of o") || lower.includes("deed")) {
        reply = "Title verification is our highest priority at Mirvai. Every listed property undergoes Governor's Consent, gazette, and registered survey beacon validation before publishing. Would you like our legal team to share the review file?";
      } else if (lower.includes("remote") || lower.includes("diaspora") || lower.includes("abroad") || lower.includes("video") || lower.includes("inspect")) {
        reply = "For our diaspora investors in the UK, US, Canada and Europe, we coordinate live 4K video walkthroughs and independent legal checks. Would you like us to schedule an inspection date this week?";
      } else if (lower.includes("material") || lower.includes("construction") || lower.includes("cement") || lower.includes("steel")) {
        reply = "Mirvai Construction supplies verified structural steel, cement, and finishing materials directly to private client sites across Lagos. We can prepare a verified bill of quantities quote for you.";
      } else if (lower.includes("price") || lower.includes("budget") || lower.includes("duplex") || lower.includes("lekki") || lower.includes("ikoyi")) {
        reply = "Our partner-developer options in Lekki Phase 1, Ikate, and Ikoyi range from contemporary 4-bedroom terraces to luxury penthouses. Share your preferred budget and we will send matching verified portfolios.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: "adv-" + Date.now(),
          sender: "advisor",
          body: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1100);
  };

  const quickChips = [
    "Verify Title (Gov. Consent)",
    "Schedule 4K Drone Inspection",
    "Lekki & Ikoyi Price List",
    "Building Materials & Supply",
  ];

  return (
    <>
      <button
        className="chat-launcher-enhanced"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label={open ? "Close Mirvai advisory chat" : "Open Mirvai advisory chat"}
      >
        <div className="launcher-crest">
          <img
            src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
            alt="Mirvai"
          />
        </div>
        <span className="online-dot" />
        <span className="launcher-text">
          {open ? "Close Desk" : "Chat with Mirvai"}
        </span>
      </button>

      {open && (
        <aside className="chat-panel-enhanced" aria-label="Mirvai Advisory Desk Chat">
          <header className="chat-panel-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">
                <img
                  src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
                  alt="Mirvai Crest"
                />
              </div>
              <div>
                <b className="chat-header-title">Mirvai Advisory Desk</b>
                <div className="chat-header-sub">
                  <span className="chat-live-pulse" />
                  <span>Online · Senior Advisors Ready</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="chat-header-close"
              aria-label="Close chat window"
            >
              ×
            </button>
          </header>

          <div className="chat-quick-chips">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                className="chat-chip"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="chat-messages-enhanced">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble-row ${m.sender === "visitor" ? "visitor" : "advisor"}`}
              >
                {m.sender === "advisor" && (
                  <div className="advisor-avatar">
                    <img
                      src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
                      alt="Advisor"
                    />
                  </div>
                )}
                <div className={`chat-bubble-box ${m.sender === "visitor" ? "bubble-visitor" : "bubble-advisor"}`}>
                  <p className="bubble-text">{m.body}</p>
                  <span className="bubble-time">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row advisor">
                <div className="advisor-avatar">
                  <img
                    src="/assets/aistudio/IMG-20261024-WA0026_1__bcc678a3.jpg"
                    alt="Advisor"
                  />
                </div>
                <div className="chat-bubble-box bubble-advisor is-typing-box">
                  <span className="typing-dot" />
                  <span className="typing-dot delay-1" />
                  <span className="typing-dot delay-2" />
                  <span className="typing-label">Advisor reviewing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chat-panel-form"
          >
            {!known && (
              <div className="chat-user-row">
                <input
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="chat-field"
                />
                <input
                  required
                  placeholder="WhatsApp or Email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="chat-field"
                />
              </div>
            )}
            <div className="chat-input-row">
              <input
                type="text"
                required
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your enquiry…"
                className="chat-input-main"
              />
              <button
                type="submit"
                className="chat-send-btn"
                aria-label="Send message"
              >
                Send
              </button>
            </div>
            <div className="chat-footer-actions">
              <span className="chat-sec-note">Protected Mirvai Advisory Relay</span>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hello Mirvai, I would like to consult with an advisor.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-wa-link"
              >
                <span>WhatsApp Desk</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            {status && <small className="chat-status-msg">{status}</small>}
          </form>
        </aside>
      )}
    </>
  );
}
