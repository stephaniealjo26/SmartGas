# SmartGas Fuel Tracker

A web application that helps drivers track fuel prices across different stations.
Built with Laravel 13, React, and Inertia.js.

---

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- npm

---

## Installation

### 1. Clone the repository
git clone https://github.com/your-group/smartgas.git
cd smartgas

### 2. Install PHP dependencies
composer install

### 3. Install JavaScript dependencies
npm install --legacy-peer-deps

### 4. Set up environment file
cp .env.example .env
php artisan key:generate

### 5. Configure your database
Open .env and set your database credentials:
DB_CONNECTION=sqlite
(or mysql, with DB_DATABASE, DB_USERNAME, DB_PASSWORD)

### 6. Run migrations
php artisan migrate

### 7. Build frontend assets
npm run dev

---

## Running the App

Open two terminals:

Terminal 1:
npm run dev

Terminal 2:
php artisan serve

Then visit: http://localhost:8000

---

## Features

- User registration and login (Laravel Breeze)
- Log fuel prices per station
- Select fuel type: Diesel, Unleaded, or Premium
- View personal fuel entry history
- Price displayed in Red if above ₱90.00, Green if below
- Delete fuel entries

---

## Project Structure

app/
  Models/
    FuelEntry.php         — Fuel entry model with belongsTo(User)
  Http/Controllers/
    FuelController.php    — index() and store() methods

database/
  migrations/
    create_fuel_entries_table.php

resources/js/
  Pages/
    Fuel/
      Dashboard.jsx       — Main fuel tracker page
  Components/
    FuelForm.jsx          — Input form
    FuelTable.jsx         — History table
    PriceTag.jsx          — Conditional red/green price color

routes/
  web.php                 — Fuel routes (index, store, destroy)

---

## Group Members & Tasks

| Member | Role                  | Files                                      |
|--------|-----------------------|--------------------------------------------|
| 1      | Database Architect    | create_fuel_entries_table.php              |
| 2      | Model Developer       | FuelEntry.php                              |
| 3      | Backend / Controller  | FuelController.php, web.php                |
| 4      | Frontend Form & Table | Dashboard.jsx, FuelForm.jsx, FuelTable.jsx |
| 5      | Frontend Styling      | PriceTag.jsx, DeleteButton.jsx             |

---

## License

For educational purposes only — BSIT Laboratory Activity