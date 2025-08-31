'use client';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  onConfirm, 
  onCancel 
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--background)] bg-opacity-85 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] sketch-border soft-shadow p-6 sm:p-8 max-w-sm w-full">
        <h3 className="text-xl font-zen font-light text-[var(--foreground)] mb-4 sm:mb-6 tracking-wide">
          Delete Poop Log?
        </h3>
        <p className="text-lighter mb-6 sm:mb-8 text-sm sm:text-base font-noto font-light leading-relaxed">
          Are you sure you want to delete this poop log? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-lighter hover:text-[var(--foreground)] font-light transition-all duration-300 ease-out border-[1.5px] border-[var(--border-soft)] rounded-sketch order-2 sm:order-1 bg-[var(--background)] hover:bg-[var(--accent-lighter)] relative hover:transform hover:translate-y-[-0.5px] hover:shadow-[0_2px_4px_var(--shadow-soft)]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-noto font-light rounded-lg transition-all duration-300 ease-out order-1 sm:order-2 border-0 relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
