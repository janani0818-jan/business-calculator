const dashboardModule = {
    init() {
        this.setupDashboardActionBindings();
        this.reloadAll();
    },

    setupDashboardActionBindings() {
        // Recent math / GST activity tabs toggle
        const btnRecentCalc = document.getElementById('tab-recent-calc');
        const btnRecentGst = document.getElementById('tab-recent-gst');
        
        const listCalc = document.getElementById('list-calc-container');
        const listGst = document.getElementById('list-gst-container');

        if (btnRecentCalc && btnRecentGst && listCalc && listGst) {
            btnRecentCalc.addEventListener('click', () => {
                btnRecentCalc.classList.add('active');
                btnRecentGst.classList.remove('active');
                listCalc.classList.add('active');
                listGst.classList.remove('active');
            });

            btnRecentGst.addEventListener('click', () => {
                btnRecentGst.classList.add('active');
                btnRecentCalc.classList.remove('active');
                listGst.classList.add('active');
                listCalc.classList.remove('active');
            });
        }
    },

    async reloadAll() {
        try {
            const stats = await window.apiClient.getDashboardStats();
            this.renderKPIs(stats);
            this.renderTimelineLists(stats);
        } catch (err) {
            console.error("Dashboard syncing error:", err);
        }
    },

    renderKPIs(stats) {
        // Total calculations count metric
        const totCalcElem = document.getElementById('dashboardTotalCalculations');
        if (totCalcElem) {
            totCalcElem.textContent = stats.total_calculations || 0;
            this.animateElementArrival(totCalcElem);
        }

        // Total GST calculations count metric
        const totGstElem = document.getElementById('dashboardTotalGst');
        if (totGstElem) {
            totGstElem.textContent = stats.total_gst_calculations || 0;
            this.animateElementArrival(totGstElem);
        }

        // Last calculation detail metric card
        const lastCalcExprElem = document.getElementById('dashboardLatestCalcExpr');
        const lastCalcResElem = document.getElementById('dashboardLatestCalcRes');

        if (lastCalcExprElem && lastCalcResElem) {
            if (stats.latest_calculation) {
                lastCalcExprElem.textContent = stats.latest_calculation.expression.replace(/\*/g, '×').replace(/\//g, '÷');
                lastCalcResElem.textContent = `= ${stats.latest_calculation.result}`;
            } else {
                lastCalcExprElem.textContent = 'No records';
                lastCalcResElem.textContent = '-';
            }
        }

        // Last GST invoice detail metric card
        const lastGstFormula = document.getElementById('dashboardLatestGstFormula');
        const lastGstRes = document.getElementById('dashboardLatestGstRes');

        if (lastGstFormula && lastGstRes) {
            if (stats.latest_gst_calculation) {
                const row = stats.latest_gst_calculation;
                const typeLabel = row.gst_type === 'INCLUSIVE' ? 'Inc.' : 'Excl.';
                lastGstFormula.textContent = `Base ${this.formatCurrency(row.amount)} @ ${row.gst_rate}% (${typeLabel})`;
                lastGstRes.textContent = this.formatCurrency(row.grand_total);
            } else {
                lastGstFormula.textContent = 'No invoices';
                lastGstRes.textContent = '₹0.00';
            }
        }
    },

    renderTimelineLists(stats) {
        // Standard math list
        const calcListUl = document.getElementById('dashboardCalcList');
        const calcEmptyState = document.getElementById('calc-empty-state');
        
        const recentCalcs = stats.recent_calculations || [];

        if (calcListUl) {
            if (recentCalcs.length === 0) {
                calcListUl.innerHTML = '';
                calcEmptyState?.classList.remove('hidden');
            } else {
                calcEmptyState?.classList.add('hidden');
                calcListUl.innerHTML = recentCalcs.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-info truncate-parent">
                            <span class="timeline-expr truncate font-mono">${item.expression.replace(/\*/g, '×').replace(/\//g, '÷')}</span>
                            <span class="timeline-meta">${new Date(item.created_at).toLocaleTimeString('en-IN', { hour12: true })}</span>
                        </div>
                        <div class="timeline-result font-mono text-accent">
                            = ${item.result}
                        </div>
                    </div>
                `).join('');
            }
        }

        //  GST list
        const gstListUl = document.getElementById('dashboardGstList');
        const gstEmptyState = document.getElementById('gst-empty-state');
        
        const recentGst = stats.recent_gst_calculations || [];

        if (gstListUl) {
            if (recentGst.length === 0) {
                gstListUl.innerHTML = '';
                gstEmptyState?.classList.remove('hidden');
            } else {
                gstEmptyState?.classList.add('hidden');
                gstListUl.innerHTML = recentGst.map(item => {
                    const isInc = item.gst_type === 'INCLUSIVE';
                    const label = isInc ? "GST Inc." : "GST Excl.";
                    
                    return `
                        <div class="timeline-item">
                            <div class="timeline-info truncate-parent">
                                <span class="timeline-expr font-sans font-semibold truncate block">Base ${this.formatCurrency(item.amount)}</span>
                                <span class="timeline-meta font-mono">Tax: ${this.formatCurrency(item.gst_amount)} (${item.gst_rate}%) • ${label}</span>
                            </div>
                            <div class="timeline-result font-mono text-accent text-right">
                                <span class="text-xs text-muted font-sans font-medium block">Grand Total</span>
                                ${this.formatCurrency(item.grand_total)}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    },

    formatCurrency(val) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val);
    },

    animateElementArrival(element) {
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0.7';
        setTimeout(() => {
            element.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease';
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 10);
    }
};

window.dashboardModule = dashboardModule;
