"use client";

const LABELS = {
  ja: {
    btn: "ご意見・要望",
  },
  zh: {
    btn: "意见反馈",
  },
};

const MAIL_TO = "yukikimura@optec-exp.com";
const SUBJECT = { ja: "【車両積載判定ツール】フィードバック", zh: "【车辆装载判定工具】反馈" };
const BODY = { ja: "▼ 内容をご記入ください\n\n", zh: "▼ 请填写内容\n\n" };

export default function FeedbackButton({ lang = "ja" }) {
  const t = LABELS[lang] || LABELS.ja;
  const subject = encodeURIComponent((SUBJECT[lang] || SUBJECT.ja));
  const body = encodeURIComponent((BODY[lang] || BODY.ja));
  const href = `mailto:${MAIL_TO}?subject=${subject}&body=${body}`;

  return (
    <a
      href={href}
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 1000,
        background: "#3b82f6", color: "#fff", border: "none",
        borderRadius: 28, padding: "12px 20px",
        fontSize: 13, fontWeight: 700, cursor: "pointer",
        boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
        display: "flex", alignItems: "center", gap: 6,
        textDecoration: "none",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(59,130,246,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.4)"; }}
    >
      💬 {t.btn}
    </a>
  );
}
