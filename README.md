# Business Calculator Pro

A full-stack business utility application built using **FastAPI**, **SQLite**, and **Vanilla JavaScript**. The project provides standard calculations, GST calculations, history tracking, and dashboard analytics through a modern responsive interface.

## Features

### Standard Calculator

* Perform arithmetic calculations
* Store calculation history
* Delete individual records
* Clear complete history

### GST Calculator

* Calculate GST-inclusive and GST-exclusive values
* Support for different GST rates
* Store GST calculation history
* Delete individual GST records
* Clear GST history

### Dashboard Analytics

* Total calculation count
* Total GST calculation count
* Recent calculation activity
* Latest GST records
* Business insights overview

### REST API

* FastAPI-powered backend
* Interactive Swagger documentation
* JSON-based API responses
* Modular route architecture

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript 


### Backend

* FastAPI
* Pydantic
* SQLAlchemy

### Database

* SQLite

### Development Tools

* Git
* GitHub


---

## Project Architecture

```text
business-calculator/
│
├── backend/
│   ├── main.py
│   └── app/
│       ├── database.py
│       ├── models/
│       ├── routes/
│       ├── schemas/
│       └── services/
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   └── index.html
│
├── requirements.txt
├── package.json
├── package-lock.json
├── database-schema.sql
└── README.md
```

---

## API Endpoints

### Calculator APIs

| Method | Endpoint                          |
| ------ | --------------------------------- |
| GET    | `/api/v1/calculator/history`      |
| POST   | `/api/v1/calculator/history`      |
| DELETE | `/api/v1/calculator/history`      |
| DELETE | `/api/v1/calculator/history/{id}` |

### GST APIs

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | `/api/v1/gst/history`      |
| POST   | `/api/v1/gst/history`      |
| DELETE | `/api/v1/gst/history`      |
| DELETE | `/api/v1/gst/history/{id}` |

### Dashboard APIs

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | `/api/v1/dashboard/stats` |

### System APIs

| Method | Endpoint  |
| ------ | --------- |
| GET    | `/health` |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/janani0818-jan/business-calculator.git
cd business-calculator
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows:

```bash
venv\Scripts\activate
```

Linux / macOS:

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Backend

```bash
uvicorn backend.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Run Frontend

Navigate to frontend folder:

```bash
cd frontend
```

Start local server:

```bash
python -m http.server 5500
```

Frontend URL:

```text
http://127.0.0.1:5500
```

---

## Database

The project uses SQLite for lightweight local storage.

Main tables:

* Calculator History
* GST History

Database schema reference:

```text
database-schema.sql
```

---

## Future Improvements

* User Authentication
* Export Reports (PDF/Excel)
* PostgreSQL Support
* Docker Deployment
* Cloud Hosting
* Advanced Analytics Dashboard
* Multi-user Support

---

## Author

Developed as a full-stack business utility application using FastAPI and modern web technologies.

GitHub Repository:
https://github.com/janani0818-jan/business-calculator
