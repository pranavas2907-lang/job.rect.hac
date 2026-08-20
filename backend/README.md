# JobNest SQL Database

The frontend no longer exposes a user-data viewer. Candidate records can be stored in MySQL and viewed privately through the PHP viewer in this folder.

## 1. Create the database

Run the schema from MySQL, phpMyAdmin, or the MySQL CLI:

```bash
mysql -u root -p < database/jobnest.sql
```

The schema creates:

- `users` for candidate profile records
- `applications` for job applications linked to users

Example queries:

```sql
USE jobnest;
SELECT id, full_name, email, phone, headline, location, resume_name, created_at
FROM users
ORDER BY created_at DESC;

SELECT * FROM applications ORDER BY applied_at DESC;
```

## 2. Configure the PHP viewer

Copy `config.example.php` to `config.php` and set your MySQL credentials. Set a private password for the viewer before starting PHP:

PowerShell:

```powershell
$env:JOBNEST_VIEWER_PASSWORD = "use-a-long-private-password"
php -S localhost:8080 -t backend
```

Open `http://localhost:8080/view_users.php` and enter the viewer password.

`config.php` and the viewer password are intentionally excluded from Git. Never commit database passwords or production credentials.

## Important

The current React demo still saves its profile locally for the browser demo. To write new registrations into MySQL, connect the registration submit handler to a server-side PHP/API endpoint that validates input and inserts into `users` with a prepared PDO statement. Do not put MySQL credentials in React or Vite environment variables exposed to the browser.