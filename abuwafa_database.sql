USE abuwafa_database;

-- Table structure for table `admin`
CREATE TABLE `admin` (
  `id_admin` int(10) NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `role` enum('Admin') NOT NULL,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `attendance`
CREATE TABLE `attendance` (
  `id_attendance` int(10) NOT NULL AUTO_INCREMENT,
  `id_schedule` int(10) NOT NULL,
  `tutor_name` varchar(50) NOT NULL,
  `id_tutor` int(10) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `id_student` int(10) NOT NULL,
  `time` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `session` int(11) NOT NULL,
  `method` enum('Online','Offline') NOT NULL,
  `subject` varchar(20) NOT NULL,
  `id_subject` int(10) NOT NULL,
  `image` varchar(300) DEFAULT NULL,
  `topic` text DEFAULT NULL,
  `result` text DEFAULT NULL,
  `attendance_status` enum('Present','Absent') NOT NULL,
  `report_generated` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_attendance`),
  KEY `id_tutor` (`id_tutor`),
  KEY `id_student` (`id_student`),
  KEY `id_schedule` (`id_schedule`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`id_tutor`) REFERENCES `tutors` (`id_tutor`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`id_schedule`) REFERENCES `schedules` (`id_schedule`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for table `invoices`
CREATE TABLE `invoices` (
  `id_invoice` int(10) NOT NULL AUTO_INCREMENT,
  `student_name` varchar(50) NOT NULL,
  `id_student` int(11) NOT NULL,
  `month` varchar(15) NOT NULL,
  `file` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`id_invoice`),
  KEY `id_student` (`id_student`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `monthly_reports`
CREATE TABLE `monthly_reports` (
  `id_monthlyReport` int(10) NOT NULL AUTO_INCREMENT,
  `id_student` int(11) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `month` varchar(15) NOT NULL,
  `year` int(4) NOT NULL,
  `file_path` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id_monthlyReport`),
  KEY `id_student` (`id_student`),
  CONSTRAINT `monthly_reports_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `paychecks`
CREATE TABLE `paychecks` (
  `id_paycheck` int(50) NOT NULL AUTO_INCREMENT,
  `tutor_name` varchar(50) NOT NULL,
  `id_tutor` int(11) NOT NULL,
  `month` varchar(15) NOT NULL,
  `status` varchar(5) NOT NULL,
  `file` varchar(50) NOT NULL,
  PRIMARY KEY (`id_paycheck`),
  KEY `id_tutor` (`id_tutor`),
  CONSTRAINT `paychecks_ibfk_1` FOREIGN KEY (`id_tutor`) REFERENCES `tutors` (`id_tutor`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `schedules`
CREATE TABLE `schedules` (
  `id_schedule` int(10) NOT NULL AUTO_INCREMENT,
  `student_name` varchar(50) NOT NULL,
  `id_student` int(11) NOT NULL,
  `tutor_name` varchar(50) NOT NULL,
  `id_tutor` int(11) NOT NULL,
  `day` varchar(10) NOT NULL,
  `date` date NOT NULL,
  `subject` varchar(20) NOT NULL,
  `id_subject` int(10) NOT NULL,
  `time` varchar(20) NOT NULL,
  `method` enum('Online','Offline') NOT NULL,
  `link` varchar(100) DEFAULT NULL,
  `curriculum` varchar(50) NOT NULL,
  `grade` varchar(20) NOT NULL,
  `time_duration` int(5) NOT NULL,
  `total_session` int(11) NOT NULL,
  PRIMARY KEY (`id_schedule`),
  KEY `id_student` (`id_student`),
  KEY `id_tutor` (`id_tutor`),
  KEY `id_subject` (`id_subject`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`id_tutor`) REFERENCES `tutors` (`id_tutor`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`id_subject`) REFERENCES `subjects` (`id_subject`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `students`
CREATE TABLE `students` (
  `id_student` int(10) NOT NULL AUTO_INCREMENT,
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
  `role` enum('Student') NOT NULL,
  PRIMARY KEY (`id_student`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `student_name` (`student_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `subjects`
CREATE TABLE `subjects` (
  `id_subject` int(10) NOT NULL AUTO_INCREMENT,
  `subject` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id_subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `tutors`
CREATE TABLE `tutors` (
  `id_tutor` int(10) NOT NULL AUTO_INCREMENT,
  `tutor_name` varchar(50) NOT NULL,
  `phone_tutor` varchar(15) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `address` text DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `courses_type` varchar(10) DEFAULT NULL,
  `bank` varchar(50) DEFAULT NULL,
  `no_rek` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `role` enum('Tutor') NOT NULL,
  PRIMARY KEY (`id_tutor`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `tutor_name` (`tutor_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `admin_name`, `email`, `username`, `password`, `role`) VALUES
(20250101, 'Utut', 'myutut@gmail.com', 'Admin1', '$2b$10$kbGNIHRxci40qqRbpT6qKecEWlg1hiapF31nMLFiyqhYYsjMKD5nK', 'Admin');

-- --------------------------------------------------------

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id_attendance`, `id_schedule`, `tutor_name`, `id_tutor`, `student_name`, `id_student`, `time`, `date`, `session`, `method`, `subject`, `id_subject`, `image`, `topic`, `result`, `attendance_status`, `report_generated`) VALUES
(10015, 2025100017, 'Fabian', 2025003, 'Thariq', 2024030026, '14:00 - 15:00', '2025-01-06', 1, 'Online', 'Coding', 1, NULL, 'Algebra', 'Very good', 'Present', 1),
(10021, 2025100018, 'Fabian', 2025003, 'Thariq', 2024030026, '14:00 - 15:00', '2025-01-06', 1, 'Online', 'Coding', 1, NULL, 'Algebra', 'Very good', 'Present', 0);

-- --------------------------------------------------------

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id_invoice`, `student_name`, `id_student`, `month`, `file`, `status`) VALUES
(1, 'Alwi', 2024030031, 'January', 'invoice1.png', 'true'),
(2, 'Alwi', 2024030031, 'February', 'invoice2.jpg', 'true'),
(4, 'Alwi', 2024030031, 'January', 'invoice1.png', 'true');

-- --------------------------------------------------------

--
-- Dumping data for table `monthly_reports`
--

INSERT INTO `monthly_reports` (`id_monthlyReport`, `id_student`, `student_name`, `month`, `year`, `file_path`) VALUES
(1, 2024030026, 'Thariq', 'January', 2025, 'C:\\Users\\Nip\\OneDrive\\Documents\\ABUWAFA\\SC\\ready\\reports\\Monthly_Report_Thariq_January_2025.pdf');

-- --------------------------------------------------------

--
-- Dumping data for table `paychecks`
--

INSERT INTO `paychecks` (`id_paycheck`, `tutor_name`, `id_tutor`, `month`, `status`, `file`) VALUES
(1, 'Gestut', 2025001, 'February', 'true', 'paycheck1.jpg'),
(2, 'Gestut', 2025001, 'January', 'True', 'paycheckgestut.jpg'),
(4, 'Gestut', 2025001, 'January', 'True', 'paycheckgestut.jpg');

-- --------------------------------------------------------

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id_schedule`, `student_name`, `id_student`, `tutor_name`, `id_tutor`, `day`, `date`, `subject`, `id_subject`, `time`, `method`, `link`, `curriculum`, `grade`, `time_duration`, `total_session`) VALUES
(2025100017, 'Thariq', 2024030026, 'Fabian', 2025003, 'Saturday', '2025-01-11', 'Coding', 1, '14:00 - 15:00', 'Online', 'gogole.com', 'Cambridge', '6', 60, 4),
(2025100018, 'Thariq', 2024030026, 'Fabian', 2025003, 'Saturday', '2025-01-11', 'Coding', 1, '14:00 - 15:00', 'Online', 'gogole.com', 'Merdeka', '6', 60, 4);

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id_student`, `student_name`, `phone_student`, `parent_name`, `city`, `address`, `status`, `package`, `school`, `grade`, `curriculum`, `username`, `password`, `role`) VALUES
(2024030026, 'Thariq', '-', '-', '-', '-', '', '-', '-', '6', '-', 'Student1', '$2b$10$TErXs9k.7vM/mDZdGPbyNeDqGOLhBCn2RsiLuGb0avK6a3mOyqyBO', 'Student'),
(2024030027, 'Salam', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student2', '$2b$10$8dY7GVbLucOuQ3jRWyJ.3eBZaHvsxpzPbZ7ptzGVpKukWRoG8LV/q', 'Student'),
(2024030028, 'Kansa', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student3', '$2b$10$T7BGHxLbxjjmY9DbdQwBAeo2v.ZXQszYkimaAZ4JFAiTidSZc0pd2', 'Student'),
(2024030029, 'Gilbert', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student4', '$2b$10$Se59bq1.w0wedyFrSO3iSuvCLtNezYhKSCuH.XNk8lf1gXbT1vzwm', 'Student'),
(2024030030, 'wuhuuuuu', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student5', '$2b$10$TRJyGWrV6JUpl7Q6Ui9tOO9Fn1grTT.04jnojC.AjYhJUBxQVlizy', 'Student'),
(2024030031, 'Alwi', '-', '-', '-', '-', '', '-', '-', '-', '-', 'Student6', '$2b$10$f8nynq7AnFlRGA1IDVwSYeaDx3cZCD1Izi20Zt5mjBJ7CC3GO1O6.', 'Student');

-- --------------------------------------------------------

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id_subject`, `subject`, `description`) VALUES
(1, 'Coding', 'Pelajaran koding mendasar'),
(2, 'Math basic', 'Pelajaran dasar matematika, seperti tambah dan kurang.'),
(3, 'English basic', 'Pelajar mendasar Bahasa Inggris.'),
(4, 'English basic', 'Pelajar mendasar Bahasa Inggris.');

-- --------------------------------------------------------

--
-- Dumping data for table `tutors`
--

INSERT INTO `tutors` (`id_tutor`, `tutor_name`, `phone_tutor`, `email`, `address`, `status`, `courses_type`, `bank`, `no_rek`, `username`, `password`, `role`) VALUES
(2025001, 'Gestut', '-', '-', '-', '-', '-', '-', '-', 'Tutor1', '$2b$10$4k2vvIA3Ut6T42lStMo09eDzIvVoHfqeLspbHzcD1KxxColV/0txu', 'Tutor'),
(2025002, 'Hanif', '--', '--', '--', '--', '--', '--', '--', 'Tutor2', '$2b$10$r6sBSqctTt2hNRryWwgXzuH.wChKZqQ19rCxlnuz3kwSgsMG.duZi', 'Tutor'),
(2025003, 'Fabian', '--', '---', '--', '--', '--', '--', '--', 'Tutor3', '$2b$10$3icZn89r7xmjhnAPcfPlSeERw2VfcXZ/WPQmtGsx2/W4dcuvoAzjq', 'Tutor');