const historyModule = {
    init() {
        this.setupActionBindings();
        this.renderAllLedgers();
    },

    setupActionBindings() {
        // Clear buttons on History screen
        const btnClearCalc = document.getElementById('btnPageClearCalcHistory');
        if (btnClearCalc) {
            btnClearCalc.addEventListener('click', () => this.clearCalculationsConfirmed());
        }

        const btnClearGst = document.getElementById('btnPageClearGstHistory');
        if (btnClearGst) {
            btnClearGst.addEventListener('click', () => this.clearGstConfirmed());
        }

        // Settings actions 
        const btnAdminCalc = document.getElementById('btnClearCalculationsAdmin');
        if (btnAdminCalc) {
            btnAdminCalc.addEventListener('click', () => this.clearCalculationsConfirmed());
        }

        const btnAdminGst = document.getElementById('btnClearGstAdmin');
        if (btnAdminGst) {
            btnAdminGst.addEventListener('click', () => this.clearGstConfirmed());
        }

        const btnFullWipe = document.getElementById('btnFullWipeAdmin');
        if (btnFullWipe) {
            btnFullWipe.addEventListener('click', () => this.hardSystemWipeConfirmed());
        }
    },

    async renderAllLedgers() {
        await Promise.all([
            this.renderCalculatorLedger(),
            this.renderGstLedger()
        ]);
    },

    async renderCalculatorLedger() {
        const body = document.getElementById('historyTableCalcBody');
        const emptyDiv = document.getElementById('historyCalcEmpty');

        if (!body) return;

        try {
            const records = await window.apiClient.getCalculatorHistory();
            
            if (!records || records.length === 0) {
                body.innerHTML = '';
                emptyDiv?.classList.remove('hidden');
                return;
            }

            emptyDiv?.classList.add('hidden');

            body.innerHTML = records.map(row => `
                <tr>
                    <td>
                        <span class="font-mono text-muted text-xs block">${new Date(row.created_at).toLocaleString('en-IN', { hour12: true })}</span>
                    </td>
                    <td>
                        <span class="font-mono font-medium text-secondary block">${row.expression.replace(/\*/g, '×').replace(/\//g, '÷')}</span>
                    </td>
                    <td class="text-right">
                        <span class="font-mono font-bold text-accent text-sm">= ${row.result}</span>
                    </td>
                    <td class="text-right">
                        <button class="bttn bttn-icon bttn-ghost text-rose-500 hover:bg-rose-50 p-1" onclick="historyModule.deleteCalcRecord(${row.id})" title="Delete calculation record">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            lucide.createIcons();
        } catch (e) {
            console.error("Ledger rendering error:", e);
        }
    },

    async renderGstLedger() {
        const body = document.getElementById('historyTableGstBody');
        const emptyDiv = document.getElementById('historyGstEmpty');

        if (!body) return;

        try {
            const records = await window.apiClient.getGstHistory();

            if (!records || records.length === 0) {
                body.innerHTML = '';
                emptyDiv?.classList.remove('hidden');
                return;
            }

            emptyDiv?.classList.add('hidden');

            body.innerHTML = records.map(row => {
                const isInc = row.gst_type === 'INCLUSIVE';
                
                // Humanize type labels
                let typeTag = '';
                if (row.gst_type === 'INCLUSIVE') {
                    typeTag = `<span class="badge bg-amber-50 text-amber-600 border border-amber-200">INCLUSIVE</span>`;
                } else if (row.gst_type === 'EXCLUSIVE_IGST') {
                    typeTag = `<span class="badge bg-sky-50 text-sky-600 border border-sky-200">EXCL (IGST)</span>`;
                } else {
                    typeTag = `<span class="badge bg-emerald-50 text-emerald-600 border border-emerald-200">EXCL (CGST/SGST)</span>`;
                }

                return `
                    <tr>
                        <td>
                            <span class="font-mono text-muted text-xs block">${new Date(row.created_at).toLocaleString('en-IN', { hour12: true })}</span>
                        </td>
                        <td>
                            <div class="flex flex-col">
                                <span class="font-mono font-medium text-secondary">${this.formatCurrency(row.amount)}</span>
                                <span class="text-xs text-muted font-mono">at ${row.gst_rate}%</span>
                            </div>
                        </td>
                        <td>
                            ${typeTag}
                        </td>
                        <td class="text-right">
                            <span class="font-mono text-muted font-medium">${this.formatCurrency(row.gst_amount)}</span>
                        </td>
                        <td class="text-right">
                            <span class="font-mono font-bold text-accent">${this.formatCurrency(row.grand_total)}</span>
                        </td>
                        <td class="text-right">
                            <button class="bttn bttn-icon bttn-ghost text-rose-500 hover:bg-rose-50 p-1" onclick="historyModule.deleteGstRecord(${row.id})" title="Delete GST invoice record">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            lucide.createIcons();
        } catch (e) {
            console.error("GST Ledger render error:", e);
        }
    },

    formatCurrency(val) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val);
    },

    async deleteCalcRecord(id) {
        if (confirm("Delete this specific transaction line from audit list?")) {
            try {
                await window.apiClient.deleteCalculatorEntry(id);
                this.renderAllLedger():
                if (window.calculatorModule) window.calculatorModule.loadLocalHistory();
                if (window.dashboardModule) window.dashboardModule.reloadAll();
            } catch (err) {
                alert("Deletion error.");
            }
        }
    },

    async deleteGstRecord(id) {
        if (confirm("Permanently withdraw this computed GST transaction invoice from historical aggregates?")) {
            try {
                await window.apiClient.deleteGstEntry(id);
                this.renderAllLedgers();
                if (window.dashboardModule) window.dashboardModule.reloadAll();
                if (window.gstModule) window.gstModule.recalculateGstLive();
            } catch (err) {
                alert("Deletion error.");
            }
        }
    },

    async clearCalculationsConfirmed() {
        if (confirm("Delete every single calculation expression ledger from server memory? This transaction is irreversible.")) {
            try {
                await window.apiClient.clearCalculatorHistory();
                this.renderAllLedgers();
                if (window.calculatorModule) window.calculatorModule.loadLocalHistory();
                if (window.dashboardModule) window.dashboardModule.reloadAll();
            } catch (err) {
                alert("Error clear history.");
            }
        }
    },

    async clearGstConfirmed() {
        if (confirm("Wipe every computed GST ledger invoice? Your total filings count will drop to zero.")) {
            try {
                await window.apiClient.clearGstHistory();
                this.renderAllLedgers();
                if (window.dashboardModule) window.dashboardModule.reloadAll();
                if (window.gstModule) window.gstModule.recalculateGstLive();
            } catch (err) {
                alert("Error wiping GST filings list.");
            }
        }
    },

    async hardSystemWipeConfirmed() {
        if (confirm("CATASTROPHIC ACTION ALERT:\nYou are going to execute a FULL system clean. This removes all mathematical operations, all GST audit invoices, and completely clears the SaaS dashboard caches.\n\nProceed?")) {
            try {
                await Promise.all([
                    window.apiClient.clearCalculatorHistory(),
                    window.apiClient.clearGstHistory()
                ]);
                this.renderAllLedgers();
                if (window.calculatorModule) window.calculatorModule.loadLocalHistory();
                if (window.dashboardModule) window.dashboardModule.reloadAll();
                if (window.gstModule) window.gstModule.recalculateGstLive();
                alert("Full system database hard reset completed. All ledgers are empty!");
            } catch (err) {
                alert("Wipe error: " + err.message);
            }
        }
    }
};

window.historyModule = historyModule;
