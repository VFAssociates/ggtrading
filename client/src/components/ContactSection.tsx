/* GG Trading Contact Section
   Simple form: name, email (filled in for signed-in members, still editable), message.
   Sends to the "contact" edge function, which saves it and emails both sides. */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { callFunction } from "@/lib/supabase";
import Turnstile, { TURNSTILE_SITE_KEY } from "@/components/Turnstile";
import { Mail } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

export default function ContactSection() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // hidden from people; bots fill it in
  const [sending, setSending] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);

  useEffect(() => {
    if (!emailTouched && user?.email) setEmail(user.email);
    const fullName = user?.user_metadata?.full_name as string | undefined;
    if (fullName) setName((current) => current || fullName);
  }, [user, emailTouched]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (TURNSTILE_SITE_KEY && !captchaToken) return toast.error("Please wait for the spam check to finish.");
    setSending(true);
    try {
      await callFunction("contact", { name, email, message, website, captchaToken });
      toast.success("Message sent! We'll get back to you by email.");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send your message. Please try again.");
    } finally {
      setSending(false);
      // Each token works once.
      setCaptchaReset((n) => n + 1);
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.48_0.26_292)/40%] to-transparent" />
      <div className="container relative z-10">
        <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-mono tracking-widest uppercase text-[oklch(0.62_0.22_292)] mb-3 block">Contact</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Get in <span className="gradient-text-violet-blue">Touch</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed">Questions about membership or the community? Send us a message.</p>
        </div>

        <form onSubmit={submit} className="gg-panel max-w-xl mx-auto p-5 sm:p-8 rounded-xl flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" autoComplete="name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmailTouched(true);
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea id="contact-message" required maxLength={5000} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Turnstile onToken={setCaptchaToken} resetKey={captchaReset} />
          <Button type="submit" disabled={sending} className="bg-[oklch(0.48_0.26_292)] hover:bg-[oklch(0.55_0.26_292)] text-white font-semibold gap-2">
            <Mail size={16} /> {sending ? "Sending..." : "Send message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
