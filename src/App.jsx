import { useState, useEffect, useRef } from "react";

const BOT_NAME = "Xtenda Finance";
const BOT_AVATAR = "XF";

const BRANCHES = [
  "Lusaka – Mambilima House", "Lusaka – Civic Centre", "Lusaka – Ben Bella",
  "Kitwe", "Ndola", "Kabwe", "Livingstone", "Chipata",
  "Solwezi", "Kasama", "Mansa", "Mongu", "Choma", "Other"
];

const EMPLOYERS = [
  "Civil Servants – GRZ, Zambia Army, ZAF, ZNS", "ZDA", "Lusaka Water",
  "NPA", "ZPPA", "NCC", "Medlink", "RSTA", "Ng'ombe Water", "Other (Specify)"
];

const PRODUCTS = [
  { label: "Loan Application", dept: "Sales" },
  { label: "Refinancing", dept: "Sales" },
  { label: "Loan Restructure", dept: "Credit" },
  { label: "Refunds", dept: "Credit" },
  { label: "Arrears", dept: "Credit" },
  { label: "Collections", dept: "Credit" },
  { label: "Make a Payment", dept: "Operations" },
  { label: "Loan Settlement", dept: "Sales" },
  { label: "Employment Opportunities", dept: "HR" },
  { label: "Customer Service", dept: "Customer Service" },
  { label: "Other Enquiries", dept: "General" },
];

const CONSULTANT = {
  name: "Collins Lumayi",
  title: "Senior Loan Consultant",
  phone: "0974002260",
};

const STEPS = {
  WELCOME: "WELCOME",
  EMPLOYER_SELECT: "EMPLOYER_SELECT",
  EMPLOYER_SPECIFY: "EMPLOYER_SPECIFY",
  NON_QUALIFIED: "NON_QUALIFIED",
  NON_QUAL_ACTION: "NON_QUAL_ACTION",
  BRANCH_SELECT: "BRANCH_SELECT",
  PRODUCT_MENU: "PRODUCT_MENU",
  HANDOVER: "HANDOVER",
  DONE: "DONE",
};

function getBotResponse(step, userInput, context) {
  switch (step) {
    case STEPS.WELCOME:
      return {
        text: `Welcome to Xtenda Finance 👋\nWe're here to assist you with fast, reliable financial solutions.\n\n_Our loan services are primarily available to Civil Servants and selected partner institutions._\n\nPlease select your employment category:`,
        options: ["Civil Servant", "Approved Private Institution", "Other"],
      };
    case STEPS.EMPLOYER_SELECT:
      if (userInput === "Other") {
        return {
          text: `Thank you for your interest.\nCurrently, Xtenda provides loans to Civil Servants and selected institutions only.\n\nHowever, you can still benefit:\n\n🤝 *Refer a friend or colleague who qualifies and earn K250*\n💼 *Become an Xtenda Agent and earn commissions*`,
          options: ["Refer a Client", "Become an Agent"],
        };
      }
      return { text: `Please select your employer:`, options: EMPLOYERS };
    case STEPS.EMPLOYER_SPECIFY:
      return { text: `Kindly type the name of your employer:`, options: null, freeText: true };
    case STEPS.NON_QUAL_ACTION:
      return {
        text: `Great! Your request has been noted. 📝\nA branch manager will be in touch shortly to assist you with the *${userInput}* process.\n\nThank you for choosing Xtenda Finance! 🙏`,
        options: ["🔄 Start Over"],
      };
    case STEPS.BRANCH_SELECT:
      return { text: `Please select your nearest Xtenda branch:`, options: BRANCHES };
    case STEPS.PRODUCT_MENU:
      return {
        text: `What would you like assistance with today?`,
        options: PRODUCTS.map((p) => `${p.label} (${p.dept})`),
      };
    case STEPS.HANDOVER:
      const product = PRODUCTS.find(p => userInput.startsWith(p.label));
      const dept = product?.dept || "our team";
      return {
        text: `Thank you! 🎉\nYou will now be assisted by:\n\n👤 *${CONSULTANT.name}*\n_${CONSULTANT.title}_\n📞 ${CONSULTANT.phone}\n\nDept routed: *${dept}*\n\nAlternatively, a team member will contact you shortly.`,
        options: ["✅ Got it – Thank you!", "🔄 Start Over"],
      };
    case STEPS.DONE:
      return {
        text: `Thank you! Your request has been received. ✅\nOur team will contact you shortly.\n\n_Xtenda Finance – Your Financial Partner_ 💚`,
        options: ["🔄 Start Over"],
      };
    default:
      return { text: "Let me get you started again.", options: null };
  }
}

function parseMarkdown(text) {
  const regex = /(\*[^*]+\*|_[^_]+_)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(<span key={lastIndex}>{text.slice(lastIndex, match.index)}</span>);
    const raw = match[0];
    if (raw.startsWith("*")) parts.push(<strong key={match.index}>{raw.slice(1, -1)}</strong>);
    else parts.push(<em key={match.index}>{raw.slice(1, -1)}</em>);
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) parts.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
  return parts;
}

function BotMessage({ text, time }) {
  const lines = text.split("\n");
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "flex-end" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#075E54", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, marginBottom: 2 }}>{BOT_AVATAR}</div>
      <div style={{ background: "#fff", borderRadius: "0 12px 12px 12px", padding: "8px 12px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)", fontSize: 13.5, color: "#111", lineHeight: 1.55 }}>
        {lines.map((line, i) => <div key={i}>{parseMarkdown(line)}</div>)}
        <div style={{ fontSize: 11, color: "#999", textAlign: "right", marginTop: 4 }}>{time}</div>
      </div>
    </div>
  );
}

function UserMessage({ text, time }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
      <div style={{ background: "#DCF8C6", borderRadius: "12px 0 12px 12px", padding: "8px 12px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.08)", fontSize: 13.5, color: "#111", lineHeight: 1.55 }}>
        {text}
        <div style={{ fontSize: 11, color: "#999", textAlign: "right", marginTop: 4 }}>
          {time} <span style={{ color: "#4FC3F7" }}>✓✓</span>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#075E54", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{BOT_AVATAR}</div>
      <div style={{ background: "#fff", borderRadius: "0 12px 12px 12px", padding: "10px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.13)", display: "flex", gap: 4, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#999", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

function QuickReplies({ options, onSelect, disabled }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 12px", background: "#f0f0f0", borderTop: "1px solid #ddd" }}>
      {options.map((opt, i) => (
        <button key={i} onClick={() => !disabled && onSelect(opt)} disabled={disabled}
          style={{ background: disabled ? "#ccc" : "#075E54", color: "#fff", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12.5, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
          onMouseEnter={e => { if (!disabled) e.target.style.background = "#128C7E"; }}
          onMouseLeave={e => { if (!disabled) e.target.style.background = "#075E54"; }}
        >
          {i + 1}. {opt}
        </button>
      ))}
    </div>
  );
}

export default function XtendaChatbot() {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(STEPS.WELCOME);
  const [context, setContext] = useState({});
  const [typing, setTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(null);
  const [freeTextMode, setFreeTextMode] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [disabled, setDisabled] = useState(false);
  const chatRef = useRef(null);
  const initialized = useRef(false);

  const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendBotMessage = (text, opts, delay = 900) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text, time: getTime() }]);
      setCurrentOptions(opts || null);
    }, delay);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const resp = getBotResponse(STEPS.WELCOME, null, {});
    sendBotMessage(resp.text, resp.options, 600);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typing]);

  const handleUserSelect = (option) => {
    if (disabled) return;
    const time = getTime();
    setMessages(prev => [...prev, { from: "user", text: option, time }]);
    setCurrentOptions(null);
    setDisabled(true);
    processUserInput(option);
    setTimeout(() => setDisabled(false), 1200);
  };

  const handleFreeTextSend = () => {
    if (!inputVal.trim()) return;
    const time = getTime();
    const text = inputVal.trim();
    setInputVal("");
    setMessages(prev => [...prev, { from: "user", text, time }]);
    setFreeTextMode(false);
    setDisabled(true);
    processUserInput(text);
    setTimeout(() => setDisabled(false), 1200);
  };

  const processUserInput = (input) => {
    let newContext = { ...context };

    if (input === "Start Over" || input === "🔄 Start Over") {
      setContext({});
      setStep(STEPS.WELCOME);
      const resp = getBotResponse(STEPS.WELCOME, null, {});
      sendBotMessage(resp.text, resp.options);
      return;
    }

    if (step === STEPS.WELCOME) {
      newContext.category = input;
      setContext(newContext);
      if (input === "Other") {
        setStep(STEPS.NON_QUAL_ACTION);
        const resp = getBotResponse(STEPS.EMPLOYER_SELECT, input, newContext);
        sendBotMessage(resp.text, resp.options);
      } else {
        setStep(STEPS.EMPLOYER_SELECT);
        const resp = getBotResponse(STEPS.EMPLOYER_SELECT, input, newContext);
        sendBotMessage(resp.text, resp.options);
      }
    } else if (step === STEPS.EMPLOYER_SELECT) {
      if (input === "Other (Specify)") {
        setFreeTextMode(true);
        setStep(STEPS.EMPLOYER_SPECIFY);
        sendBotMessage("Kindly type the name of your employer:", null);
      } else {
        newContext.employer = input;
        setContext(newContext);
        setStep(STEPS.BRANCH_SELECT);
        const resp = getBotResponse(STEPS.BRANCH_SELECT, input, newContext);
        sendBotMessage(resp.text, resp.options);
      }
    } else if (step === STEPS.EMPLOYER_SPECIFY) {
      newContext.employer = input;
      setContext(newContext);
      setStep(STEPS.BRANCH_SELECT);
      const resp = getBotResponse(STEPS.BRANCH_SELECT, input, newContext);
      sendBotMessage(resp.text, resp.options);
    } else if (step === STEPS.NON_QUAL_ACTION) {
      const resp = getBotResponse(STEPS.NON_QUAL_ACTION, input, newContext);
      setStep(STEPS.DONE);
      sendBotMessage(resp.text, resp.options);
    } else if (step === STEPS.BRANCH_SELECT) {
      newContext.branch = input;
      setContext(newContext);
      setStep(STEPS.PRODUCT_MENU);
      const resp = getBotResponse(STEPS.PRODUCT_MENU, input, newContext);
      sendBotMessage(resp.text, resp.options);
    } else if (step === STEPS.PRODUCT_MENU) {
      newContext.product = input;
      setContext(newContext);
      setStep(STEPS.HANDOVER);
      const resp = getBotResponse(STEPS.HANDOVER, input, newContext);
      sendBotMessage(resp.text, resp.options);
    } else if (step === STEPS.HANDOVER) {
      setStep(STEPS.DONE);
      const resp = getBotResponse(STEPS.DONE, input, newContext);
      sendBotMessage(resp.text, resp.options);
    } else if (step === STEPS.DONE) {
      setContext({});
      setStep(STEPS.WELCOME);
      const resp = getBotResponse(STEPS.WELCOME, null, {});
      sendBotMessage(resp.text, resp.options);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: 430, margin: "0 auto", fontFamily: "'Segoe UI', sans-serif", background: "#e5ddd5", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.2);border-radius:4px}
      `}</style>

      {/* Header */}
      <div style={{ background: "#075E54", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.25)", zIndex: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#128C7E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", border: "2px solid #25D366" }}>{BOT_AVATAR}</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{BOT_NAME}</div>
          <div style={{ color: "#B2DFDB", fontSize: 12 }}>{typing ? "typing..." : "Online"}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          <span style={{ color: "#fff", fontSize: 18 }}>📞</span>
          <span style={{ color: "#fff", fontSize: 18 }}>⋮</span>
        </div>
      </div>

      {/* Chat area */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "12px 12px 4px", backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b8a2' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ background: "rgba(0,0,0,0.15)", color: "#fff", borderRadius: 8, padding: "3px 10px", fontSize: 11.5, fontWeight: 500 }}>TODAY</span>
        </div>
        {messages.map((msg, i) =>
          msg.from === "bot"
            ? <BotMessage key={i} text={msg.text} time={msg.time} />
            : <UserMessage key={i} text={msg.text} time={msg.time} />
        )}
        {typing && <TypingIndicator />}
        <div style={{ height: 8 }} />
      </div>

      {/* Input area */}
      {freeTextMode ? (
        <div style={{ background: "#f0f0f0", padding: "8px 10px", display: "flex", gap: 8, alignItems: "center", borderTop: "1px solid #ddd" }}>
          <input autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleFreeTextSend()}
            placeholder="Type your employer name..."
            style={{ flex: 1, borderRadius: 24, border: "none", padding: "9px 14px", fontSize: 13.5, outline: "none", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          />
          <button onClick={handleFreeTextSend} style={{ width: 40, height: 40, borderRadius: "50%", background: "#075E54", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
        </div>
      ) : currentOptions ? (
        <QuickReplies options={currentOptions} onSelect={handleUserSelect} disabled={disabled || typing} />
      ) : (
        <div style={{ background: "#f0f0f0", padding: "10px 14px", textAlign: "center", borderTop: "1px solid #ddd", fontSize: 12, color: "#999" }}>
          Waiting for bot response...
        </div>
      )}
    </div>
  );
}
