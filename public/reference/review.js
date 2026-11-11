(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const all = (selector) => Array.from(document.querySelectorAll(selector));
  const icon = (name) => '<svg aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const ngn = (amount) => "₦" + new Intl.NumberFormat("en-NG", {maximumFractionDigits:0}).format(amount);
  const categories = [
    ["terrace","Terrace duplex"],["semi","Semi-detached"],["detached","Detached"],
    ["apartment","Apartment"],["off-plan","Off-plan"],["land","Land"]
  ];
  const category = (id) => categories.find(([key]) => id === key)?.[1] || "Property";
  const branches = [
    {id:"realty",name:"Realty",label:"Active",summary:"Properties from independent developers and owners.",detail:"Explore third-party homes and land listed through MIRVAI Realty. These are not MIRVAI-owned developments."},
    {id:"development",name:"Development",label:"Incoming",summary:"MIRVAI-owned developments and the homes we build.",detail:"This will be the home of MIRVAI’s own projects, separate from the third-party listings in Realty. No MIRVAI development is available through this preview."},
    {id:"construction",name:"Construction",label:"Incoming",summary:"Building materials and supply.",detail:"A future place to browse and source building materials. This branch is planned for materials sales and supply; it is not offering third-party building work."},
    {id:"technology",name:"Technology",label:"Incoming",summary:"Digital tools for property buyers and teams.",detail:"Future digital products, including MIRVAI Intelligence, will support research, client journeys and operations. They are not live services here."},
    {id:"energy",name:"Energy",label:"Incoming",summary:"Reliable energy for homes and communities.",detail:"A future branch focused on energy solutions, including solar and storage for homes and communities. No products are available in this preview."},
    {id:"community",name:"Community",label:"Incoming",summary:"Resources and connections for buyers and residents.",detail:"A future place for buyer resources, community updates and ways to stay connected after moving in."}
  ];
  const images = {
    courtyard:{src:"assets/courtyard.webp",alt:"Contemporary limestone courtyard and reflecting pool"},
    terraces:{src:"assets/terraces.webp",alt:"Warm limestone townhouse with a planted entrance"},
    garden:{src:"assets/garden.webp",alt:"Calm contemporary living room with natural materials"}
  };
  const homes = [
    {id:"courtyard",name:"The Courtyard House",type:"detached",area:"Island",locale:"Ikoyi",price:650000000,beds:4,photo:"courtyard",description:"A contemporary detached home organised around a quiet courtyard, with generous living areas and an indoor-outdoor outlook."},
    {id:"terraces",name:"The Limestone Terrace",type:"terrace",area:"Mainland",locale:"Ikeja",price:265000000,beds:4,photo:"terraces",description:"A terrace duplex with a planted entrance, warm natural finishes and space for everyday family life."},
    {id:"garden",name:"The Garden Residence",type:"apartment",area:"Island",locale:"Lekki",price:175000000,beds:3,photo:"garden",description:"A light-filled apartment with a welcoming living area and space to unwind."},
    {id:"willow",name:"Willow House",type:"semi",area:"Mainland",locale:"Magodo",price:245000000,beds:4,description:"A sample semi-detached home with four bedrooms and a layout suited to family living."},
    {id:"atelier",name:"The Atelier",type:"off-plan",area:"Island",locale:"Oniru",price:198000000,beds:3,description:"A sample off-plan home. In a real enquiry, ask about delivery milestones, payment terms and documentation."},
    {id:"grove",name:"The Grove Plot",type:"land",area:"Mainland",locale:"Ikorodu",price:42000000,description:"A sample land listing. In a real enquiry, check the survey, title and permitted use before committing."}
  ];
  const home = (id) => homes.find((entry) => entry.id === id);
  const key = "mirvai-courtyard-ecosystem-review-1";
  const emptyState = {saved:[],requests:[],drafts:[]};
  let state = {...emptyState};
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "{}");
    for (const prop of Object.keys(emptyState)) if (Array.isArray(parsed[prop])) state[prop] = parsed[prop];
  } catch { /* The demo still works in memory. */ }
  let view = "website", appScreen = "home", formContext, portrait = "";
  let filters = {web:"all",app:"all",webArea:"all",appArea:"all"};
  const drawer = $("menu-panel"), modal = $("modal"), modalBody = $("modal-body"), deviceScreen = $("app-screen");
  let timer;
  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* In-memory fallback. */ }
  }
  function toast(message) {
    clearTimeout(timer);
    $("toast").textContent = message;
    $("toast").hidden = false;
    timer = setTimeout(() => { $("toast").hidden = true; }, 3200);
  }
  function openModal(title, content) {
    if (drawer.open) drawer.close();
    modalBody.innerHTML = '<h2 id="modal-title">' + esc(title) + '</h2>' + content;
    modal.scrollTop = 0;
    if (!modal.open) modal.showModal();
  }
  function setView(next, scroll = true) {
    view = next;
    all("[data-surface]").forEach((surface) => { surface.hidden = surface.id !== next; });
    all("[data-view]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === next)));
    if (next === "app") renderApp();
    if (next === "team") renderTeam();
    if (scroll) window.scrollTo({top:0,behavior:"instant"});
  }
  function jump(id) {
    if (drawer.open) drawer.close();
    if (modal.open) modal.close();
    setView("website", false);
    $(id)?.scrollIntoView();
  }
  function badges(branch) {
    return '<span class="badge' + (branch.id === "realty" ? " active" : "") + '">' + branch.label + '</span>';
  }
  $("division-list").innerHTML = branches.map((branch, index) =>
    '<button class="division' + (index ? "" : " active") + '" data-division="' + branch.id + '"><span class="division-top"><span>0' + (index + 1) + ' / ' + icon("arrow") + '</span>' + badges(branch) + '</span><h3>MIRVAI ' + branch.name + '</h3><p>' + branch.summary + '</p></button>'
  ).join("");
  $("menu-divisions").innerHTML = branches.map((branch) =>
    '<button class="menu-link" data-division="' + branch.id + '"><span>MIRVAI ' + branch.name + '</span>' + badges(branch) + '</button>'
  ).join("");
  $("menu-types").innerHTML = categories.map(([id, label]) =>
    '<button class="menu-link" data-menu-filter="' + id + '">' + label + icon("arrow") + '</button>'
  ).join("");
  function showBranch(id) {
    if (id === "realty") {
      if (view === "app") {
        drawer.close();
        setApp("home");
      } else {
        jump("properties");
      }
      return;
    }
    const branch = branches.find((item) => item.id === id);
    if (branch) openModal("MIRVAI " + branch.name, '<p class="eyebrow">Incoming / Future division</p><p>' + branch.detail + '</p><button class="button outline" data-action="go-ecosystem">View all six divisions ' + icon("arrow") + '</button>');
  }
  function filterButtons(surface) {
    return [["all","All properties"],...categories].map(([id,label]) =>
      '<button data-filter="' + id + '" data-filter-surface="' + surface + '" aria-pressed="' + (filters[surface] === id) + '">' + label + '</button>'
    ).join("");
  }
  function visible(surface) {
    return homes.filter((item) => !state.drafts.includes(item.id)
      && (filters[surface] === "all" || item.type === filters[surface])
      && (filters[surface + "Area"] === "all" || item.area === filters[surface + "Area"]));
  }
  function cardImage(item, showTag = true) {
    const art = images[item.photo];
    return '<button class="property-image" data-property="' + item.id + '" aria-label="View ' + item.name + '">' +
      (art ? '<img loading="lazy" src="' + art.src + '" alt="' + art.alt + '" width="1050" height="700">' : '<span class="image-placeholder">' + icon("home") + ' Concept listing</span>') +
      (showTag ? '<span class="sample-tag">Sample</span>' : "") + '</button>';
  }
  function cardInfo(item) {
    return '<p class="mini-meta">' + item.locale + ' · Lagos ' + item.area + ' · ' + category(item.type) + '</p><h3><button data-property="' + item.id + '">' + item.name + '</button></h3><span class="price">' + ngn(item.price) + ' <span class="mini-meta">· sample price</span></span>';
  }
  function propertyCards(list, app = false) {
    if (!list.length) return '<p class="empty">No sample properties match this selection. Try another category or area.</p>';
    return list.map((item) => app
      ? '<article class="app-card">' + cardImage(item, false) + '<div>' + cardInfo(item) + '</div></article>'
      : '<article class="property-card">' + cardImage(item) + cardInfo(item) + '</article>'
    ).join("");
  }
  function renderWebsite() {
    $("web-filters").innerHTML = filterButtons("web");
    $("web-list").innerHTML = propertyCards(visible("web"));
  }
  function setApp(screen) {
    appScreen = screen;
    renderApp();
    deviceScreen.scrollTop = 0;
  }
  function renderApp() {
    all(".dock [data-app]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.app === appScreen)));
    if (appScreen === "home") {
      deviceScreen.innerHTML = '<div class="device-banner"><p class="eyebrow">Lagos Island &amp; Mainland</p><h2>Explore homes.</h2><p>See what fits your next chapter.</p></div><img class="device-cover" src="assets/courtyard.webp" alt="' + images.courtyard.alt + '"><div class="screen-inner"><div class="filters" aria-label="App property categories">' + filterButtons("app") + '</div><div class="app-cards">' + propertyCards(visible("app"), true) + '</div><p class="fineprint">Sample properties and prices.</p></div>';
      return;
    }
    if (appScreen === "saved") {
      const saved = state.saved.map(home).filter((item) => item && !state.drafts.includes(item.id));
      deviceScreen.innerHTML = '<div class="screen-inner"><p class="eyebrow">YOUR SHORTLIST</p><h2>Saved homes.</h2><div class="app-cards">' + (saved.length ? propertyCards(saved, true) : '<p class="empty">No saved homes yet. Open a sample listing and save it to your shortlist.</p>') + '</div></div>';
      return;
    }
    if (appScreen === "enquiries") {
      deviceScreen.innerHTML = '<div class="screen-inner"><p class="eyebrow">YOUR ACTIVITY</p><h2>Enquiries.</h2><p class="inline-note">This is a local demo. Website messaging is incoming; no one receives these requests.</p>' + (state.requests.length ? state.requests.map(requestRow).join("") : '<p class="empty">No requests yet. Try a sample viewing or enquiry.</p>') + '<div class="actions"><button class="button dark" data-action="enquire">Try a general enquiry</button></div></div>';
      return;
    }
    deviceScreen.innerHTML = '<div class="screen-inner"><p class="eyebrow">YOUR DASHBOARD</p><h2>Client profile.</h2>' + (portrait ? '<img class="avatar" src="' + esc(portrait) + '" alt="Your local profile photo preview">' : '<div class="avatar" aria-label="Demo avatar">M</div>') + '<p>Demo buyer</p><p class="inline-note">Choose a profile photo to preview it here. The image is not uploaded or kept after this page closes.</p><label class="form-field">Profile photo <input id="portrait" type="file" accept="image/jpeg,image/png,image/webp,image/avif"></label>' + (portrait ? '<button class="text-button" data-action="clear-portrait">Remove photo</button>' : "") + '<p class="inline-note">Live accounts, messages and payments are not connected.</p></div>';
  }
  function requestRow(request, team = false) {
    if (!request || typeof request !== "object") return "";
    const status = request.reviewed ? "Reviewed in demo" : "New · demo only";
    return '<div class="item-row"><div><strong>' + esc(request.kind) + ' · ' + esc(request.title) + '</strong><span>' + esc(request.summary) + '</span><span>' + status + '</span></div>' +
      (team && !request.reviewed ? '<button class="button outline" data-review="' + esc(request.id) + '">Mark reviewed</button>' : "") + '</div>';
  }
  function renderTeam() {
    const reviewed = state.requests.filter((request) => request?.reviewed).length;
    $("team-metrics").innerHTML = [[homes.length - state.drafts.length,"Visible sample listings"],[state.requests.length - reviewed,"New sample requests"],[reviewed,"Reviewed requests"]]
      .map(([n,caption]) => '<div><b>' + n + '</b><span>' + caption + '</span></div>').join("");
    $("team-enquiries").innerHTML = state.requests.length
      ? state.requests.map((request) => requestRow(request, true)).join("")
      : '<p class="empty">Nothing to review yet. Submit a sample viewing from Website or App to see it here.</p>';
    $("team-inventory").innerHTML = homes.map((item) => {
      const draft = state.drafts.includes(item.id);
      return '<div class="item-row"><div><strong>' + item.name + '</strong><span>' + category(item.type) + ' · ' + (draft ? "Draft" : "Visible in preview") + '</span></div><button class="button outline" data-inventory="' + item.id + '">' + (draft ? "Show listing" : "Move to draft") + '</button></div>';
    }).join("");
  }
  function propertyDetail(id) {
    const item = home(id);
    if (!item) return;
    const saved = state.saved.includes(id), art = images[item.photo];
    openModal(item.name, '<p class="eyebrow">' + category(item.type) + ' / ' + item.locale + '</p>' +
      (art ? '<img class="property-photo" src="' + art.src + '" alt="' + art.alt + '" width="1050" height="700">' : "") +
      '<p><strong>' + ngn(item.price) + '</strong> · sample asking price' + (item.beds ? ' · ' + item.beds + ' bedrooms' : '') + '</p><p>' + item.description + '</p><p class="fineprint">Example for this design review, not a verified or available listing.</p><div class="actions">' +
      '<button class="button primary" data-action="viewing" data-id="' + id + '">Request a viewing</button><button class="button outline" data-action="enquire" data-id="' + id + '">Enquire</button><button class="button outline" data-save="' + id + '" aria-pressed="' + saved + '">' + icon("saved") + (saved ? "Saved · remove" : "Save home") + '</button></div>');
  }
  const control = (label, name, choices) => '<label>' + label + '<select name="' + name + '">' + choices.map((choice) => '<option>' + esc(choice) + '</option>').join("") + '</select></label>';
  function openForm(kind, id) {
    const item = home(id);
    const heading = {viewing:"Request a viewing",brief:"Share a property brief",partner:"List a property",enquire:"Make an enquiry"}[kind];
    formContext = {kind,id};
    const intro = item ? '<p>' + item.name + ' · ' + item.locale + '</p>' : "";
    let fields;
    if (kind === "viewing") {
      fields = control("Viewing type","channel",["Video walkthrough","In-person viewing"]) + control("Preferred time","when",["Weekday morning","Weekday afternoon","Saturday morning"]);
    } else if (kind === "partner") {
      fields = control("I’m a…","partner",["Developer","Property owner"]) + control("Property area","area",["Lagos Mainland","Lagos Island"]);
    } else {
      fields = control("Preferred area","area",["Either Lagos Island or Mainland","Lagos Island","Lagos Mainland"]) + control("Property type","type",["Not sure yet",...categories.map(([,label]) => label)]);
      if (kind === "brief") fields += control("Budget","budget",["Below ₦100m","₦100m–₦250m","₦250m–₦500m","Above ₦500m"]) + control("Purpose","purpose",["Own home","Investment","Still exploring"]);
    }
    openModal(heading, intro + '<p>Try the flow as Demo Buyer. No personal details are needed and nothing is sent to MIRVAI.</p><form id="request-form"><div class="form-grid">' +
      fields + '</div><div class="form-actions"><button class="button primary">Add sample request ' + icon("arrow") + '</button></div></form>');
  }
  function calculator() {
    openModal("Investment calculator", '<p>Try a rough annual rental yield in naira. These figures are illustrative, not a forecast or investment advice.</p><form id="calculator-form"><div class="form-grid">' +
      '<label>Purchase price (₦)<input name="price" type="number" min="1" step="any" required value="200000000"></label>' +
      '<label>Annual rent (₦)<input name="rent" type="number" min="0" step="any" required value="14000000"></label>' +
      '<label>Annual expenses (₦)<input name="expenses" type="number" min="0" step="any" required value="2000000"></label>' +
      '</div><div class="form-actions"><button class="button primary">Calculate yield</button></div><p id="yield-result" class="result" aria-live="polite" hidden></p></form>');
  }
  function changeFilter(surface, value, refocus = false) {
    filters[surface] = value;
    if (surface === "app") renderApp();
    else renderWebsite();
    if (refocus) document.querySelector('[data-filter-surface="' + surface + '"][data-filter="' + value + '"]')?.focus({preventScroll:true});
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const d = button.dataset;
    if (d.view) { setView(d.view); return; }
    if (d.app) { setApp(d.app); return; }
    if (d.jump) { jump(d.jump); return; }
    if (d.division) { showBranch(d.division); return; }
    if (d.filter) { changeFilter(d.filterSurface,d.filter,true); return; }
    if (d.menuFilter) {
      drawer.close();
      if (view === "app") { appScreen = "home"; changeFilter("app",d.menuFilter,true); deviceScreen.scrollTop = 0; }
      else { changeFilter("web",d.menuFilter); jump("properties"); }
      return;
    }
    if (d.property) { propertyDetail(d.property); return; }
    if (d.save) {
      const saved = state.saved.includes(d.save);
      state.saved = saved ? state.saved.filter((id) => id !== d.save) : [...state.saved,d.save];
      save();
      button.setAttribute("aria-pressed",String(!saved));
      button.innerHTML = icon("saved") + (saved ? "Save home" : "Saved · remove");
      if (view === "app" && appScreen === "saved") renderApp();
      return;
    }
    if (d.review) {
      const request = state.requests.find((item) => item?.id === d.review);
      if (request) { request.reviewed = true; save(); renderTeam(); toast("Sample request marked as reviewed."); }
      return;
    }
    if (d.inventory) {
      state.drafts = state.drafts.includes(d.inventory) ? state.drafts.filter((id) => id !== d.inventory) : [...state.drafts,d.inventory];
      save(); renderTeam(); renderWebsite(); toast("Sample inventory updated.");
      return;
    }
    switch (d.action) {
      case "menu": drawer.showModal(); break;
      case "close-menu": drawer.close(); break;
      case "close-modal": modal.close(); break;
      case "go-ecosystem": case "app-ecosystem": jump("ecosystem"); break;
      case "go-enquiries": modal.close(); setView("app"); setApp("enquiries"); break;
      case "viewing": case "brief": case "partner": case "enquire": openForm(d.action,d.id); break;
      case "calculator": calculator(); break;
      case "contact": openModal("Talk to MIRVAI",'<p>In the live experience, choose WhatsApp or a website enquiry. In-app messaging is a future feature. This preview won’t open WhatsApp or send anything.</p><button class="button primary" data-action="enquire">Try a website enquiry ' + icon("arrow") + '</button>'); break;
      case "clear-portrait": if (portrait) URL.revokeObjectURL(portrait); portrait = ""; renderApp(); break;
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.id === "web-area") {
      filters.webArea = event.target.value;
      renderWebsite();
    } else if (event.target.id === "portrait") {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!["image/jpeg","image/png","image/webp","image/avif"].includes(file.type) || file.size > 8 * 1024 * 1024) {
        toast("Choose a JPG, PNG, WebP or AVIF image up to 8 MB.");
        event.target.value = "";
        return;
      }
      if (portrait) URL.revokeObjectURL(portrait);
      portrait = URL.createObjectURL(file);
      renderApp();
    }
  });
  document.addEventListener("submit", (event) => {
    if (event.target.id === "request-form" && formContext) {
      event.preventDefault();
      const {kind,id} = formContext;
      const data = new FormData(event.target);
      const summary = Array.from(data.values()).join(" · ");
      state.requests = [{
        id: globalThis.crypto?.randomUUID?.() || Date.now().toString(36),
        kind: {viewing:"Viewing",brief:"Property brief",partner:"Listing enquiry",enquire:"Enquiry"}[kind],
        title: home(id)?.name || "MIRVAI Realty",
        summary,
        reviewed:false
      }, ...state.requests].slice(0,40);
      save();
      if (view === "app") renderApp();
      openModal("Sample request added.", '<p>You can see the request in App Enquiries and Team view. No viewing was booked and no message was sent.</p><button class="button primary" data-action="go-enquiries">Open App Enquiries ' + icon("arrow") + '</button>');
    } else if (event.target.id === "calculator-form") {
      event.preventDefault();
      const data = new FormData(event.target);
      const price = Number(data.get("price")), rent = Number(data.get("rent")), expenses = Number(data.get("expenses"));
      if (![price,rent,expenses].every(Number.isFinite) || price <= 0) return;
      const result = $("yield-result");
      result.textContent = 'Gross yield: ' + (rent / price * 100).toFixed(1) + '% · Estimated net yield: ' + ((rent - expenses) / price * 100).toFixed(1) + '%';
      result.hidden = false;
    }
  });
  renderWebsite();
})();
