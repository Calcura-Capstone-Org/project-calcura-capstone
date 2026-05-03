import React, { useState, useEffect } from 'react';
import { Mail, ArrowUpRight, Plus, Minus } from "lucide-react";

interface FAQPageProps {
  onContactClick?: () => void;
}

const faqCategories = [
  { label: "All", id: "all" },
  { label: "General", id: "general" },
  { label: "Privacy", id: "privacy" },
  { label: "Features", id: "features" },
  { label: "Support", id: "support" },
];

const faqItems = [
  {
    category: "general",
    question: "What exactly is Calcura?",
    answer: "Calcura is a personal budgeting and financial planning platform designed to help users better understand their income, expenses, savings, and spending habits. It provides personalized budget recommendations, financial insights, and goal tracking tools to support healthier financial decisions",
  },
  {
    category: "general",
    question: "How does Calcura calculate my recommended budget?",
    answer: "Calcura analyzes the financial information you provide, including income, expenses, savings, debt, and spending categories. Based on budgeting principles and customizable financial goals, it generates recommended spending targets for each category.",
  },
  {
    category: "general",
    question: "What is the 'Net Balance' shown in my report?",
    answer: "Net Balance represents the amount remaining after subtracting your total expenses, savings, and other allocations from your income. A positive balance means you are staying within your budget, while a negative balance may indicate overspending.",
  },
  {
    category: "privacy",
    question: "Is my personal and financial data secure?",
    answer: "Yes. Calcura is designed with security and privacy in mind. User data is stored securely, and sensitive information is protected using modern security practices and encrypted connections whenever possible.",
  },
  {
    category: "privacy",
    question: "Does Calcura sync directly with my bank accounts?",
    answer: "Currently, Calcura does not directly connect to or sync with bank accounts. Users manually enter their financial information to maintain full control over their personal data and privacy.",
  },
  {
    category: "features",
    question: "Can I fully customize the budget templates?",
    answer: "Yes. Calcura allows users to customize budget templates based on their financial situation and lifestyle. You can adjust categories, spending targets, savings goals, and additional income sources.",
  },
  {
    category: "features",
    question: "How do the 'Financial Goals' work?",
    answer: "Financial Goals help users set targets such as saving money, reducing debt, or increasing investments. Calcura uses these goals to provide adjusted recommendations and track your overall financial progress.",
  },
  {
    category: "features",
    question: "What happens if my income fluctuates each month?",
    answer: "Calcura is designed to support variable income situations. You can update your income whenever it changes, and the recommended budget calculations will automatically adjust to reflect your current financial situation.",
  },
  {
    category: "support",
    question: "How quickly does your support team respond?",
    answer: "We aim to respond to most support requests within 24 to 48 hours. Response times may vary depending on request volume and complexity.",
  },
  {
    category: "support",
    question: "I have a suggestion for a new feature. How can I share it?",
    answer: "We welcome feedback and feature suggestions from users. You can submit ideas through the Feedback section of the platform or contact the support team directly.",
  },
];

export function FAQPage({ onContactClick }: FAQPageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenIndex(null);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f8f7f4" }}
    >
      <style>{`
        .faq-root {
          background: #f8f7f4;
          min-height: 100vh;
        }

        .tab-pill {
          display: inline-flex;
          align-items: center;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
          color: #6b6b6b;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .tab-pill:hover {
          color: #111;
          border-color: #d0cfc9;
        }

        .tab-pill.active {
          background: #111;
          color: #f8f7f4;
          border-color: #111;
        }

        .faq-row {
          border-top: 1px solid #e0ddd6;
          transition: background 0.15s ease;
        }

        .faq-row:last-child {
          border-bottom: 1px solid #e0ddd6;
        }

        .faq-question-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 24px 0;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 24px;
        }

        .faq-question-text {
          font-size: 16px;
          font-weight: 500;
          color: #111;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        .faq-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
          transition: all 0.2s ease;
        }

        .faq-row.open .faq-icon {
          background: #111;
          border-color: #111;
          color: #f8f7f4;
        }

        .faq-answer {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-answer.open {
          max-height: 400px;
        }

        .faq-answer-inner {
          padding-bottom: 28px;
          padding-right: 56px;
          font-size: 15px;
          color: #555;
          line-height: 1.7;
        }

        .contact-strip {
          border-top: 1px solid #e0ddd6;
          padding: 64px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #111;
          color: #f8f7f4;
          padding: 14px 24px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          transition: opacity 0.18s ease;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .contact-btn:hover {
          opacity: 0.8;
        }

        .fade-in {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div
        className={`faq-root fade-in ${mounted ? "visible" : ""}`}
        style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 32px" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#999",
              marginBottom: "16px",
              fontWeight: 500,
            }}
          >
            Support
          </p>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.08,
              color: "#111",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Frequently asked
            <br />
            <em className="text-gray-500 font-serif">questions</em>
          </h1>
        </div>

        {/* Category tabs */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "48px",
          }}
        >
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              className={`tab-pill ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        <div style={{ marginBottom: "0" }}>
          {filtered.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={`${activeCategory}-${idx}`}
                className={`faq-row ${isOpen ? "open" : ""}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-icon">
                    {isOpen ? <Minus size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
                  </span>
                </button>
                <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                  <div className="faq-answer-inner">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact strip */}
        <div className="contact-strip" style={{ marginTop: "64px" }}>
          <div>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "#111",
                margin: "0 0 6px",
                letterSpacing: "-0.02em",
              }}
            >
              Still have questions?
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#888",
                margin: 0,
                fontWeight: 400,
              }}
            >
              Our team is ready to help with anything.
            </p>
          </div>
          <button className="contact-btn" onClick={onContactClick}>
            <Mail size={15} strokeWidth={1.5} />
            Contact us
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}