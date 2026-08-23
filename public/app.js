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

  // Purity options per metal
  const purityOptions = {
    GOLD: [
      { value: '22K', label: '22K Gold' },
      { value: '24K', label: '24K Gold' },
    ],
    SILVER: [
      { value: '925', label: 'Silver 925' },
      { value: 'PURE', label: 'Pure Silver' },
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
    const p = String(purity || '').toUpperCase().replace(/\s/g, '');
    if (metal === 'GOLD' && p === '24K') return 'G24';
    if (metal === 'GOLD') return 'G22';
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
    puritySel.innerHTML = opts.map((o) =>
      `<option value="${o.value}"${o.value === current ? ' selected' : ''}>${o.label}</option>`
    ).join('');
  }

  function updateReadouts() {
    const metal = metalSel ? metalSel.value : 'GOLD';
    const purity = puritySel ? puritySel.value : '22K';

    if (barcodePreview) {
      const prefix = getBarcodePrefixPreview(metal, purity);
      barcodePreview.textContent = `${prefix} 1`;
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
      suggestedDisplay.textContent = fmt(metalAmount + making);
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

  if (metalSel) {
    metalSel.addEventListener('change', () => { updatePurityOptions(); updateReadouts(); });
  }
  if (puritySel) {
    puritySel.addEventListener('change', updateReadouts);
  }
  if (grossWeightInput) grossWeightInput.addEventListener('input', updateNetWeight);
  if (stoneWeightInput) stoneWeightInput.addEventListener('input', updateNetWeight);
  if (netWeightInput) netWeightInput.addEventListener('input', updateReadouts);
  if (makingTypeSelect) makingTypeSelect.addEventListener('change', updateReadouts);
  if (makingValueInput) makingValueInput.addEventListener('input', updateReadouts);

  // Run on load
  updatePurityOptions();
  updateReadouts();
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
  const newFields = lookup.querySelector('[data-new-customer-fields]');
  const nameInput = lookup.querySelector('[data-customer-name]');
  const emailInput = lookup.querySelector('[data-customer-email]');
  const addressInput = lookup.querySelector('[data-customer-address]');
  let lookupTimer = null;
  let requestNumber = 0;

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
    [nameInput, emailInput, addressInput].forEach((input) => { input.disabled = false; });
    nameInput.required = true;
    status.textContent = `${phone} is new. Enter the name to create this customer automatically when the bill is saved.`;
    status.className = 'customer-lookup-status is-new';
  }

  function showExisting(customer) {
    customerId.value = customer.id;
    existing.hidden = false;
    newFields.hidden = true;
    [nameInput, emailInput, addressInput].forEach((input) => { input.disabled = true; });
    nameInput.required = false;
    existingName.textContent = customer.name;
    const contact = [customer.phone, customer.email, customer.address].filter(Boolean).join(' · ');
    existingDetails.textContent = `${contact || 'Customer details loaded'} · Outstanding: ${fmt(customer.outstanding)}`;
    ledgerLink.href = `/customers/${customer.id}`;
    ledgerLink.hidden = false;
    status.textContent = 'Existing customer found. Their profile and ledger will be used for this bill.';
    status.className = 'customer-lookup-status is-found';
  }

  function clearLookup(message) {
    customerId.value = '';
    existing.hidden = true;
    ledgerLink.hidden = true;
    newFields.hidden = true;
    [nameInput, emailInput, addressInput].forEach((input) => { input.disabled = true; });
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
  clearLookup('Enter the customer’s mobile number to load their ledger details.');
})();

/* ═══════════════════════════════════════════════════════════════
   4. BILLING / SALES FORM — barcode scan, live totals
   ═══════════════════════════════════════════════════════════════ */
(function initBarcodeSale() {
  const form = document.querySelector('[data-barcode-sale]');
  if (!form) return;

  const rowsContainer = form.querySelector('[data-rows]');
  const template = form.querySelector('[data-line-template]');
  const addRowBtn = form.querySelector('[data-add-row]');
  const subtotalEl = form.querySelector('[data-subtotal]');
  const discountInput = form.querySelector('[data-discount]');
  const gstEl = form.querySelector('[data-gst]');
  const totalEl = form.querySelector('[data-total]');
  const paidInput = form.querySelector('[data-paid]');
  const paymentMethodInput = form.querySelector('[data-payment-method]');
  const splitPayment = form.querySelector('[data-split-payment]');
  const cashPaidInput = form.querySelector('[data-cash-paid]');
  const upiPaidInput = form.querySelector('[data-upi-paid]');
  const balanceEl = form.querySelector('[data-balance]');
  const saleDateInput = form.querySelector('[data-sale-date]');
  const urdEnabled = form.querySelector('[data-urd-enabled]');
  const urdFields = form.querySelector('[data-urd-fields]');
  const urdMetal = form.querySelector('[data-urd-metal]');
  const urdPurity = form.querySelector('[data-urd-purity]');
  const urdGrossWeight = form.querySelector('[data-urd-gross-weight]');
  const urdNetWeight = form.querySelector('[data-urd-net-weight]');
  const urdRate = form.querySelector('[data-urd-rate]');
  const urdAmount = form.querySelector('[data-urd-amount]');
  const urdOffsetRow = form.querySelector('[data-urd-offset-row]');
  const urdOffsetEl = form.querySelector('[data-urd-offset]');
  const netPayableEl = form.querySelector('[data-net-payable]');

  let rowCount = 0;

  /* ── Add a new barcode row ───────────────────────────────── */
  function addRow() {
    rowCount++;
    const clone = template.content.cloneNode(true);
    const row = clone.querySelector('[data-line-item]');
    row.querySelector('.line-number').textContent = rowCount;

    // Wire up this row's interactivity
    wireRow(row);
    rowsContainer.appendChild(row);

    // Focus barcode input
    row.querySelector('[data-barcode]').focus();
  }

  /* ── Wire a single row ──────────────────────────────────── */
  function wireRow(row) {
    const barcodeInput = row.querySelector('[data-barcode]');
    const productIdInput = row.querySelector('[data-product-id]');
    const itemDetails = row.querySelector('[data-item-details]');
    const qtyInput = row.querySelector('[data-quantity]');
    const weightInput = row.querySelector('[data-weight]');
    const metalRateInput = row.querySelector('[data-metal-rate]');
    const makingTypeSelect = row.querySelector('[data-making-type]');
    const makingValueInput = row.querySelector('[data-making-value]');
    const taxableInput = row.querySelector('[data-taxable-amount]');
    const lineHelp = row.querySelector('[data-line-help]');
    const removeBtn = row.querySelector('[data-remove-row]');

    let lookupTimer = null;
    let productData = null;

    function getSaleDate() {
      return saleDateInput ? saleDateInput.value : new Date().toISOString().slice(0, 10);
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
      const qty = n(qtyInput.value) || 1;
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
    }

    async function lookupBarcode(barcode) {
      if (!barcode) return;
      // Allow re-lookup of same barcode (user may have set rates in between)

      setRowStatus(row, 'loading', 'Looking up barcode…');
      productIdInput.value = '';
      productData = null;

      try {
        const date = getSaleDate();
        const resp = await fetch(`/api/products/barcode/${encodeURIComponent(barcode.toUpperCase())}?date=${date}`);
        const data = await resp.json();

        if (!resp.ok) {
          setRowStatus(row, 'error', data.error || 'Not found.');
          itemDetails.innerHTML = `<strong class="err-text">${data.error || 'Item not found'}</strong>`;
          return;
        }

        productData = data.product;
        productIdInput.value = data.product.id;

        itemDetails.innerHTML = `<strong>${data.product.name}</strong><small>${data.product.barcode} · ${data.product.category} · ${data.product.purity || data.product.metal} · ${Number(data.product.netWeight).toFixed(3)} g</small>`;

        weightInput.value = Number(data.product.netWeight).toFixed(3);
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
        setRowStatus(row, 'error', 'Network error — check your connection.');
        console.error('Barcode lookup failed:', err);
      }
    }

    // Barcode input: debounce lookup
    barcodeInput.addEventListener('input', () => {
      clearTimeout(lookupTimer);
      const val = barcodeInput.value.trim();
      if (val.length >= 1) {
        lookupTimer = setTimeout(() => lookupBarcode(val), 500);
      }
    });

    barcodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(lookupTimer);
        lookupBarcode(barcodeInput.value.trim());
      }
    });

    // Quantity change
    qtyInput.addEventListener('input', recalcRow);

    // Rate change (manual override)
    metalRateInput.addEventListener('input', recalcRow);

    // Making charge changes
    if (makingTypeSelect) makingTypeSelect.addEventListener('change', recalcRow);
    if (makingValueInput) makingValueInput.addEventListener('input', recalcRow);

    // Taxable amount: mark as manual override when user edits it
    taxableInput.addEventListener('input', () => {
      taxableInput.dataset.manualOverride = '1';
      updateFormTotals();
    });

    // Remove row
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        row.remove();
        renumberRows();
        updateFormTotals();
      });
    }
  }

  function setRowStatus(row, type, message) {
    const help = row.querySelector('[data-line-help]');
    if (!help) return;
    help.className = `line-help ${type}`;
    help.textContent = message;
  }

  function renumberRows() {
    rowsContainer.querySelectorAll('[data-line-item]').forEach((row, i) => {
      const num = row.querySelector('.line-number');
      if (num) num.textContent = i + 1;
    });
    rowCount = rowsContainer.querySelectorAll('[data-line-item]').length;
  }

  /* ── Live totals ─────────────────────────────────────────── */
  function updateFormTotals() {
    let subtotal = 0;
    rowsContainer.querySelectorAll('[data-taxable-amount]').forEach((input) => {
      subtotal += n(input.value);
    });

    const discount = n(discountInput ? discountInput.value : 0);
    const taxable = Math.max(0, subtotal - discount);
    const gst = taxable * 0.03;
    const total = taxable + gst;
    const urdAdjustment = urdEnabled?.checked ? Math.max(0, n(urdAmount?.value)) : 0;
    const netPayable = Math.max(0, total - urdAdjustment);
    const paid = paymentMethodInput?.value === 'MIXED'
      ? n(cashPaidInput?.value) + n(upiPaidInput?.value)
      : n(paidInput ? paidInput.value : 0);
    if (paymentMethodInput?.value === 'MIXED' && paidInput) paidInput.value = paid.toFixed(2);
    const balance = Math.max(0, netPayable - paid);

    if (subtotalEl) subtotalEl.textContent = fmt(subtotal);
    if (gstEl) gstEl.textContent = fmt(gst);
    if (totalEl) totalEl.textContent = fmt(total);
    if (urdOffsetRow) urdOffsetRow.hidden = urdAdjustment <= 0;
    if (urdOffsetEl) urdOffsetEl.textContent = fmt(urdAdjustment);
    if (netPayableEl) netPayableEl.textContent = fmt(netPayable);
    if (balanceEl) {
      balanceEl.textContent = fmt(balance);
      const dueRow = balanceEl.closest('.summary-row');
      if (dueRow) dueRow.classList.toggle('has-balance', balance > 0.01);
    }
  }

  if (discountInput) discountInput.addEventListener('input', updateFormTotals);
  if (paidInput) paidInput.addEventListener('input', updateFormTotals);
  if (cashPaidInput) cashPaidInput.addEventListener('input', updateFormTotals);
  if (upiPaidInput) upiPaidInput.addEventListener('input', updateFormTotals);
  if (paymentMethodInput) paymentMethodInput.addEventListener('change', () => {
    const mixed = paymentMethodInput.value === 'MIXED';
    if (splitPayment) splitPayment.hidden = !mixed;
    if (cashPaidInput) cashPaidInput.disabled = !mixed;
    if (upiPaidInput) upiPaidInput.disabled = !mixed;
    if (paidInput) paidInput.disabled = mixed;
    updateFormTotals();
  });

  function updateUrdRate() {
    if (!urdRate || !urdPurity) return;
    const purity = urdPurity.value;
    const rate = purity === '24K' ? n(urdRate.dataset.rate24)
      : (purity === '925' || purity === 'PURE') ? n(urdRate.dataset.rateSilver)
        : n(urdRate.dataset.rate22);
    if (rate > 0) urdRate.value = rate.toFixed(2);
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
    if (enabled) { updateUrdRate(); recalcUrdAmount(); }
    updateFormTotals();
  }

  if (urdEnabled) urdEnabled.addEventListener('change', toggleUrdFields);
  if (urdMetal) urdMetal.addEventListener('change', () => {
    if (urdPurity && urdMetal.value === 'SILVER') urdPurity.value = '925';
    if (urdPurity && urdMetal.value === 'GOLD' && !['22K', '24K'].includes(urdPurity.value)) urdPurity.value = '22K';
    updateUrdRate(); recalcUrdAmount();
  });
  if (urdPurity) urdPurity.addEventListener('change', () => { updateUrdRate(); recalcUrdAmount(); });
  if (urdGrossWeight && urdNetWeight) urdGrossWeight.addEventListener('input', () => { urdNetWeight.value = urdGrossWeight.value; recalcUrdAmount(); });
  if (urdNetWeight) urdNetWeight.addEventListener('input', recalcUrdAmount);
  if (urdRate) urdRate.addEventListener('input', recalcUrdAmount);
  if (urdAmount) urdAmount.addEventListener('input', updateFormTotals);

  if (addRowBtn) {
    addRowBtn.addEventListener('click', addRow);
  }

  // Add first row automatically
  addRow();
  toggleUrdFields();
  updateFormTotals();
})();

/* ═══════════════════════════════════════════════════════════════
   5. OPTIONAL CASHBOOK SYNC — any recorded payment method
   ═══════════════════════════════════════════════════════════════ */
(function initCashbookSyncControls() {
  document.querySelectorAll('[data-cashbook-sync-control]').forEach((control) => {
    const checkbox = control.querySelector('input[name="syncCashbook"]');
    const form = control.closest('form');
    const method = form?.querySelector('[data-payment-method]');
    if (!checkbox || !method) return;
    function update() {
      const canSync = ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'MIXED'].includes(method.value);
      control.hidden = !canSync;
      checkbox.disabled = !canSync;
      if (!canSync) checkbox.checked = false;
    }
    method.addEventListener('change', update);
    update();
  });
})();

/* ═══════════════════════════════════════════════════════════════
   6. CUSTOMER DETAIL — payment form amount slider hint
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
(function initLabelBatch() {
  const form = document.getElementById('label-print-form');
  if (!form) return;

  const selectAll = document.querySelector('[data-label-select-all]');
  const selections = Array.from(document.querySelectorAll('[data-label-select]'));
  const countEl = form.querySelector('[data-label-count]');
  const printButtons = Array.from(document.querySelectorAll('[data-label-print-button]'));

  function update() {
    const selected = selections.filter((input) => input.checked);
    const count = selected.length;
    if (countEl) countEl.textContent = `${count} selected`;
    printButtons.forEach((button) => { button.disabled = count === 0; });
    if (selectAll) {
      selectAll.checked = count > 0 && count === selections.length;
      selectAll.indeterminate = count > 0 && count < selections.length;
    }
  }

  if (selectAll) {
    selectAll.addEventListener('change', () => {
      selections.forEach((input) => { input.checked = selectAll.checked; });
      update();
    });
  }
  selections.forEach((input) => input.addEventListener('change', update));
  update();
})();
