-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 12, 2025 at 06:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id_attendance`, `tutor_name`, `id_tutor`, `student_name`, `time`, `date`, `session`, `method`, `subject`, `image`, `topic`, `result`, `attendance_status`) VALUES
(10001, 'Gestut', 2025001, 'Thariq', '14:00 - 15:00', '2025-01-06', 4, 'Online', 'Math', NULL, 'Algebra', 'Very good', 'Present'),
(10002, 'Gestut', 2025001, 'Thariq', '14:00 - 15:00', '2025-01-06', 4, 'Online', 'Math', NULL, 'Algebra', 'Very good', 'Present'),
(10003, 'Gestut', 2025001, 'Thariq', '14:00 - 15:00', '2025-01-06', 4, 'Online', 'Math', NULL, 'Algebra', 'Very good', 'Present'),
(10004, 'Gestut', 2025001, 'Thariq', '14:00 - 15:00', '2025-01-06', 4, 'Online', 'Math', NULL, 'Algebra', 'Very good', 'Present'),
(10005, 'Gestut', 2025001, 'Thariq', '14:00 - 15:00', '2025-01-06', 4, 'Online', 'Math', NULL, 'Algebra', 'Very good', 'Present'),
(10006, 'Gestut', 2025001, 'Thariq', '14:00 - 15:00', '2025-01-06', 4, 'Online', 'Math', 0x68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f616275776166612d6275636b65742f313733363532303539343639382de28094506e6774726565e280946461726b20736f756c73207368696e6f62692077616c6c706170657220666f725f323636303430302e6a7067, 'Algebra', 'Very good', 'Present'),
(10007, 'Gestut', 2025001, 'Thariq', '14:00 - 15:00', '2025-01-06', 4, 'Online', 'Math', 0x68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f616275776166612d6275636b65742f313733363532303738353831392de28094506e6774726565e280946461726b20736f756c73207368696e6f62692077616c6c706170657220666f725f323636303430302e6a7067, 'Algebra', 'Very good', 'Present'),
(10008, 'Gestut', 2025001, 'Thariq', '14:00 - 15:00', '2025-01-06', 4, 'Online', 'Math', NULL, 'Algebra', 'Very good', 'Present');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id_invoice` int(10) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `id_student` int(11) NOT NULL,
  `month` varchar(15) NOT NULL,
  `file` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id_invoice`, `student_name`, `id_student`, `month`, `file`, `status`) VALUES
(1, 'Alwi', 2024030031, 'January', 'invoice1.png', 'true'),
(2, 'Alwi', 2024030031, 'February', 'invoice2.jpg', 'true'),
(4, 'Alwi', 2024030031, 'January', 'invoice1.png', 'true');

-- --------------------------------------------------------

--
-- Table structure for table `monthly_report`
--

CREATE TABLE `monthly_report` (
  `id_monthlyReport` int(10) NOT NULL,
  `id_student` int(11) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `month` varchar(15) NOT NULL,
  `file` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paychecks`
--

CREATE TABLE `paychecks` (
  `id_paycheck` int(50) NOT NULL,
  `tutor_name` varchar(50) NOT NULL,
  `id_tutor` int(11) NOT NULL,
  `month` varchar(15) NOT NULL,
  `status` varchar(5) NOT NULL,
  `file` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paychecks`
--

INSERT INTO `paychecks` (`id_paycheck`, `tutor_name`, `id_tutor`, `month`, `status`, `file`) VALUES
(1, 'Gestut', 2025001, 'February', 'true', 'paycheck1.jpg'),
(2, 'Gestut', 2025001, 'January', 'True', 'paycheckgestut.jpg'),
(4, 'Gestut', 2025001, 'January', 'True', 'paycheckgestut.jpg');

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
(2025100004, 'Thariq', 2024030026, 'Gestut', 2025001, 'Wednesday', '2025-01-03', 'Math', '14:00 - 15:00', 'Online', 'gogole.com', 'Merdeka', '6th Grade', '00:00:00', 4),
(2025100005, 'Thariq', 2024030026, 'Gestut', 2025001, 'Wednesday', '0000-00-00', 'Math', '14:00 - 15:00', 'Online', 'gogole.com', 'Merdeka', '6th Grade', '00:00:00', 4),
(2025100006, 'Thariq', 2024030026, 'Gestut', 2025001, 'Friday', '2025-01-03', 'Math', '14:00 - 15:00', 'Online', 'gogole.com', 'Merdeka', '6th Grade', '00:00:00', 4),
(2025100008, 'Thariq', 2024030026, 'Fabian', 2025003, 'Saturday', '2025-01-11', 'Coding', '14:00 - 15:00', 'Online', 'gogole.com', 'Merdeka', '6th Grade', '00:00:00', 4),
(2025100009, 'Thariq', 2024030026, 'Fabian', 2025003, 'Saturday', '2025-01-11', 'Coding', '14:00 - 15:00', 'Online', 'gogole.com', 'Merdeka', '6th Grade', '00:00:00', 4);

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
(2024030028, 'Kansa', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student3', '$2b$10$T7BGHxLbxjjmY9DbdQwBAeo2v.ZXQszYkimaAZ4JFAiTidSZc0pd2', 'Student'),
(2024030029, 'Gilbert', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student4', '$2b$10$Se59bq1.w0wedyFrSO3iSuvCLtNezYhKSCuH.XNk8lf1gXbT1vzwm', 'Student'),
(2024030030, 'wuhuuuuu', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student5', '$2b$10$TRJyGWrV6JUpl7Q6Ui9tOO9Fn1grTT.04jnojC.AjYhJUBxQVlizy', 'Student'),
(2024030031, 'Alwi', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student6', '$2b$10$f8nynq7AnFlRGA1IDVwSYeaDx3cZCD1Izi20Zt5mjBJ7CC3GO1O6.', 'Student');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id_subject` int(10) NOT NULL,
  `subject_title` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id_subject`, `subject_title`, `description`) VALUES
(1, 'Coding', 'Pelajaran koding mendasar'),
(2, 'Math basic', 'Pelajaran dasar matematika, seperti tambah dan kurang.'),
(3, 'English basic', 'Pelajar mendasar Bahasa Inggris.'),
(4, 'English basic', 'Pelajar mendasar Bahasa Inggris.');

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
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id_invoice`),
  ADD KEY `id_student` (`id_student`);

--
-- Indexes for table `monthly_report`
--
ALTER TABLE `monthly_report`
  ADD PRIMARY KEY (`id_monthlyReport`),
  ADD KEY `id_student` (`id_student`);

--
-- Indexes for table `paychecks`
--
ALTER TABLE `paychecks`
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
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id_attendance` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10009;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id_invoice` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `monthly_report`
--
ALTER TABLE `monthly_report`
  MODIFY `id_monthlyReport` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paychecks`
--
ALTER TABLE `paychecks`
  MODIFY `id_paycheck` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id_subject` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`id_tutor`) REFERENCES `tutors` (`id_tutor`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE;

--
-- Constraints for table `monthly_report`
--
ALTER TABLE `monthly_report`
  ADD CONSTRAINT `monthly_report_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE;

--
-- Constraints for table `paychecks`
--
ALTER TABLE `paychecks`
  ADD CONSTRAINT `paychecks_ibfk_1` FOREIGN KEY (`id_tutor`) REFERENCES `tutors` (`id_tutor`) ON DELETE CASCADE;

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
