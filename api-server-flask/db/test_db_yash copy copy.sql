-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: 127.0.0.1    Database: test_db
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `general_transaction_logs`
--

DROP TABLE IF EXISTS `general_transaction_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `general_transaction_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ids` text COLLATE utf8mb4_general_ci,
  `uid` int DEFAULT NULL,
  `payer_email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` text COLLATE utf8mb4_general_ci,
  `transaction_id` text COLLATE utf8mb4_general_ci,
  `txn_fee` double DEFAULT NULL,
  `note` int DEFAULT NULL,
  `data` text COLLATE utf8mb4_general_ci,
  `amount` float DEFAULT NULL,
  `status` int DEFAULT '1',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=26763 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `general_transaction_logs`
--

LOCK TABLES `general_transaction_logs` WRITE;
/*!40000 ALTER TABLE `general_transaction_logs` DISABLE KEYS */;
INSERT INTO `general_transaction_logs` VALUES (12587,'ADDED THOURH BOT PAYTM',39,NULL,'coinbase','2aa79c6e-d5f8-4547-85e7-2b3042a62bec',NULL,6969,NULL,20,1,'2024-11-14 08:36:32'),(24563,'ADDED THROUGH BOT',40,NULL,'paytm_qr','c489ee69-4072-4cf0-8b3d-7c40b8b2ba',NULL,0,NULL,5.88235,1,'2025-06-22 18:03:14'),(12584,'ADDED THROUGH BOT',517,NULL,'paytm_qr','be997bb9-8719-43e1-ac41-778a74bc85',NULL,0,NULL,5.88235,1,'2024-11-14 06:26:46'),(12583,'Bonus',38,NULL,'bonus','SIGNUP BONUS',NULL,0,NULL,0.05,1,'2024-11-14 04:26:38'),(12582,'Bonus',41,NULL,'bonus','SIGNUP BONUS',NULL,0,NULL,0.05,1,'2024-11-14 03:51:31');
/*!40000 ALTER TABLE `general_transaction_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `general_users`
--

DROP TABLE IF EXISTS `general_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `general_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ids` text COLLATE utf8mb4_general_ci,
  `role` enum('admin','user') COLLATE utf8mb4_general_ci DEFAULT 'user',
  `login_type` text COLLATE utf8mb4_general_ci,
  `first_name` text COLLATE utf8mb4_general_ci,
  `last_name` text COLLATE utf8mb4_general_ci,
  `email` text COLLATE utf8mb4_general_ci,
  `password` text COLLATE utf8mb4_general_ci,
  `timezone` text COLLATE utf8mb4_general_ci,
  `more_information` text COLLATE utf8mb4_general_ci,
  `settings` longtext COLLATE utf8mb4_general_ci,
  `descd` longtext COLLATE utf8mb4_general_ci,
  `balance` decimal(15,4) DEFAULT '0.0000',
  `affiliate_bal_available` decimal(15,4) DEFAULT '0.0000',
  `affiliate_bal_transferred` decimal(15,4) DEFAULT '0.0000',
  `custom_rate` int NOT NULL DEFAULT '0',
  `api_key` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `affiliate_id` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `referral_id` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `spent` varchar(225) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activation_key` text COLLATE utf8mb4_general_ci,
  `reset_key` text COLLATE utf8mb4_general_ci,
  `history_ip` text COLLATE utf8mb4_general_ci,
  `status` int DEFAULT '1',
  `changed` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=28647 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `general_users`
--

LOCK TABLES `general_users` WRITE;
/*!40000 ALTER TABLE `general_users` DISABLE KEYS */;
INSERT INTO `general_users` VALUES (26740,'4e1ef309bd2c3a3bd1da6061eb0efe8d','user',NULL,'Services','Account','Amitdwivedi1234101@telesmm.in','$2a$08$aGEY2II59u2fZnHCpt/f7e1G45q3gn6JQvciykMGzvPCFGCz2YDo.','Asia/Kolkata','{\"skype_id\":\"9993322334442\"}','{\"limit_payments\":[]}',NULL,0.0000,0.0000,0.0000,0,'5x2nDWKtUuECxZiDNU68QHL870QQdo4j','93838808',NULL,NULL,'Dx64B4ZiEs0xzvlM9ZGyMIYqABswyrzc','5d8d825f8139e74f778f28a205075111','2401:4900:7cd5:e200:dc02:68ff:feee:dda4',1,'2025-07-07 22:14:39','2025-07-07 22:14:39'),(38,'e7ace76210625c6880498190c0af2d58','admin',NULL,'Vicky','Kumar','vreve123@gmail.com','$2a$08$qZ4aOGG3nF5jRkz6ZZg14u1VSFq359Bgx8PItXQnKfTBsYAvDUsoG','Asia/Kolkata',NULL,NULL,'',1.3332,0.0000,0.0000,0,'LBNglKzRVkBLq0YU6aM4ySycLv8iAnel',NULL,NULL,'550265.8266','c4a78c5172c30e669bb05d9dse48d6f5','eae94719d7c0f03dc467905e580a7c96','2405:201:ac00:e804:a5a7:7304:b038:311b',1,'2025-03-16 07:10:54',NULL),(39,'3fb7a81051e033d1b88a6eab1fb1f0c7','admin',NULL,'Govind','Chaudhary','govindchaudhary133@gmail.com','$2a$08$/fuVcZRc01hb4B5Ap01MeevCdj.T5/yczXpBPtbFCHmvkNMVQxduO','Asia/Kolkata',NULL,'{\"limit_payments\":{\"payumoney\":\"1\",\"paytm_qr\":\"1\",\"coinbase\":\"1\"}}','',0.1628,0.0000,0.0000,0,'jVtRvSDyWnMUDKI5YS6abd4EXDPiufVz',NULL,NULL,NULL,'8dbdd05202445781c067ae339a8c7855','0fdb725dd53ae21f55fa08e2693a5faf','49.37.103.105',1,'2022-05-04 18:57:05','2021-03-28 04:36:47'),(40,'a41195724dd349cc1d9c2e3151e1ec8e','user',NULL,'usber','kumar','usber555@gmail.com','loda','Pacific/Midway',NULL,NULL,'',0.0000,0.0000,0.0000,0,'Z8KKT33Oqti6zugqBMZZatYia4sYTZzT',NULL,NULL,'176',NULL,'23255e91930f44d7dcff499e50395702','220.158.157.229',1,'2023-07-12 21:58:37','2021-03-28 09:29:32'),(41,'34bb5c2897ae8a1b17bb5daf19e3a5f6','user',NULL,'Ayush','Mishra ','ayushmishra1004@gmail.com','$2a$08$3Oorc0/nHK6Kea2MZdNxa.Uj0NOhXjQge0xH86f/uGkT5lE3L0q5W','Asia/Kolkata',NULL,NULL,NULL,0.2706,0.0000,0.0000,0,'CpzQE81jY7haO8d3neNLb6sJaHlnbWef',NULL,NULL,NULL,'afe8c97c8b62ca08af5bd816c1c56de1','b5878ea415b09816aeb4edcf4b08df15','2409:4052:e1b:448d::3848:6e0f',1,'2021-03-28 19:40:31','2021-03-28 19:40:31');
/*!40000 ALTER TABLE `general_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ids` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `type` enum('direct','api') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'direct',
  `cate_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_order_id` int DEFAULT NULL,
  `service_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'default',
  `api_provider_id` int DEFAULT NULL,
  `api_service_id` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_order_id` int DEFAULT '0',
  `uid` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usernames` text COLLATE utf8mb4_unicode_ci,
  `username` text COLLATE utf8mb4_unicode_ci,
  `hashtags` text COLLATE utf8mb4_unicode_ci,
  `hashtag` text COLLATE utf8mb4_unicode_ci,
  `media` text COLLATE utf8mb4_unicode_ci,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `sub_posts` int DEFAULT NULL,
  `sub_min` int DEFAULT NULL,
  `sub_max` int DEFAULT NULL,
  `sub_delay` int DEFAULT NULL,
  `sub_expiry` text COLLATE utf8mb4_unicode_ci,
  `sub_response_orders` text COLLATE utf8mb4_unicode_ci,
  `sub_response_posts` text COLLATE utf8mb4_unicode_ci,
  `sub_status` enum('Active','Paused','Completed','Expired','Canceled') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `charge` decimal(15,4) DEFAULT NULL,
  `formal_charge` decimal(15,4) DEFAULT NULL,
  `profit` decimal(15,4) DEFAULT NULL,
  `status` enum('active','completed','processing','inprogress','pending','partial','canceled','refunded','awaiting','error','fail') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `start_counter` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remains` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `is_drip_feed` int DEFAULT '0',
  `runs` int DEFAULT '0',
  `interval_` int DEFAULT '0',
  `dripfeed_quantity` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `note` text COLLATE utf8mb4_unicode_ci,
  `changed` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6980518 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1144007,'cdf3fa2faa1b34b1d5b7c756730da787','direct','361','4180',NULL,'default',3,'4520',43041144,'38','https://t.me/radheexchange7/296','2700',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.0324,0.0019,0.0305,'completed','2','0',0,0,0,'0','','2023-08-01 01:55:13','2023-08-01 01:11:37'),(1144530,'2dbfc9c48a3df07a00e730ef787187e1','direct','361','4180',NULL,'default',3,'4520',43069073,'26740','https://t.me/A_P_C1471/1769','100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.0012,0.0001,0.0011,'completed','353','0',0,0,0,'0','','2023-08-01 03:35:04','2023-08-01 02:56:40'),(1145222,'d42c7ce2d034349351fa4f403455c0ab','direct','361','4180',NULL,'default',3,'4520',43108062,'39','https://t.me/radheexchange7/299','800',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.0096,0.0006,0.0090,'completed','9','0',0,0,0,'0','','2023-08-01 05:31:42','2023-08-01 05:00:24'),(1145270,'8840c32bf6ee2d99bff882a92cc48d60','direct','361','4180',NULL,'default',3,'4520',43112230,'40','https://t.me/radheexchange7/300?single','450',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.0054,0.0003,0.0051,'completed','2','0',0,0,0,'0','','2023-08-01 05:52:02','2023-08-01 05:14:52'),(1145280,'3ff280b049c84b46f2f6689d40eef2dc','direct','361','4180',NULL,'default',3,'4520',43112516,'7160','https://t.me/radheexchange7/320?single','700',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.0084,0.0005,0.0079,'completed','3','0',0,0,0,'0','','2023-08-01 05:54:15','2023-08-01 05:15:20');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-16 14:01:15
