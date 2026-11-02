export type BuyerGuideSection = {
  heading: string;
  paragraphs: string[];
  points?: string[];
};

export type BuyerGuide = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
  introduction: string;
  readTime: string;
  sections: BuyerGuideSection[];
};

export const buyerGuides: BuyerGuide[] = [
  {
    slug: "buy-property-in-lagos-from-abroad",
    kicker: "Diaspora buyer guide",
    title: "How to buy property in Lagos from abroad",
    description: "A practical guide to property search, remote inspection, professional checks and completing a Lagos purchase while living overseas.",
    introduction: "Buying from another country can work well when the process is organised around evidence, clear communication and independent professional checks. This guide explains the steps Mirvai uses to help diaspora buyers move from a property brief to an informed decision.",
    readTime: "7 minute read",
    sections: [
      {
        heading: "Begin with a precise property brief",
        paragraphs: [
          "Start by defining why you are buying: a home, a rental investment, land for future development or a property you may resell later. The purpose affects the location, property type and checks that matter most.",
          "Set a working budget for the property itself and keep room for professional, documentation, administrative and transaction costs. These costs vary, so ask for a transaction-specific breakdown before committing.",
        ],
        points: ["Preferred Lagos locations", "Property type and must-have features", "Maximum working budget", "Purchase timeline", "Personal use or investment goal"],
      },
      {
        heading: "Review evidence, not only marketing",
        paragraphs: [
          "A useful shortlist should include current photos or video, location context, price, completion status and the available property or title information. A live video viewing can help you see the street, access road, exterior, rooms and immediate surroundings in real time.",
          "If you appoint a relative or representative to inspect, give them a written checklist. Their visit is helpful, but it should not replace legal, title, survey or technical checks where those are required.",
        ],
      },
      {
        heading: "Coordinate independent checks before payment",
        paragraphs: [
          "Once an option is serious, request the relevant documents and have qualified Nigerian professionals review the transaction. Depending on the property, this may include a lawyer, surveyor or other specialist and searches with the relevant authorities.",
          "Confirm who owns or is authorised to sell the property, what exactly is being sold, whether the documents correspond with the property, and what conditions apply to the transaction. Do not rely on screenshots, verbal assurances or a viewing alone.",
        ],
      },
      {
        heading: "Keep the decision trail clear",
        paragraphs: [
          "Ask for important information, findings, agreed terms and payment instructions in writing. Confirm the receiving party and account independently before transferring funds. If a power of attorney or another form of representation is needed, obtain transaction-specific advice from a qualified Nigerian legal practitioner.",
          "Mirvai can coordinate the search, viewing, documents and communication. Independent professionals provide their legal, title, survey or technical opinions, and you decide whether to proceed after reviewing the findings.",
        ],
      },
    ],
  },
  {
    slug: "lagos-mainland-property-guide",
    kicker: "Location guide",
    title: "A buyer’s guide to Lagos Mainland property",
    description: "What to consider when searching for a home, land or investment property across Lagos Mainland.",
    introduction: "Lagos Mainland covers established residential districts, commercial centres and fast-changing neighbourhoods. The right option depends less on a famous location name and more on how the property fits your budget, daily movement, intended use and long-term plan.",
    readTime: "6 minute read",
    sections: [
      {
        heading: "Match the area to your daily life",
        paragraphs: [
          "Consider where the occupants will work, study, shop and spend most of their time. Test realistic journey times at the hours that matter to you, not only during a quiet inspection period.",
          "Street quality can vary within the same neighbourhood. Check the immediate road, drainage, security arrangements, electricity setup, water supply and access during rain as part of the physical assessment.",
        ],
      },
      {
        heading: "Choose the right property type",
        paragraphs: [
          "Apartments may suit buyers who value managed shared spaces. Terrace and semi-detached duplexes can provide more room while sharing part of a development. Fully detached homes offer more separation but often require a larger budget and more maintenance.",
          "For land or redevelopment opportunities, confirm permitted use, boundaries, access and the planning implications with the appropriate professionals before relying on a future building plan.",
        ],
      },
      {
        heading: "Assess value beyond the asking price",
        paragraphs: [
          "Compare properties with similar condition, access, documentation and immediate surroundings. A lower asking price can be less attractive if major repairs, infrastructure gaps or unresolved documentation add cost and delay.",
          "If you are buying for rental income, examine the likely tenant profile, achievable rent, vacancy risk, service costs and the standard of competing homes nearby. Avoid basing a decision on an advertised return without supporting assumptions.",
        ],
      },
      {
        heading: "Shortlist, inspect and verify",
        paragraphs: [
          "A focused shortlist saves time. Mirvai can compare your location, property type and budget, explain the closest available options, coordinate viewings and organise the information required for independent professional checks.",
        ],
      },
    ],
  },
  {
    slug: "lagos-island-property-guide",
    kicker: "Location guide",
    title: "A buyer’s guide to Lagos Island property",
    description: "How to compare Island homes and investments by access, service costs, condition, documentation and intended use.",
    introduction: "The Lagos Island market includes apartments, terraces, detached homes, off-plan developments, land and commercial property at very different price points. A strong decision begins with the exact micro-location and the full cost of owning the property—not the Island label alone.",
    readTime: "6 minute read",
    sections: [
      {
        heading: "Compare micro-locations carefully",
        paragraphs: [
          "Proximity to a main road, business district or leisure destination may improve convenience, but the street itself still matters. Visit or view the route, drainage, traffic pattern, neighbouring development and access controls.",
          "Ask how the area and the development perform during heavy rain. Where appropriate, obtain technical advice instead of relying only on assurances about flooding or drainage.",
        ],
      },
      {
        heading: "Understand the total ownership cost",
        paragraphs: [
          "Apartments and gated developments may include estate or service charges for security, cleaning, shared power, water, lifts, landscaping or facilities. Ask what the charge covers, how often it is reviewed and whether any major work is planned.",
          "Also consider finishing, repairs, furnishing, professional fees, documentation and ongoing maintenance. A clear cost picture makes it easier to compare a completed home with an off-plan or partly finished option.",
        ],
      },
      {
        heading: "Test an investment case realistically",
        paragraphs: [
          "For rental or resale goals, identify the likely customer, comparable properties and realistic demand. Estimate income using conservative occupancy and cost assumptions, and treat any forecast as an estimate rather than a guaranteed return.",
          "For off-plan property, review the developer, project documentation, specifications, payment milestones, completion terms and what happens if the programme changes. Obtain independent professional advice before signing or paying.",
        ],
      },
      {
        heading: "Move from interest to evidence",
        paragraphs: [
          "When a property matches your brief, inspect it, request the available documents and coordinate appropriate legal, title, survey and technical checks. Mirvai keeps the search and communication organised so you can compare findings before deciding.",
        ],
      },
    ],
  },
  {
    slug: "property-verification-in-nigeria",
    kicker: "Due diligence guide",
    title: "Property verification in Nigeria: what buyers should check",
    description: "A clear overview of physical inspection, seller authority, property documents and independent professional checks before a purchase.",
    introduction: "Property verification is a process, not a badge or a single document. The exact checks depend on the property, location and transaction. The goal is to confirm that the physical property, the person selling it and the supporting records all align before you make a commitment.",
    readTime: "8 minute read",
    sections: [
      {
        heading: "Confirm the property and the seller",
        paragraphs: [
          "Inspect the physical property and confirm its location, access, boundaries, condition and occupancy. Establish the identity of the owner or seller and the basis on which any agent, family member, company or developer is authorised to act.",
          "Names, property descriptions and transaction parties should be consistent across the information provided. Any mismatch should be explained and checked rather than ignored.",
        ],
      },
      {
        heading: "Review the available records",
        paragraphs: [
          "Ask for the documents relevant to that specific property and transaction. A qualified Nigerian legal practitioner can advise which records are necessary, conduct or coordinate official searches and explain any interests, restrictions or outstanding issues found.",
          "Where boundaries, coordinates or physical extent matter, a qualified survey professional can assess the survey information and site. Buildings may also require technical inspection depending on their age, condition and stage of construction.",
        ],
      },
      {
        heading: "Watch for avoidable warning signs",
        paragraphs: [
          "Be cautious when there is pressure to pay before checks are complete, reluctance to share documents, inconsistent names or prices, payment instructions that keep changing, or promises that cannot be put in writing.",
          "A polished brochure, social media page, property viewing or receipt does not by itself establish ownership, authority to sell or a clear title.",
        ],
        points: ["Unexplained document or identity differences", "Pressure to pay immediately", "Refusal to allow independent checks", "Unconfirmed personal payment accounts", "Guaranteed returns without evidence"],
      },
      {
        heading: "Know who is responsible for each step",
        paragraphs: [
          "Mirvai can source options, coordinate inspections, request available information and keep communication organised. Qualified legal, survey and technical professionals provide their respective opinions, and relevant authorities maintain or confirm official records where applicable.",
          "The buyer should review the findings, ask questions and decide whether the risk and terms are acceptable before signing or paying. This guide is general education and is not a substitute for advice on a specific transaction.",
        ],
      },
    ],
  },
];

export function getBuyerGuide(slug: string) {
  return buyerGuides.find((guide) => guide.slug === slug);
}
