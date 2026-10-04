import type { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";

type Props = {
  title: string;
  badge?: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (e: { preventDefault(): void }) => void;
  onDelete?: () => void;
  children: ReactNode;
};

const ModalComponent = ({
  title,
  badge,
  submitLabel,
  onClose,
  onSubmit,
  onDelete,
  children,
}: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[2px]">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onSubmit={onSubmit}
        className="max-h-full w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white shadow-[0_24px_60px_rgba(20,20,22,0.25)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 pt-6 pb-5">
          <div className="flex flex-col items-start gap-1.5">
            {badge && (
              <span className="rounded-md bg-ink px-2 py-0.5 font-mono text-[11px] font-medium text-accent">
                {badge}
              </span>
            )}
            <h2 id="modal-title" className="font-display text-[30px] leading-tight tracking-tight">
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-paper"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">{children}</div>

        <footer className="flex items-center gap-2.5 border-t border-line bg-sheet px-6 py-4">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] px-3 text-sm font-medium text-neg transition-colors hover:bg-neg-bg"
            >
              <DeleteOutline sx={{ fontSize: 16 }} />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto h-10 cursor-pointer rounded-[10px] border border-line bg-white px-4 text-sm font-medium transition-colors hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-ink px-4.5 text-sm font-medium text-white transition-colors hover:bg-ink-2"
          >
            <CheckIcon sx={{ fontSize: 16 }} className="text-accent" />
            {submitLabel}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default ModalComponent;
