import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import NewLinkForm from "./page";

interface NewLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewLinkModal({ isOpen, onClose }: NewLinkModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Payment Link</DialogTitle>
        </DialogHeader>
        {/* Here component of newlink */}
        <NewLinkForm />
      </DialogContent>
    </Dialog>
  )
}