import { motion } from 'framer-motion';
import { Zap, Shield, RefreshCcw } from 'lucide-react';

export const ValueProps = () => {
  const props = [
    { icon: Zap, title: 'Instant Processing', desc: 'Your orders are processed and shipped within minutes of placement.' },
    { icon: Shield, title: 'Secure Ecosystem', desc: 'Multi-layered encryption ensures your data and transactions are impenetrable.' },
    { icon: RefreshCcw, title: 'Infinite Returns', desc: 'Not satisfied? Return any product within 30 days with a zero-questions policy.' }
  ];

  return (
    <section className="bg-muted/30 py-24 border-y border-border/50">
      <div className="section grid grid-cols-1 md:grid-cols-3 gap-16">
        {props.map((prop, i) => (
          <motion.div 
            key={i}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="flex gap-6 items-start"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-slate-200/50 flex items-center justify-center text-black shrink-0">
              <prop.icon className="w-6 h-6" />
            </div>
            <div className="space-y-2">
               <h3 className="font-black uppercase tracking-tight text-sm">{prop.title}</h3>
               <p className="text-xs text-muted-foreground font-medium leading-relaxed">{prop.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
