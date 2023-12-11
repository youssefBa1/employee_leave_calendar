# Employee Leave Calendar

The Employee Leave Calendar is a mobile app developed to automate the process of requesting and handling leave requests.

## Technologies Used

- **Frontend:** React Native
- **Backend:** Flask
- ElasticSearch

## Features

- **Leave Request:** Employees can submit leave requests through the mobile app.
- **Approval Workflow:** Managers can review and approve/deny leave requests.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm
- Python and pip
- ElasticSearch

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/employee-leave-calendar.git
   cd employee-leave-calendar
Install Dependencies:

bash
Copy code
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
Configure ElasticSearch:

Ensure ElasticSearch is installed.

Run ElasticSearch locally or set up connection details in the backend.

Running ElasticSearch Locally:

bash
Copy code
# Download and install ElasticSearch
# Example for Linux/Mac:
curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.15.0-linux-x86_64.tar.gz
tar -xvf elasticsearch-7.15.0-linux-x86_64.tar.gz
cd elasticsearch-7.15.0

# Start ElasticSearch
./bin/elasticsearch
Run the App:

bash
Copy code
# Run the frontend
cd ../frontend
npm start

# Run the backend
cd ../backend
.venv/Scripts/Activate
python app.py
Access the App:
Open your web browser and go to http://localhost:3000 to access the Employee Leave Calendar.
