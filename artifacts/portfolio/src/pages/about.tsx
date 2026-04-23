import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import hariPhoto from "@assets/IMG-20260423-WA0005_1776950452874.jpg";

export default function About() {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-screen-xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2"
        >
          <div className="aspect-[3/4] bg-muted relative overflow-hidden">
            <img 
              src={hariPhoto}
              alt="Hariharakrishnan Sriram"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full md:w-1/2 flex flex-col justify-center"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-12">About Me</h1>
          
          <div className="space-y-6 text-muted-foreground font-light text-lg leading-relaxed">
            <p>
              I am a photographer specializing in portraits and street photography, capturing both people and everyday life in their most authentic form. My work spans a wide range of styles—from raw, candid street moments to thoughtfully composed portraits—allowing each story to unfold in its own unique way.
            </p>
            <p>
              I'm drawn to genuine emotion, natural light, and the unpredictability of real-life scenes. Whether photographing strangers in motion or individuals in quiet stillness, I aim to create images that feel honest, expressive, and timeless. For me, photography is about observation and connection—finding meaning in fleeting moments and transforming them into lasting visual stories.
            </p>
            <p>
              Alongside photography, I am a trained tabla player, having completed four formal examinations, and I also work as a percussionist. My connection to rhythm and sound deeply influences my visual storytelling, shaping how I perceive timing, movement, and emotion.
            </p>
            <p>
              I have also completed a one-year foundation in a Bachelor of Design, which has expanded my creative perspective and strengthened my interest in developing new designs. I enjoy exploring the intersection of visual art, music, and design, constantly seeking new ways to express ideas and tell stories.
            </p>
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}
