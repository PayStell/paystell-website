import { MdMenu, MdClose } from "react-icons/md";
import { navStyles } from "./styles";

interface MobileTriggerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MobileTrigger({ open, setOpen }: MobileTriggerProps) {
  return (
<button
      type="button"
      className={navStyles.trigger}
      onClick={() => setOpen(!open)}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      {open ? (
        <MdClose className="h-6 w-6" />
      ) : (
        <MdMenu className="h-6 w-6" />
      )}
    </button>
  );
}
