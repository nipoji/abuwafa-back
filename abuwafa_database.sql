CREATE Database abuwafa_database;
USE abuwafa_database;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2025 at 02:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `abuwafa_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(10) NOT NULL,
  `admin_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `role` enum('Admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `admin_name`, `email`, `username`, `password`, `role`) VALUES
(20250101, 'Utut', 'myutut@gmail.com', 'Admin1', '$2b$10$kbGNIHRxci40qqRbpT6qKecEWlg1hiapF31nMLFiyqhYYsjMKD5nK', 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id_attendance` int(10) NOT NULL,
  `tutor_name` varchar(50) NOT NULL,
  `id_tutor` int(11) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `time` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `session` int(11) NOT NULL,
  `method` enum('Online','Offline') NOT NULL,
  `subject` varchar(20) NOT NULL,
  `image` mediumblob DEFAULT NULL,
  `topic` text DEFAULT NULL,
  `result` text DEFAULT NULL,
  `attendance_status` enum('Present','Absent') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id_invoice` int(10) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `id_student` int(11) NOT NULL,
  `month` varchar(15) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `note` text DEFAULT NULL,
  `link` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_report`
--

CREATE TABLE `monthly_report` (
  `id_monthlyReport` int(10) NOT NULL,
  `month` varchar(15) NOT NULL,
  `id_student` int(11) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `subject` varchar(20) NOT NULL,
  `level` varchar(20) DEFAULT NULL,
  `date` date NOT NULL,
  `tutor_name` varchar(50) NOT NULL,
  `topic` text DEFAULT NULL,
  `result` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `link` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paycheck`
--

CREATE TABLE `paycheck` (
  `id_paycheck` int(10) NOT NULL,
  `tutor_name` varchar(50) NOT NULL,
  `id_tutor` int(11) NOT NULL,
  `month` varchar(15) NOT NULL,
  `salary` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id_schedule` int(10) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `id_student` int(11) NOT NULL,
  `tutor_name` varchar(50) NOT NULL,
  `id_tutor` int(11) NOT NULL,
  `day` varchar(10) NOT NULL,
  `date` date NOT NULL,
  `subject` varchar(20) NOT NULL,
  `time` varchar(20) NOT NULL,
  `method` enum('Online','Offline') NOT NULL,
  `link` varchar(100) DEFAULT NULL,
  `curriculum` varchar(50) NOT NULL,
  `grade` varchar(20) NOT NULL,
  `time_duration` time NOT NULL,
  `total_session` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id_schedule`, `student_name`, `id_student`, `tutor_name`, `id_tutor`, `day`, `date`, `subject`, `time`, `method`, `link`, `curriculum`, `grade`, `time_duration`, `total_session`) VALUES
(2025100001, 'Thariq', 2024030026, 'Hanif', 2025002, 'Monday', '2025-01-02', 'English', '10:00:00', 'Online', 'gogole.com', '', '0', '00:00:00', 0),
(2025100002, 'Thariq', 2024030026, 'Gestut', 2025001, 'Monday', '2025-01-02', 'Math', '14:00:00', 'Online', 'gogole.com', '', '0', '00:00:00', 0),
(2025100003, 'Thariq', 2024030026, 'Gestut', 2025001, 'Tuesday', '2025-01-02', 'Math', '14:00 - 15:00', 'Online', 'gogole.com', 'Merdeka', '6', '00:00:00', 4),
(2025100004, 'Thariq', 2024030026, 'Gestut', 2025001, 'Wednesday', '2025-01-03', 'Math', '14:00 - 15:00', 'Online', 'gogole.com', 'Merdeka', '6th Grade', '00:00:00', 4);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id_student` int(10) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `phone_student` varchar(15) DEFAULT NULL,
  `parent_name` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('Active','Nonactive') NOT NULL,
  `package` varchar(8) DEFAULT NULL,
  `school` varchar(50) DEFAULT NULL,
  `grade` varchar(2) DEFAULT NULL,
  `curriculum` varchar(20) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `role` enum('Student') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id_student`, `student_name`, `phone_student`, `parent_name`, `city`, `address`, `status`, `package`, `school`, `grade`, `curriculum`, `username`, `password`, `role`) VALUES
(2024030026, 'Thariq', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student1', '$2b$10$TErXs9k.7vM/mDZdGPbyNeDqGOLhBCn2RsiLuGb0avK6a3mOyqyBO', 'Student'),
(2024030027, 'Salam', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student2', '$2b$10$8dY7GVbLucOuQ3jRWyJ.3eBZaHvsxpzPbZ7ptzGVpKukWRoG8LV/q', 'Student'),
(2024030028, 'Kansa', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student3', '$2b$10$T7BGHxLbxjjmY9DbdQwBAeo2v.ZXQszYkimaAZ4JFAiTidSZc0pd2', 'Student');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `id_subject` int(10) NOT NULL,
  `subject_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tutors`
--

CREATE TABLE `tutors` (
  `id_tutor` int(10) NOT NULL,
  `tutor_name` varchar(50) NOT NULL,
  `phone_tutor` varchar(15) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `courses_type` varchar(10) DEFAULT NULL,
  `bank` varchar(50) DEFAULT NULL,
  `no_rek` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `role` enum('Tutor') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutors`
--

INSERT INTO `tutors` (`id_tutor`, `tutor_name`, `phone_tutor`, `email`, `address`, `city`, `status`, `courses_type`, `bank`, `no_rek`, `username`, `password`, `role`) VALUES
(2025001, 'Gestut', '-', '-', '-', '-', '-', '-', '-', '-', 'Tutor1', '$2b$10$4k2vvIA3Ut6T42lStMo09eDzIvVoHfqeLspbHzcD1KxxColV/0txu', 'Tutor'),
(2025002, 'Hanif', '--', '--', '--', '--', '--', '--', '--', '--', 'Tutor2', '$2b$10$r6sBSqctTt2hNRryWwgXzuH.wChKZqQ19rCxlnuz3kwSgsMG.duZi', 'Tutor'),
(2025003, 'Fabian', '--', '---', '--', '--', '--', '--', '--', '--', 'Tutor3', '$2b$10$3icZn89r7xmjhnAPcfPlSeERw2VfcXZ/WPQmtGsx2/W4dcuvoAzjq', 'Tutor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id_attendance`),
  ADD KEY `id_tutor` (`id_tutor`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id_invoice`),
  ADD KEY `id_student` (`id_student`);

--
-- Indexes for table `monthly_report`
--
ALTER TABLE `monthly_report`
  ADD PRIMARY KEY (`id_monthlyReport`),
  ADD KEY `id_student` (`id_student`);

--
-- Indexes for table `paycheck`
--
ALTER TABLE `paycheck`
  ADD PRIMARY KEY (`id_paycheck`),
  ADD KEY `id_tutor` (`id_tutor`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id_schedule`),
  ADD KEY `id_student` (`id_student`),
  ADD KEY `id_tutor` (`id_tutor`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id_student`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `student_name` (`student_name`),
  ADD UNIQUE KEY `student_name_2` (`student_name`),
  ADD UNIQUE KEY `student_name_3` (`student_name`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`id_subject`);

--
-- Indexes for table `tutors`
--
ALTER TABLE `tutors`
  ADD PRIMARY KEY (`id_tutor`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `tutor_name` (`tutor_name`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`id_tutor`) REFERENCES `tutors` (`id_tutor`) ON DELETE CASCADE;

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE;

--
-- Constraints for table `monthly_report`
--
ALTER TABLE `monthly_report`
  ADD CONSTRAINT `monthly_report_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE;

--
-- Constraints for table `paycheck`
--
ALTER TABLE `paycheck`
  ADD CONSTRAINT `paycheck_ibfk_1` FOREIGN KEY (`id_tutor`) REFERENCES `tutors` (`id_tutor`) ON DELETE CASCADE;

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`id_tutor`) REFERENCES `tutors` (`id_tutor`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
