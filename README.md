# Dokumentasi
**[Endpoint](https://documenter.getpostman.com/view/34827171/2sAYJ9Ae6N)**

Buat .env yang berisi

KEY_JWT="isi apapun"
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME="isi nama database"
DB_PORT=3306

=========================================================

Buat database menggunakan mysql, lalu buat tabel:

CREATE TABLE Students (
    id_student INT(10) PRIMARY KEY,
    student_name VARCHAR(50) NOT NULL,
    phone_student VARCHAR(15),
    parent_name VARCHAR(50),
    city VARCHAR(50),
    address TEXT,
    status ENUM('Active', 'Nonactive') NOT NULL,
    package VARCHAR(8),
    school VARCHAR(50),
    grade VARCHAR(2),
    curriculum VARCHAR(20),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(300) NOT NULL,
    role ENUM('Student') NOT NULL
);

==========================================================

CREATE TABLE Tutors (
    id_tutor INT(10) PRIMARY KEY,
    tutor_name VARCHAR(50) NOT NULL,
    phone_tutor VARCHAR(15),
    email VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(50),
    status VARCHAR(10),
    courses_type VARCHAR(10),
    bank VARCHAR(50),
    no_rek VARCHAR(50),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(300) NOT NULL,
    role ENUM('Tutor') NOT NULL
);

==========================================================

CREATE TABLE Admin (
    id_admin INT(10) PRIMARY KEY,
    admin_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(300) NOT NULL,
    role ENUM('Admin') NOT NULL
);

==========================================================

CREATE TABLE Schedules (
    id_schedule INT(10) PRIMARY KEY,
    student_name VARCHAR(50) NOT NULL,
    id_student INT NOT NULL,
    tutor_name VARCHAR(50) NOT NULL,
    id_tutor INT NOT NULL,
    days VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(20) NOT NULL,
    time VARCHAR(20) NOT NULL,
    type ENUM('Online', 'Offline') NOT NULL,
    link VARCHAR(100),
    curriculum VARCHAR(50) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    time_duration TIME NOT NULL,
    total_session INT NOT NULL,
    FOREIGN KEY (id_student) REFERENCES Students(id_student) ON DELETE CASCADE,
    FOREIGN KEY (id_tutor) REFERENCES Tutors(id_tutor) ON DELETE CASCADE
);
