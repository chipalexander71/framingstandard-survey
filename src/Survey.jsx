import { useState, useRef, useEffect } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY, CONTACT_EMAIL, SITE_NAME } from './config.js';

const SECTIONS = [
  {
    id: "shop_info",
    title: "About Your Shop",
    icon: "🏪",
    intro: "Let's start with the basics about your business.",
    questions: [
      { id: "shop_name", type: "text", label: "Shop name", placeholder: "e.g., Creative Framing Studio" },
      { id: "contact_name", type: "text", label: "Your name", placeholder: "First and last name" },
      { id: "contact_email", type: "text", label: "Email address (optional — only if you'd like us to follow up)", placeholder: "you@example.com" },
      { id: "location", type: "text", label: "City & State", placeholder: "e.g., San Antonio, TX" },
      { id: "years_in_business", type: "select", label: "How long have you been in business?",
        options: ["Less than 2 years", "2–5 years", "5–10 years", "10–20 years", "20+ years"] },
      { id: "employees", type: "select", label: "How many people work in your shop (including you)?",
        options: ["Just me", "2–3", "4–6", "7–10", "More than 10"] },
      { id: "revenue_range", type: "select", label: "Approximate annual revenue range (optional — helps us understand scale)",
        options: ["Prefer not to say", "Under $100K", "$100K–$250K", "$250K–$500K", "$500K–$1M", "Over $1M"] },
    ]
  },
  {
    id: "services",
    title: "What You Do",
    icon: "🖼️",
    intro: "Tell us about the services your shop offers.",
    questions: [
      { id: "services_offered", type: "multi", label: "Which services does your shop offer? (select all that apply)",
        options: ["Custom picture framing", "Pre-made/ready-made frames", "Canvas stretching", "Shadow boxes & display cases",
          "Conservation/archival framing", "Corporate/commercial framing", "Needlework framing", "Jersey/sports memorabilia framing",
          "Mirror framing", "Art sales (prints, originals)", "Art restoration", "Printing/giclée services",
          "Framing classes/workshops", "Online sales"] },
      { id: "specialty", type: "textarea", label: "Do you have a specialty or niche? Tell us about it.",
        placeholder: "e.g., We specialize in museum-quality conservation framing for watercolors and works on paper..." },
      { id: "pct_custom", type: "select", label: "What percentage of your revenue comes from custom framing?",
        options: ["Under 25%", "25–50%", "50–75%", "Over 75%", "Nearly 100%"] },
    ]
  },
  {
    id: "current_tech",
    title: "Current Technology",
    icon: "💻",
    intro: "What tools and software are you using today?",
    questions: [
      { id: "current_pos", type: "select", label: "What POS / shop management software do you currently use?",
        options: ["LifeSaver", "FrameReady", "SpecialtySoft", "Artteck", "shopVOX", "iFramer", "Generic POS (Square, Clover, etc.)", "Spreadsheets / paper", "Other"] },
      { id: "current_pos_other", type: "text", label: "If 'Other', what do you use?", placeholder: "Software name", conditional: { field: "current_pos", value: "Other" } },
      { id: "pos_satisfaction", type: "rating", label: "How satisfied are you with your current system?", scale: 5,
        labels: ["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"] },
      { id: "pos_likes", type: "textarea", label: "What do you LIKE about your current system?",
        placeholder: "What works well? What would you miss if you switched?" },
      { id: "pos_dislikes", type: "textarea", label: "What FRUSTRATES you about your current system?",
        placeholder: "What doesn't work? What's missing? Where do you work around it?" },
      { id: "viz_tool", type: "yesno", label: "Do you use a visualization/design tool to show customers mockups?" },
      { id: "viz_tool_name", type: "text", label: "Which visualization tool?", placeholder: "e.g., FrameVue, Simulart...", conditional: { field: "viz_tool", value: "yes" } },
      { id: "mat_cutter_computerized", type: "yesno", label: "Do you have a computerized mat cutter?" },
      { id: "online_presence", type: "multi", label: "Where do you have an online presence?",
        options: ["Website", "Facebook", "Instagram", "Google Business Profile", "Etsy", "Shopify/e-commerce store", "None", "Other"] },
      { id: "online_presence_other", type: "text",
        label: "You selected 'Other' — where else do you have an online presence?",
        placeholder: "e.g., TikTok, Pinterest, Nextdoor, custom app...",
        conditional: { field: "online_presence", includes: "Other" } },
    ]
  },
  {
    id: "suppliers",
    title: "Suppliers & Purchasing",
    icon: "📦",
    intro: "This section is really important to us — we want to understand how you actually buy materials.",
    questions: [
      { id: "primary_moulding", type: "multi", label: "Which moulding suppliers do you use? (select all)",
        options: ["Larson-Juhl", "Roma Moulding", "Nielsen Bainbridge", "Bella Moulding", "CMI (Columbia)", "Don Mar", "Fotiou", "Omega Moulding", "Other/Local"] },
      { id: "primary_moulding_other", type: "text",
        label: "You selected 'Other/Local' — which other moulding suppliers do you use?",
        placeholder: "e.g., local lumber yard, regional distributor name...",
        conditional: { field: "primary_moulding", includes: "Other/Local" } },
      { id: "primary_matboard", type: "multi", label: "Which matboard suppliers do you use?",
        options: ["Crescent (part of Larson-Juhl)", "Bainbridge/Artcare", "Tru Vue (glazing + mat)", "Rising Museum Board", "Other/Local"] },
      { id: "primary_matboard_other", type: "text",
        label: "You selected 'Other/Local' — which other matboard suppliers do you use?",
        placeholder: "e.g., local art supply store, regional distributor...",
        conditional: { field: "primary_matboard", includes: "Other/Local" } },
      { id: "primary_glazing", type: "multi", label: "Which glazing suppliers do you use?",
        options: ["Tru Vue", "Larson-Juhl", "CMI", "Local plastics supplier", "Other"] },
      { id: "primary_glazing_other", type: "text",
        label: "You selected 'Other' — which other glazing suppliers do you use?",
        placeholder: "e.g., TAP Plastics, local glass shop...",
        conditional: { field: "primary_glazing", includes: "Other" } },
      { id: "non_industry_purchases", type: "yesno", label: "Do you regularly buy supplies from NON-framing-industry vendors (hardware stores, plastics suppliers, paint stores, etc.)?" },
      { id: "non_industry_details", type: "textarea",
        label: "Tell us about your non-industry purchasing. What do you buy and where?",
        placeholder: "e.g., I buy plexiglass from a local plastics company because it's cheaper than CMI. I get spray adhesive and sandpaper from Home Depot. I buy unfinished wood moulding from a local lumber yard for custom staining...",
        conditional: { field: "non_industry_purchases", value: "yes" } },
      { id: "supplier_ordering", type: "multi", label: "How do you typically place orders with your primary suppliers? (select all that apply)",
        options: ["Phone/fax", "Supplier's website/portal", "Through POS software", "Sales rep visit"] },
      { id: "supplier_ordering_detail", type: "textarea",
        label: "You use more than one method — tell us how your ordering process works across these channels.",
        placeholder: "e.g., I order moulding through Larson-Juhl's website but call my local matboard supplier because they don't have an online portal...",
        conditional: { field: "supplier_ordering", minLength: 2 } },
      { id: "supplier_pain", type: "textarea", label: "What's your biggest frustration with ordering supplies?",
        placeholder: "e.g., Pricing is never up to date, I can't tell what's in stock, delivery times are unpredictable..." },
      { id: "price_comparison", type: "yesno", label: "Do you actively compare prices between suppliers for the same or equivalent materials?" },
      { id: "price_comparison_how", type: "textarea", label: "How do you compare prices currently?",
        placeholder: "e.g., I keep a spreadsheet, I just remember, I call around...",
        conditional: { field: "price_comparison", value: "yes" } },
    ]
  },
  {
    id: "workflow",
    title: "Your Daily Workflow",
    icon: "⚙️",
    intro: "Walk us through how work flows through your shop. As much or as little detail as you want — it all helps.",
    questions: [
      { id: "intake_process", type: "textarea", label: "How does a typical custom framing job start? (customer walks in, what happens?)",
        placeholder: "Describe your intake process — consultation, measurements, design decisions..." },
      { id: "pricing_method", type: "multi", label: "How do you calculate pricing for a custom job? (select all that apply)",
        options: ["POS software calculates it", "I use a formula/spreadsheet", "United Inch method", "I price by feel/experience"] },
      { id: "pricing_method_detail", type: "textarea",
        label: "You use more than one pricing method — tell us how you combine them and why.",
        placeholder: "e.g., I use United Inch for moulding but price matboard and glazing from a spreadsheet because my POS doesn't handle those markups correctly...",
        conditional: { field: "pricing_method", minLength: 2 } },
      { id: "pricing_detail", type: "textarea", label: "Any details about how you handle pricing? Markup rules, discounts, etc.?",
        placeholder: "e.g., We use 3x markup on moulding, 4x on matboard, flat rate for fitting..." },
      { id: "work_order_method", type: "multi", label: "How do you track work orders / jobs in progress? (select all that apply)",
        options: ["POS software", "Paper tickets/tags", "Whiteboard", "Spreadsheet", "Sticky notes / memory", "Other"] },
      { id: "work_order_method_other", type: "textarea",
        label: "You selected 'Other' — tell us how you track work orders.",
        placeholder: "e.g., I use a custom Access database, a shared Google Doc, a Trello board...",
        conditional: { field: "work_order_method", includes: "Other" } },
      { id: "production_steps", type: "textarea", label: "What are the steps to build a typical framed piece in your shop?",
        placeholder: "Walk us through it: pulling materials, cutting, joining, matting, mounting, glazing, fitting, finishing..." },
      { id: "customer_notification", type: "multi", label: "How do you notify customers when their order is ready? (select all that apply)",
        options: ["Phone call", "Text message", "Email", "Automated from POS", "They just check back"] },
      { id: "customer_notification_detail", type: "textarea",
        label: "You use more than one notification method — tell us how you decide which to use.",
        placeholder: "e.g., I text regulars but call older customers who don't text. POS sends an auto-email but I follow up by phone if they don't pick up within a week...",
        conditional: { field: "customer_notification", minLength: 2 } },
      { id: "workarounds", type: "textarea", label: "Where do you use sticky notes, notebooks, or memory to track things your software can't handle?",
        placeholder: "This is gold for us — every workaround reveals something the software should do but doesn't." },
    ]
  },
  {
    id: "pain_points",
    title: "Challenges & Wish List",
    icon: "✨",
    intro: "Last section — what would make your life easier?",
    questions: [
      { id: "top_challenges", type: "multi", label: "What are your biggest operational challenges? (pick your top 3–5)",
        options: ["Pricing accuracy", "Inventory tracking", "Supplier ordering/communication", "Finding/comparing local suppliers",
          "Work order management", "Customer communication", "Online sales integration", "Visualizing designs for customers",
          "Employee training on software", "Reporting and business insights", "Cost of current software",
          "Keeping up with technology", "Competition from online framers"] },
      { id: "must_have", type: "textarea", label: "If you could wave a magic wand and have ONE feature in your shop software, what would it be?",
        placeholder: "Dream big — what would change your daily life?" },
      { id: "would_switch", type: "yesno", label: "Would you consider switching to a free, open-source POS if it met your needs?" },
      { id: "switch_concerns", type: "textarea", label: "What concerns would you have about switching systems?",
        placeholder: "e.g., Data migration, learning curve, reliability, support..." },
      { id: "customization_interest", type: "select", label: "How interested are you in being able to customize your shop software?",
        options: ["Not at all — just make it work", "Somewhat — I'd tweak settings", "Very — I'd want to configure workflows", "I'd love to modify the code itself"] },
      { id: "beta_interest", type: "yesno", label: "Would you be interested in being an early tester of a new framing shop system?" },
      { id: "anything_else", type: "textarea", label: "Anything else you want us to know about running your shop?",
        placeholder: "Open floor — vent, dream, suggest, whatever's on your mind." },
    ]
  }
];

// ---- Reusable Components ----

function RatingStars({ value, onChange, labels }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)} type="button"
            style={{
              width: 44, height: 44, borderRadius: 8,
              border: value === n ? "2px solid #2d5a27" : "1.5px solid #c8c4bc",
              background: value === n ? "#2d5a27" : "#faf9f6",
              color: value === n ? "#fff" : "#5c5649",
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s ease"
            }}>{n}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8a8479",
        fontFamily: "'DM Sans', sans-serif", maxWidth: 228 }}>
        <span>{labels[0]}</span><span>{labels[4]}</span>
      </div>
    </div>
  );
}

function YesNo({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {["yes", "no"].map(v => (
        <button key={v} onClick={() => onChange(v)} type="button"
          style={{
            padding: "8px 28px", borderRadius: 8,
            border: value === v ? "2px solid #2d5a27" : "1.5px solid #c8c4bc",
            background: value === v ? "#2d5a27" : "#faf9f6",
            color: value === v ? "#fff" : "#5c5649",
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
            cursor: "pointer", transition: "all 0.15s ease", textTransform: "capitalize"
          }}>{v}</button>
      ))}
    </div>
  );
}

function MultiSelect({ options, value = [], onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(opt => {
        const selected = value.includes(opt);
        return (
          <button key={opt} onClick={() => onChange(selected ? value.filter(v => v !== opt) : [...value, opt])} type="button"
            style={{
              padding: "7px 16px", borderRadius: 20,
              border: selected ? "2px solid #2d5a27" : "1.5px solid #c8c4bc",
              background: selected ? "#e8f0e6" : "#faf9f6",
              color: selected ? "#2d5a27" : "#5c5649",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: selected ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s ease"
            }}>{opt}</button>
        );
      })}
    </div>
  );
}

// ---- Main Survey ----

export default function Survey() {
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const topRef = useRef(null);

  const set = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  const shouldShow = (q) => {
    if (!q.conditional) return true;
    if (q.conditional.minLength) {
      const val = answers[q.conditional.field];
      return Array.isArray(val) && val.length >= q.conditional.minLength;
    }
    if (q.conditional.includes) {
      const val = answers[q.conditional.field];
      return Array.isArray(val) && val.includes(q.conditional.includes);
    }
    return answers[q.conditional.field] === q.conditional.value;
  };

  const section = SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  const goTo = (idx) => {
    setCurrentSection(idx);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const row = {
      submitted_at: new Date().toISOString(),
      survey_version: "1.0",
      shop_name: answers.shop_name || null,
      contact_name: answers.contact_name || null,
      contact_email: answers.contact_email || null,
      raw_json: answers,
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/survey_responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(row),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Submission failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(err.message || 'Submission failed. You can download your responses below.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadJSON = () => {
    const ts = new Date().toISOString();
    const output = { submitted_at: ts, version: "1.0", responses: answers };
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `framing-survey-${(answers.shop_name || "response").replace(/\s+/g, "-").toLowerCase()}-${ts.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- Global Styles ----
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: linear-gradient(170deg, #f5f3ee 0%, #e8e4db 100%); min-height: 100vh; -webkit-font-smoothing: antialiased; }
      ::selection { background: #2d5a27; color: #fff; }
      input:focus, textarea:focus { border-color: #2d5a27 !important; outline: none; box-shadow: 0 0 0 3px rgba(45,90,39,0.1); }
      @media (max-width: 640px) {
        .survey-header h1 { font-size: 24px !important; }
        .survey-card { padding: 24px 18px !important; }
        .nav-pills { gap: 4px !important; }
        .nav-pill { font-size: 11px !important; padding: 5px 10px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ---- Thank You Screen ----
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", maxWidth: 540,
          width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#2d2a24", margin: "0 0 12px" }}>
            Thank you!
          </h2>
          <p style={{ color: "#6b6560", fontSize: 16, lineHeight: 1.6, margin: "0 0 12px" }}>
            Your input is incredibly valuable. We're building something that works for real shops like yours.
          </p>
          <p style={{ color: "#8a8479", fontSize: 14, lineHeight: 1.5, margin: "0 0 32px" }}>
            Want to stay in the loop? Follow the project at <a href="https://framingstandard.org" style={{ color: "#2d5a27" }}>{SITE_NAME}</a>
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={downloadJSON}
              style={{ padding: "12px 24px", borderRadius: 10, border: "1.5px solid #2d5a27",
                background: "#fff", color: "#2d5a27", fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Download My Responses
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Main Survey Screen ----
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div ref={topRef} className="survey-header" style={{ background: "#2d2a24", padding: "32px 24px 28px", color: "#fff" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
            color: "#a8c49a", marginBottom: 8 }}>{SITE_NAME}</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700,
            margin: "0 0 8px", lineHeight: 1.2 }}>Help Us Build Something Better</h1>
          <p style={{ color: "#b0aca5", fontSize: 15, margin: 0, lineHeight: 1.5, maxWidth: 560 }}>
            We're designing an open platform and free tools for picture framing shops.
            Your real-world experience shapes what we build. Answer as much or as little as you like — every bit helps.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#e0ddd6", height: 4 }}>
        <div style={{ height: 4, background: "#2d5a27", width: `${progress}%`, transition: "width 0.4s ease", borderRadius: "0 2px 2px 0" }} />
      </div>

      {/* Section nav pills */}
      <div className="nav-pills" style={{ maxWidth: 680, margin: "0 auto", padding: "16px 24px 0", display: "flex",
        gap: 6, flexWrap: "wrap" }}>
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => goTo(i)} type="button" className="nav-pill"
            style={{
              padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 13, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s ease",
              background: i === currentSection ? "#2d5a27" : "#e8e4db",
              color: i === currentSection ? "#fff" : "#6b6560"
            }}>
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* Current section */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 24px 120px" }}>
        <div className="survey-card" style={{ background: "#fff", borderRadius: 16, padding: "36px 32px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{section.icon}</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#2d2a24", margin: 0 }}>
              {section.title}
            </h2>
          </div>
          <p style={{ color: "#8a8479", fontSize: 15, marginTop: 4, marginBottom: 28, lineHeight: 1.5 }}>
            {section.intro}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {section.questions.filter(shouldShow).map(q => (
              <div key={q.id}>
                <label style={{ display: "block", fontWeight: 500, fontSize: 15, color: "#3a3733",
                  marginBottom: 10, lineHeight: 1.4 }}>{q.label}</label>

                {q.type === "text" && (
                  <input type="text" value={answers[q.id] || ""} onChange={e => set(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: "1.5px solid #d4d0c8", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                      background: "#faf9f6", color: "#2d2a24", outline: "none",
                      transition: "border-color 0.15s ease" }} />
                )}

                {q.type === "textarea" && (
                  <textarea value={answers[q.id] || ""} onChange={e => set(q.id, e.target.value)}
                    placeholder={q.placeholder} rows={4}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: "1.5px solid #d4d0c8", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                      background: "#faf9f6", color: "#2d2a24", outline: "none", resize: "vertical",
                      lineHeight: 1.5, transition: "border-color 0.15s ease" }} />
                )}

                {q.type === "select" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {q.options.map(opt => (
                      <button key={opt} onClick={() => set(q.id, opt)} type="button"
                        style={{
                          padding: "9px 16px", borderRadius: 8, textAlign: "left",
                          border: answers[q.id] === opt ? "2px solid #2d5a27" : "1.5px solid #d4d0c8",
                          background: answers[q.id] === opt ? "#e8f0e6" : "#faf9f6",
                          color: answers[q.id] === opt ? "#2d5a27" : "#5c5649",
                          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                          fontWeight: answers[q.id] === opt ? 600 : 400,
                          cursor: "pointer", transition: "all 0.15s ease"
                        }}>{opt}</button>
                    ))}
                  </div>
                )}

                {q.type === "multi" && (
                  <MultiSelect options={q.options} value={answers[q.id] || []}
                    onChange={val => set(q.id, val)} />
                )}

                {q.type === "yesno" && (
                  <YesNo value={answers[q.id]} onChange={val => set(q.id, val)} />
                )}

                {q.type === "rating" && (
                  <RatingStars value={answers[q.id]} onChange={val => set(q.id, val)} labels={q.labels} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit error */}
        {submitError && (
          <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "#fef2f2",
            border: "1px solid #fca5a5", color: "#991b1b", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
            {submitError}
            <button onClick={downloadJSON} type="button"
              style={{ display: "block", marginTop: 8, background: "none", border: "none",
                color: "#991b1b", textDecoration: "underline", cursor: "pointer", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif" }}>
              Download your responses as a backup
            </button>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
          <button onClick={() => goTo(currentSection - 1)} type="button"
            disabled={currentSection === 0}
            style={{
              padding: "12px 28px", borderRadius: 10, border: "1.5px solid #c8c4bc",
              background: "#fff", color: currentSection === 0 ? "#c8c4bc" : "#5c5649",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
              cursor: currentSection === 0 ? "default" : "pointer"
            }}>← Back</button>

          {currentSection < SECTIONS.length - 1 ? (
            <button onClick={() => goTo(currentSection + 1)} type="button"
              style={{
                padding: "12px 28px", borderRadius: 10, border: "none",
                background: "#2d5a27", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
                cursor: "pointer"
              }}>Next →</button>
          ) : (
            <button onClick={handleSubmit} type="button" disabled={submitting}
              style={{
                padding: "12px 32px", borderRadius: 10, border: "none",
                background: submitting ? "#6b8f66" : "#2d5a27", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
                cursor: submitting ? "wait" : "pointer", transition: "background 0.15s ease"
              }}>{submitting ? "Submitting..." : "Submit Survey ✓"}</button>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: "center", color: "#a09b94", fontSize: 13,
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
          <p>This survey is part of the <strong style={{ color: "#6b6560" }}>{SITE_NAME}</strong> initiative — an open platform for the picture framing industry.</p>
          <p style={{ marginTop: 4 }}>Questions? Reach us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#2d5a27" }}>{CONTACT_EMAIL}</a></p>
        </div>
      </div>
    </div>
  );
}
