import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Instagram, Phone, Mail, ArrowUpRight } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center pt-24 pb-24 px-6 md:px-12 max-w-screen-md mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full text-center"
        >
          <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-8">Get in Touch</h1>
          
          <p className="text-muted-foreground font-light text-xl mb-16 max-w-lg mx-auto leading-relaxed">
            Available for portrait sessions, events, and editorial commissions. I look forward to hearing your story.
          </p>

          <div className="flex flex-col gap-8 max-w-sm mx-auto items-center">
            
            <a 
              href="https://wa.me/917977206423" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-between w-full p-6 bg-secondary/50 hover:bg-secondary rounded-lg border border-transparent hover:border-border transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-background rounded-full text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm tracking-widest uppercase text-muted-foreground mb-1">WhatsApp / Phone</p>
                  <p className="text-lg font-medium">+91 79772 06423</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            <a 
              href="https://www.instagram.com/frames_by_hari_/" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-between w-full p-6 bg-secondary/50 hover:bg-secondary rounded-lg border border-transparent hover:border-border transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-background rounded-full text-primary">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm tracking-widest uppercase text-muted-foreground mb-1">Instagram</p>
                  <p className="text-lg font-medium">@frames_by_hari_</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
