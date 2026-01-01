import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Lock, Archive, FileText, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Faqs = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      icon: <HelpCircle className="w-6 h-6" />,
      question: "What is Racksmart?",
      answer:
        "Racksmart is a unified stock control system that helps monitor inventory in real-time with analytics. It allows organizations to track, manage, and organize their stock levels efficiently.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      question: "I can’t log in to my account.",
      answer: (
        <>
          Please double-check your email and password. If you're still having trouble, click{" "}
          <strong>“Forgot Password”</strong> on the login page or email{" "}
          <a href="mailto:support@racksmart.ph" className="text-orange-600 font-bold">
            support@racksmart.ph
          </a>{" "}
          with subject: <strong>RACKSMART - ACCOUNT ACCESS</strong>.
        </>
      ),
    },
    {
      icon: <Lock className="w-6 h-6" />,
      question: "My account is locked after too many failed attempts.",
      answer: (
        <>
          For security, your account is temporarily locked after several failed logins. Please wait{" "}
          <strong>10 minutes</strong> before trying again, or email{" "}
          <a href="mailto:support@racksmart.ph" className="text-orange-600 font-bold">
            support@racksmart.ph
          </a>{" "}
          with subject: <strong>RACKSMART - ACCOUNT LOCKED</strong>.
        </>
      ),
    },
    {
      icon: <Archive className="w-6 h-6" />,
      question: "How do I update or delete an inventory item?",
      answer:
        "For data integrity, items cannot be permanently deleted. Use the Archive feature to hide them from active view. Only Administrators can edit or archive items. Inventory personnel must request changes via admin.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      question: "How can I generate reports?",
      answer:
        "Go to the Reports tab in your dashboard. You can generate daily, weekly, monthly, or custom date range reports. All reports can be exported as PDF with one click.",
    },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex items-center justify-center p-6 relative"
        style={{
          backgroundImage: "url('/final background (1).png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-[#fa6709] to-orange-600 text-white py-8 px-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Racksmart FAQs</h1>
            <p className="text-center mt-3 text-white/90">
              Frequently Asked Questions & Support Guide
            </p>
          </div>

          {/* FAQ List */}
          <div className="p-8 md:p-12 space-y-6 md:space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-5 bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all"
              >
                <div className="text-orange-600 mt-1 shrink-0">{faq.icon}</div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">{faq.question}</h2>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Support */}
          <div className="bg-gray-50 px-10 py-8 text-center border-t border-gray-200">
            <p className="text-gray-600 mb-3">Still need help?</p>
            <a
              href="mailto:support@racksmart.ph"
              className="inline-flex items-center gap-2 bg-[#fa6709] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Mail className="w-5 h-5" /> Email Support Team
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Faqs;
