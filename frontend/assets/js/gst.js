const gstModule = {
    selectedRate: 18, 

    init() {
        this.setupRateButtons();
        this.setupInputTriggers();
        this.setupRadioCards();
       
        this.recalculateGstLive();
    },

    setupRateButtons() {
        const rateButtons = document.querySelectorAll('.gst-rate-btn');
        const customRateInput = document.getElementById('gstRateInput');

        rateButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Deactivate sisters
                rateButtons.forEach(b => b.classList.remove('active'));
                
                // Activate self
                btn.classList.add('active');
                
                const rate = parseFloat(btn.dataset.rate);
                this.selectedRate = rate;
                
                if (customRateInput) {
                    customRateInput.value = rate;
                }

                this.recalculateGstLive();
            });
        });

        if (customRateInput) {
            customRateInput.addEventListener('input', (e) => {
                const rateVal = parseFloat(e.target.value) || 0;
                this.selectedRate = rateVal;

                rateButtons.forEach(b => {
                    if (parseFloat(b.dataset.rate) === rateVal) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });

                this.recalculateGstLive();
            });
        }
    },

    setupInputTriggers() {
        const amountInput = document.getElementById('gstAmountInput');
        if (amountInput) {
            amountInput.addEventListener('input', () => this.recalculateGstLive());
        }
    },

    setupRadioCards() {
        // Toggle card borders 
        const radioWrappers = [
            { name: 'gst_inclusive_exclusive', elements: document.querySelectorAll('input[name="gst_inclusive_exclusive"]') },
            { name: 'gst_type', elements: document.querySelectorAll('input[name="gst_type"]') }
        ];

        radioWrappers.forEach(wrap => {
            wrap.elements.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const cards = radio.closest('.form-group').querySelectorAll('.toggle-card');
                    cards.forEach(card => card.classList.remove('active'));
                    
                    if (radio.checked) {
                        const cardLabel = radio.closest('.toggle-card');
                        if (cardLabel) cardLabel.classList.add('active');
                    }

                    // For the dynamic display rows toggle
                    this.adjustTaxTypeRows();
                    this.recalculateGstLive();
                });
            });
        });
    },

    adjustTaxTypeRows() {
        const selectedTaxModel = document.querySelector('input[name="gst_type"]:checked').value;
        const cgstRow = document.getElementById('cgstRow');
        const sgstRow = document.getElementById('sgstRow');
        const igstRow = document.getElementById('igstRow');

        if (selectedTaxModel === 'CGST_SGST') {
            cgstRow?.classList.remove('hidden');
            sgstRow?.classList.remove('hidden');
            igstRow?.classList.add('hidden');
        } else {
            cgstRow?.classList.add('hidden');
            sgstRow?.classList.add('hidden');
            igstRow?.classList.remove('hidden');
        }
    },

    computeTax(amount, rate, isInclusive, isIGST) {
        let taxableValue = 0;
        let gstAmount = 0;
        let grandTotal = 0;

        if (isInclusive) {
            // INCLUSIVE GST FORMULA
            // taxable_value = total * 100 / (100 + gst_rate)
            // gst_amount = total - taxable_value
            grandTotal = amount;
            taxableValue = (amount * 100) / (100 + rate);
            gstAmount = amount - taxableValue;
        } else {
            // EXCLUSIVE GST FORMULA
            // gst_amount = amount * gst_rate / 100
            // grand_total = amount + gst_amount
            taxableValue = amount;
            gstAmount = (amount * rate) / 100;
            grandTotal = amount + gstAmount;
        }

        // CGST, SGST & IGST
        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        if (isIGST) {
            igst = gstAmount;
        } else {
            cgst = gstAmount / 2;
            sgst = gstAmount / 2;
        }

        return {
            taxableValue,
            gstAmount,
            grandTotal,
            cgst,
            sgst,
            igst
        };
    },

    recalculateGstLive() {
        const amountVal = parseFloat(document.getElementById('gstAmountInput').value) || 0;
        const rateVal = parseFloat(this.selectedRate) || 0;
        const isInclusive = document.querySelector('input[name="gst_inclusive_exclusive"]:checked').value === 'INCLUSIVE';
        const isIGST = document.querySelector('input[name="gst_type"]:checked').value === 'IGST';

        const result = this.computeTax(amountVal, rateVal, isInclusive, isIGST);
   // Update elements
        document.getElementById('resTaxableValue').textContent = this.formatCurrency(result.taxableValue);
        document.getElementById('resGstAmount').textContent = this.formatCurrency(result.gstAmount);
        document.getElementById('resGrandTotal').textContent = this.formatCurrency(result.grandTotal);

        if (isIGST) {
            document.getElementById('resIGST').innerHTML = `${this.formatCurrency(result.igst)} <span class="tax-rate-sub" id="resIGSTRate">(${rateVal.toFixed(1)}%)</span>`;
        } else {
            document.getElementById('resCGST').innerHTML = `${this.formatCurrency(result.cgst)} <span class="tax-rate-sub" id="resCGSTRate">(${(rateVal / 2).toFixed(1)}%)</span>`;
            document.getElementById('resSGST').innerHTML = `${this.formatCurrency(result.sgst)} <span class="tax-rate-sub" id="resSGSTRate">(${(rateVal / 2).toFixed(1)}%)</span>`;
        }
    },

    formatCurrency(val) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    },

    async submitGstCalculation() {
        const amountVal = parseFloat(document.getElementById('gstAmountInput').value) || 0;
        const rateVal = parseFloat(this.selectedRate) || 0;
        const isInclusive = document.querySelector('input[name="gst_inclusive_exclusive"]:checked').value === 'INCLUSIVE';
        const isIGST = document.querySelector('input[name="gst_type"]:checked').value === 'IGST';

        // Validation rule: Amount > 0
        if (amountVal <= 0) {
            alert("Please enter a valid base amount greater than zero.");
            return;
        }

        // Validation rule: GST Rate >= 0
        if (rateVal < 0) {
            alert("GST Rate cannot be negative.");
            return;
        }

        const metrics = this.computeTax(amountVal, rateVal, isInclusive, isIGST);
        
        const modeLabel = isInclusive ? "EXCLUSIVE_EXT_FROM_INC" : "EXCLUSIVE_ADDED";
        // Actually represent: Inclusive, Exclusive or Split names
        const labelType = isInclusive ? "INCLUSIVE" : (isIGST ? "EXCLUSIVE_IGST" : "EXCLUSIVE_CGST_SGST");

        try {
            await window.apiClient.createGstEntry(
                metrics.taxableValue, 
                rateVal, 
                labelType, 
                metrics.gstAmount, 
                metrics.grandTotal
            );
            if (window.dashboardModule) window.dashboardModule.reloadAll();
            if (window.historyModule) window.historyModule.renderAllLedgers();
            
            alert(`GST computation logged and verified! Grand Total: ${this.formatCurrency(metrics.grandTotal)}`);
        } catch (err) {
            alert("Error persisting GST ledger: " + err.message);
        }
    }
};
window.gstModule = gstModule;
window.submitGstCalculation = () => gstModule.submitGstCalculation();
