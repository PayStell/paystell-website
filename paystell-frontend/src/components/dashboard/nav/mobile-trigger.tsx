import { Menu, X } from "lucide-react";
import { navStyles } from "./styles";

interface MobileTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileTrigger({ isOpen, onToggle }: MobileTriggerProps) {
  return (
    <button
      onClick={onToggle}
      className={navStyles.trigger}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
}
