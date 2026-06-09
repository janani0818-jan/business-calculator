const calculatorModule = {
    displayValue: '0',
    equationExpr: '',
    shouldResetDisplay: false,

    init() {
        this.setupKeypadBindings();
        this.setupKeyboardBindings();
        this.displayValue = '0';
        this.equationExpr = '';
        this.updateScreen();
        this.loadLocalHistory();
    },

    setupKeypadBindings() {
        document.querySelectorAll('.calc-key.num').forEach(button => {
            button.addEventListener('click', (e) => {
                const value = e.target.textContent;
                this.handleInput(value);
            });
        });
        const ops = {
            'btn-add': '+',
            'btn-subtract': '-',
            'btn-multiply': '*',
            'btn-divide': '/'
        };
        for (const [id, value] of Object.entries(ops)) {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.handleOperator(value));
            }
        }

        // Action Keys
        const clearBtn = document.getElementById('btn-clear');
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearAll());

        const backBtn = document.getElementById('btn-backspace');
        if (backBtn) backBtn.addEventListener('click', () => this.backspace());

        const percentBtn = document.getElementById('btn-percent');
        if (percentBtn) percentBtn.addEventListener('click', () => this.percent());

        const equalsBtn = document.getElementById('btn-equals');
        if (equalsBtn) equalsBtn.addEventListener('click', () => this.evaluate());

        // Sidebar Clear All Action
        const ledgerClearBtn = document.getElementById('btnClearCalcHistory');
        if (ledgerClearBtn) {
            ledgerClearBtn.addEventListener('click', () => this.clearHistoryConfirmed());
        }
    },

    setupKeyboardBindings() {
        document.addEventListener('keydown', (e) => {
            // Verify if active page is indeed standard calculator
            const activePage = document.querySelector('.page-section.active');
            if (!activePage || activePage.id !== 'page-calculator') {
                return;
            }

            const key = e.key;

            if (/[0-9]/.test(key)) {
                this.handleInput(key);
            } else if (key === '.') {
                this.handleInput('.');
            } else if (key === '+') {
                this.handleOperator('+');
            } else if (key === '-') {
                this.handleOperator('-');
            } else if (key === '*') {
                this.handleOperator('*');
            } else if (key === '/') {
                e.preventDefault();
                this.handleOperator('/');
            } else if (key === '%') {
                this.percent();
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                this.evaluate();
            } else if (key === 'Backspace') {
                this.backspace();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                this.clearAll();
            }
        });
    },

    handleInput(value) {
        if (this.shouldResetDisplay) {
            this.displayValue = '';
            this.shouldResetDisplay = false;
        }

        if (value === '.') 
            const segments = this.displayValue.split(/[\+\-\*\/]/);
            const currentSegment = segments[segments.length - 1];
            if (currentSegment.includes('.')) {
                return;
            }
            if (this.displayValue === '' || this.displayValue === '0') {
                this.displayValue = '0.';
                this.updateScreen();
                return;
            }
        }

        if (this.displayValue === '0' && value !== '.') {
            this.displayValue = value;
        } else {
            this.displayValue += value;
        }

        this.updateScreen();
    },

    handleOperator(op) {
        if (this.shouldResetDisplay) {
            this.shouldResetDisplay = false;
        }

        const lastChar = this.displayValue.trim().slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            // Swap operator
            this.displayValue = this.displayValue.trim().slice(0, -1) + op;
        } else {
            if (this.displayValue === '0' && op === '-') {
                this.displayValue = '-';
            } else {
                this.displayValue += ` ${op} `;
            }
        }
        this.updateScreen();
    },

    clearAll() {
        this.displayValue = '0';
        this.equationExpr = '';
        this.shouldResetDisplay = false;
        this.updateScreen();
    },

    backspace() {
        if (this.shouldResetDisplay) {
            this.clearAll();
            return;
        }

        let curr = this.displayValue.trim();
        if (curr.length <= 1 || curr === '0') {
            this.displayValue = '0';
        } else {
            // If deleting space-padded operator
            const lastChar = curr.slice(-1);
            if (['+', '-', '*', '/'].includes(lastChar)) {
                this.displayValue = curr.slice(0, -1).trim();
            } else {
                this.displayValue = this.displayValue.slice(0, -1);
                if (this.displayValue === '' || this.displayValue === ' ') {
                    this.displayValue = '0';
                }
            }
        }
        this.updateScreen();
    },

    percent() {
        try {
            if (/[+\-*/]/.test(this.displayValue)) {
                return;
            }
            const val = parseFloat(this.displayValue);
            if (!isNaN(val)) {
                const res = val / 100;
                this.equationExpr = `${val}%`;
                this.displayValue = String(res);
                this.shouldResetDisplay = true;
                this.updateScreen();
                this.saveEntryToBackend(this.equationExpr, this.displayValue);
            }
        } catch (e) {
            this.displayValue = 'Error';
            this.updateScreen();
        }
    },

    async evaluate() {
        let formula = this.displayValue.trim();
        if (!formula || formula === '0') return;

        // Clean trailing operator if exists
        const lastChar = formula.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            formula = formula.slice(0, -1).trim();
        }

        try {
            this.equationExpr = formula;
            
            // Prevention of Division By Zero Check
            if (/\/ *0(?!\.)/.test(formula)) {
                throw new Error("DivByZero");
            }
            const sanitized = formula.replace(/[^0-9\+\-\*\/\. \(\)]/g, '');
            const computedResult = new Function(`return (${sanitized});`)();
            
            if (computedResult === Infinity || computedResult === -Infinity || isNaN(computedResult)) {
                throw new Error("DivByZero");
            }


            let finalResult = parseFloat(computedResult.toFixed(8));
            
            this.displayValue = String(finalResult);
            this.shouldResetDisplay = true;
            this.updateScreen();

            
            await this.saveEntryToBackend(this.equationExpr, this.displayValue);
        } catch (err) {
            console.error("Evaluation error:", err);
            this.displayValue = err.message === "DivByZero" ? 'Can\'t divide by 0' : 'Error';
            this.shouldResetDisplay = true;
            this.updateScreen();
        }
    },

    updateScreen() {
        const displayField = document.getElementById('calcDisplay');
        const exprField = document.getElementById('calcHistoryExpr');
        
        if (displayField) {
            let visual = this.displayValue
                .replace(/\*/g, '×')
                .replace(/\//g, '÷');
            displayField.value = visual;
        }

        if (exprField) {
            let visualExpr = this.equationExpr
                .replace(/\*/g, '×')
                .replace(/\//g, '÷');
            exprField.textContent = visualExpr;
        }
    },

    async saveEntryToBackend(expression, result) {
        try {
            await window.apiClient.createCalculatorEntry(expression, result);
            // Refresh history panels
            this.loadLocalHistory();
            if (window.dashboardModule) window.dashboardModule.reloadAll();
            if (window.historyModule) window.historyModule.renderAllLedgers();
        } catch (e) {
            console.error("Failed persisting calculator entry:", e);
        }
    },

    async loadLocalHistory() {
        const listDiv = document.getElementById('calcHistoryList');
        if (!listDiv) return;

        try {
            const records = await window.apiClient.getCalculatorHistory();
            const items = (records || []).slice(0, 15);

            if (items.length === 0) {
                listDiv.innerHTML = `
                    <div class="empty-state">
                        <p class="text-sm text-center text-muted">No computations in session.</p>
                    </div>
                `;
                return;
            }

            listDiv.innerHTML = items.map(record => `
                <div class="calc-session-row">
                    <div class="truncate-parent" style="flex:1;">
                        <span class="text-xs text-muted font-mono block">${new Date(record.created_at).toLocaleTimeString()}</span>
                        <span class="text-sm font-medium font-mono text-secondary truncate block">${record.expression.replace(/\*/g, '×').replace(/\//g, '÷')}</span>
                        <span class="text-base font-semibold font-mono text-accent truncate block">= ${record.result}</span>
                    </div>
                    <button class="bttn bttn-icon bttn-ghost calc-row-delete-btn" onclick="calculatorModule.deleteRow(${record.id})">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5 text-rose-500"></i>
                    </button>
                </div>
            `).join('');

            lucide.createIcons();
        } catch (e) {
            console.error(e);
        }
    },

    async deleteRow(id) {
        if (confirm("Exclude this record from audit ledger?")) {
            try {
                await window.apiClient.deleteCalculatorEntry(id);
                this.loadLocalHistory();
                if (window.dashboardModule) window.dashboardModule.reloadAll();
                if (window.historyModule) window.historyModule.renderAllLedgers();
            } catch (err) {
                alert("Error deleting record.");
            }
        }
    },

    async clearHistoryConfirmed() {
        if (confirm("Are you sure you want to delete all computations in standard ledger?")) {
            try {
                await window.apiClient.clearCalculatorHistory();
                this.loadLocalHistory();
                if (window.dashboardModule) window.dashboardModule.reloadAll();
                if (window.historyModule) window.historyModule.renderAllLedgers();
            } catch (err) {
                alert("Error purging history.");
            }
        }
    }
};

window.calculatorModule = calculatorModule;
