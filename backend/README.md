# JobNest SQL Database

Candidate profiles are stored in MySQL through `save_user.php` and viewed privately through `view_users.php` in this folder.

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

Copy `config.example.php` to `config.php` and set both reader and writer MySQL credentials. Set a private password for the viewer before starting PHP:

PowerShell:

```powershell
$env:JOBNEST_VIEWER_PASSWORD = "use-a-long-private-password"
php -S localhost:8080 -t backend
```

Open `http://localhost:8080/view_users.php` and enter the viewer password.

`config.php` and the viewer password are intentionally excluded from Git. Never commit database passwords or production credentials.

## Important

The React registration form posts profile data to `save_user.php`. Do not put MySQL credentials in React or Vite environment variables exposed to the browser.