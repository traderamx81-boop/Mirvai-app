"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import PropertyExploreMenu from "@/components/property-explore-menu";
import MirvaiBrand from "@/components/mirvai-brand";
import { formatNaira, propertyCategories, type PublicProperty, withFeaturedProperty } from "@/lib/featured-property";

const DEFAULT_WA = "2349011081436";

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
    void fetch("/api/analytics", { 
      method: "POST", 
      headers: { "content-type": "application/json" }, 
      body: JSON.stringify({ event, path: location.pathname, sessionId: sessionId() }) 
    });
  } catch { /* Analytics must never interrupt a visitor. */ }
}

export interface WebsiteSettings {
  heroKickerTop: string;
  heroKickerBottom: string;
  heroHeadlineMain: string;
  heroHeadlineEm: string;
  heroCopy: string;
  whatsapp: string;
  contactEmail: string;
  officeLocation: string;
  playStoreUrl: string;
  trustPoints: string[];
  announcement: string;
  showAnnouncement: boolean;
}

export default function Home() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    heroKickerTop: "Lagos · Nigeria · Diaspora",
    heroKickerBottom: "Buy · Sell · Invest",
    heroHeadlineMain: "Property decisions,",
    heroHeadlineEm: "made with confidence.",
    heroCopy: "We help you find, evaluate and secure the right property in Lagos—wherever you are in the world.",
    whatsapp: DEFAULT_WA,
    contactEmail: "advisory@mirvaigroup.com",
    officeLocation: "Admiralty Way Corridor, Lekki Phase 1 / Ikeja, Lagos",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.mirvai.app",
    trustPoints: ["Verified options", "Clear guidance", "End-to-end support"],
    announcement: "",
    showAnnouncement: false,
  });

  useEffect(() => {
    trackEvent("page_view");

    // Fetch initial settings
    fetch("/api/website-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});

    // Real-time SSE updates for settings
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/realtime/stream");
      eventSource.addEventListener("settings_updated", (e) => {
        try {
          const { payload } = JSON.parse(e.data);
          if (payload) setSettings(payload);
        } catch {}
      });
    } catch {}

    return () => {
      eventSource?.close();
    };
  }, []);

  const openChat = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.dispatchEvent(new CustomEvent("mirvai:open-chat"));
  };

  return (
    <main>
      <header className="nav-shell editorial-nav">
        <MirvaiBrand href="#top" />
        <div className="site-header-actions flex items-center gap-3">
          <a
            className="nav-cta hidden sm:inline-flex items-center"
            onClick={() => trackEvent("whatsapp_click")}
            href={`https://wa.me/${settings.whatsapp || DEFAULT_WA}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp us
          </a>
          <PropertyExploreMenu />
        </div>
      </header>

      <section className="hero editorial-hero" id="top">
        <Image
          src="/mirvai-hero.png"
          alt="Contemporary luxury home at dusk"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-signature" aria-hidden="true">
          <span>MIRVAI</span>
          <small>FIND · OWN · GROW</small>
        </div>
        <div className="hero-content">
          <div className="hero-kicker">
            <p className="eyebrow">{settings.heroKickerTop}</p>
            <span>{settings.heroKickerBottom}</span>
          </div>
          <h1>
            {settings.heroHeadlineMain}
            <br />
            <em>{settings.heroHeadlineEm}</em>
          </h1>
          <p className="hero-copy">{settings.heroCopy}</p>
          <div className="hero-actions">
            <a className="button gold editorial-button" href="#properties">
              Explore properties <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className="text-link bg-transparent border-0 text-left cursor-pointer"
              onClick={openChat}
            >
              Tell us what you need
            </button>
          </div>
          <div className="trust-line">
            {settings.trustPoints && settings.trustPoints.length > 0 ? (
              settings.trustPoints.map((tp) => <span key={tp}>{tp}</span>)
            ) : (
              <>
                <span>Verified options</span>
                <span>Clear guidance</span>
                <span>End-to-end support</span>
              </>
            )}
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">
          <span>01</span>
          <i />
          <small>
            Mirvai
            <br />
            Lagos
          </small>
        </div>
      </section>

      <PropertyGrid onOpenChat={openChat} />
      <BuyerStoriesSection />
      <TrustProofSection />
      <CompactAppDownloadStrip playStoreUrl={settings.playStoreUrl} />

      <footer>
        <MirvaiBrand />
        <p>Integrity. Professionalism. Results.</p>
        <p>
          © 2026 Mirvai · <Link href="/guides">Buyer guides</Link> ·{" "}
          <Link href="/privacy">Privacy</Link>
        </p>
      </footer>

      <WebsiteChat whatsappNumber={settings.whatsapp || DEFAULT_WA} />
    </main>
  );
}

function BuyerStoriesSection() {
  const stories = [
    {
      quote:
        "I live in London and was terrified of buying land in Lagos remotely—too many horror stories. Mirvai walked me through every check before I sent a naira. The video inspection alone saved me from a bad deal.",
      profile: "Diaspora client",
      location: "United Kingdom",
      tag: "Remote Acquisition",
      initials: "DC",
    },
    {
      quote:
        "I told them my budget upfront, expecting to be pushed towards something I could not afford. Instead, they were honest about what it could get me and showed me options I had not even considered on the Mainland.",
      profile: "Local investor",
      location: "Lagos, Nigeria",
      tag: "Budget Sourcing",
      initials: "LI",
    },
    {
      quote:
        "First time buying property and I had no idea what documentation even meant. Mirvai explained everything in plain terms and coordinated the whole process end to end.",
      profile: "First-time buyer",
      location: "Lekki, Lagos",
      tag: "First Purchase",
      initials: "FB",
    },
    {
      quote:
        "What stood out was that they did not disappear after the sale. Documentation support continued until everything was fully sorted and title registered.",
      profile: "Property investor",
      location: "Toronto, Canada",
      tag: "Documentation Support",
      initials: "PI",
    },
  ];

  return (
    <section
      className="buyer-stories section"
      aria-labelledby="buyer-stories-title"
      id="stories"
    >
      <div className="buyer-stories-head">
        <div>
          <p className="section-label">What clients say</p>
          <h2 id="buyer-stories-title">Trusted by buyers at home and abroad.</h2>
        </div>
        <p>
          Real experiences from clients who trusted Mirvai to guide their property
          journey with clarity, honesty and continued support.
        </p>
      </div>
      <div className="buyer-story-grid">
        {stories.map((story, index) => (
          <article className="story-card" key={story.profile + index}>
            <div className="story-card-header">
              <div className="story-stars" aria-label="5 stars rating">
                ★★★★★
              </div>
              <span className="story-number">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="story-quote">“{story.quote}”</p>
            <div className="story-card-footer">
              <div className="story-avatar">{story.initials}</div>
              <div className="story-info">
                <strong className="story-name">{story.profile}</strong>
                <span className="story-location">
                  {story.location} · {story.tag}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrustProofSection() {
  const steps = [
    [
      "01",
      "Understand your brief",
      "We clarify the property, location, budget, purpose and timeline that should guide the search.",
    ],
    [
      "02",
      "Source and inspect",
      "We compare suitable options and coordinate physical or live video viewings of the property and surroundings.",
    ],
    [
      "03",
      "Prepare the review file",
      "We organise the available title documents, survey plan, seller or owner details, approvals and transaction terms that apply to the property.",
    ],
    [
      "04",
      "Coordinate specialist review",
      "A qualified Nigerian property lawyer reviews legal and title questions; a registered surveyor checks survey or boundary issues; and a building professional can assess physical condition when needed.",
    ],
    [
      "05",
      "Share findings before a decision",
      "We organise the feedback, flag open questions and help you understand the next step before commitment.",
    ],
  ];
  return (
    <section className="trust-proof section" id="about">
      <div className="trust-identity">
        <p className="section-label">About Mirvai</p>
        <h2>Built on trust, not shortcuts.</h2>
        <p>
          Buying property in Lagos should not mean guessing who to trust. Unclear
          information and distance make it difficult for buyers—especially
          Nigerians living abroad—to find properties that match their exact needs
          and budgets. Mirvai provides a verified, transparent path through
          carefully sourced options, independent professional checks, and
          dedicated buyer advisory from initial search to final deed
          registration.
        </p>
      </div>
      <div className="trust-process">
        <p className="section-label">The Mirvai due-diligence journey</p>
        {steps.map(([number, title, copy]) => (
          <article key={number}>
            <b>{number}</b>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
        <div className="role-note">
          <strong>Clear responsibility at every step</strong>
          <p>
            Mirvai manages the sourcing and communication journey. The
            appropriate independent professionals provide specialist findings, and
            you review those findings before deciding whether to proceed.
          </p>
        </div>
      </div>
    </section>
  );
}

function CompactAppDownloadStrip({ playStoreUrl }: { playStoreUrl?: string }) {
  const url =
    playStoreUrl ||
    "https://play.google.com/store/apps/details?id=com.mirvai.app";
  return (
    <aside
      className="w-full bg-[#071911] border-y border-[#1a3d2e] py-4 sm:py-5 px-4 sm:px-8"
      aria-label="Download Mirvai Mobile App"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-sm bg-[#cca462] flex items-center justify-center font-serif text-xl font-bold text-[#082216] shrink-0 select-none shadow-sm">
            M
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f0eee8] m-0">
              Get Mirvai on Google Play
            </p>
            <span className="text-xs text-[#9bb3a6]">
              Verified Lagos listings, title documentation tracking &amp; instant
              WhatsApp advisory
            </span>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-lg bg-[#cca462] hover:bg-[#deb26d] text-[#082216] font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a1.5 1.5 0 0 1-.61-.926V2.74a1.5 1.5 0 0 1 .609-.926zm11.238 11.241l2.585-2.585-11.83-6.83 9.245 9.415zm0 1.89L5.602 24.36l11.83-6.83-2.585-2.585zm1.488-1.488l3.158-1.823c.895-.517.895-1.365 0-1.882l-3.158-1.823-2.032 2.032 2.032 2.096z" />
          </svg>
          <span>Download on Google Play</span>
        </a>
      </div>
    </aside>
  );
}

function PropertyGrid({ onOpenChat }: { onOpenChat: () => void }) {
  const [items, setItems] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProps = () => {
    fetch("/api/properties")
      .then((response) =>
        response.ok ? (response.json() as Promise<PublicProperty[]>) : []
      )
      .then((properties) => setItems(withFeaturedProperty(properties)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProps();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/realtime/stream");
      eventSource.addEventListener("property_added", () => fetchProps());
      eventSource.addEventListener("property_updated", () => fetchProps());
      eventSource.addEventListener("property_deleted", () => fetchProps());
    } catch {}

    return () => {
      eventSource?.close();
    };
  }, []);

  return (
    <section className="listings editorial-listings section" id="properties">
      <div className="editorial-section-head">
        <div>
          <p className="section-label">The Mirvai selection</p>
          <h2>
            Homes and investments,
            <br />
            <em>carefully considered.</em>
          </h2>
        </div>
        <div className="section-note">
          <span>01</span>
          <p>Explore selected opportunities across Lagos Mainland and Island.</p>
        </div>
      </div>
      <nav
        className="property-category-rail"
        aria-label="Browse featured property categories"
      >
        {propertyCategories.slice(1, 7).map((category) => (
          <Link
            key={category.slug}
            href={`/properties?type=${category.slug}#browse`}
          >
            {category.label}
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
      {loading ? (
        <div
          className="editorial-listing-loading"
          aria-label="Checking available properties"
        >
          <span />
        </div>
      ) : items.length === 0 ? (
        <div className="editorial-empty-listing">
          <div>
            <p className="section-label">Current availability</p>
            <h3>
              No property is published until its details and availability are
              confirmed.
            </h3>
          </div>
          <div>
            <p>
              There are no approved public listings at the moment. Share your
              preferred location, property type and budget, and Mirvai will check
              the closest suitable options.
            </p>
            <button
              type="button"
              className="button gold cursor-pointer"
              onClick={onOpenChat}
            >
              Start a tailored search <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="property-grid editorial-property-grid">
          {items.slice(0, 3).map((property) => {
            const imageSource =
              property.image_url ||
              (property.image_key
                ? `/api/images/${property.image_key}`
                : null);
            return (
              <article className="property-card" key={property.id}>
                <div className="property-card-media">
                  {imageSource && (
                    <Image
                      src={imageSource}
                      width={1600}
                      height={1200}
                      sizes="(max-width: 800px) 100vw, 66vw"
                      alt={`${property.title} in ${property.location}`}
                    />
                  )}
                  <span className="property-number">
                    {String(items.indexOf(property) + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="property-card-copy">
                  <small>
                    {property.type} · {property.status}
                  </small>
                  <h3>{property.title}</h3>
                  <p>{property.location}</p>
                  <div className="property-price-row">
                    <b>{formatNaira(property.price)}</b>
                    {property.verified ? (
                      <span className="verified">Verified</span>
                    ) : null}
                  </div>
                  <Link href={`/properties/${property.slug}`}>
                    View details &amp; gallery <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="listing-actions editorial-listing-actions">
        <Link className="button" href="/properties">
          View all properties <span aria-hidden="true">→</span>
        </Link>
        <button
          type="button"
          className="text-link dark bg-transparent border-0 cursor-pointer"
          onClick={onOpenChat}
        >
          Request a tailored search
        </button>
      </div>
    </section>
  );
}

type ChatMessage = {
  id: string;
  sender: "visitor" | "advisor";
  body: string;
  time: string;
  senderName?: string;
};

function getChatToken() {
  if (typeof window === "undefined") return "";
  try {
    let value = localStorage.getItem("mirvai-chat-token");
    if (!value) {
      value = "vis-" + crypto.randomUUID();
      localStorage.setItem("mirvai-chat-token", value);
    }
    return value;
  } catch {
    return "vis-" + Math.random().toString(36).slice(2);
  }
}

function WebsiteChat({ whatsappNumber }: { whatsappNumber: string }) {
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
        senderName: "Mirvai Senior Advisory",
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [name, setName] = useState(() => {
    try {
      const contact = localStorage.getItem("mirvai_client_contact");
      if (contact) return JSON.parse(contact).name || "";
    } catch {}
    return "";
  });
  const [contact, setContact] = useState(() => {
    try {
      const c = localStorage.getItem("mirvai_client_contact");
      if (c) return JSON.parse(c).contact || "";
    } catch {}
    return "";
  });
  const [known, setKnown] = useState(() => {
    try {
      return !!localStorage.getItem("mirvai_client_contact");
    } catch {
      return false;
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [open, messages, isTyping]);

  useEffect(() => {
    try {
      localStorage.setItem("mirvai_chat_history", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Listen to open-chat custom events from anywhere on the landing page
  useEffect(() => {
    const handleOpenEvent = () => setOpen(true);
    window.addEventListener("mirvai:open-chat", handleOpenEvent);
    return () => window.removeEventListener("mirvai:open-chat", handleOpenEvent);
  }, []);

  // Sync past conversation with backend on mount
  useEffect(() => {
    if (!token) return;
    fetch(`/api/chat?token=${encodeURIComponent(token)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.messages && data.messages.length > 0) {
          const backendMsgs: ChatMessage[] = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender === "admin" ? "advisor" : "visitor",
            body: m.body,
            time: m.timeString || "Recent",
            senderName: m.senderName,
          }));
          setMessages(backendMsgs);
        }
      })
      .catch(() => {});
  }, [token]);

  // Connect to SSE stream for live real-time two-way replies from admin desk!
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/realtime/stream");
      eventSource.addEventListener("chat_message", (e) => {
        try {
          const { payload } = JSON.parse(e.data);
          const { conversation, message } = payload;
          if (
            conversation &&
            (conversation.visitorToken === token || conversation.id === token)
          ) {
            const mappedMsg: ChatMessage = {
              id: message.id,
              sender: message.sender === "admin" ? "advisor" : "visitor",
              body: message.body,
              time: message.timeString || "Just now",
              senderName: message.senderName,
            };

            setMessages((prev) => {
              if (prev.some((m) => m.id === mappedMsg.id)) return prev;
              return [...prev, mappedMsg];
            });

            if (!open) {
              setUnreadCount((c) => c + 1);
            }
            setIsTyping(false);
          }
        } catch {}
      });
    } catch {}

    return () => {
      eventSource?.close();
    };
  }, [token, open]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    if (name && contact) {
      try {
        localStorage.setItem(
          "mirvai_client_contact",
          JSON.stringify({ name, contact })
        );
        setKnown(true);
      } catch {}
    }

    const timeString = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const localId = "usr-" + Date.now();
    const userMsg: ChatMessage = {
      id: localId,
      sender: "visitor",
      body: text,
      time: timeString,
      senderName: name || "You",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);
    setStatus("Connecting live to Mirvai Senior Desk…");

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          name: name || "Guest Visitor",
          contact: contact || "Direct Web Visitor",
          message: text,
        }),
      });
      setStatus("Sent directly to Mirvai Senior Desk.");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Network error sending message. Please use WhatsApp.");
    }

    // Gentle automated reassuring feedback if admin hasn't responded after 2.5s
    setTimeout(() => {
      setIsTyping(false);
    }, 2500);
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
        className="chat-launcher-enhanced fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#082216] border border-[#cca462]/40 text-[#f0eee8] shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={
          open ? "Close Mirvai advisory chat" : "Open Mirvai advisory chat"
        }
      >
        <div className="w-7 h-7 rounded-sm bg-[#cca462] flex items-center justify-center font-serif text-sm font-bold text-[#082216] select-none shadow-sm shrink-0">
          M
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium text-xs sm:text-sm tracking-wide">
          {open ? "Close Desk" : "Chat with Mirvai"}
        </span>
        {unreadCount > 0 && !open && (
          <span className="w-5 h-5 rounded-full bg-[#cca462] text-[#082216] text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <aside
          className="chat-panel-enhanced fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] max-h-[82vh] h-[600px] z-50 flex flex-col rounded-2xl bg-[#082216] border border-[#cca462]/30 shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200"
          aria-label="Mirvai Advisory Desk Chat"
        >
          {/* Header */}
          <header className="px-4 py-3.5 bg-[#05170f] border-b border-[#cca462]/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#cca462] flex items-center justify-center font-serif text-sm font-bold text-[#082216] select-none shadow-sm">
                M
              </div>
              <div>
                <b className="block text-sm font-serif font-bold text-[#f0eee8] tracking-wide">
                  Mirvai Advisory Desk
                </b>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Senior Desk Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-[#113123] hover:bg-[#1a4431] text-[#cca462] flex items-center justify-center text-lg transition-colors cursor-pointer"
              aria-label="Close chat window"
            >
              ×
            </button>
          </header>

          {/* Quick Inquiry Chips */}
          <div className="px-3 py-2 bg-[#061c12] border-b border-[#cca462]/10 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] bg-[#113123] hover:bg-[#cca462] text-[#9bb3a6] hover:text-[#082216] transition-colors border border-[#1d4634] shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#082216]/95">
            {messages.map((m) => {
              const isVisitor = m.sender === "visitor";
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${
                    isVisitor ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isVisitor && (
                    <div className="w-6 h-6 rounded-sm bg-[#cca462] text-[#082216] font-serif font-bold text-[10px] flex items-center justify-center shrink-0 mb-1 select-none">
                      M
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isVisitor
                        ? "bg-[#cca462] text-[#082216] rounded-br-none font-medium"
                        : "bg-[#113123] text-[#f0eee8] border border-[#1d4634] rounded-bl-none"
                    }`}
                  >
                    {!isVisitor && m.senderName && (
                      <span className="block text-[10px] font-bold text-[#cca462] mb-1">
                        {m.senderName}
                      </span>
                    )}
                    <p className="m-0 whitespace-pre-wrap">{m.body}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isVisitor ? "text-[#082216]/70" : "text-[#9bb3a6]"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-6 h-6 rounded-sm bg-[#cca462] text-[#082216] font-serif font-bold text-[10px] flex items-center justify-center shrink-0 mb-1 select-none">
                  M
                </div>
                <div className="bg-[#113123] border border-[#1d4634] rounded-2xl rounded-bl-none px-3.5 py-2.5 flex items-center gap-1.5 text-xs text-[#9bb3a6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cca462] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cca462] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cca462] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">Live Advisor connecting...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* User Details & Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#05170f] border-t border-[#cca462]/20 shrink-0"
          >
            {!known && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0c281a] border border-[#1d4634] text-xs text-[#f0eee8] placeholder-[#9bb3a6]/60 focus:outline-none focus:border-[#cca462]"
                />
                <input
                  required
                  placeholder="WhatsApp or Email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0c281a] border border-[#1d4634] text-xs text-[#f0eee8] placeholder-[#9bb3a6]/60 focus:outline-none focus:border-[#cca462]"
                />
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your enquiry for our senior team…"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0c281a] border border-[#1d4634] text-xs sm:text-sm text-[#f0eee8] placeholder-[#9bb3a6]/60 focus:outline-none focus:border-[#cca462]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#cca462] hover:bg-[#deb26d] text-[#082216] font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
              >
                Send
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a3d2e] text-[11px] text-[#9bb3a6]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Desk Relay
              </span>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  "Hello Mirvai, I am enquiring from your website live chat."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#cca462] hover:underline flex items-center gap-1 font-medium"
              >
                WhatsApp Advisor ↗
              </a>
            </div>
            {status && (
              <p className="text-[10px] text-[#cca462] mt-1 text-center font-medium">
                {status}
              </p>
            )}
          </form>
        </aside>
      )}
    </>
  );
}
