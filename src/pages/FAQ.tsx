import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is SISF 2026?",
    answer: "The Startup & Innovation Spring Festival (SISF) 2026 is Asia's premier startup event, bringing together entrepreneurs, investors, and industry leaders for three days of learning, networking, and deal-making.",
  },
  {
    question: "When and where is the event?",
    answer: "SISF 2026 will take place from April 15-17, 2026 at Innovation Hub, Singapore. The venue is easily accessible by public transportation and offers ample parking.",
  },
  {
    question: "How can I register for the event?",
    answer: "You can register for SISF 2026 by clicking the 'Register Now' button on our website. Early bird pricing is available until February 28, 2026.",
  },
  {
    question: "What types of tickets are available?",
    answer: "We offer several ticket types: General Admission for access to all public sessions, VIP for priority seating and exclusive networking events, and Startup passes for pitch competition participants.",
  },
  {
    question: "How can my startup participate in the pitch competition?",
    answer: "Startups can apply through our 'Apply as Startup' page. Applications are reviewed by our selection committee, and selected startups will be notified within 4 weeks of application.",
  },
  {
    question: "Are there sponsorship opportunities?",
    answer: "Yes! We offer various sponsorship tiers with different benefits. Visit our 'Become a Sponsor' page or contact our partnerships team at sponsors@sisf.com.",
  },
  {
    question: "What is the refund policy?",
    answer: "Full refunds are available up to 30 days before the event. 50% refunds are available up to 14 days before the event. No refunds are available within 14 days of the event.",
  },
  {
    question: "Will sessions be recorded?",
    answer: "Yes, main stage sessions will be recorded and made available to registered attendees after the event. Some workshops may not be recorded to maintain interactivity.",
  },
];

export default function FAQ() {
  return (
    <Layout>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about SISF 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 data-[state=open]:shadow-glow transition-shadow"
                >
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact our support team →
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
