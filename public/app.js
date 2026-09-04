/* ─────────────────────────────────────────────────────────────────
   Kusum Jewelers ERP — app.js
   Client-side interactivity for inventory, billing and rates pages.
   ───────────────────────────────────────────────────────────────── */

'use strict';

/* ── Helpers ─────────────────────────────────────────────────── */
function fmt(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

function n(value) {
  const v = parseFloat(value);
  return Number.isFinite(v) ? v : 0;
}

function roundMoney(value) {
  return Math.round((n(value) + Number.EPSILON) * 100) / 100;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function shouldUppercaseInput(input) {
  if (!input || !input.matches) return false;
  if (input.matches('input[type="password"], input[type="email"], input[type="number"], input[type="date"], input[type="file"], input[type="checkbox"], input[type="radio"], input[type="hidden"]')) {
    return false;
  }
  if (input.matches('[data-no-uppercase], [data-no-uppercase] *, .preserve-case, .preserve-case *')) {
    return false;
  }
  if (input.matches('[name="username"], [name="password"], [name="currentPassword"], [name="newPassword"], [name="confirmPassword"], [name="appUsername"], [name="appPassword"], [name="mysqlUser"], [name="mysqlPassword"], [name="databaseUser"], [name="databasePassword"], [name="mysqlHost"], [name="databaseName"], [name="printerHost"], [name="printerPort"], [name="printerName"]')) {
    return false;
  }
  if (input.closest('.login-page, .login-card, .login-form-panel, form[action="/login"], form[action="/change-password"], .setup-body, .setup-container, .setup-card, #setup-form, form[action="/setup"], form[action="/connection-repair"], form[action="/network-setup"], #printer-setup-form, [data-preserve-case]')) {
    return false;
  }
  return input.matches('input[type="text"], input[type="search"], input:not([type]), textarea, [data-uppercase], [data-title-case], [data-huid-code], [name="huidCode"]');
}

function convertInputToUppercase(input) {
  if (!shouldUppercaseInput(input)) return;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const upper = String(input.value || '').toUpperCase();
  if (input.value !== upper) {
    input.value = upper;
    if (start !== null && end !== null && typeof input.setSelectionRange === 'function') {
      try {
        input.setSelectionRange(start, end);
      } catch (_) {}
    }
  }
}

// Convert all ERP data-entry text inputs to UPPERCASE in real time as the user types
document.addEventListener('input', (event) => {
  convertInputToUppercase(event.target);
});

document.addEventListener('change', (event) => {
  convertInputToUppercase(event.target);
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (!form || !form.querySelectorAll) return;
  if (form.closest('.login-page, .login-card, .login-form-panel, form[action="/login"], form[action="/change-password"], .setup-body, .setup-container, .setup-card, #setup-form, form[action="/setup"], form[action="/connection-repair"], form[action="/network-setup"], #printer-setup-form')) {
    return;
  }
  form.querySelectorAll('input[type="text"], input[type="search"], input:not([type]), textarea, [data-uppercase], [data-title-case]').forEach(convertInputToUppercase);
});


/* ── Form Enter navigation ───────────────────────────────────
   Cashiers enter a large amount of data from the keyboard. Enter moves to
   the next visible, editable field in the current form (or explicitly marked
   field group), and submits only after its final field. Controls with a
   specialised Enter action—such as barcode scanners and autocomplete
   selection—call preventDefault themselves, so their existing workflow wins.
*/
function isEnterNavigableControl(control) {
  if (!control?.matches?.('input, select, textarea')) return false;
  if (control.disabled || control.readOnly || control.type === 'hidden') return false;
  if (control.matches('input[type="button"], input[type="submit"], input[type="reset"], input[type="file"], input[type="checkbox"], input[type="radio"]')) return false;
  if (control.closest('[hidden], [aria-hidden="true"]')) return false;
  return Boolean(control.getClientRects().length);
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.defaultPrevented || event.isComposing) return;
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;

  const control = event.target;
  if (!isEnterNavigableControl(control)) return;

  const scope = control.closest('[data-enter-scope]') || control.form;
  if (!scope || scope.matches('[data-disable-enter-navigation]')) return;

  const controls = Array.from(scope.querySelectorAll('input, select, textarea')).filter(isEnterNavigableControl);
  const position = controls.indexOf(control);
  if (position < 0) return;

  event.preventDefault();
  const next = controls[position + 1];
  if (next) {
    next.focus();
    return;
  }

  const nextSelector = scope.dataset.enterNext;
  if (nextSelector) {
    document.querySelector(nextSelector)?.focus();
    return;
  }

  if (!control.form) return;
  if (!control.form.reportValidity()) return;
  control.form.requestSubmit();
});

function replaceWithTextElements(container, elements) {
  container.replaceChildren(...elements.map(({ tag, text, className }) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = String(text ?? '');
    return element;
  }));
}

/* ── Flash auto-dismiss ──────────────────────────────────────── */
document.querySelectorAll('.flash').forEach((el) => {
  setTimeout(() => {
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => el.remove(), 400);
  }, 4000);
});

/* ═══════════════════════════════════════════════════════════════
   1. RATES PAGE — tab switching
   ═══════════════════════════════════════════════════════════════ */
(function initRateTabs() {
  const tabLinks = document.querySelectorAll('.rate-tabs a');
  if (!tabLinks.length) return;

  const sections = {
    '#rate-form': document.getElementById('rate-form'),
    '#rate-history': document.getElementById('rate-history'),
  };

  function showTab(hash) {
    tabLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === hash));
    Object.entries(sections).forEach(([key, el]) => {
      if (el) el.style.display = key === hash ? '' : 'none';
    });
  }

  // Set initial state: hide non-active sections
  showTab(location.hash || '#rate-form');

  tabLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      history.replaceState(null, '', a.getAttribute('href'));
      showTab(a.getAttribute('href'));
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   2. INVENTORY FORM — barcode preview + rate readout + suggested ₹
   ═══════════════════════════════════════════════════════════════ */
(function initInventoryForm() {
  const form = document.querySelector('[data-product-form]');
  if (!form) return;

  const rate22 = n(form.dataset.rate22);
  const rate24 = n(form.dataset.rate24);
  const rateSilver = n(form.dataset.rateSilver);

  const metalSel = form.querySelector('[data-product-metal]');
  const puritySel = form.querySelector('[data-product-purity]');
  const barcodePreview = form.querySelector('[data-barcode-preview]');
  const rateDisplay = form.querySelector('[data-product-rate]');
  const suggestedDisplay = form.querySelector('[data-product-suggested]');
  const netWeightInput = form.querySelector('[data-weight-net]');
  const grossWeightInput = form.querySelector('[data-weight-gross]');
  const stoneWeightInput = form.querySelector('[data-weight-stone]');
  const makingTypeSelect = form.querySelector('[data-making-type]');
  const makingValueInput = form.querySelector('[data-making-value]');
  const sellingPriceInput = form.querySelector('[data-selling-price]');

  // Purity options per metal
  const purityOptions = {
    GOLD: [
      { value: '22K', label: '22K Gold' },
      { value: '24K', label: '24K Gold' },
    ],
    SILVER: [
      { value: '', label: 'Not specified' },
    ],
    PLATINUM: [
      { value: 'PT950', label: 'Platinum 950' },
    ],
    DIAMOND: [
      { value: '18K', label: '18K Gold (Diamond)' },
      { value: '22K', label: '22K Gold (Diamond)' },
    ],
    OTHER: [
      { value: 'OTHER', label: 'Other' },
    ],
  };

  function getBarcodePrefixPreview(metal, purity) {
    if (metal === 'GOLD') return 'G';
    if (metal === 'SILVER') return 'S';
    return 'J';
  }

  function getMetalRate(metal, purity) {
    const p = String(purity || '').toUpperCase().replace(/\s/g, '');
    if (metal === 'GOLD' && p === '24K') return rate24;
    if (metal === 'GOLD') return rate22;
    if (metal === 'SILVER') return rateSilver;
    return 0;
  }

  function calcMaking(type, value, metalAmount, weight) {
    const v = n(value);
    if (type === 'FIXED') return v;
    if (type === 'PERCENTAGE') return metalAmount * v / 100;
    return v * n(weight); // PER_GRAM
  }

  function updatePurityOptions() {
    if (!metalSel || !puritySel) return;
    const metal = metalSel.value;
    const opts = purityOptions[metal] || [{ value: 'OTHER', label: 'Other' }];
    const current = puritySel.value;
    puritySel.replaceChildren(...opts.map((option) => {
      const element = document.createElement('option');
      element.value = option.value;
      element.textContent = option.label;
      element.selected = option.value === current;
      return element;
    }));
  }

  function updateReadouts() {
    const metal = metalSel ? metalSel.value : 'GOLD';
    const purity = puritySel ? puritySel.value : '22K';

    if (barcodePreview) {
      const prefix = getBarcodePrefixPreview(metal, purity);
      barcodePreview.textContent = `${prefix} 00001`;
    }

    const metalRate = getMetalRate(metal, purity);
    if (rateDisplay) {
      rateDisplay.textContent = metalRate > 0 ? `${fmt(metalRate)} / g` : '₹ — (no rate set)';
    }

    if (suggestedDisplay && netWeightInput) {
      const netWeight = n(netWeightInput.value);
      const metalAmount = metalRate * netWeight;
      const makingType = makingTypeSelect ? makingTypeSelect.value : 'PER_GRAM';
      const makingValue = makingValueInput ? n(makingValueInput.value) : 0;
      const making = calcMaking(makingType, makingValue, metalAmount, netWeight);
      const suggestedPrice = metalAmount + making;
      suggestedDisplay.textContent = fmt(suggestedPrice);
      if (sellingPriceInput) sellingPriceInput.value = suggestedPrice.toFixed(2);
    }
  }

  function updateNetWeight() {
    if (!grossWeightInput || !stoneWeightInput || !netWeightInput) return;
    const gross = n(grossWeightInput.value);
    const stone = n(stoneWeightInput.value);
    const net = Math.max(0, gross - stone);
    netWeightInput.value = net.toFixed(3);
    updateReadouts();
  }

  const nameInput = form.querySelector('[data-item-name-input]');

  function autoDetectMetal(nameText) {
    if (!metalSel) return;
    const clean = String(nameText || '').trim().toLowerCase();
    if (!clean) return;
    let targetMetal = null;
    if (/\b(silver|chandi)\b/i.test(clean)) {
      targetMetal = 'SILVER';
    } else if (/\b(gold|sona)\b/i.test(clean)) {
      targetMetal = 'GOLD';
    } else if (/\b(platinum)\b/i.test(clean)) {
      targetMetal = 'PLATINUM';
    } else if (/\b(diamond|heera)\b/i.test(clean)) {
      targetMetal = 'DIAMOND';
    }
    if (targetMetal && metalSel.value !== targetMetal) {
      metalSel.value = targetMetal;
      updatePurityOptions();
      updateReadouts();
    }
  }

  if (metalSel) {
    metalSel.addEventListener('change', () => { updatePurityOptions(); updateReadouts(); });
  }
  if (puritySel) {
    puritySel.addEventListener('change', updateReadouts);
  }
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      autoDetectMetal(nameInput.value);
    });
  }
  if (grossWeightInput) grossWeightInput.addEventListener('input', updateNetWeight);
  if (stoneWeightInput) stoneWeightInput.addEventListener('input', updateNetWeight);
  if (netWeightInput) netWeightInput.addEventListener('input', updateReadouts);
  if (makingTypeSelect) makingTypeSelect.addEventListener('change', updateReadouts);
  if (makingValueInput) makingValueInput.addEventListener('input', updateReadouts);

  // Run on load
  updatePurityOptions();
  updateReadouts();
  if (nameInput && nameInput.value) {
    autoDetectMetal(nameInput.value);
  }
})();

/* ═══════════════════════════════════════════════════════════════
   3. BILLING CUSTOMER — phone-first lookup and automatic creation
   ═══════════════════════════════════════════════════════════════ */
(function initBillingCustomerLookup() {
  const lookup = document.querySelector('[data-customer-lookup]');
  if (!lookup) return;
  const phoneInput = document.querySelector('[data-customer-phone]');
  const customerId = lookup.querySelector('[data-customer-id]');
  const status = lookup.querySelector('[data-customer-status]');
  const existing = lookup.querySelector('[data-existing-customer]');
  const existingName = lookup.querySelector('[data-existing-name]');
  const existingDetails = lookup.querySelector('[data-existing-details]');
  const ledgerLink = lookup.querySelector('[data-existing-ledger]');
  const existingPanInput = lookup.querySelector('[data-existing-pan]');
  const newFields = lookup.querySelector('[data-new-customer-fields]');
  const nameInput = lookup.querySelector('[data-customer-name]');
  const panInput = lookup.querySelector('[data-customer-pan]');
  const emailInput = lookup.querySelector('[data-customer-email]');
  const addressInput = lookup.querySelector('[data-customer-address]');
  let lookupTimer = null;
  let requestNumber = 0;
  let lastAlertedCustomerId = null;

  // PAN is an identifier, so it remains uppercase. Customer names and
  // addresses use the shared title-case input rule instead.
  function enforceUppercase(input) {
    input?.addEventListener('input', () => {
      const upper = String(input.value || '').toUpperCase();
      if (input.value !== upper) input.value = upper;
    });
  }
  enforceUppercase(panInput);
  enforceUppercase(existingPanInput);

  function normalizedPhone() {
    let digits = (phoneInput.value || '').replace(/\D/g, '');
    if (digits.startsWith('00')) digits = digits.slice(2);
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    return digits;
  }

  function showNewCustomer(phone) {
    customerId.value = '';
    existing.hidden = true;
    newFields.hidden = false;
    [nameInput, panInput, emailInput, addressInput].filter(Boolean).forEach((input) => { input.disabled = false; });
    nameInput.required = true;
    status.textContent = `${phone} is new. Enter the name to create this customer automatically when the bill is saved.`;
    status.className = 'customer-lookup-status is-new';
  }

  function showExisting(customer) {
    customerId.value = customer.id;
    existing.hidden = false;
    newFields.hidden = true;
    [nameInput, panInput, emailInput, addressInput].filter(Boolean).forEach((input) => { input.disabled = true; });
    nameInput.required = false;
    existingName.textContent = String(customer.name || '').toUpperCase();
    const contact = [customer.phone, customer.email, customer.address ? String(customer.address).toUpperCase() : ''].filter(Boolean).join(' · ');
    existingDetails.textContent = `${contact || 'Customer details loaded'} · Outstanding: ${fmt(customer.outstanding)}`;
    if (existingPanInput) existingPanInput.value = String(customer.panNumber || '').toUpperCase();
    ledgerLink.href = `/customers/${customer.id}`;
    ledgerLink.hidden = false;
    const outstandingVal = Number(customer.outstanding || 0);
    if (outstandingVal > 0.01) {
      status.textContent = `⚠️ Customer has an outstanding balance of ${fmt(outstandingVal)}.`;
      status.className = 'customer-lookup-status is-warning';
      if (lastAlertedCustomerId !== customer.id) {
        lastAlertedCustomerId = customer.id;
        showBalanceAlert(customer, outstandingVal);
      }
    } else {
      status.textContent = 'Existing customer found. Their profile and ledger will be used for this bill.';
      status.className = 'customer-lookup-status is-found';
    }
  }

  function showBalanceAlert(customer, amount) {
    const modal = document.getElementById('customerBalanceAlertModal');
    if (!modal) return;
    const nameEl = document.getElementById('balanceAlertCustName');
    const phoneEl = document.getElementById('balanceAlertCustPhone');
    const amountEl = document.getElementById('balanceAlertCustAmount');
    const ledgerBtn = document.getElementById('balanceAlertLedgerBtn');
    const okBtn = document.getElementById('balanceAlertOkBtn');

    if (nameEl) nameEl.textContent = customer.name;
    if (phoneEl) phoneEl.textContent = customer.phone || '—';
    if (amountEl) amountEl.textContent = fmt(amount);
    if (ledgerBtn) ledgerBtn.href = `/customers/${customer.id}`;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');

    function closeModal() {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }

    if (okBtn) {
      okBtn.onclick = closeModal;
      setTimeout(() => okBtn.focus(), 50);
    }
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }

  function clearLookup(message) {
    customerId.value = '';
    existing.hidden = true;
    ledgerLink.hidden = true;
    newFields.hidden = true;
    lastAlertedCustomerId = null;
    [nameInput, panInput, emailInput, addressInput].filter(Boolean).forEach((input) => { input.disabled = true; });
    if (existingPanInput) existingPanInput.value = '';
    nameInput.required = false;
    status.textContent = message;
    status.className = 'customer-lookup-status';
  }

  async function lookupCustomer() {
    const phone = normalizedPhone();
    phoneInput.value = phone;
    if (phone.length < 10 || phone.length > 15) {
      clearLookup('Enter a valid 10 to 15 digit customer mobile number.');
      return;
    }
    const currentRequest = ++requestNumber;
    status.textContent = 'Looking up customer details…';
    status.className = 'customer-lookup-status is-loading';
    try {
      const response = await fetch(`/api/customers/phone/${encodeURIComponent(phone)}`);
      const data = await response.json();
      if (currentRequest !== requestNumber) return;
      if (!response.ok) throw new Error(data.error || 'Could not look up this customer.');
      if (data.found) showExisting(data.customer); else showNewCustomer(data.phone);
    } catch (error) {
      clearLookup(error.message || 'Could not look up this customer.');
    }
  }

  phoneInput.addEventListener('input', () => {
    clearTimeout(lookupTimer);
    const digits = normalizedPhone();
    if (digits.length >= 10) lookupTimer = setTimeout(lookupCustomer, 350);
    else clearLookup('Enter the customer’s mobile number to load their ledger details.');
  });
  phoneInput.addEventListener('blur', lookupCustomer);
  phoneInput.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter' || event.isComposing) return;
    event.preventDefault();
    clearTimeout(lookupTimer);
    const requestedPhone = normalizedPhone();
    await lookupCustomer();
    if (normalizedPhone() !== requestedPhone) return;
    if (!newFields.hidden && !nameInput.disabled) {
      nameInput.focus();
    } else if (!existing.hidden && existingPanInput && !existingPanInput.disabled) {
      existingPanInput.focus();
    }
  });
  clearLookup('Enter the customer’s mobile number to load their ledger details.');
})();

/* ═══════════════════════════════════════════════════════════════
   4. BILLING / SALES FORM — barcode scan, live totals
   ═══════════════════════════════════════════════════════════════ */
(function initBarcodeSale() {
  const form = document.querySelector('[data-barcode-sale]');
  if (!form) return;
  const editScript = document.getElementById('kusumSaleEditData');
  let parsedEditSale = null;
  if (editScript && editScript.textContent.trim()) {
    try {
      parsedEditSale = JSON.parse(editScript.textContent);
    } catch (_) {}
  }
  const editSale = (parsedEditSale && typeof parsedEditSale === 'object')
    ? parsedEditSale
    : (window.kusumSaleEdit && typeof window.kusumSaleEdit === 'object' ? window.kusumSaleEdit : null);
  window.kusumSaleEdit = editSale;
  const isEditingSale = form.dataset.editSale === 'true' && Boolean(editSale);

  const rowsContainer = form.querySelector('[data-rows]');
  const template = form.querySelector('[data-line-template]');
  const addRowBtn = form.querySelector('[data-add-row]');
  const itemCountEl = form.querySelector('[data-item-count]');
  const lineEditorModal = form.querySelector('#saleLineEditorModal');
  const lineEditorHost = form.querySelector('[data-line-editor-host]');
  const lineEditorTitle = form.querySelector('#saleLineEditorTitle');
  const lineEditorDone = form.querySelector('[data-line-editor-done]');
  const subtotalEl = form.querySelector('[data-subtotal]');
  const discountInput = form.querySelector('[data-discount]');
  const gstEl = form.querySelector('[data-gst]');
  const roundOffEl = form.querySelector('[data-round-off]');
  const totalEl = form.querySelector('[data-total]');
  const paidInput = form.querySelector('[data-paid]');
  const paymentMethodInput = form.querySelector('[data-payment-method]');
  const splitPayment = form.querySelector('[data-split-payment]');
  const cashPaidInput = form.querySelector('[data-cash-paid]');
  const upiPaidInput = form.querySelector('[data-upi-paid]');
  const cardPaidInput = form.querySelector('[data-card-paid]');
  const bankPaidInput = form.querySelector('[data-bank-paid]');
  const balanceEl = form.querySelector('[data-balance]');
  const saleDateInput = form.querySelector('[data-sale-date]');
  const urdEnabled = form.querySelector('[data-urd-enabled]');
  const urdFields = form.querySelector('[data-urd-fields]');
  const urdMetal = form.querySelector('[data-urd-metal]');
  const urdPuritySelect = form.querySelector('[data-urd-purity-select]');
  const urdPurityManual = form.querySelector('[data-urd-purity-manual]');
  const urdGrossWeight = form.querySelector('[data-urd-gross-weight]');
  const urdNetWeight = form.querySelector('[data-urd-net-weight]');
  const urdRate = form.querySelector('[data-urd-rate]');
  const urdAmount = form.querySelector('[data-urd-amount]');
  const urdOffsetRow = form.querySelector('[data-urd-offset-row]');
  const urdOffsetEl = form.querySelector('[data-urd-offset]');
  const netPayableLabel = form.querySelector('[data-net-payable-label]');
  const netPayableEl = form.querySelector('[data-net-payable]');
  const urdRefundMethodWrap = form.querySelector('[data-urd-refund-method]');
  const urdRefundMethodInput = form.querySelector('select[data-urd-refund-method]');
  const urdRefundNote = form.querySelector('[data-urd-refund-note]');

  let rowCount = 0;
  let isUrdRefundable = false;
  let editingRow = null;
  let restoringDraft = false;
  let draftSaveTimer = null;
  let discardingDraft = false;
  let preservingInitialEditUrd = isEditingSale;

  function editorFor(row) {
    if (!row) return null;
    if (editingRow === row) return lineEditorHost?.querySelector('[data-line-editor]') || null;
    return row.querySelector('[data-line-editor]');
  }

  function lineField(row, selector) {
    return editorFor(row)?.querySelector(selector) || null;
  }

  function updateLineSummary(row) {
    const barcode = lineField(row, '[data-barcode]')?.value.trim().toUpperCase() || '';
    const productId = lineField(row, '[data-product-id]')?.value;
    const name = row.querySelector('[data-line-summary-name]');
    const meta = row.querySelector('[data-line-summary-meta]');
    const purity = row.querySelector('[data-line-summary-purity]');
    const weight = row.querySelector('[data-line-summary-weight]');
    const rate = row.querySelector('[data-line-summary-rate]');
    const making = row.querySelector('[data-line-summary-making]');
    const amount = row.querySelector('[data-line-summary-amount]');
    const purityValue = lineField(row, '[data-purity]')?.value.trim();
    const weightValue = n(lineField(row, '[data-weight]')?.value);
    const rateValue = n(lineField(row, '[data-metal-rate]')?.value);
    const makingType = lineField(row, '[data-making-type]')?.value || 'PER_GRAM';
    const makingValue = n(lineField(row, '[data-making-value]')?.value);
    const amountValue = n(lineField(row, '[data-taxable-amount]')?.value);

    if (name) name.textContent = row.dataset.productName || (barcode ? 'Looking up barcode…' : 'Pending barcode');
    if (meta) meta.textContent = row.dataset.productMeta || (productId ? barcode : (barcode || 'Click edit to scan'));
    if (purity) purity.textContent = purityValue || '—';
    if (weight) weight.textContent = weightValue > 0 ? `${weightValue.toFixed(3)} g` : '—';
    if (rate) rate.textContent = rateValue > 0 ? fmt(rateValue) : '—';
    if (making) {
      const type = makingType === 'PER_GRAM' ? '/g' : makingType === 'PERCENTAGE' ? '%' : 'fixed';
      making.textContent = makingValue > 0 ? `${fmt(makingValue)} ${type}` : '—';
    }
    if (amount) amount.textContent = amountValue > 0 ? fmt(amountValue) : '₹0.00';
  }

  function updateAllLineSummaries() {
    rowsContainer.querySelectorAll('[data-line-item]').forEach(updateLineSummary);
  }

  function returnEditorToRow(row) {
    const editor = lineEditorHost?.querySelector('[data-line-editor]');
    const slot = row?.querySelector('[data-line-editor-slot]');
    if (editor && slot) slot.appendChild(editor);
  }

  function closeLineEditor({ discardNew = false } = {}) {
    const row = editingRow;
    if (!row) return;
    const wasNew = row.dataset.newLine === 'true';
    returnEditorToRow(row);
    editingRow = null;
    lineEditorModal.style.display = 'none';
    lineEditorModal.setAttribute('aria-hidden', 'true');
    if (discardNew && wasNew) {
      row.remove();
      renumberRows();
      updateFormTotals();
    } else {
      delete row.dataset.newLine;
      updateLineSummary(row);
      updateFormTotals();
    }
    scheduleDraftSave();
  }

  function openLineEditor(row, { isNew = false } = {}) {
    if (!lineEditorModal || !lineEditorHost) return;
    if (editingRow && editingRow !== row) closeLineEditor();
    const editor = editorFor(row);
    if (!editor) return;
    editingRow = row;
    if (isNew) row.dataset.newLine = 'true';
    lineEditorHost.appendChild(editor);
    lineEditorTitle.textContent = (lineField(row, '[data-product-id]')?.value || lineField(row, '[data-sale-item-id]')?.value) ? 'Edit invoice item' : 'Add barcode';
    lineEditorModal.style.display = 'flex';
    lineEditorModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => lineEditorHost.querySelector('[data-barcode]')?.focus(), 0);
  }

  function removeLine(row) {
    if (editingRow === row) {
      lineEditorHost?.querySelector('[data-line-editor]')?.remove();
      editingRow = null;
      lineEditorModal.style.display = 'none';
      lineEditorModal.setAttribute('aria-hidden', 'true');
    }
    row.remove();
    renumberRows();
    updateFormTotals();
    scheduleDraftSave();
  }

  /* ── Add a new barcode row ───────────────────────────────── */
  function addRow({ openEditor = true } = {}) {
    rowCount++;
    const clone = template.content.cloneNode(true);
    const row = clone.querySelector('[data-line-item]');
    row.querySelector('.line-number').textContent = rowCount;

    // Wire up this row's interactivity
    row._saleLine = wireRow(row);
    rowsContainer.appendChild(row);
    updateItemCount();
    updateLineSummary(row);
    if (openEditor) openLineEditor(row, { isNew: true });
    return row;
  }

  /* ── Wire a single row ──────────────────────────────────── */
  function wireRow(row) {
    const barcodeInput = row.querySelector('[data-barcode]');
    const productIdInput = row.querySelector('[data-product-id]');
    const saleItemIdInput = row.querySelector('[data-sale-item-id]');
    const itemDetails = row.querySelector('[data-item-details]');
    const qtyInput = row.querySelector('[data-quantity]');
    const weightInput = row.querySelector('[data-weight]');
    const purityInput = row.querySelector('[data-purity]');
    const metalRateInput = row.querySelector('[data-metal-rate]');
    const makingTypeSelect = row.querySelector('[data-making-type]');
    const makingValueInput = row.querySelector('[data-making-value]');
    const taxableInput = row.querySelector('[data-taxable-amount]');
    const lineHelp = row.querySelector('[data-line-help]');
    const editBtn = row.querySelector('[data-edit-row]');
    const removeBtn = row.querySelector('[data-remove-summary]');

    let lookupTimer = null;
    let productData = null;
    let lookupSequence = 0;
    let lookupController = null;

    function getSaleDate() {
      if (saleDateInput?.value) return saleDateInput.value;
      const now = new Date();
      const pad = (part) => String(part).padStart(2, '0');
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    }

    function calcMaking(type, value, metalAmount, weight, qty) {
      const v = n(value);
      qty = n(qty) || 1;
      if (type === 'FIXED') return v * qty;
      if (type === 'PERCENTAGE') return metalAmount * v / 100;
      return v * n(weight) * qty; // PER_GRAM
    }

    function recalcRow() {
      if (!productData) return;
      const qty = 1;
      qtyInput.value = '1';
      const weight = n(weightInput.value);
      const metalRate = n(metalRateInput.value);
      const makingType = makingTypeSelect.value;
      const makingValue = n(makingValueInput.value);

      const metalAmount = metalRate * weight * qty;
      const making = calcMaking(makingType, makingValue, metalAmount, weight, qty);
      const taxable = metalAmount + making;

      // Only auto-set if user hasn't manually overridden it
      if (!taxableInput.dataset.manualOverride) {
        taxableInput.value = taxable.toFixed(2);
      }

      updateFormTotals();
      updateLineSummary(row);
      scheduleDraftSave();
    }

    async function lookupBarcode(barcode) {
      if (!barcode) return;
      const requestedBarcode = barcode.trim().toUpperCase();
      const requestSequence = ++lookupSequence;
      if (lookupController) lookupController.abort();
      lookupController = new AbortController();

      setRowStatus(row, 'loading', 'Looking up barcode…');
      productIdInput.value = '';
      productData = null;
      delete row.dataset.productName;
      delete row.dataset.productMeta;
      updateLineSummary(row);

      try {
        const date = getSaleDate();
        const resp = await fetch(`/api/products/barcode/${encodeURIComponent(requestedBarcode)}?date=${date}`, { signal: lookupController.signal });
        const data = await resp.json();
        if (requestSequence !== lookupSequence || barcodeInput.value.trim().toUpperCase() !== requestedBarcode) return;

        if (!resp.ok) {
          setRowStatus(row, 'error', data.error || 'Not found.');
          replaceWithTextElements(itemDetails, [{ tag: 'strong', className: 'err-text', text: data.error || 'Item not found' }]);
          return;
        }

        productData = data.product;
        productIdInput.value = data.product.id;
        row.dataset.productName = data.product.name;
        row.dataset.productMeta = `${data.product.barcode} · ${data.product.category}`;

        replaceWithTextElements(itemDetails, [
          { tag: 'strong', text: data.product.name },
          { tag: 'small', text: `${data.product.barcode} · ${data.product.category} · ${data.product.purity || data.product.metal} · ${Number(data.product.netWeight).toFixed(3)} g` }
        ]);

        weightInput.value = Number(data.product.netWeight).toFixed(3);
        if (purityInput) purityInput.value = data.product.purity || '';
        metalRateInput.value = Number(data.metalRate).toFixed(2);

        // Set making charge type + value from product defaults
        if (makingTypeSelect) {
          makingTypeSelect.value = data.product.makingChargeType || 'PER_GRAM';
        }
        if (makingValueInput) {
          makingValueInput.value = Number(data.product.makingChargeValue).toFixed(2);
        }

        taxableInput.dataset.manualOverride = '';
        recalcRow();
        updateLineSummary(row);
        scheduleDraftSave();

        // A scanner normally finishes by sending Enter. Once its lookup has
        // completed, continue directly to the editable weight field.
        if (editingRow === row && document.activeElement === barcodeInput) {
          weightInput.focus();
        }

        // Show warnings
        if (data.rateWarning) {
          setRowStatus(row, 'warn', data.rateWarning);
          metalRateInput.focus();
        } else if (data.isFallback) {
          setRowStatus(row, 'warn', `Using rates from ${data.sourceDate}`);
        } else {
          setRowStatus(row, 'ok', `✓ ${data.product.name} loaded · Rate: ${fmt(data.metalRate)}/g`);
        }
      } catch (err) {
        if (err.name === 'AbortError' || requestSequence !== lookupSequence) return;
        setRowStatus(row, 'error', 'Network error — check your connection.');
        console.error('Barcode lookup failed:', err);
      }
    }

    // Barcode input: debounce lookup
    barcodeInput.addEventListener('input', () => {
      clearTimeout(lookupTimer);
      lookupSequence++;
      if (lookupController) lookupController.abort();
      productIdInput.value = '';
      productData = null;
      delete row.dataset.productName;
      delete row.dataset.productMeta;
      if (purityInput) purityInput.value = '';
      replaceWithTextElements(itemDetails, [
        { tag: 'strong', text: 'Waiting for barcode…' },
        { tag: 'small', text: 'Item details will appear here after lookup' }
      ]);
      const val = barcodeInput.value.trim();
      if (val.length >= 1) {
        lookupTimer = setTimeout(() => lookupBarcode(val), 500);
      } else {
        setRowStatus(row, '', '');
      }
      updateLineSummary(row);
      scheduleDraftSave();
    });

    barcodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(lookupTimer);
        lookupBarcode(barcodeInput.value.trim());
      }
    });

    // Quantity is intentionally fixed to one because each scanned barcode is
    // one physical jewellery piece. Billing weight remains negotiable/editable.
    function onPricingComponentChange() {
      delete taxableInput.dataset.manualOverride;
      recalcRow();
    }
    weightInput.addEventListener('input', onPricingComponentChange);

    // Rate change (recalculates line price)
    metalRateInput.addEventListener('input', onPricingComponentChange);

    // Making charge changes
    if (makingTypeSelect) makingTypeSelect.addEventListener('change', onPricingComponentChange);
    if (makingValueInput) makingValueInput.addEventListener('input', onPricingComponentChange);
    if (purityInput) purityInput.addEventListener('input', () => {
      updateLineSummary(row);
      scheduleDraftSave();
    });

    // HUID code: auto-convert to UPPERCASE in real time
    const huidInput = row.querySelector('[data-huid-code]');
    if (huidInput) {
      huidInput.addEventListener('input', () => {
        const start = huidInput.selectionStart;
        const end = huidInput.selectionEnd;
        huidInput.value = huidInput.value.toUpperCase();
        if (start !== null && end !== null) {
          huidInput.setSelectionRange(start, end);
        }
      });
    }

    // Taxable amount: mark as manual override when user edits it
    taxableInput.addEventListener('input', () => {
      taxableInput.dataset.manualOverride = '1';
      updateFormTotals();
      updateLineSummary(row);
      scheduleDraftSave();
    });

    if (editBtn) editBtn.addEventListener('click', () => openLineEditor(row));

    // Remove row
    if (removeBtn) {
      removeBtn.addEventListener('click', () => removeLine(row));
    }

    return {
      async restore(values) {
        const existingSaleItemId = Number(values.saleItemId || values.existingSaleItemId || 0);
        if (existingSaleItemId > 0) {
          saleItemIdInput.value = String(existingSaleItemId);
          barcodeInput.value = values.barcode || '';
          barcodeInput.readOnly = true;
          productIdInput.value = '';
          productData = {
            id: null,
            barcode: values.barcode || '',
            sku: values.sku || '',
            name: values.name || values.productName || 'Jewellery item',
            category: values.category || '',
            metal: values.metal || 'OTHER',
            purity: values.purity || '',
            grossWeight: values.grossWeight || 0,
            netWeight: values.weight || 0,
            makingChargeType: values.makingChargeType || 'PER_GRAM',
            makingChargeValue: values.makingChargeValue || 0
          };
          row.dataset.productName = productData.name;
          row.dataset.productMeta = `${productData.barcode || 'Billed item'} · ${productData.metal || ''}`;
          replaceWithTextElements(itemDetails, [
            { tag: 'strong', text: productData.name },
            { tag: 'small', text: `${productData.barcode || 'Billed item'} · Already sold; barcode remains unavailable` }
          ]);
        } else {
          barcodeInput.value = values.barcode || '';
          if (values.barcode) await lookupBarcode(values.barcode);
        }
        weightInput.value = values.weight !== undefined && values.weight !== null ? values.weight : '';
        if (purityInput) purityInput.value = values.purity || '';
        metalRateInput.value = values.metalRate !== undefined && values.metalRate !== null ? values.metalRate : '';
        makingTypeSelect.value = values.makingChargeType || 'PER_GRAM';
        makingValueInput.value = values.makingChargeValue !== undefined && values.makingChargeValue !== null ? values.makingChargeValue : '0';
        taxableInput.value = values.taxableAmount !== undefined && values.taxableAmount !== null ? values.taxableAmount : '';
        taxableInput.dataset.manualOverride = values.taxableManual || existingSaleItemId > 0 ? '1' : '';
        qtyInput.value = '1';
        const hsn = row.querySelector('[data-hsn-code]');
        const huid = row.querySelector('[data-huid-code]');
        if (hsn) hsn.value = values.hsnCode || '';
        if (huid) huid.value = values.huidCode || '';
        if (values.productName) row.dataset.productName = values.productName;
        if (values.productMeta) row.dataset.productMeta = values.productMeta;
        recalcRow();
        updateLineSummary(row);
      }
    };
  }

  function setRowStatus(row, type, message) {
    const help = lineField(row, '[data-line-help]');
    if (help) {
      help.className = `line-help ${type}`;
      help.textContent = message;
    }
    if (type === 'error') {
      const meta = row.querySelector('[data-line-summary-meta]');
      if (meta) meta.textContent = message;
    }
  }

  function renumberRows() {
    rowsContainer.querySelectorAll('[data-line-item]').forEach((row, i) => {
      const num = row.querySelector('.line-number');
      if (num) num.textContent = i + 1;
    });
    rowCount = rowsContainer.querySelectorAll('[data-line-item]').length;
    updateItemCount();
  }

  function updateItemCount() {
    if (!itemCountEl) return;
    const count = rowsContainer.querySelectorAll('[data-line-item]').length;
    itemCountEl.textContent = `${count} item${count === 1 ? '' : 's'}`;
  }

  /* ── Live totals ─────────────────────────────────────────── */
  function updateFormTotals() {
    let subtotal = 0;
    // The row currently being edited is temporarily mounted inside the modal,
    // so calculate through each logical row rather than only descendant inputs.
    rowsContainer.querySelectorAll('[data-line-item]').forEach((row) => {
      subtotal += n(lineField(row, '[data-taxable-amount]')?.value);
    });

    subtotal = roundMoney(subtotal);
    const discount = roundMoney(n(discountInput ? discountInput.value : 0));
    const taxable = roundMoney(Math.max(0, subtotal - discount));
    const gst = roundMoney(taxable * 0.03);
    // Match the server exactly: GST is calculated first, then the final invoice is
    // rounded to the nearest whole rupee before payment/credit calculations.
    const beforeRoundOff = roundMoney(taxable + gst);
    const total = Math.round(beforeRoundOff);
    const roundOff = roundMoney(total - beforeRoundOff);
    const urdAdjustment = urdEnabled?.checked ? Math.max(0, n(urdAmount?.value)) : 0;
    const netPayable = Math.max(0, total - urdAdjustment);
    const netRefundable = Math.max(0, urdAdjustment - total);
    const nextIsUrdRefundable = netRefundable > 0.005;
    if (nextIsUrdRefundable) {
      if (paidInput) paidInput.value = '';
      if (cashPaidInput) cashPaidInput.value = '';
      if (upiPaidInput) upiPaidInput.value = '';
      if (cardPaidInput) cardPaidInput.value = '';
      if (bankPaidInput) bankPaidInput.value = '';
    }
    let paid = 0;
    if (paymentMethodInput?.value === 'MIXED') {
      const c = n(cashPaidInput?.value);
      const u = n(upiPaidInput?.value);
      const cd = n(cardPaidInput?.value);
      const b = n(bankPaidInput?.value);
      paid = c + u + cd + b;
      if (paidInput) {
        paidInput.value = paid > 0 ? paid.toFixed(2) : '';
      }
    } else {
      paid = n(paidInput ? paidInput.value : 0);
    }
    const balance = Math.max(0, netPayable - paid);

    if (subtotalEl) subtotalEl.textContent = fmt(subtotal);
    if (gstEl) gstEl.textContent = fmt(gst);
    if (roundOffEl) roundOffEl.textContent = fmt(roundOff);
    if (totalEl) totalEl.textContent = fmt(total);
    if (urdOffsetRow) urdOffsetRow.hidden = urdAdjustment <= 0;
    if (urdOffsetEl) urdOffsetEl.textContent = fmt(urdAdjustment);
    if (netPayableLabel) netPayableLabel.textContent = nextIsUrdRefundable ? 'Net Refundable' : 'Net Payable';
    if (netPayableEl) netPayableEl.textContent = fmt(nextIsUrdRefundable ? netRefundable : netPayable);
    if (balanceEl) {
      balanceEl.textContent = fmt(balance);
      const dueRow = balanceEl.closest('.summary-row');
      if (dueRow) dueRow.classList.toggle('has-balance', balance > 0.01);
    }
    if (nextIsUrdRefundable !== isUrdRefundable) {
      isUrdRefundable = nextIsUrdRefundable;
      updatePaymentMethodState();
    }
  }

  if (discountInput) discountInput.addEventListener('input', updateFormTotals);
  if (paidInput) paidInput.addEventListener('input', updateFormTotals);
  if (cashPaidInput) cashPaidInput.addEventListener('input', updateFormTotals);
  if (upiPaidInput) upiPaidInput.addEventListener('input', updateFormTotals);
  if (cardPaidInput) cardPaidInput.addEventListener('input', updateFormTotals);
  if (bankPaidInput) bankPaidInput.addEventListener('input', updateFormTotals);
  function updatePaymentMethodState() {
    if (!paymentMethodInput) return;
    const mixed = !isUrdRefundable && paymentMethodInput.value === 'MIXED';
    const isCredit = !isUrdRefundable && paymentMethodInput.value === 'CREDIT';
    if (splitPayment) {
      splitPayment.hidden = !mixed;
      splitPayment.style.display = mixed ? 'grid' : 'none';
    }
    if (cashPaidInput) cashPaidInput.disabled = !mixed;
    if (upiPaidInput) upiPaidInput.disabled = !mixed;
    if (cardPaidInput) cardPaidInput.disabled = !mixed;
    if (bankPaidInput) bankPaidInput.disabled = !mixed;
    if (paidInput) {
      paidInput.disabled = mixed || isUrdRefundable || isCredit;
      if (isCredit) {
        paidInput.value = '0.00';
      } else if (!mixed && !isUrdRefundable && (paidInput.value === '0.00' || paidInput.value === '0')) {
        paidInput.value = '';
      }
    }
    paymentMethodInput.disabled = isUrdRefundable;
    if (urdRefundMethodWrap) urdRefundMethodWrap.hidden = !isUrdRefundable;
    if (urdRefundMethodInput) urdRefundMethodInput.disabled = !isUrdRefundable;
    if (urdRefundNote) urdRefundNote.hidden = !isUrdRefundable;
  }

  if (paymentMethodInput) {
    paymentMethodInput.addEventListener('change', () => {
      updatePaymentMethodState();
      updateFormTotals();
    });
    updatePaymentMethodState();
  }

  function updateUrdRate() {
    if (!urdRate || !urdMetal) return;
    const rate = urdMetal.value === 'SILVER' ? n(urdRate.dataset.rateSilver)
      : urdPuritySelect?.value === '24K' ? n(urdRate.dataset.rate24)
        : n(urdRate.dataset.rate22);
    if (rate > 0) urdRate.value = rate.toFixed(2);
  }

  function syncUrdPurityControl() {
    if (!urdMetal || !urdPuritySelect || !urdPurityManual) return;
    const isManual = urdMetal.value !== 'GOLD';
    const fieldsEnabled = Boolean(urdEnabled?.checked);
    urdPuritySelect.hidden = isManual;
    urdPuritySelect.disabled = !fieldsEnabled || isManual;
    urdPurityManual.hidden = !isManual;
    urdPurityManual.disabled = !fieldsEnabled || !isManual;
    if (!isManual && !urdPuritySelect.value) urdPuritySelect.value = '22K';
  }

  function recalcUrdAmount() {
    if (!urdNetWeight || !urdRate || !urdAmount) return;
    urdAmount.value = (n(urdNetWeight.value) * n(urdRate.value)).toFixed(2);
    updateFormTotals();
  }

  function toggleUrdFields() {
    if (!urdFields || !urdEnabled) return;
    const enabled = urdEnabled.checked;
    urdFields.hidden = !enabled;
    urdFields.querySelectorAll('input, select, textarea').forEach((input) => { input.disabled = !enabled; });
    syncUrdPurityControl();
    // Existing invoices must retain their recorded URD rate and valuation
    // when the edit form first opens. New invoices and cashier changes still
    // calculate from the current selected rate exactly as before.
    if (enabled && !(isEditingSale && preservingInitialEditUrd)) { updateUrdRate(); recalcUrdAmount(); }
    updateFormTotals();
  }

  if (urdEnabled) urdEnabled.addEventListener('change', toggleUrdFields);
  if (urdMetal) urdMetal.addEventListener('change', () => {
    syncUrdPurityControl();
    updateUrdRate(); recalcUrdAmount();
  });
  if (urdPuritySelect) urdPuritySelect.addEventListener('change', () => { updateUrdRate(); recalcUrdAmount(); });
  if (urdPurityManual) urdPurityManual.addEventListener('input', recalcUrdAmount);
  if (urdGrossWeight && urdNetWeight) urdGrossWeight.addEventListener('input', () => { urdNetWeight.value = urdGrossWeight.value; recalcUrdAmount(); });
  if (urdNetWeight) urdNetWeight.addEventListener('input', recalcUrdAmount);
  if (urdRate) urdRate.addEventListener('input', recalcUrdAmount);
  if (urdAmount) urdAmount.addEventListener('input', updateFormTotals);

  if (lineEditorDone) {
    lineEditorDone.addEventListener('click', () => {
      const row = editingRow;
      if (!row) return;
      if (!lineField(row, '[data-product-id]')?.value && !lineField(row, '[data-sale-item-id]')?.value) {
        setRowStatus(row, 'error', 'Scan a valid barcode before adding this item to the bill.');
        lineEditorHost?.querySelector('[data-barcode]')?.focus();
        return;
      }
      closeLineEditor();
    });
  }
  lineEditorModal?.querySelectorAll('[data-line-editor-cancel]').forEach((button) => {
    button.addEventListener('click', () => closeLineEditor({ discardNew: true }));
  });
  lineEditorModal?.addEventListener('click', (event) => {
    if (event.target === lineEditorModal) closeLineEditor({ discardNew: true });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lineEditorModal?.style.display === 'flex') closeLineEditor({ discardNew: true });
  });

  const saleDraftKey = 'kusum-erp-sale-draft-v1';

  function nonLineDraftControls() {
    return Array.from(form.querySelectorAll('input, select, textarea')).filter((control) => (
      control.name &&
      control.name !== 'invoiceNumber' &&
      control.name !== 'gstRate' &&
      !control.closest('[data-line-item]') &&
      !control.closest('[data-line-editor]')
    ));
  }

  function snapshotLine(row) {
    const value = (selector) => lineField(row, selector)?.value || '';
    return {
      barcode: value('[data-barcode]'), productId: value('[data-product-id]'), saleItemId: value('[data-sale-item-id]'),
      weight: value('[data-weight]'), purity: value('[data-purity]'), metalRate: value('[data-metal-rate]'),
      makingChargeType: value('[data-making-type]'), makingChargeValue: value('[data-making-value]'),
      taxableAmount: value('[data-taxable-amount]'), taxableManual: Boolean(lineField(row, '[data-taxable-amount]')?.dataset.manualOverride),
      hsnCode: value('[data-hsn-code]'), huidCode: value('[data-huid-code]'),
      productName: row.dataset.productName || '', productMeta: row.dataset.productMeta || ''
    };
  }

  function saveSaleDraft() {
    if (isEditingSale || restoringDraft || discardingDraft) return;
    try {
      const controls = nonLineDraftControls().map((control) => ({
        value: control.value,
        checked: control.type === 'checkbox' ? control.checked : undefined
      }));
      const lines = Array.from(rowsContainer.querySelectorAll('[data-line-item]')).map(snapshotLine);
      sessionStorage.setItem(saleDraftKey, JSON.stringify({ savedAt: Date.now(), controls, lines }));
    } catch (_) {
      // Draft recovery is a convenience only; billing remains fully usable if
      // browser storage is unavailable.
    }
  }

  function scheduleDraftSave() {
    if (restoringDraft) return;
    clearTimeout(draftSaveTimer);
    draftSaveTimer = setTimeout(saveSaleDraft, 180);
  }

  async function restoreSaleDraft() {
    if (isEditingSale) return;
    let draft;
    try {
      draft = JSON.parse(sessionStorage.getItem(saleDraftKey) || 'null');
      if (!draft || Date.now() - Number(draft.savedAt || 0) > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem(saleDraftKey);
        return;
      }
    } catch (_) {
      return;
    }

    restoringDraft = true;
    const restoreControls = () => {
      const controls = nonLineDraftControls();
      draft.controls?.forEach((saved, index) => {
        const control = controls[index];
        if (!control) return;
        if (control.type === 'checkbox') control.checked = Boolean(saved.checked);
        else control.value = saved.value || '';
      });
    };
    restoreControls();
    toggleUrdFields();
    // Enabling URD chooses the current rate by default. Reapply the saved form
    // values afterwards so a cashier's manually entered rate is not lost.
    restoreControls();
    updatePaymentMethodState();

    for (const savedLine of draft.lines || []) {
      const row = addRow({ openEditor: false });
      await row._saleLine?.restore(savedLine);
    }

    updateAllLineSummaries();
    updateFormTotals();
    restoringDraft = false;
    const restoredPhone = form.querySelector('[data-customer-phone]');
    if (restoredPhone?.value) restoredPhone.dispatchEvent(new Event('input', { bubbles: true }));
    scheduleDraftSave();
  }

  form.addEventListener('input', scheduleDraftSave);
  form.addEventListener('change', scheduleDraftSave);
  window.addEventListener('pagehide', saveSaleDraft);
  document.querySelector('[data-discard-sale-draft]')?.addEventListener('click', () => {
    discardingDraft = true;
    try { sessionStorage.removeItem(saleDraftKey); } catch (_) { /* storage unavailable */ }
  });

  if (addRowBtn) {
    addRowBtn.addEventListener('click', addRow);
  }

  form.addEventListener('submit', (event) => {
    const rows = Array.from(rowsContainer.querySelectorAll('[data-line-item]'));
    if (!rows.length) {
      event.preventDefault();
      const row = addRow();
      setRowStatus(row, 'error', 'Add at least one barcode before generating the bill.');
      return;
    }
    const unresolved = rows.find((row) => {
      const barcode = lineField(row, '[data-barcode]')?.value.trim();
      const productId = lineField(row, '[data-product-id]')?.value;
      const saleItemId = lineField(row, '[data-sale-item-id]')?.value;
      return barcode && !productId && !saleItemId;
    });
    if (unresolved) {
      event.preventDefault();
      setRowStatus(unresolved, 'error', 'Wait for this barcode to load, or scan it again before saving.');
      lineField(unresolved, '[data-barcode]')?.focus();
      return;
    }

    const phoneInput = form.querySelector('[data-customer-phone]');
    const phoneDigits = (phoneInput?.value || '').replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10 || phoneDigits.length > 15) {
      event.preventDefault();
      alert('Enter a valid customer mobile number (10 to 15 digits).');
      phoneInput?.focus();
      return;
    }

    const nameInput = form.querySelector('[data-edit-customer-name], [data-customer-name]:not([disabled])');
    if (nameInput && !nameInput.value.trim()) {
      event.preventDefault();
      alert('Enter the customer name.');
      nameInput.focus();
      return;
    }

    const netPayableText = form.querySelector('[data-net-payable]')?.textContent || '0';
    const netPayableNum = n(netPayableText.replace(/[^0-9.-]+/g, ''));
    let totalPaidVal = 0;
    if (paymentMethodInput?.value === 'MIXED') {
      const c = n(cashPaidInput?.value);
      const u = n(upiPaidInput?.value);
      const cd = n(cardPaidInput?.value);
      const b = n(bankPaidInput?.value);
      totalPaidVal = c + u + cd + b;
    } else {
      totalPaidVal = n(paidInput ? paidInput.value : 0);
    }
    if (!isUrdRefundable && netPayableNum > 0 && totalPaidVal > netPayableNum + 0.5) {
      event.preventDefault();
      alert(`Amount received (₹${totalPaidVal.toFixed(2)}) cannot be greater than the net payable amount (₹${netPayableNum.toFixed(2)}).`);
      if (paymentMethodInput?.value === 'MIXED') {
        cashPaidInput?.focus();
      } else {
        paidInput?.focus();
      }
      return;
    }
  });

  async function restoreExistingSale() {
    if (!editSale) return;
    restoringDraft = true;
    for (const savedLine of editSale.items || []) {
      const row = addRow({ openEditor: false });
      await row._saleLine?.restore({ ...savedLine, taxableManual: true });
    }
    updateAllLineSummaries();
    updatePaymentMethodState();
    updateFormTotals();
    updateItemCount();
    restoringDraft = false;
  }

  if (isEditingSale) {
    const editPhoneInput = form.querySelector('[data-customer-phone]');
    const editNameInput = form.querySelector('[data-edit-customer-name]');
    const editPanInput = form.querySelector('[data-edit-customer-pan]');
    const editEmailInput = form.querySelector('[data-edit-customer-email]');
    const editAddressInput = form.querySelector('[data-edit-customer-address]');

    if (editPanInput) {
      editPanInput.addEventListener('input', () => {
        const upper = String(editPanInput.value || '').toUpperCase();
        if (editPanInput.value !== upper) editPanInput.value = upper;
      });
    }

    let editPhoneLookupTimer = null;
    if (editPhoneInput) {
      editPhoneInput.addEventListener('input', () => {
        clearTimeout(editPhoneLookupTimer);
        const digits = (editPhoneInput.value || '').replace(/\D/g, '');
        if (digits.length >= 10 && digits.length <= 15) {
          editPhoneLookupTimer = setTimeout(async () => {
            try {
              const resp = await fetch(`/api/customers/phone/${encodeURIComponent(digits)}`);
              if (!resp.ok) return;
              const data = await resp.json();
              if (data.found && data.customer) {
                if (editNameInput && !editNameInput.value) editNameInput.value = String(data.customer.name || '').toUpperCase();
                if (editPanInput && !editPanInput.value) editPanInput.value = String(data.customer.panNumber || '').toUpperCase();
                if (editEmailInput && !editEmailInput.value) editEmailInput.value = data.customer.email || '';
                if (editAddressInput && !editAddressInput.value) editAddressInput.value = String(data.customer.address || '').toUpperCase();
              }
            } catch (_) {}
          }, 350);
        }
      });
    }
  }

  toggleUrdFields();
  preservingInitialEditUrd = false;
  updateFormTotals();
  updateItemCount();
  if (isEditingSale) restoreExistingSale();
  else restoreSaleDraft();
})();

/* ═══════════════════════════════════════════════════════════════
   5. CUSTOMER DETAIL — payment form amount slider hint
   ═══════════════════════════════════════════════════════════════ */
(function initCustomerPayment() {
  const amountInput = document.querySelector('.receive-payment input[name="amount"]');
  if (!amountInput) return;

  const maxAmount = parseFloat(amountInput.max) || 0;
  const hint = document.createElement('small');
  hint.style.cssText = 'color:#a07928;margin-top:4px;display:block;';
  amountInput.parentElement.appendChild(hint);

  function updateHint() {
    const val = parseFloat(amountInput.value) || 0;
    if (val > 0 && maxAmount > 0) {
      const remaining = Math.max(0, maxAmount - val);
      hint.textContent = remaining > 0.01
        ? `Remaining credit after this payment: ${fmt(remaining)}`
        : `Full credit cleared ✓`;
    } else {
      hint.textContent = '';
    }
  }

  amountInput.addEventListener('input', updateHint);
  updateHint();
})();

/* ═══════════════════════════════════════════════════════════════
   7. INVENTORY LABEL BATCH — select multiple labels for one print run
   ═══════════════════════════════════════════════════════════════ */
function updateInventoryLabelBatchState() {
  const form = document.getElementById('label-print-form');
  const selections = Array.from(document.querySelectorAll('[data-label-select]')).filter((input) => !input.disabled);
  const selected = selections.filter((input) => input.checked);
  const selectAll = document.querySelector('[data-label-select-all]');
  const countEl = form?.querySelector('[data-label-count]');
  if (countEl) countEl.textContent = `${selected.length} selected`;
  document.querySelectorAll('[data-label-print-button]').forEach((button) => {
    button.disabled = selected.length === 0;
  });
  if (selectAll) {
    selectAll.checked = selections.length > 0 && selected.length === selections.length;
    selectAll.indeterminate = selected.length > 0 && selected.length < selections.length;
  }
}

(function initLabelBatch() {
  document.addEventListener('change', (event) => {
    if (event.target.matches('[data-label-select-all]')) {
      document.querySelectorAll('[data-label-select]').forEach((input) => {
        if (!input.disabled) input.checked = event.target.checked;
      });
      updateInventoryLabelBatchState();
    } else if (event.target.matches('[data-label-select]')) {
      updateInventoryLabelBatchState();
    }
  });
  updateInventoryLabelBatchState();
})();

/* ═══════════════════════════════════════════════════════════════
   ITEM NAME AUTOCOMPLETE — inventory form
   ═══════════════════════════════════════════════════════════════ */
(function initItemNameAutocomplete() {
  const nameInput = document.querySelector('[data-item-name-input]');
  const listEl = document.querySelector('[data-item-name-list]');
  const categoryInput = document.querySelector('[data-item-category-input]');
  if (!nameInput || !listEl) return;

  let debounceTimer = null;
  let highlighted = -1;
  let items = [];
  let isSelecting = false;
  let categoryManuallyEdited = Boolean(categoryInput && categoryInput.value && categoryInput.value !== nameInput.value);

  if (categoryInput) {
    categoryInput.addEventListener('input', () => {
      // If user clears category or types matching name, keep sync active; otherwise mark as manual edit
      categoryManuallyEdited = categoryInput.value.trim().length > 0 && categoryInput.value !== nameInput.value;
    });
  }

  function render() {
    if (isSelecting || !items.length) {
      close();
      return;
    }
    listEl.innerHTML = items.map((item, i) =>
      `<li data-index="${i}" class="${i === highlighted ? 'highlighted' : ''}">
        <strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category || '')}</small>
      </li>`
    ).join('');
    listEl.classList.add('open');
  }

  function select(index) {
    const item = items[index];
    if (!item) return;
    isSelecting = true;
    nameInput.value = item.name;
    if (categoryInput) {
      categoryInput.value = item.category || item.name;
      categoryManuallyEdited = false;
    }
    close();
    // Dispatch input event to trigger autoDetectMetal and form calculators
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => { isSelecting = false; }, 200);
  }

  function close() {
    items = [];
    highlighted = -1;
    listEl.classList.remove('open');
    listEl.innerHTML = '';
  }

  async function search(query) {
    if (isSelecting || query.length < 2) { close(); return; }
    try {
      const res = await fetch(`/api/item-names?q=${encodeURIComponent(query)}`);
      if (!res.ok || isSelecting) return;
      const data = await res.json();
      if (isSelecting) return;
      items = data;
      highlighted = -1;
      render();
    } catch (err) { /* silently fail */ }
  }

  nameInput.addEventListener('input', () => {
    if (categoryInput && !categoryManuallyEdited) {
      categoryInput.value = nameInput.value;
    }
    if (isSelecting) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!isSelecting) search(nameInput.value.trim());
    }, 200);
  });

  nameInput.addEventListener('keydown', (e) => {
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlighted = Math.min(highlighted + 1, items.length - 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlighted = Math.max(highlighted - 1, 0);
      render();
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      select(highlighted);
    } else if (e.key === 'Escape') {
      close();
    }
  });

  listEl.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const li = e.target.closest('li');
    if (!li) return;
    select(Number(li.dataset.index));
  });

  listEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    select(Number(li.dataset.index));
  });

  document.addEventListener('click', (e) => {
    if (!nameInput.contains(e.target) && !listEl.contains(e.target)) close();
  });

  nameInput.addEventListener('blur', () => {
    setTimeout(close, 180);
  });
})();

/* ═══════════════════════════════════════════════════════════════
   7. REPORT ITEM-WISE WEIGHT SEARCH & LIVE TOTALS
   ═══════════════════════════════════════════════════════════════ */
(function initReportItemSearch() {
  const searchInput = document.getElementById('reportItemSearchInput');
  const table = document.getElementById('reportItemsTable');
  const tbody = document.getElementById('reportItemsTbody');
  const noMatches = document.getElementById('reportNoMatches');
  const visibleCountEl = document.getElementById('reportVisibleCount');
  const totalPiecesEl = document.getElementById('reportTotalPieces');
  const totalNetEl = document.getElementById('reportTotalNet');
  const totalGrossEl = document.getElementById('reportTotalGross');

  if (!searchInput || !tbody) return;

  const rows = Array.from(tbody.querySelectorAll('[data-item-row]'));

  function fmtGrams(val) {
    return Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }) + ' g';
  }

  function filter() {
    const q = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;
    let totalPieces = 0;
    let totalNet = 0;
    let totalGross = 0;

    rows.forEach((row) => {
      const searchTarget = row.dataset.search || '';
      const match = !q || searchTarget.includes(q);
      row.style.display = match ? '' : 'none';
      if (match) {
        visibleCount++;
        totalPieces += parseInt(row.dataset.pieces, 10) || 0;
        totalNet += parseFloat(row.dataset.netTotal) || 0;
        totalGross += parseFloat(row.dataset.grossTotal) || 0;
      }
    });

    if (visibleCountEl) visibleCountEl.textContent = visibleCount;
    if (totalPiecesEl) totalPiecesEl.textContent = totalPieces;
    if (totalNetEl) totalNetEl.textContent = fmtGrams(totalNet);
    if (totalGrossEl) totalGrossEl.textContent = fmtGrams(totalGross);

    if (noMatches) noMatches.style.display = visibleCount === 0 ? '' : 'none';
    if (table) {
      const tfoot = table.querySelector('tfoot');
      if (tfoot) tfoot.style.display = visibleCount === 0 ? 'none' : '';
    }
  }

  searchInput.addEventListener('input', filter);
})();

/* ═══════════════════════════════════════════════════════════════
   8. FAST BATCH INVENTORY PIECE ADDER MODAL
   ═══════════════════════════════════════════════════════════════ */
(function initBatchInventoryModal() {
  const modal = document.getElementById('batchPieceModal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('[data-batch-modal-close]');
  const closeRefreshBtn = modal.querySelector('[data-batch-close-refresh]');

  // Inputs & elements
  const nameInput = document.getElementById('batchItemName');
  const nameList = modal.querySelector('[data-batch-name-list]');
  const categoryInput = document.getElementById('batchCategory');
  const metalSel = document.getElementById('batchMetal');
  const puritySel = document.getElementById('batchPurity');
  const makingTypeSel = document.getElementById('batchMakingType');
  const makingValueInput = document.getElementById('batchMakingValue');
  const locationInput = document.getElementById('batchLocation');
  const rateTextEl = modal.querySelector('[data-batch-rate-text]');

  const grossWeightInput = document.getElementById('batchGrossWeight');
  const stoneWeightInput = document.getElementById('batchStoneWeight');
  const netWeightInput = document.getElementById('batchNetWeight');
  const addPieceBtn = document.getElementById('batchAddPieceBtn');
  const feedbackEl = document.getElementById('batchFeedback');

  const statsCountEl = modal.querySelector('[data-batch-stats-count]');
  const statsWeightEl = modal.querySelector('[data-batch-stats-weight]');
  const statsValueEl = modal.querySelector('[data-batch-stats-value]');
  const selectAllCb = modal.querySelector('[data-batch-select-all]');
  const clearListBtn = modal.querySelector('[data-batch-clear-list]');
  const printBtn = document.getElementById('batchPrintBtn');
  const tbody = modal.querySelector('[data-batch-items-tbody]');

  // Purity options
  const purityOptions = {
    GOLD: [
      { value: '22K', label: '22K Gold' },
      { value: '24K', label: '24K Gold' },
    ],
    SILVER: [
      { value: '', label: 'Not specified' },
    ],
    PLATINUM: [
      { value: 'PT950', label: 'Platinum 950' },
    ],
    OTHER: [
      { value: '', label: 'Standard / None' },
    ],
  };

  let sessionPieces = [];
  let liveRates = null;
  let isSelectingAutocomplete = false;
  let editingPieceId = null;

  // Batch doc elements
  const docNoInput = document.getElementById('batchDocNoInput');
  const newDocBtn = document.getElementById('batchNewDocBtn');
  const loadDocBtn = document.getElementById('batchLoadDocBtn');
  const loadModal = document.getElementById('batchLoadDocModal');
  const loadModalCloseBtn = document.getElementById('batchLoadDocCloseBtn');
  const loadModalCancelBtn = document.getElementById('batchLoadDocCancelBtn');
  const docListTbody = document.getElementById('batchDocListTbody');

  const entryPanel = document.getElementById('batchEntryPanel');
  const entryTitle = document.getElementById('batchEntryTitle');
  const entrySubtitle = document.getElementById('batchEntrySubtitle');
  const editingBanner = document.getElementById('batchEditingBanner');
  const editingBarcodeEl = document.getElementById('batchEditingBarcode');
  const cancelEditBtn = document.getElementById('batchCancelEditBtn');

  // Fetch rates
  async function fetchLiveRates() {
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        liveRates = data.rate;
        updateRateDisplay();
      }
    } catch (_) { }
  }

  // A document number is allocated with the first database save, never by
  // opening this popup. This prevents skipped or duplicated batch numbers.
  function clearNewBatchDocument() {
    if (!docNoInput) return;
    docNoInput.value = '';
    docNoInput.placeholder = 'Assigned on first piece';
    docNoInput.title = 'A unique batch document number is assigned when the first piece is saved.';
  }

  function updatePurities() {
    const metal = metalSel.value;
    const opts = purityOptions[metal] || purityOptions.OTHER;
    puritySel.innerHTML = '';
    opts.forEach((o, i) => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      if (i === 0) opt.selected = true;
      puritySel.appendChild(opt);
    });
    updateRateDisplay();
  }

  function updateRateDisplay() {
    if (!rateTextEl) return;
    if (!liveRates) {
      rateTextEl.textContent = 'Live Rate: Check daily rates';
      return;
    }
    const metal = metalSel.value;
    const purity = puritySel.value;
    let rate = 0;
    if (metal === 'GOLD') {
      rate = purity === '24K' ? Number(liveRates.gold24k) : Number(liveRates.gold22k);
    } else if (metal === 'SILVER') {
      rate = Number(liveRates.silver);
    }
    rateTextEl.textContent = rate > 0
      ? `Live Rate (${metal} ${purity}): ₹${rate.toFixed(2)}/g`
      : `Live Rate: Custom metal pricing`;
  }

  function autoDetectMetal(nameText) {
    if (!nameText || !metalSel || editingPieceId) return;
    const lower = nameText.toLowerCase();
    if (lower.includes('silver') || lower.includes('chandi')) {
      if (metalSel.value !== 'SILVER') {
        metalSel.value = 'SILVER';
        updatePurities();
      }
    } else if (lower.includes('gold') || lower.includes('sona')) {
      if (metalSel.value !== 'GOLD') {
        metalSel.value = 'GOLD';
        updatePurities();
      }
    } else if (lower.includes('platinum')) {
      if (metalSel.value !== 'PLATINUM') {
        metalSel.value = 'PLATINUM';
        updatePurities();
      }
    }
  }

  // Autocomplete for master item names
  let debounceTimer = null;
  function searchItemNames(q) {
    clearTimeout(debounceTimer);
    if (!q || q.length < 1) {
      if (nameList) { nameList.innerHTML = ''; nameList.classList.remove('open'); }
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/item-names?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const items = await res.json();
        if (!nameList) return;
        nameList.innerHTML = '';
        if (items.length === 0) {
          nameList.classList.remove('open');
          return;
        }
        items.forEach((item) => {
          const li = document.createElement('li');
          li.className = 'autocomplete-item';
          replaceWithTextElements(li, [
            { tag: 'strong', text: item.name },
            { tag: 'small', text: item.category }
          ]);
          li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isSelectingAutocomplete = true;
            nameInput.value = item.name;
            if (categoryInput) {
              categoryInput.value = item.category || item.name;
              batchCategoryManuallyEdited = false;
            }
            autoDetectMetal(item.name);
            nameList.innerHTML = '';
            nameList.classList.remove('open');
            setTimeout(() => { isSelectingAutocomplete = false; }, 150);
            if (grossWeightInput) grossWeightInput.focus();
          });
          nameList.appendChild(li);
        });
        nameList.classList.add('open');
      } catch (_) { }
    }, 180);
  }

  let batchCategoryManuallyEdited = Boolean(categoryInput && categoryInput.value && categoryInput.value !== nameInput?.value);
  if (categoryInput) {
    categoryInput.addEventListener('input', () => {
      batchCategoryManuallyEdited = categoryInput.value.trim().length > 0 && categoryInput.value !== (nameInput ? nameInput.value : '');
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (categoryInput && !batchCategoryManuallyEdited) {
        categoryInput.value = nameInput.value;
      }
      if (!isSelectingAutocomplete) {
        searchItemNames(nameInput.value.trim());
      }
      autoDetectMetal(nameInput.value);
    });
    nameInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (nameList) nameList.classList.remove('open');
      }, 200);
    });
  }

  metalSel?.addEventListener('change', updatePurities);
  puritySel?.addEventListener('change', updateRateDisplay);

  // Weight auto-sync
  function syncWeights() {
    const gross = parseFloat(grossWeightInput.value) || 0;
    const stone = parseFloat(stoneWeightInput.value) || 0;
    const net = Math.max(0, gross - stone);
    netWeightInput.value = net > 0 ? net.toFixed(3) : '';
  }

  grossWeightInput?.addEventListener('input', syncWeights);
  stoneWeightInput?.addEventListener('input', syncWeights);

  // Edit mode helpers
  function enterEditMode(piece) {
    editingPieceId = piece.id;
    if (editingBanner) {
      editingBanner.style.display = 'flex';
      if (editingBarcodeEl) editingBarcodeEl.textContent = piece.barcode;
    }
    if (entryPanel) entryPanel.classList.add('is-editing');
    if (entryTitle) entryTitle.textContent = 'Edit Piece Details';
    if (entrySubtitle) entrySubtitle.textContent = '(Update weight and press Enter ↵ to save)';
    if (addPieceBtn) addPieceBtn.textContent = '💾 Save Updates ↵';
    if (metalSel) metalSel.disabled = true;

    grossWeightInput.value = Number(piece.grossWeight || piece.netWeight).toFixed(3);
    stoneWeightInput.value = Number(piece.stoneWeight || 0).toFixed(3);
    netWeightInput.value = Number(piece.netWeight).toFixed(3);

    if (makingTypeSel && piece.makingChargeType) makingTypeSel.value = piece.makingChargeType;
    if (makingValueInput && piece.makingChargeValue !== undefined) makingValueInput.value = piece.makingChargeValue;

    grossWeightInput.focus();
    grossWeightInput.select();
  }

  function exitEditMode() {
    editingPieceId = null;
    if (editingBanner) editingBanner.style.display = 'none';
    if (entryPanel) entryPanel.classList.remove('is-editing');
    if (entryTitle) entryTitle.textContent = 'Weight Entry';
    if (addPieceBtn) addPieceBtn.textContent = '+ Add Piece ↵';
    if (metalSel) metalSel.disabled = false;

    grossWeightInput.value = '';
    netWeightInput.value = '';
    grossWeightInput.focus();
  }

  cancelEditBtn?.addEventListener('click', exitEditMode);

  // Open modal
  function openModal() {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    fetchLiveRates();
    updatePurities();
    if (!docNoInput.value) clearNewBatchDocument();
    setTimeout(() => {
      if (nameInput && !nameInput.value) {
        nameInput.focus();
      } else if (grossWeightInput) {
        grossWeightInput.focus();
      }
    }, 100);
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    if (editingPieceId) exitEditMode();
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-open-batch-modal]')) openModal();
  });
  closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));

  closeRefreshBtn?.addEventListener('click', () => {
    closeModal();
    if (sessionPieces.length > 0) {
      window.location.href = '/inventory';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (loadModal && loadModal.style.display === 'flex') {
        closeLoadDocModal();
      } else if (modal.style.display === 'flex') {
        if (editingPieceId) {
          exitEditMode();
        } else {
          closeModal();
        }
      }
    }
  });

  // Start new Batch Document
  newDocBtn?.addEventListener('click', () => {
    if (sessionPieces.length > 0) {
      if (!confirm(`Start a fresh Batch Document? All ${sessionPieces.length} items are safely saved under ${docNoInput.value}.`)) return;
    }
    sessionPieces = [];
    if (editingPieceId) exitEditMode();
    clearNewBatchDocument();
    renderTable();
  });

  // Load Batch Doc Modal controls
  function openLoadDocModal() {
    if (!loadModal) return;
    loadModal.style.display = 'flex';
    loadModal.setAttribute('aria-hidden', 'false');
    fetchBatchDocsList();
  }

  function closeLoadDocModal() {
    if (!loadModal) return;
    loadModal.style.display = 'none';
    loadModal.setAttribute('aria-hidden', 'true');
  }

  loadDocBtn?.addEventListener('click', openLoadDocModal);
  loadModalCloseBtn?.addEventListener('click', closeLoadDocModal);
  loadModalCancelBtn?.addEventListener('click', closeLoadDocModal);

  async function fetchBatchDocsList() {
    if (!docListTbody) return;
    docListTbody.innerHTML = '<tr><td colspan="6" class="center muted" style="padding: 24px;">Loading batch documents...</td></tr>';
    try {
      const res = await fetch('/api/inventory/batch-docs');
      if (!res.ok) throw new Error('Failed to load batch list');
      const data = await res.json();
      if (!data.docs || data.docs.length === 0) {
        docListTbody.innerHTML = '<tr><td colspan="6" class="center muted" style="padding: 28px;">No Batch Documents found yet. Create one by adding pieces!</td></tr>';
        return;
      }
      docListTbody.innerHTML = data.docs.map((d) => `
        <tr style="background:#ffffff;">
          <td style="padding:10px 12px;"><strong style="font-family:monospace;font-size:13px;color:#9d6512;">${escapeHtml(d.batchDocNo)}</strong></td>
          <td style="padding:10px 12px;"><strong style="color:#1a1612;display:block;">${escapeHtml(d.name || 'Jewellery Pieces')}</strong><small style="color:#7d7265;font-size:11.5px;">${escapeHtml(`${d.metal || ''} ${d.purity || ''}`)}</small></td>
          <td class="right" style="padding:10px 12px;"><strong style="color:#1a1612;">${d.pieceCount}</strong></td>
          <td class="right" style="padding:10px 12px;color:#1a1612;font-weight:600;">${Number(d.totalWeight).toFixed(3)}g</td>
          <td class="right" style="padding:10px 12px;color:#1a1612;font-weight:700;">${fmt(d.totalValue)}</td>
          <td class="center" style="padding:10px 12px;">
            <button type="button" class="button small accent" data-load-batch-btn="${escapeHtml(d.batchDocNo)}" style="padding:4px 11px;font-size:11.5px;font-weight:700;background:#b47a21;color:#fff;border:none;border-radius:6px;">
              Load &amp; Print →
            </button>
          </td>
        </tr>
      `).join('');

      docListTbody.querySelectorAll('[data-load-batch-btn]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const docNo = btn.dataset.loadBatchBtn;
          loadBatchDocument(docNo);
        });
      });

    } catch (err) {
      docListTbody.innerHTML = `<tr><td colspan="6" class="center text-danger" style="padding: 20px;">Error loading batches: ${escapeHtml(err.message)}</td></tr>`;
    }
  }

  async function loadBatchDocument(batchDocNo, silent = false) {
    try {
      const res = await fetch(`/api/inventory/batch-docs/${encodeURIComponent(batchDocNo)}`);
      if (!res.ok) throw new Error('Failed to load batch details');
      const data = await res.json();
      sessionPieces = data.products || [];
      if (docNoInput) docNoInput.value = batchDocNo;

      if (sessionPieces.length > 0 && !silent) {
        const first = sessionPieces[0];
        if (nameInput && first.name) nameInput.value = first.name;
        if (categoryInput && first.category) categoryInput.value = first.category;
        if (metalSel && first.metal) {
          metalSel.value = first.metal;
          updatePurities();
          if (puritySel && first.purity) puritySel.value = first.purity;
        }
        if (makingTypeSel && first.makingChargeType) makingTypeSel.value = first.makingChargeType;
        if (makingValueInput && first.makingChargeValue !== undefined) makingValueInput.value = first.makingChargeValue;
        if (locationInput && first.location) locationInput.value = first.location;
      }

      if (!silent) closeLoadDocModal();
      renderTable();
      updateRateDisplay();

      if (feedbackEl && !silent) {
        feedbackEl.style.display = 'inline-block';
        feedbackEl.textContent = `✓ Loaded ${sessionPieces.length} pieces from ${batchDocNo}`;
        setTimeout(() => { feedbackEl.style.display = 'none'; }, 4000);
      }

    } catch (err) {
      if (!silent) alert(`Could not load batch: ${err.message}`);
    }
  }
  window.loadBatchDocument = loadBatchDocument;

  // Save piece (Add new or Update existing)
  async function savePiece() {
    const name = nameInput.value.trim();
    const category = categoryInput.value.trim();
    const metal = metalSel.value;
    const purity = puritySel.value;
    const grossWeight = parseFloat(grossWeightInput.value) || 0;
    const stoneWeight = parseFloat(stoneWeightInput.value) || 0;
    let netWeight = parseFloat(netWeightInput.value) || 0;
    if (netWeight <= 0 && grossWeight > 0) {
      netWeight = Math.max(0, grossWeight - stoneWeight);
    }
    const makingChargeType = makingTypeSel.value;
    const makingChargeValue = parseFloat(makingValueInput.value) || 0;
    const location = locationInput ? locationInput.value.trim() : '';
    const batchDocNo = docNoInput ? docNoInput.value.trim() : '';

    if (!name) {
      alert('Please enter an item name.');
      nameInput.focus();
      return;
    }
    if (!category) {
      alert('Please enter a category.');
      categoryInput.focus();
      return;
    }
    if (netWeight <= 0) {
      alert('Please enter a valid weight.');
      grossWeightInput.focus();
      return;
    }

    addPieceBtn.disabled = true;
    addPieceBtn.textContent = editingPieceId ? 'Updating...' : 'Saving...';

    try {
      if (editingPieceId) {
        // Update existing piece
        const res = await fetch(`/api/inventory/batch-piece/${editingPieceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            category,
            metal,
            purity,
            grossWeight,
            stoneWeight,
            netWeight,
            makingChargeType,
            makingChargeValue,
            location
          })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update piece.');

        const idx = sessionPieces.findIndex((p) => p.id === editingPieceId);
        if (idx !== -1) {
          sessionPieces[idx] = { ...data.product, isUpdated: true };
        }
        renderTable();

        if (feedbackEl) {
          feedbackEl.style.display = 'inline-block';
          feedbackEl.textContent = `✓ ${data.product.barcode} updated (${netWeight.toFixed(3)}g)`;
          setTimeout(() => { feedbackEl.style.display = 'none'; }, 3500);
        }

        exitEditMode();

      } else {
        // Create new piece
        const res = await fetch('/api/inventory/batch-piece', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            category,
            metal,
            purity,
            grossWeight,
            stoneWeight,
            netWeight,
            makingChargeType,
            makingChargeValue,
            location,
            batchDocNo
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add piece.');

        const p = data.product;
        sessionPieces.unshift(p);
        if (docNoInput && p.batchDocNo) docNoInput.value = p.batchDocNo;
        renderTable();

        if (feedbackEl) {
          feedbackEl.style.display = 'inline-block';
          feedbackEl.textContent = `✓ ${p.barcode} added (${netWeight.toFixed(3)}g)`;
          setTimeout(() => { feedbackEl.style.display = 'none'; }, 3500);
        }

        grossWeightInput.value = '';
        netWeightInput.value = '';
        grossWeightInput.focus();
      }

    } catch (err) {
      alert(err.message || 'Could not save piece.');
    } finally {
      addPieceBtn.disabled = false;
      addPieceBtn.textContent = editingPieceId ? '💾 Save Updates ↵' : '+ Add Piece ↵';
    }
  }

  const weightForm = document.getElementById('batchWeightForm');
  weightForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    savePiece();
  });
  addPieceBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    savePiece();
  });

  // Delete piece
  async function deletePiece(id) {
    const p = sessionPieces.find((item) => item.id === id);
    if (!p) return;
    if (!confirm(`Delete piece ${p.barcode} (${Number(p.netWeight).toFixed(3)}g) from inventory?`)) return;

    try {
      const res = await fetch(`/api/inventory/batch-piece/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete piece.');

      sessionPieces = sessionPieces.filter((item) => item.id !== id);
      if (editingPieceId === id) exitEditMode();
      renderTable();

      if (feedbackEl) {
        feedbackEl.style.display = 'inline-block';
        feedbackEl.textContent = `✓ ${p.barcode} deleted`;
        setTimeout(() => { feedbackEl.style.display = 'none'; }, 3000);
      }
    } catch (err) {
      alert(err.message || 'Could not delete piece.');
    }
  }

  // Render added pieces table
  function renderTable() {
    if (!tbody) return;

    if (sessionPieces.length === 0) {
      tbody.innerHTML = `
        <tr class="batch-empty-row">
          <td colspan="9" class="center muted" style="padding: 36px 16px;">
            No pieces in this Batch Document yet.<br>Enter Gross Weight on the left and press <strong>Enter ↵</strong> to begin!
          </td>
        </tr>`;
      if (statsCountEl) statsCountEl.textContent = '0';
      if (statsWeightEl) statsWeightEl.textContent = '0.000';
      if (statsValueEl) statsValueEl.textContent = '₹0.00';
      modal.querySelectorAll('[data-batch-print-tspl]').forEach((btn) => {
        btn.disabled = true;
      });
      return;
    }

    let totalWeight = 0;
    let totalValue = 0;

    tbody.innerHTML = sessionPieces.map((p) => {
      totalWeight += Number(p.netWeight) || 0;
      totalValue += Number(p.sellingPrice) || 0;
      const statusHtml = p.isUpdated
        ? '<span class="pill warning" style="font-size:11px;padding:2px 6px;">Updated ✓</span>'
        : '<span class="pill success" style="font-size:11px;padding:2px 6px;">Saved ✓</span>';

      return `
        <tr data-piece-id="${p.id}">
          <td class="label-select" style="text-align:center;">
            <input type="checkbox" data-batch-item-cb value="${p.id}" checked>
          </td>
          <td><span class="batch-barcode-pill">${escapeHtml(p.barcode)}</span></td>
          <td><strong>${escapeHtml(p.name)}</strong></td>
          <td><span class="metal-dot ${escapeHtml((p.metal || '').toLowerCase())}"></span>${escapeHtml(p.metal)}</td>
          <td class="right"><strong>${Number(p.netWeight).toFixed(3)}g</strong></td>
          <td><small>${escapeHtml(p.makingChargeType === 'PERCENTAGE' ? `${p.makingChargeValue}%` : p.makingChargeType === 'FIXED' ? `₹${p.makingChargeValue} fixed` : `₹${p.makingChargeValue}/g`)}</small></td>
          <td class="right"><strong>${escapeHtml(p.formattedSellingPrice || fmt(p.sellingPrice))}</strong></td>
          <td class="center">${statusHtml}</td>
          <td class="center" style="white-space:nowrap;">
            <button type="button" class="batch-action-btn" data-batch-edit-btn="${p.id}" title="Edit weight or details">✎ Edit</button>
            <button type="button" class="batch-action-btn delete" data-batch-delete-btn="${p.id}" title="Delete piece">✕</button>
          </td>
        </tr>`;
    }).join('');

    function updateSelectedCount() {
      const selectedCountEl = modal.querySelector('[data-batch-selected-count]');
      const printerInput = modal.querySelector('input[name="batchPrinterName"]');
      const pName = printerInput ? printerInput.value : 'TSC TTP-244 Pro';
      const checkedCount = tbody.querySelectorAll('[data-batch-item-cb]:checked').length;
      if (selectedCountEl) {
        selectedCountEl.textContent = `${checkedCount} selected`;
      }
      modal.querySelectorAll('[data-batch-print-tspl]').forEach((btn) => {
        btn.disabled = checkedCount === 0;
        btn.textContent = `Send to ${pName}`;
      });
    }

    if (statsCountEl) statsCountEl.textContent = sessionPieces.length;
    if (statsWeightEl) statsWeightEl.textContent = totalWeight.toFixed(3);
    if (statsValueEl) statsValueEl.textContent = fmt(totalValue);
    updateSelectedCount();

    // Wire individual checkboxes
    tbody.querySelectorAll('[data-batch-item-cb]').forEach((cb) => {
      cb.addEventListener('change', updateSelectedCount);
    });

    // Wire action buttons
    tbody.querySelectorAll('[data-batch-edit-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.batchEditBtn);
        const piece = sessionPieces.find((item) => item.id === id);
        if (piece) enterEditMode(piece);
      });
    });

    tbody.querySelectorAll('[data-batch-delete-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.batchDeleteBtn);
        deletePiece(id);
      });
    });
  }

  // Select all checkbox
  selectAllCb?.addEventListener('change', () => {
    const cbs = tbody.querySelectorAll('[data-batch-item-cb]');
    cbs.forEach((cb) => { cb.checked = selectAllCb.checked; });
    const selectedCountEl = modal.querySelector('[data-batch-selected-count]');
    const printerInput = modal.querySelector('input[name="batchPrinterName"]');
    const pName = printerInput ? printerInput.value : 'TSC TTP-244 Pro';
    const checkedCount = selectAllCb.checked ? cbs.length : 0;
    if (selectedCountEl) selectedCountEl.textContent = `${checkedCount} selected`;
    modal.querySelectorAll('[data-batch-print-tspl]').forEach((btn) => {
      btn.disabled = checkedCount === 0;
      btn.textContent = `Send to ${pName}`;
    });
  });

  // Clear list
  clearListBtn?.addEventListener('click', () => {
    if (sessionPieces.length === 0) return;
    if (confirm('Clear the session list from this screen? (Saved pieces will remain safely in your database).')) {
      sessionPieces = [];
      if (editingPieceId) exitEditMode();
      renderTable();
    }
  });

  // Direct TSPL Label Printing for this session only
  async function printSessionLabels() {
    const checked = Array.from(tbody.querySelectorAll('[data-batch-item-cb]:checked')).map((cb) => Number(cb.value));
    if (checked.length === 0) {
      alert('Please select at least one piece to print barcodes.');
      return;
    }

    const printBtns = modal.querySelectorAll('[data-batch-print-tspl]');
    const printerInput = modal.querySelector('input[name="batchPrinterName"]');
    const pName = printerInput ? printerInput.value : 'TSC TTP-244 Pro';
    printBtns.forEach((btn) => {
      btn.disabled = true;
      btn.textContent = 'Sending to printer...';
    });

    try {
      const res = await fetch('/labels/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: checked, copies: 1, isJson: true })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to print labels.');
      }
      alert(`${data.message || `${checked.length} barcode labels sent to ${pName}!`}`);
    } catch (err) {
      alert(`Printer response: ${err.message}`);
    } finally {
      printBtns.forEach((btn) => {
        btn.disabled = checked.length === 0;
        btn.textContent = `Send to ${pName}`;
      });
    }
  }

  modal.querySelectorAll('[data-batch-print-tspl]').forEach((btn) => {
    btn.addEventListener('click', printSessionLabels);
  });

  // Refresh batch items from database
  async function handleBatchRefresh() {
    const docNo = docNoInput?.value?.trim();
    const refBtns = [document.getElementById('batchRefreshBtn'), document.getElementById('batchRefreshBtnFooter')].filter(Boolean);
    refBtns.forEach((b) => { b.disabled = true; b.textContent = 'Refreshing...'; });
    try {
      if (docNo) {
        await loadBatchDocument(docNo, false);
      } else {
        await fetchLiveRates();
      }
    } catch (_) {
    } finally {
      refBtns.forEach((b) => { b.disabled = false; b.textContent = 'Refresh'; });
    }
  }

  document.getElementById('batchRefreshBtn')?.addEventListener('click', handleBatchRefresh);
  document.getElementById('batchRefreshBtnFooter')?.addEventListener('click', handleBatchRefresh);

  // Check printer connectivity live
  const checkPrinterBtn = document.getElementById('batchCheckPrinterBtn');
  const printerStatusText = document.getElementById('batchPrinterStatusText');
  const printerDot = document.getElementById('batchPrinterDot');

  checkPrinterBtn?.addEventListener('click', async () => {
    checkPrinterBtn.disabled = true;
    checkPrinterBtn.textContent = 'Checking...';
    try {
      const res = await fetch('/api/printer/check');
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success && data.status) {
        const status = data.status;
        if (data.status.available === true) {
          if (printerDot) printerDot.style.color = '#2e7d32';
          if (printerStatusText) printerStatusText.innerHTML = `Printer ready: <strong>${escapeHtml(status.name)}</strong>`;
        } else if (data.status.available === false) {
          if (printerDot) printerDot.style.color = '#c62828';
          if (printerStatusText) printerStatusText.innerHTML = `<span style="color:#c62828;">Not connected: ${escapeHtml(status.name)}</span>`;
        } else {
          if (printerDot) printerDot.style.color = '#f57f17';
          if (printerStatusText) printerStatusText.innerHTML = `Queue: <strong>${escapeHtml(status.name)}</strong>`;
        }
        alert(status.message || `Printer status: ${status.name} is configured.`);
      } else {
        throw new Error(data.error || 'Check failed');
      }
    } catch (err) {
      alert(`Printer notice: ${err.message}`);
    } finally {
      checkPrinterBtn.disabled = false;
      checkPrinterBtn.textContent = 'Check printer';
    }
  });
})();

// ── Mobile Responsive Navigation Toggle ───────────────────────
(function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (!toggleBtn || !sidebar || !backdrop) return;

  function toggleSidebar(open) {
    const isOpen = open !== undefined ? open : !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', isOpen);
    backdrop.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  backdrop.addEventListener('click', () => {
    toggleSidebar(false);
  });

  sidebar.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        toggleSidebar(false);
      }
    });
  });
})();

// ── Master Item Names Add Form Auto-Sync ──────────────────────
(function initAddItemNameAutoSync() {
  const form = document.getElementById('addItemNameForm');
  if (!form) return;
  const nameInput = form.querySelector('input[name="name"]');
  const catInput = form.querySelector('input[name="category"]');
  if (!nameInput || !catInput) return;
  let manuallyEdited = Boolean(catInput.value && catInput.value !== nameInput.value);
  catInput.addEventListener('input', () => {
    manuallyEdited = catInput.value.trim().length > 0 && catInput.value !== nameInput.value;
  });
  nameInput.addEventListener('input', () => {
    if (!manuallyEdited) {
      catInput.value = nameInput.value;
    }
  });
})();

// ── Customer Profile Editor ───────────────────────────────────
(function initCustomerEditModal() {
  const modal = document.getElementById('customerEditModal');
  const openButton = document.querySelector('[data-customer-edit-open]');
  if (!modal || !openButton) return;

  const closeButtons = modal.querySelectorAll('[data-customer-edit-close]');
  const firstField = modal.querySelector('input[name="name"]');
  let previousFocus = null;

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    previousFocus?.focus();
  }

  openButton.addEventListener('click', () => {
    previousFocus = document.activeElement;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => firstField?.focus(), 0);
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeModal));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
})();

// ── Inventory Printer Setup ──────────────────────────────────
(function initInventoryPrinterSetupModal() {
  const modal = document.getElementById('printerSetupModal');
  const openButton = document.querySelector('[data-printer-setup-open]');
  const form = document.getElementById('inventory-printer-setup-form');
  if (!modal || !openButton || !form) return;

  const windowsFields = form.querySelector('[data-windows-printer-fields]');
  const tcpFields = form.querySelector('[data-tcp-printer-fields]');
  let previousFocus = null;

  function updateTransportFields() {
    const selected = form.querySelector('input[name="printerMode"]:checked');
    const directTcp = selected?.value === 'TCP';
    windowsFields.hidden = directTcp;
    tcpFields.hidden = !directTcp;
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    previousFocus?.focus();
  }

  openButton.addEventListener('click', () => {
    previousFocus = document.activeElement;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    updateTransportFields();
    setTimeout(() => form.querySelector('input[name="printerMode"]:checked')?.focus(), 0);
  });

  form.querySelectorAll('input[name="printerMode"]').forEach((input) => input.addEventListener('change', updateTransportFields));
  modal.querySelectorAll('[data-printer-setup-close]').forEach((button) => button.addEventListener('click', closeModal));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
  updateTransportFields();
})();

// ── Network Connection Change Confirmation ───────────────────
(function initConnectionRepairModal() {
  const modal = document.getElementById('connectionRepairModal');
  const openButton = document.querySelector('[data-connection-repair-open]');
  if (!modal || !openButton) return;

  let previousFocus = null;
  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    previousFocus?.focus();
  }

  openButton.addEventListener('click', () => {
    previousFocus = document.activeElement;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => modal.querySelector('[data-connection-repair-close]')?.focus(), 0);
  });

  modal.querySelectorAll('[data-connection-repair-close]').forEach((button) => button.addEventListener('click', closeModal));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
})();
