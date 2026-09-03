import Swal from 'sweetalert2';

/**
 * TraceFlow RMG Enterprise Alert & Toastr Service (Powered by SweetAlert2)
 * Standardized notifications adhering to flat solid enterprise styling.
 */

// Top-Right Toastr Mixin
const ToastMixin = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: '#ffffff',
  color: '#0f172a',
  customClass: {
    popup: 'rounded-md shadow-lg border border-slate-200 text-sm font-sans !p-3.5',
    timerProgressBar: 'bg-blue-600',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const alertService = {
  // 1. Toastr Success (Auto-dismiss floating top-right)
  success(title: string, message?: string) {
    return ToastMixin.fire({
      icon: 'success',
      title,
      text: message,
      customClass: {
        popup: 'rounded-md shadow-lg border border-emerald-300 text-sm font-sans !p-3.5',
        timerProgressBar: 'bg-emerald-600',
      },
    });
  },

  // 2. Toastr Error (Auto-dismiss floating top-right)
  error(title: string, message?: string) {
    return ToastMixin.fire({
      icon: 'error',
      title,
      text: message,
      timer: 4500,
      customClass: {
        popup: 'rounded-md shadow-lg border border-rose-300 text-sm font-sans !p-3.5',
        timerProgressBar: 'bg-rose-600',
      },
    });
  },

  // 3. Toastr Warning
  warning(title: string, message?: string) {
    return ToastMixin.fire({
      icon: 'warning',
      title,
      text: message,
      customClass: {
        popup: 'rounded-md shadow-lg border border-amber-300 text-sm font-sans !p-3.5',
        timerProgressBar: 'bg-amber-500',
      },
    });
  },

  // 4. Toastr Info
  info(title: string, message?: string) {
    return ToastMixin.fire({
      icon: 'info',
      title,
      text: message,
      customClass: {
        popup: 'rounded-md shadow-lg border border-blue-300 text-sm font-sans !p-3.5',
        timerProgressBar: 'bg-blue-600',
      },
    });
  },

  // 5. SweetAlert Action Confirmation (Returns Promise<boolean>)
  async confirm(options: {
    title: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDanger?: boolean;
  }): Promise<boolean> {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.isDanger ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Confirm',
      cancelButtonText: options.cancelButtonText || 'Cancel',
      confirmButtonColor: options.isDanger ? '#e11d48' : '#2563eb',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
      focusCancel: true,
      background: '#ffffff',
      color: '#0f172a',
      customClass: {
        popup: 'rounded-md border border-slate-200 font-sans shadow-xl !p-6',
        confirmButton: 'rounded-md font-semibold text-sm px-4 py-2 !shadow-none',
        cancelButton: 'rounded-md font-semibold text-sm px-4 py-2 !shadow-none',
      },
    });

    return result.isConfirmed;
  },
};
