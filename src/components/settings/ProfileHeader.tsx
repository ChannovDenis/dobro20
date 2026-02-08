import { motion } from "framer-motion";
import { Crown, Edit3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userProfile } from "@/data/mockData";

export function ProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center pt-8 pb-6 px-4"
    >
      {/* Avatar with glow */}
      <div className="relative mb-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          {/* Glow ring */}
          <div className="absolute -inset-2 rounded-full gradient-primary opacity-50 blur-lg animate-pulse" />
          
          <Avatar className="w-24 h-24 border-4 border-background relative z-10">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback className="text-2xl">{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Edit button */}
        <button className="absolute bottom-0 right-0 z-20 p-2 rounded-full gradient-primary border-2 border-background">
          <Edit3 className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold text-foreground mb-2"
      >
        {userProfile.name}
      </motion.h1>

      {/* Subscription badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full glass"
      >
        <Crown className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          {userProfile.subscription}
        </span>
        {userProfile.subscriptionActive && (
          <span className="text-xs text-primary">• Активна</span>
        )}
      </motion.div>
    </motion.div>
  );
}
