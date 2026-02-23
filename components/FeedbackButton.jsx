"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const LABELS = {
  ja: {
    btn: "ご意見・要望",
    title: "フィードバック",
    subtitle: "改善要望やバグ報告をお寄せください",
    cat: "カテゴリ",
    catBug: "バグ・不具合",
    catImprove: "改善要望",
    catOther: "その他",
    msg: "内容",
    msgPlaceholder: "具体的な内容を入力してください…",
    submit: "送信",
    sending: "送信中…",
    thanks: "フィードバックを送信しました。ありがとうございます！",
    error: "送信に失敗しました。もう一度お試しください。",
    close: "✕",
  },
  zh: {
    btn: "意见反馈",
    title: "反馈",
    subtitle: "请提交改进建议或错误报告",
    cat: "类别",
    catBug: "问题/故障",
    catImprove: "改进建议",
    catOther: "其他",
    msg: "内容",
    msgPlaceholder: "请输入具体内容…",
    submit: "提交",
    sending: "提交中…",
    thanks: "反馈已提交，谢谢！",
    error: "提交失败，请重试。",
    close: "✕",
  },
};

const CATEGORIES = [
  { value: "bug", labelKey: "catBug" },
  { value: "improvement", labelKey: "catImprove" },
  { value: "other", labelKey: "catOther" },
];

export default function FeedbackButton({ lang = "ja" }) {
  const t = LABELS[lang] || LABELS.ja;
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("improvement");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const reset = () => {
    setCategory("improvement");
    setMessage("");
    setStatus("idle");
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setStatus("sending");
    const { error } = await supabase.from("feedback").insert({
      category,
      message: message.trim(),
    });
    if (error) {
      setStatus("error");
    } else {
      setStatus("done");
      setTimeout(() => { setOpen(false); reset(); }, 2000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setOpen(true); reset(); }}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1000,
          background: "#3b82f6", color: "#fff", border: "none",
          borderRadius: 28, padding: "12px 20px",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
          display: "flex", alignItems: "center", gap: 6,
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(59,130,246,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.4)"; }}
      >
        💬 {t.btn}
      </button>

      {/* Modal Overlay */}
      {open && (
        <div
          onClick={() => { setOpen(false); reset(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 1001,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
        >
          {/* Modal */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 12, padding: 24,
              width: "100%", maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => { setOpen(false); reset(); }}
              style={{
                position: "absolute", top: 12, right: 12,
                background: "none", border: "none", fontSize: 18,
                color: "#94a3b8", cursor: "pointer", padding: 4,
              }}
            >{t.close}</button>

            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e293b" }}>
                💬 {t.title}
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
                {t.subtitle}
              </p>
            </div>

            {status === "done" ? (
              <div style={{
                background: "#f0fdf4", border: "1px solid #86efac",
                borderRadius: 8, padding: "16px 20px", textAlign: "center",
                fontSize: 14, color: "#16a34a", fontWeight: 600,
              }}>
                ✓ {t.thanks}
              </div>
            ) : (
              <>
                {/* Category */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                    {t.cat}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {CATEGORIES.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        style={{
                          flex: 1, padding: "8px 4px",
                          background: category === c.value ? "#3b82f6" : "#f1f5f9",
                          color: category === c.value ? "#fff" : "#64748b",
                          border: category === c.value ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                          borderRadius: 8, fontSize: 12, fontWeight: 600,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        {t[c.labelKey]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                    {t.msg}
                  </div>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={t.msgPlaceholder}
                    rows={4}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      border: "1px solid #d1d5db", borderRadius: 8,
                      padding: "10px 12px", fontSize: 14,
                      resize: "vertical", outline: "none",
                      fontFamily: "inherit",
                    }}
                    onFocus={e => e.target.style.borderColor = "#3b82f6"}
                    onBlur={e => e.target.style.borderColor = "#d1d5db"}
                  />
                </div>

                {/* Error message */}
                {status === "error" && (
                  <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 10 }}>
                    {t.error}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || status === "sending"}
                  style={{
                    width: "100%", padding: "12px 0",
                    background: !message.trim() ? "#94a3b8" : "#3b82f6",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontSize: 14, fontWeight: 700, cursor: !message.trim() ? "default" : "pointer",
                    opacity: status === "sending" ? 0.7 : 1,
                    transition: "background 0.15s",
                  }}
                >
                  {status === "sending" ? t.sending : t.submit}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
