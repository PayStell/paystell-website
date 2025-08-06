import { MdMenu, MdClose } from "react-icons/md";
import { navStyles } from "./styles";

interface MobileTriggerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MobileTrigger({ open, setOpen }: MobileTriggerProps) {
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <button
      type="button"
      className={`${navStyles.trigger} min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation active:scale-95 transition-transform duration-150`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={open}
      aria-controls="main-navigation"
    >
      {open ? (
        <MdClose className="h-6 w-6" aria-hidden="true" />
      ) : (
        <MdMenu className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}
