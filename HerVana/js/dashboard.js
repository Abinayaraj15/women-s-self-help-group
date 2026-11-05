/**
 * HerVana - SHG Artisan Portal Interactive Script: dashboard.js
 * Handles sidebar toggling, live metric updates, SVG sales chart, and actions
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
  initDashboardChart();
  initOrderActions();
  initWithdrawalModal();
  initAddProductModal();
});

/* ==========================================================================
   1. Dashboard Mobile Sidebar Toggle
   ========================================================================== */
function initDashboardSidebar() {
  const toggleBtn = document.querySelector('.dash-sidebar-toggle-btn');
  const sidebar = document.querySelector('.dash-sidebar');

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
  });

  // Close sidebar on background click if mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 860 && 
        !sidebar.contains(e.target) && 
        !toggleBtn.contains(e.target) && 
        sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

/* ==========================================================================
   2. Interactive SVG Analytics Chart
   ========================================================================== */
function initDashboardChart() {
  const container = document.querySelector('.chart-container-visual');
  if (!container) return;

  const data = [
    { month: 'Jun', sales: 42000 },
    { month: 'Jul', sales: 68000 },
    { month: 'Aug', sales: 95000 },
    { month: 'Sep', sales: 124000 },
    { month: 'Oct', sales: 188000 },
    { month: 'Nov', sales: 246500 }
  ];

  const maxVal = 280000;
  const width = 640;
  const height = 220;
  const padBottom = 30;
  const padLeft = 45;
  const chartW = width - padLeft - 20;
  const chartH = height - padBottom - 20;

  // Render SVG chart
  let barsSvg = '';
  const barWidth = 36;
  const gap = chartW / data.length;

  data.forEach((d, i) => {
    const x = padLeft + i * gap + (gap - barWidth) / 2;
    const barH = (d.sales / maxVal) * chartH;
    const y = chartH - barH + 15;

    barsSvg += `
      <g class="chart-bar-group" data-month="${d.month}" data-val="₹${d.sales.toLocaleString('en-IN')}">
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="url(#barGradient)" opacity="0.9" style="transition: all 0.3s ease; cursor: pointer;"></rect>
        <text x="${x + barWidth/2}" y="${height - 8}" text-anchor="middle" font-size="11" font-weight="600" fill="#64748B">${d.month}</text>
      </g>
    `;
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="overflow: visible;">
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#C85A32"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </linearGradient>
      </defs>
      <!-- Grid Lines -->
      <line x1="${padLeft}" y1="20" x2="${width - 10}" y2="20" stroke="#E2E8F0" stroke-dasharray="3 3"/>
      <line x1="${padLeft}" y1="${chartH/2 + 15}" x2="${width - 10}" y2="${chartH/2 + 15}" stroke="#E2E8F0" stroke-dasharray="3 3"/>
      <line x1="${padLeft}" y1="${chartH + 15}" x2="${width - 10}" y2="${chartH + 15}" stroke="#CBD5E1"/>

      <!-- Y axis labels -->
      <text x="${padLeft - 8}" y="24" text-anchor="end" font-size="10" fill="#94A3B8">₹2.8L</text>
      <text x="${padLeft - 8}" y="${chartH/2 + 18}" text-anchor="end" font-size="10" fill="#94A3B8">₹1.4L</text>
      <text x="${padLeft - 8}" y="${chartH + 18}" text-anchor="end" font-size="10" fill="#94A3B8">₹0</text>

      ${barsSvg}
    </svg>
    <div id="chartTooltip" style="position: absolute; display: none; background: #1E293B; color: #FFF; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; pointer-events: none; transform: translate(-50%, -120%); box-shadow: 0 4px 12px rgba(0,0,0,0.15);"></div>
  `;

  // Tooltip interaction
  const tooltip = container.querySelector('#chartTooltip');
  container.querySelectorAll('.chart-bar-group').forEach(group => {
    group.addEventListener('mouseenter', (e) => {
      const month = group.dataset.month;
      const val = group.dataset.val;
      tooltip.textContent = `${month}: ${val}`;
      tooltip.style.display = 'block';
      const rect = group.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      tooltip.style.left = (rect.left - contRect.left + rect.width / 2) + 'px';
      tooltip.style.top = (rect.top - contRect.top) + 'px';
      group.querySelector('rect').setAttribute('opacity', '1');
    });
    group.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
      group.querySelector('rect').setAttribute('opacity', '0.9');
    });
  });
}

/* ==========================================================================
   3. Order Status Simulator
   ========================================================================= */
function initOrderActions() {
  document.addEventListener('click', (e) => {
    const updateBtn = e.target.closest('.btn-update-order-status');
    if (updateBtn) {
      const row = updateBtn.closest('tr');
      const badge = row.querySelector('.status-pill');
      if (badge) {
        if (badge.classList.contains('processing')) {
          badge.className = 'status-pill shipped';
          badge.textContent = 'Shipped';
          row.setAttribute('data-status', 'shipped');
          updateBtn.className = 'btn btn-secondary btn-sm btn-update-order-status';
          updateBtn.textContent = 'Mark Delivered';
          updateOrderPillCounts();
          showToast('Order status updated to Shipped! Tracking generated.', 'success');
        } else if (badge.classList.contains('shipped')) {
          badge.className = 'status-pill delivered';
          badge.textContent = 'Delivered';
          row.setAttribute('data-status', 'delivered');
          updateBtn.className = 'btn btn-secondary btn-sm';
          updateBtn.textContent = 'Invoice';
          updateBtn.onclick = () => showToast('Invoice downloaded.', 'success');
          updateOrderPillCounts();
          showToast('Order marked as Delivered! Funds released to available balance.', 'success');
        } else {
          showToast('Order is already completed & delivered.', 'demo');
        }
      }
    }
  });
}

/* ==========================================================================
   4. Payout Withdrawal Request Modal & Direct Bank Transfer System
   ========================================================================= */

let shgAvailableBalance = 84250;
let shgTotalWithdrawn = 281850;

function getAvailableBalance() {
  const el = document.getElementById('availableBalanceVal') || document.querySelector('.balance-val');
  if (el) {
    const parsed = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) return parsed;
  }
  return shgAvailableBalance;
}

function ensurePayoutModalInDOM() {
  let modalOverlay = document.getElementById('payoutModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'payoutModalOverlay';
    modalOverlay.className = 'payout-modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-labelledby', 'payoutModalTitle');
    modalOverlay.innerHTML = `
      <div class="payout-modal-dialog">
        <button type="button" class="payout-modal-close" onclick="closePayoutModal()" aria-label="Close modal">&times;</button>

        <div class="payout-modal-head">
          <div class="payout-modal-icon-badge">
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <div>
            <h3 id="payoutModalTitle">Transfer to State Bank of India</h3>
            <p>Instant Direct Settlement via PFMS • 0% Platform Commission</p>
          </div>
        </div>

        <!-- Beneficiary Bank Info Card -->
        <div class="payout-bank-summary-card">
          <div class="payout-bank-title-row">
            <div class="payout-bank-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="color:#1D4ED8;"><path d="M12 2L2 7v3h20V7L12 2zm8 10h-3v6h3v-6zm-6 0h-3v6h3v-6zm-6 0H5v6h3v-6zm-6 8v2h20v-2H2z"/></svg>
              <span>State Bank of India (SBI)</span>
            </div>
            <span class="badge-pill badge-teal">✓ PFMS Verified</span>
          </div>
          <div class="payout-bank-grid">
            <div class="payout-bank-item">
              <label>Beneficiary SHG</label>
              <span>Radhika Mahila Samiti</span>
            </div>
            <div class="payout-bank-item">
              <label>Account Number</label>
              <span>•••• •••• 4892</span>
            </div>
            <div class="payout-bank-item">
              <label>IFSC Code</label>
              <span>SBIN0000845</span>
            </div>
            <div class="payout-bank-item">
              <label>Branch</label>
              <span>Kanchipuram Main</span>
            </div>
          </div>
        </div>

        <!-- Balance & Quick Presets -->
        <div class="payout-balance-banner">
          <div>
            <div class="label">Available for Withdrawal</div>
            <div style="font-size:0.75rem; color:var(--dash-text-muted);">Verified escrow release</div>
          </div>
          <div class="amount" id="modalBalanceDisplay">₹84,250</div>
        </div>

        <span class="payout-presets-label">Choose Quick Amount:</span>
        <div class="payout-preset-chips">
          <button type="button" class="payout-chip-btn" data-preset="25000">₹25,000</button>
          <button type="button" class="payout-chip-btn" data-preset="50000">₹50,000</button>
          <button type="button" class="payout-chip-btn active" data-preset="all">₹84,250 (Full Amount)</button>
        </div>

        <!-- Amount Input Field -->
        <div class="payout-field-group">
          <label for="payoutAmountInput" class="payout-presets-label">Transfer Amount (INR):</label>
          <div class="payout-input-wrapper">
            <span class="payout-rupee-sign">₹</span>
            <input type="number" id="payoutAmountInput" class="payout-num-input" value="84250" min="500" max="84250" step="100" placeholder="Enter amount">
          </div>
          <div class="payout-calc-feedback">
            <span>Remaining SHG Balance:</span>
            <strong id="payoutRemainingDisplay">₹0</strong>
          </div>
          <div id="payoutErrorAlert" class="payout-error-alert"></div>
        </div>

        <!-- Zero-fee Assurance -->
        <div class="payout-trust-badge">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <p>HerVana 0% Commission Promise: 100% of these sales proceeds reach your cooperative bank account directly via PFMS without any middleman cuts or deductions.</p>
        </div>

        <!-- Actions -->
        <div class="payout-action-row">
          <button type="button" class="btn btn-secondary" onclick="closePayoutModal()">Cancel</button>
          <button type="button" class="btn btn-gold" id="btnConfirmTransfer" onclick="executeBankTransfer()">
            <span id="transferBtnText">Confirm & Transfer ₹84,250</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
    attachPayoutModalEvents();
  }
  return modalOverlay;
}

function attachPayoutModalEvents() {
  const modalOverlay = document.getElementById('payoutModalOverlay');
  if (!modalOverlay || modalOverlay.dataset.eventsAttached === 'true') return;
  modalOverlay.dataset.eventsAttached = 'true';

  // Backdrop click to close
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closePayoutModal();
    }
  });

  // Preset chips
  const chips = modalOverlay.querySelectorAll('.payout-chip-btn');
  const input = modalOverlay.querySelector('#payoutAmountInput');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const preset = chip.getAttribute('data-preset');
      const bal = getAvailableBalance();
      let targetVal = bal;

      if (preset === 'all') {
        targetVal = bal;
      } else {
        targetVal = Math.min(parseInt(preset, 10), bal);
      }

      if (input) {
        input.value = targetVal;
        handlePayoutInputChange(targetVal, bal);
      }
    });
  });

  // Live input changes
  if (input) {
    input.addEventListener('input', () => {
      const bal = getAvailableBalance();
      const val = parseInt(input.value || '0', 10);
      handlePayoutInputChange(val, bal);
    });
  }
}

function handlePayoutInputChange(val, bal) {
  const errorAlert = document.getElementById('payoutErrorAlert');
  const remainingDisplay = document.getElementById('payoutRemainingDisplay');
  const confirmBtn = document.getElementById('btnConfirmTransfer');
  const transferBtnText = document.getElementById('transferBtnText');
  const chips = document.querySelectorAll('.payout-chip-btn');

  // Sync active preset chip
  chips.forEach(c => {
    const p = c.getAttribute('data-preset');
    if ((p === 'all' && val === bal) || (p === String(val))) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });

  if (bal <= 0) {
    if (errorAlert) {
      errorAlert.textContent = 'No funds currently available for withdrawal.';
      errorAlert.style.display = 'block';
    }
    if (confirmBtn) confirmBtn.disabled = true;
    if (remainingDisplay) remainingDisplay.textContent = '₹0';
    if (transferBtnText) transferBtnText.textContent = 'No Available Balance';
    return;
  }

  if (isNaN(val) || val < 500) {
    if (errorAlert) {
      errorAlert.textContent = 'Minimum transfer amount is ₹500.';
      errorAlert.style.display = 'block';
    }
    if (confirmBtn) confirmBtn.disabled = true;
    if (remainingDisplay) remainingDisplay.textContent = 'Invalid amount';
    if (transferBtnText) transferBtnText.textContent = 'Enter Valid Amount';
    return;
  }

  if (val > bal) {
    if (errorAlert) {
      errorAlert.textContent = `Amount cannot exceed available balance of ₹${bal.toLocaleString('en-IN')}.`;
      errorAlert.style.display = 'block';
    }
    if (confirmBtn) confirmBtn.disabled = true;
    if (remainingDisplay) remainingDisplay.textContent = 'Exceeds balance';
    if (transferBtnText) transferBtnText.textContent = 'Exceeds Balance';
    return;
  }

  // Valid input
  if (errorAlert) errorAlert.style.display = 'none';
  if (confirmBtn) confirmBtn.disabled = false;
  const remaining = bal - val;
  if (remainingDisplay) remainingDisplay.textContent = '₹' + remaining.toLocaleString('en-IN');
  if (transferBtnText) transferBtnText.textContent = `Confirm & Transfer ₹${val.toLocaleString('en-IN')}`;
}

window.openPayoutModal = function() {
  const modalOverlay = ensurePayoutModalInDOM();
  const bal = getAvailableBalance();

  const modalBal = document.getElementById('modalBalanceDisplay');
  if (modalBal) modalBal.textContent = '₹' + bal.toLocaleString('en-IN');

  const allChip = modalOverlay.querySelector('.payout-chip-btn[data-preset="all"]');
  if (allChip) allChip.textContent = `₹${bal.toLocaleString('en-IN')} (Full Amount)`;

  const input = modalOverlay.querySelector('#payoutAmountInput');
  if (input) {
    input.max = bal;
    input.value = bal > 0 ? bal : 0;
    input.disabled = (bal <= 0);
  }

  handlePayoutInputChange(bal > 0 ? bal : 0, bal);

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    if (input && bal > 0) input.focus();
  }, 100);
};

window.closePayoutModal = function() {
  const modalOverlay = document.getElementById('payoutModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.executeBankTransfer = function() {
  const input = document.getElementById('payoutAmountInput');
  const bal = getAvailableBalance();
  const val = parseInt(input ? input.value : bal, 10);

  if (isNaN(val) || val < 500 || val > bal) {
    alert('Please enter a valid transfer amount between ₹500 and ₹' + bal.toLocaleString('en-IN'));
    return;
  }

  const confirmBtn = document.getElementById('btnConfirmTransfer');
  const transferBtnText = document.getElementById('transferBtnText');
  if (confirmBtn) confirmBtn.disabled = true;
  if (transferBtnText) {
    transferBtnText.innerHTML = `<span class="spinner-border" style="display:inline-block; width:16px; height:16px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px;"></span> Processing Transfer via PFMS...`;
  }

  setTimeout(() => {
    // Deduct available balance
    shgAvailableBalance = bal - val;
    shgTotalWithdrawn += val;

    // Update page balance elements
    const balEls = document.querySelectorAll('#availableBalanceVal, .balance-val');
    balEls.forEach(el => {
      el.textContent = '₹' + shgAvailableBalance.toLocaleString('en-IN');
    });

    // Update total life withdrawn if present
    const totalWithdrawnEl = document.getElementById('totalWithdrawnVal');
    if (totalWithdrawnEl) {
      totalWithdrawnEl.textContent = '₹' + shgTotalWithdrawn.toLocaleString('en-IN');
    }

    // Generate bank UTR and transaction reference
    const utr = 'SBIN26310' + Math.floor(100000 + Math.random() * 900000);
    const ref = '#PAY-2026-' + (new Date().getMonth() + 1).toString().padStart(2, '0') + new Date().getDate().toString().padStart(2, '0');
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    // Prepend new row to settlement table in earnings.html
    const tableBody = document.getElementById('payoutHistoryTableBody') || document.querySelector('.dash-table tbody');
    if (tableBody) {
      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
      tr.style.transition = 'background-color 2.5s ease';
      tr.innerHTML = `
        <td><strong>${ref}</strong></td>
        <td>${today} <span class="badge-pill badge-teal" style="font-size:0.68rem; padding:1px 6px; margin-left:4px;">Just Now</span></td>
        <td>SBI (•••• 4892)</td>
        <td><strong>₹${val.toLocaleString('en-IN')}</strong></td>
        <td><code class="dash-code">${utr}</code></td>
        <td><span class="status-pill delivered">Completed</span></td>
      `;
      tableBody.insertBefore(tr, tableBody.firstChild);
      setTimeout(() => {
        tr.style.backgroundColor = '';
      }, 2500);
    }

    // Close modal
    closePayoutModal();

    // Reset button
    if (confirmBtn) confirmBtn.disabled = false;
    if (transferBtnText) transferBtnText.textContent = `Confirm & Transfer ₹${val.toLocaleString('en-IN')}`;

    // Show celebration toast
    showToast(`✓ Transfer of ₹${val.toLocaleString('en-IN')} successfully credited to State Bank of India (•••• 4892)! UTR: ${utr}`, 'success');
  }, 700);
};

// Global delegation for withdrawal buttons & Escape key
function initWithdrawalModal() {
  // Delegate all clicks on .btn-request-withdrawal across the entire document
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-request-withdrawal');
    if (btn) {
      e.preventDefault();
      openPayoutModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('payoutModalOverlay');
      if (modal && modal.classList.contains('open')) {
        closePayoutModal();
      }
    }
  });

  // Pre-inject modal into DOM for immediate readiness
  ensurePayoutModalInDOM();
}

/* ==========================================================================
   5. Add Product Simulation Modal
   ========================================================================= */
function initAddProductModal() {
  const addBtn = document.querySelector('.btn-add-product-modal');
  if (!addBtn) return;

  addBtn.addEventListener('click', () => {
    const title = prompt('Enter Handcrafted Product Title:', 'Hand-spun Mulberry Silk Stole');
    if (title) {
      const price = prompt('Enter Selling Price (₹):', '1250');
      showToast(`Product "${title}" (₹${price}) published successfully to HerVana Marketplace!`, 'success');
    }
  });
}

// Global Toast helper for dashboard
window.showToast = function(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `<div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};


/* ==========================================================================
   Order Filtering & Search Handlers (orders.html)
   ========================================================================== */
window.filterOrderTable = function(status, btn) {
  // Update button active state in pill group
  const pillGroup = (btn && btn.closest('.order-pill-group')) || document.querySelector('.order-pill-group');
  if (pillGroup) {
    pillGroup.querySelectorAll('button').forEach(b => {
      b.classList.remove('btn-primary', 'active');
      b.classList.add('btn-secondary');
    });
  }
  if (btn) {
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary', 'active');
  }

  // Filter table rows
  const rows = document.querySelectorAll('#ordersMasterTable tbody tr:not(#ordersEmptyStateRow)');
  let visibleCount = 0;
  rows.forEach(r => {
    const rowStatus = (r.getAttribute('data-status') || '').toLowerCase();
    if (status === 'all' || rowStatus === status) {
      r.style.display = '';
      visibleCount++;
    } else {
      r.style.display = 'none';
    }
  });

  // Empty state handling
  let emptyRow = document.getElementById('ordersEmptyStateRow');
  const tbody = document.querySelector('#ordersMasterTable tbody');
  if (visibleCount === 0) {
    if (!emptyRow && tbody) {
      emptyRow = document.createElement('tr');
      emptyRow.id = 'ordersEmptyStateRow';
      emptyRow.innerHTML = `<td colspan="7" style="text-align:center; padding:3rem 1.5rem; color:var(--dash-text-muted); font-weight:600;">No orders found in "${status}" state.</td>`;
      tbody.appendChild(emptyRow);
    } else if (emptyRow) {
      emptyRow.style.display = '';
      emptyRow.querySelector('td').textContent = `No orders found in "${status}" state.`;
    }
  } else if (emptyRow) {
    emptyRow.style.display = 'none';
  }
};

window.searchOrders = function(val) {
  val = (val || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#ordersMasterTable tbody tr:not(#ordersEmptyStateRow)');
  let visibleCount = 0;
  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    if (!val || text.includes(val)) {
      r.style.display = '';
      visibleCount++;
    } else {
      r.style.display = 'none';
    }
  });

  let emptyRow = document.getElementById('ordersEmptyStateRow');
  const tbody = document.querySelector('#ordersMasterTable tbody');
  if (visibleCount === 0) {
    if (!emptyRow && tbody) {
      emptyRow = document.createElement('tr');
      emptyRow.id = 'ordersEmptyStateRow';
      emptyRow.innerHTML = `<td colspan="7" style="text-align:center; padding:3rem 1.5rem; color:var(--dash-text-muted); font-weight:600;">No orders matching "${val}".</td>`;
      tbody.appendChild(emptyRow);
    } else if (emptyRow) {
      emptyRow.style.display = '';
      emptyRow.querySelector('td').textContent = `No orders matching "${val}".`;
    }
  } else if (emptyRow) {
    emptyRow.style.display = 'none';
  }
};

function updateOrderPillCounts() {
  const rows = document.querySelectorAll('#ordersMasterTable tbody tr:not(#ordersEmptyStateRow)');
  if (!rows.length) return;
  let total = rows.length;
  let proc = 0, ship = 0, deliv = 0;
  rows.forEach(r => {
    const s = (r.getAttribute('data-status') || '').toLowerCase();
    if (s === 'processing') proc++;
    else if (s === 'shipped') ship++;
    else if (s === 'delivered') deliv++;
  });

  const pills = document.querySelectorAll('.order-pill-group button');
  pills.forEach(p => {
    const txt = p.textContent;
    if (txt.includes('All Orders')) p.textContent = `All Orders (${total})`;
    else if (txt.includes('Processing')) p.textContent = `Processing (${proc})`;
    else if (txt.includes('Shipped')) p.textContent = `Shipped (${ship})`;
    else if (txt.includes('Delivered')) p.textContent = `Delivered (${deliv})`;
  });
}

/* ==========================================================================
   Interactive Header Buttons: Date Filter Menu & Notifications Panel
   ========================================================================== */

function toggleDateFilterMenu(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const dropdown = document.getElementById('dateFilterDropdown');
  const notifDropdown = document.getElementById('notifDropdown');
  if (notifDropdown) notifDropdown.style.display = 'none';

  if (!dropdown) return;
  const isShown = dropdown.style.display === 'block';
  dropdown.style.display = isShown ? 'none' : 'block';
}

function selectDateRange(rangeText, btn) {
  const activeLabel = document.getElementById('activeDateFilterText');
  if (activeLabel) activeLabel.textContent = rangeText;

  // Update checkmarks
  const items = document.querySelectorAll('#dateFilterDropdown .dash-dropdown-item');
  items.forEach(item => {
    item.classList.remove('active');
    const check = item.querySelector('.check-mark');
    if (check) check.textContent = '';
  });

  if (btn) {
    btn.classList.add('active');
    const check = btn.querySelector('.check-mark');
    if (check) check.textContent = '✓';
  }

  const dropdown = document.getElementById('dateFilterDropdown');
  if (dropdown) dropdown.style.display = 'none';

  if (typeof showToast === 'function') {
    showToast(`Date range filter set to: ${rangeText}`, 'info');
  }
}

function toggleNotificationMenu(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const notifDropdown = document.getElementById('notifDropdown');
  const dateDropdown = document.getElementById('dateFilterDropdown');
  if (dateDropdown) dateDropdown.style.display = 'none';

  if (!notifDropdown) return;
  const isShown = notifDropdown.style.display === 'block';
  notifDropdown.style.display = isShown ? 'none' : 'block';
}

function markAllNotificationsRead(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const dot = document.getElementById('headerNotifDot');
  if (dot) dot.style.display = 'none';

  const badge = document.getElementById('notifCountBadge');
  if (badge) {
    badge.textContent = '0 New';
    badge.style.background = '#64748B';
  }

  const unreadItems = document.querySelectorAll('#notifList .dash-notif-item');
  unreadItems.forEach(item => {
    item.classList.remove('unread');
    item.style.opacity = '0.7';
  });

  if (typeof showToast === 'function') {
    showToast('All 8 notifications marked as read!', 'success');
  }
}

function handleNotifClick(target) {
  const dropdown = document.getElementById('notifDropdown');
  if (dropdown) dropdown.style.display = 'none';
  if (target === 'orders') {
    window.location.href = 'orders.html';
  } else if (target === 'earnings') {
    window.location.href = 'earnings.html';
  } else if (target === 'stock') {
    window.location.href = 'dashboard.html';
  }
}

// Global click-outside listener to close dropdowns
document.addEventListener('click', (e) => {
  const dateMenu = document.getElementById('dateFilterDropdown');
  const dateBtn = document.getElementById('dateFilterBtn');
  if (dateMenu && dateMenu.style.display === 'block') {
    if (!dateMenu.contains(e.target) && !dateBtn?.contains(e.target)) {
      dateMenu.style.display = 'none';
    }
  }

  const notifMenu = document.getElementById('notifDropdown');
  const notifBtn = document.getElementById('notifBellBtn');
  if (notifMenu && notifMenu.style.display === 'block') {
    if (!notifMenu.contains(e.target) && !notifBtn?.contains(e.target)) {
      notifMenu.style.display = 'none';
    }
  }
});

// Export globally
window.toggleDateFilterMenu = toggleDateFilterMenu;
window.selectDateRange = selectDateRange;
window.toggleNotificationMenu = toggleNotificationMenu;
window.markAllNotificationsRead = markAllNotificationsRead;
window.handleNotifClick = handleNotifClick;
