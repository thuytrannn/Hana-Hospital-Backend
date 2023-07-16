# Hana-Hospital-Backend
Website building project for Hana plastic surgery hospital - Backend.
Website is used with 3 roles: patient, doctor and administrator.
## It has the following main functions:
- For patients: view information, book an appointment, receive email confirmation of examination and email bill.
- For doctors: login function, manage medical examination schedule, manage list of patients examined, send invoices to patients via email (confirmation).
- For administrators: login function, user management, doctor management, medical examination schedule management, clinic management, specialty management.
## Technologies:
- Frontend: Reactjs (v18.2.0) + Redux. HTML/CSS-SCSS/Bootstrap (reactrap).

- Backend: Node.js (v14.17.0) (Express) + MySql (Sequelize), PostgreSQL.
## The production environment I use to deploy the website:
- Backend: render
- Frontend: vercel
- Database: supabase
## Website link:
- For patients: https://hana-hospital-frontend.vercel.app/home
- For doctors and administrators: https://hana-hospital-frontend.vercel.app/login
## To see the details of the doctor and admin layout, I have prepared 2 accounts to log in according to the role below:
### Role doctor:
- Email: doctor@gmail.com
- Password: 12345
### Role admin:
- Email: admin@gmail.com
- Password: 12345
## In the project directory, you can run:
`npm start`