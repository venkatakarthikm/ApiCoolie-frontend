/**
 * Global custom toast notification system.
 * Appends premium micro-animated top-middle notifications directly to the document body.
 */
export function showToast(message, type = 'success') {
  // Create or retrieve container
  let container = document.getElementById('api-coolie-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'api-coolie-toast-container';
    container.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  
  // Custom colors and border highlights based on status type
  const typeClasses = {
    success: 'bg-emerald-600 border-emerald-500 text-white shadow-2xl shadow-emerald-500/20',
    error: 'bg-rose-600 border-rose-500 text-white shadow-2xl shadow-rose-500/20',
    info: 'bg-primary border-primary text-white shadow-2xl shadow-primary/20'
  };

  const icons = {
    success: '<span style="color:#ffffff;font-weight:900;font-size:16px;">✓</span>',
    error: '<span style="color:#ffffff;font-weight:900;font-size:16px;">✕</span>',
    info: '<span style="color:#ffffff;font-weight:900;font-size:16px;">ℹ</span>'
  };

  toast.className = `flex items-center gap-3.5 px-6 py-4 border rounded-2xl text-sm font-extrabold select-none pointer-events-auto transition-all duration-300 transform translate-y-[-10px] opacity-0 ${typeClasses[type] || typeClasses.info}`;
  toast.innerHTML = `
    <div style="flex-shrink:0; display:flex; align-items:center; justify-content:center; width:22px; height:22px; background:rgba(255,255,255,0.2); rounded:50%; border-radius:9999px;">${icons[type] || icons.info}</div>
    <div style="flex-grow:1; line-height: 1.4; letter-spacing: 0.01em;">${message}</div>
  `;

  // Append to overlay
  container.appendChild(toast);

  // Trigger entering animation on next tick
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  // Setup removing timeout
  setTimeout(() => {
    toast.style.transform = 'translateY(-15px)';
    toast.style.opacity = '0';
    
    // Cleanup from DOM
    toast.addEventListener('transitionend', () => {
      toast.remove();
      // Remove container too if empty
      if (container.childNodes.length === 0) {
        container.remove();
      }
    });
  }, 3500);
}
