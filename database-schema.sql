CREATE TABLE calculator_history (
    id INTEGER PRIMARY KEY,
    expression TEXT,
    result TEXT,
    created_at DATETIME
);

CREATE TABLE gst_history (
    id INTEGER PRIMARY KEY,
    amount REAL,
    gst_rate REAL,
    gst_type TEXT,
    gst_amount REAL,
    grand_total REAL,
    created_at DATETIME
);