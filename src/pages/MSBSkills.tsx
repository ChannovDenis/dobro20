import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Skill {
  id: string;
  icon: string;
  name: string;
  desc: string;
  examples: string[];
  color: string;
  prompt: string;
}

const SKILLS: Skill[] = [
  {
    id: "ai-lawyer",
    icon: "\uD83D\uDCCB",
    name: "AI-\u042E\u0440\u0438\u0441\u0442",
    desc: "\u0414\u043E\u0433\u043E\u0432\u043E\u0440\u044B, \u043F\u0440\u0435\u0442\u0435\u043D\u0437\u0438\u0438, \u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0438\u0438",
    examples: ["\u041F\u0440\u043E\u0432\u0435\u0440\u044C \u0434\u043E\u0433\u043E\u0432\u043E\u0440 \u0430\u0440\u0435\u043D\u0434\u044B", "\u0421\u043E\u0441\u0442\u0430\u0432\u044C \u043F\u0440\u0435\u0442\u0435\u043D\u0437\u0438\u044E"],
    color: "142 76% 36%",
    prompt: "\u041F\u043E\u043C\u043E\u0433\u0438 \u043C\u043D\u0435 \u0441 \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0432\u043E\u043F\u0440\u043E\u0441\u043E\u043C \u0434\u043B\u044F \u0431\u0438\u0437\u043D\u0435\u0441\u0430",
  },
  {
    id: "ai-accountant",
    icon: "\uD83D\uDCCA",
    name: "AI-\u0411\u0443\u0445\u0433\u0430\u043B\u0442\u0435\u0440",
    desc: "\u041D\u0430\u043B\u043E\u0433\u0438, \u043E\u0442\u0447\u0451\u0442\u043D\u043E\u0441\u0442\u044C, \u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u044F",
    examples: ["\u041A\u0430\u043A\u043E\u0439 \u043D\u0430\u043B\u043E\u0433\u043E\u0432\u044B\u0439 \u0440\u0435\u0436\u0438\u043C \u0432\u044B\u0431\u0440\u0430\u0442\u044C?", "\u041F\u043E\u043C\u043E\u0433\u0438 \u0441 \u043E\u0442\u0447\u0451\u0442\u043D\u043E\u0441\u0442\u044C\u044E"],
    color: "210 80% 45%",
    prompt: "\u041F\u043E\u043C\u043E\u0433\u0438 \u043C\u043D\u0435 \u0441 \u0431\u0443\u0445\u0433\u0430\u043B\u0442\u0435\u0440\u0441\u043A\u0438\u043C \u0432\u043E\u043F\u0440\u043E\u0441\u043E\u043C",
  },
  {
    id: "ai-hr",
    icon: "\uD83D\uDC65",
    name: "AI-HR",
    desc: "\u0412\u0430\u043A\u0430\u043D\u0441\u0438\u0438, \u043E\u043D\u0431\u043E\u0440\u0434\u0438\u043D\u0433, KPI",
    examples: ["\u0421\u043E\u0441\u0442\u0430\u0432\u044C \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u044E", "\u041F\u043B\u0430\u043D \u043E\u043D\u0431\u043E\u0440\u0434\u0438\u043D\u0433\u0430"],
    color: "280 60% 50%",
    prompt: "\u041F\u043E\u043C\u043E\u0433\u0438 \u043C\u043D\u0435 \u0441 HR-\u0437\u0430\u0434\u0430\u0447\u0435\u0439",
  },
  {
    id: "ai-marketer",
    icon: "\uD83D\uDCE3",
    name: "AI-\u041C\u0430\u0440\u043A\u0435\u0442\u043E\u043B\u043E\u0433",
    desc: "\u041A\u043E\u043D\u0442\u0435\u043D\u0442-\u043F\u043B\u0430\u043D, SMM, \u0432\u043E\u0440\u043E\u043D\u043A\u0438",
    examples: ["\u041A\u043E\u043D\u0442\u0435\u043D\u0442-\u043F\u043B\u0430\u043D \u043D\u0430 \u043C\u0435\u0441\u044F\u0446", "\u0422\u0435\u043A\u0441\u0442 \u0434\u043B\u044F \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0438"],
    color: "340 70% 50%",
    prompt: "\u041F\u043E\u043C\u043E\u0433\u0438 \u043C\u043D\u0435 \u0441 \u043C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433\u043E\u0432\u043E\u0439 \u0437\u0430\u0434\u0430\u0447\u0435\u0439",
  },
  {
    id: "ai-sales",
    icon: "\uD83D\uDCBC",
    name: "AI-\u041F\u0440\u043E\u0434\u0430\u0436\u043D\u0438\u043A",
    desc: "\u0421\u043A\u0440\u0438\u043F\u0442\u044B, \u041A\u041F, \u043F\u0435\u0440\u0435\u0433\u043E\u0432\u043E\u0440\u044B",
    examples: ["\u041D\u0430\u043F\u0438\u0448\u0438 \u0441\u043A\u0440\u0438\u043F\u0442 \u0437\u0432\u043E\u043D\u043A\u0430", "\u0421\u043E\u0441\u0442\u0430\u0432\u044C \u043A\u043E\u043C\u043C\u0435\u0440\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435"],
    color: "25 80% 50%",
    prompt: "\u041F\u043E\u043C\u043E\u0433\u0438 \u043C\u043D\u0435 \u0441 \u043F\u0440\u043E\u0434\u0430\u0436\u0430\u043C\u0438",
  },
  {
    id: "ai-analyst",
    icon: "\uD83D\uDCC8",
    name: "AI-\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A",
    desc: "\u0414\u0430\u043D\u043D\u044B\u0435, \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u044B, \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u044B",
    examples: ["\u041F\u0440\u043E\u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0439 \u043F\u0440\u043E\u0434\u0430\u0436\u0438", "\u0421\u0434\u0435\u043B\u0430\u0439 \u043F\u0440\u043E\u0433\u043D\u043E\u0437"],
    color: "200 70% 45%",
    prompt: "\u041F\u043E\u043C\u043E\u0433\u0438 \u043C\u043D\u0435 \u0441 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u043E\u0439",
  },
];

export default function MSBSkills() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 safe-top border-b border-border sticky top-0 bg-background/80 backdrop-blur-lg z-50"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full glass"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">AI-\u043D\u0430\u0432\u044B\u043A\u0438 \u0434\u043B\u044F \u0431\u0438\u0437\u043D\u0435\u0441\u0430</h1>
          <p className="text-xs text-muted-foreground">15+ AI-\u0441\u043A\u0438\u043B\u043B\u043E\u0432 \u0434\u043B\u044F \u041C\u0421\u0411</p>
        </div>
        <Badge variant="secondary" className="text-xs gap-1">
          <Sparkles className="w-3 h-3" /> AI
        </Badge>
      </motion.header>

      {/* Description */}
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 AI-\u043D\u0430\u0432\u044B\u043A \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u044D\u043A\u0441\u043F\u0435\u0440\u0442\u043D\u0443\u044E \u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0438\u044E \u0437\u0430 \u0441\u0435\u043A\u0443\u043D\u0434\u044B.
          \u041A\u0430\u0436\u0434\u044B\u0439 \u0441\u043A\u0438\u043B\u043B \u043E\u0431\u0443\u0447\u0435\u043D \u043D\u0430 \u043B\u0443\u0447\u0448\u0438\u0445 \u043F\u0440\u0430\u043A\u0442\u0438\u043A\u0430\u0445 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u043C\u0430\u043B\u043E\u0433\u043E \u0438 \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0431\u0438\u0437\u043D\u0435\u0441\u0430.
        </p>
      </div>

      {/* Skills grid */}
      <div className="px-4 pb-8 grid grid-cols-2 gap-3">
        {SKILLS.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              navigate(`/chat?service=${skill.id}&prompt=${encodeURIComponent(skill.prompt)}`)
            }
            className="glass-card p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="text-3xl block mb-2">{skill.icon}</span>
            <h3 className="text-sm font-bold mb-1">{skill.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{skill.desc}</p>
            <div className="space-y-1">
              {skill.examples.map((ex) => (
                <div
                  key={ex}
                  className="text-[10px] text-muted-foreground bg-muted/50 rounded px-2 py-1"
                >
                  \u00AB{ex}\u00BB
                </div>
              ))}
            </div>
            <div
              className="mt-3 h-0.5 rounded-full opacity-60"
              style={{ backgroundColor: `hsl(${skill.color})` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
