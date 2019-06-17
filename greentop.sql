-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2019 at 08:51 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `greentop`
--

-- --------------------------------------------------------

--
-- Table structure for table `client_master`
--

CREATE TABLE `client_master` (
  `clientid` int(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(500) DEFAULT NULL,
  `contactno` varchar(50) NOT NULL,
  `contactperson1` varchar(50) DEFAULT NULL,
  `contactno1` varchar(50) DEFAULT NULL,
  `contactperson2` varchar(50) DEFAULT NULL,
  `contactno2` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `gstno` varchar(50) DEFAULT NULL,
  `type` int(2) NOT NULL,
  `status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='All suppliers and Customers details are stored here';

--
-- Dumping data for table `client_master`
--

INSERT INTO `client_master` (`clientid`, `name`, `address`, `contactno`, `contactperson1`, `contactno1`, `contactperson2`, `contactno2`, `email`, `city`, `state`, `gstno`, `type`, `status`) VALUES
(1, 'Aadi Plastic Pvt. Ltd.', 'Pune, Maharashtra', '9887655432', 'Mr. Kumar', '9090909090', '', '', 'aadi@gmail.com', 'Pune', 'Maharashtra', 'GST11223344', 1, 1),
(2, 'Kumar Farms', 'Pune, Maharashtra', '22776655', 'Mr. Kumar', '', '', '', '', 'Pune', 'Maharashtra', 'GGNNSSTT', 2, 1),
(3, 'AA Organics', 'Swargate, Pune, Maharashtra', '1234567890', 'Mr. AA', '', '', '', '', 'Pune', 'Maharashtra', 'GG11aa22ss22aasss', 1, 1),
(4, 'Ram BM', 'Pune, Maharashtra', '1324578990', 'Mr. Ram', '', '', '', '', 'Pune', 'Maharashtra', '', 1, 1),
(5, 'Akshay Bags', 'Kolhapur, Maharashtra', '2121212121', 'Mr. Akshay', '', '', '', '', 'Kolhapur', 'Maharashtra', '', 1, 1),
(6, 'Rahul Chemicals', 'Satara, Maharashtra', '3322112233', 'Mr. Rahul', '', '', '', '', 'Satara', 'Maharashtra', '', 1, 1),
(7, 'Zaid Wastes', 'Belgaum, Karnataka', '2244667799', 'Mr. Zaid', '', '', '', '', 'Belgaum', 'Karnataka', '', 1, 1),
(8, 'BB Organics', 'Bangalore, Karnataka', '3322332233', 'Mr. BB', '', '', '', '', 'Bangalore', 'Karnataka', '', 1, 1),
(9, 'Sheti Sang', 'Kolhapur, Maharashtra', '2525252525', 'Mr. Shetilal', '', '', '', '', 'Kolhapur', 'Maharashtra', '', 2, 1),
(10, 'New Supplier ', 'Satara, Maharashtra', '1234567890', 'Naaziya', '1234567890', '', '', 'naaziyat1@gmail.com', 'Satara', 'Maharashtra', 'P123ABC089', 1, 1),
(11, 'Test company', 'Pune, Maharashtra', '0987654321', 'Naaziya Afreen', '0987654321', '', '', 'naaziyat2@gmail.com', 'Pune', 'Maharashtra', 'P545454POIUY', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `client_openingbal`
--

CREATE TABLE `client_openingbal` (
  `openbalid` int(20) NOT NULL,
  `clientid` int(20) NOT NULL,
  `openingbal` varchar(50) NOT NULL,
  `baldate` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_openingbal`
--

INSERT INTO `client_openingbal` (`openbalid`, `clientid`, `openingbal`, `baldate`) VALUES
(1, 3, '0', '1554057000000'),
(2, 1, '0', '1554057000000'),
(3, 5, '0', '1554057000000'),
(4, 2, '0', '1554057000000'),
(5, 9, '0', '1554057000000'),
(6, 11, '0', '1554057000000');

-- --------------------------------------------------------

--
-- Table structure for table `dbsetting_master`
--

CREATE TABLE `dbsetting_master` (
  `dbsettingid` int(20) NOT NULL,
  `dbsettingtitle` varchar(100) NOT NULL,
  `state` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dbsetting_master`
--

INSERT INTO `dbsetting_master` (`dbsettingid`, `dbsettingtitle`, `state`) VALUES
(1, 'Current Stocks', 1),
(2, 'Orders for Current Financial Year', 1),
(3, 'View Suppliers', 1),
(4, 'View Customers', 1);

-- --------------------------------------------------------

--
-- Table structure for table `dispatches_batches`
--

CREATE TABLE `dispatches_batches` (
  `dispbatid` int(20) NOT NULL,
  `dispatchid` int(20) NOT NULL,
  `batchid` int(20) NOT NULL,
  `quantity` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dispatches_batches`
--

INSERT INTO `dispatches_batches` (`dispbatid`, `dispatchid`, `batchid`, `quantity`) VALUES
(1, 1, 1, '10'),
(2, 2, 2, '2');

-- --------------------------------------------------------

--
-- Table structure for table `dispatch_register`
--

CREATE TABLE `dispatch_register` (
  `dispatchid` int(20) NOT NULL,
  `orderid` int(20) NOT NULL,
  `dispatchdate` varchar(20) NOT NULL,
  `dcno` varchar(50) NOT NULL,
  `vehicalno` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dispatch_register`
--

INSERT INTO `dispatch_register` (`dispatchid`, `orderid`, `dispatchdate`, `dcno`, `vehicalno`) VALUES
(1, 1, '1556821800000', '305', 'MH12LL12'),
(2, 2, '1556994600000', '505', 'MH505');

-- --------------------------------------------------------

--
-- Table structure for table `dispatch_transport`
--

CREATE TABLE `dispatch_transport` (
  `disptransid` int(20) NOT NULL,
  `dispatchid` int(20) NOT NULL,
  `rate` varchar(30) NOT NULL,
  `amount` varchar(30) NOT NULL,
  `advance` varchar(30) NOT NULL,
  `paidondate` varchar(20) NOT NULL,
  `remarks` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dispatch_transport`
--

INSERT INTO `dispatch_transport` (`disptransid`, `dispatchid`, `rate`, `amount`, `advance`, `paidondate`, `remarks`) VALUES
(1, 1, '0', '0', '0', '1556821800000', 'Self Transport'),
(2, 2, '0', '0', '0', '1556994600000', 'Self Transport');

-- --------------------------------------------------------

--
-- Table structure for table `order_consignees`
--

CREATE TABLE `order_consignees` (
  `orderconsignid` int(20) NOT NULL,
  `orderid` int(20) NOT NULL,
  `consigneename` varchar(500) NOT NULL,
  `contactperson` varchar(100) NOT NULL,
  `contactnumber` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(100) NOT NULL,
  `address` varchar(500) NOT NULL,
  `quantity` varchar(20) NOT NULL,
  `remarks` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_consignees`
--

INSERT INTO `order_consignees` (`orderconsignid`, `orderid`, `consigneename`, `contactperson`, `contactnumber`, `city`, `state`, `address`, `quantity`, `remarks`) VALUES
(1, 1, 'Sheti Sang', 'Mr. Shetilal', '2525252525', 'Kolhapur', 'Maharashtra', 'Kolhapur, Maharashtra', '10', 'SELF'),
(2, 2, 'Kumar Farms', 'Mr. Kumar', '22776655', 'Pune', 'Maharashtra', 'Pune, Maharashtra', '2', 'SELF');

-- --------------------------------------------------------

--
-- Table structure for table `order_master`
--

CREATE TABLE `order_master` (
  `orderid` int(20) NOT NULL,
  `orderno` varchar(50) NOT NULL,
  `orderdt` varchar(20) NOT NULL,
  `clientid` int(20) NOT NULL,
  `prodid` int(20) NOT NULL,
  `quantity` varchar(20) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_master`
--

INSERT INTO `order_master` (`orderid`, `orderno`, `orderdt`, `clientid`, `prodid`, `quantity`, `remarks`, `status`) VALUES
(1, 'GTO-1', '1556735400000', 9, 1, '10', 'SELF', 'closed'),
(2, 'GTO-2', '1556994600000', 2, 1, '2', 'SELF', 'dispatched');

-- --------------------------------------------------------

--
-- Table structure for table `order_payments`
--

CREATE TABLE `order_payments` (
  `orderpayid` int(20) NOT NULL,
  `paydate` varchar(20) NOT NULL,
  `clientid` varchar(20) NOT NULL,
  `amount` varchar(50) NOT NULL,
  `paymodeid` varchar(20) NOT NULL,
  `particulars` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_payments`
--

INSERT INTO `order_payments` (`orderpayid`, `paydate`, `clientid`, `amount`, `paymodeid`, `particulars`) VALUES
(1, '1556908200000', '9', '10000', '1', ''),
(2, '1556735400000', '9', '5200', '1', '');

-- --------------------------------------------------------

--
-- Table structure for table `order_taxinvoice`
--

CREATE TABLE `order_taxinvoice` (
  `otaxinvoiceid` int(20) NOT NULL,
  `orderid` int(20) NOT NULL,
  `clientid` int(20) NOT NULL,
  `billno` varchar(100) NOT NULL,
  `billdt` varchar(20) NOT NULL,
  `amount` varchar(50) NOT NULL,
  `discount` varchar(50) NOT NULL,
  `rate` varchar(50) NOT NULL,
  `cgst` varchar(20) NOT NULL,
  `sgst` varchar(20) NOT NULL,
  `igst` varchar(20) NOT NULL,
  `roundoff` varchar(50) NOT NULL,
  `totalamount` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_taxinvoice`
--

INSERT INTO `order_taxinvoice` (`otaxinvoiceid`, `orderid`, `clientid`, `billno`, `billdt`, `amount`, `discount`, `rate`, `cgst`, `sgst`, `igst`, `roundoff`, `totalamount`) VALUES
(1, 1, 9, '1', '1556821800000', '20000', '0', '2000', '8', '8', '0', '0', '23200');

-- --------------------------------------------------------

--
-- Table structure for table `paymode_master`
--

CREATE TABLE `paymode_master` (
  `paymodeid` int(20) NOT NULL,
  `paymode` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `paymode_master`
--

INSERT INTO `paymode_master` (`paymodeid`, `paymode`) VALUES
(1, 'Cash'),
(2, 'Netbanking');

-- --------------------------------------------------------

--
-- Table structure for table `production_batch_master`
--

CREATE TABLE `production_batch_master` (
  `batchmastid` int(20) NOT NULL,
  `batchid` varchar(20) NOT NULL,
  `prodid` int(20) NOT NULL,
  `qtyproduced` varchar(20) NOT NULL,
  `qtyremained` varchar(20) NOT NULL,
  `manufacdate` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `production_batch_master`
--

INSERT INTO `production_batch_master` (`batchmastid`, `batchid`, `prodid`, `qtyproduced`, `qtyremained`, `manufacdate`, `status`) VALUES
(1, '1', 1, '10', '0', '1554834600000', 'closed'),
(2, '2', 1, '10', '8', '1555698600000', 'open');

-- --------------------------------------------------------

--
-- Table structure for table `production_batch_register`
--

CREATE TABLE `production_batch_register` (
  `prodregid` int(20) NOT NULL,
  `rawmatid` int(20) NOT NULL,
  `rawmatqty` varchar(20) NOT NULL,
  `batchid` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `product_master`
--

CREATE TABLE `product_master` (
  `prodid` int(20) NOT NULL,
  `prodname` varchar(100) NOT NULL,
  `hsncode` varchar(30) NOT NULL,
  `status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of all products GreenTop produces';

--
-- Dumping data for table `product_master`
--

INSERT INTO `product_master` (`prodid`, `prodname`, `hsncode`, `status`) VALUES
(1, 'ECHOMEAL', '001', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_rawmat_register`
--

CREATE TABLE `product_rawmat_register` (
  `prodrawid` int(20) NOT NULL,
  `prodid` int(20) NOT NULL,
  `rawmatid` int(20) NOT NULL,
  `defquantity` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_master`
--

CREATE TABLE `purchase_master` (
  `purcmastid` int(20) NOT NULL,
  `clientid` int(20) NOT NULL,
  `vehicalno` varchar(100) NOT NULL,
  `dcno` varchar(50) NOT NULL,
  `billno` varchar(50) NOT NULL,
  `billdt` varchar(20) NOT NULL,
  `arrivaldt` varchar(20) NOT NULL,
  `totaldiscount` varchar(50) NOT NULL,
  `totalamount` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the data of page "Purchase Raw Material" and stores all details of purchases';

--
-- Dumping data for table `purchase_master`
--

INSERT INTO `purchase_master` (`purcmastid`, `clientid`, `vehicalno`, `dcno`, `billno`, `billdt`, `arrivaldt`, `totaldiscount`, `totalamount`) VALUES
(1, 1, 'MH12LL12', '204', '304', '1554229800000', '1554143400000', '0', '25000'),
(2, 10, 'MH12AA1', '404', '504', '1554402600000', '1554316200000', '0', '15000'),
(3, 1, 'MH121212', '904', '804', '1554661800000', '1554748200000', '0', '13750');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_payments`
--

CREATE TABLE `purchase_payments` (
  `purchpayid` int(20) NOT NULL,
  `paydate` varchar(20) NOT NULL,
  `clientid` varchar(20) NOT NULL,
  `amount` varchar(50) NOT NULL,
  `paymodeid` varchar(20) NOT NULL,
  `particulars` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `purchase_payments`
--

INSERT INTO `purchase_payments` (`purchpayid`, `paydate`, `clientid`, `amount`, `paymodeid`, `particulars`) VALUES
(1, '1557426600000', '1', '5000', '1', ''),
(2, '1554661800000', '1', '20000', '1', '');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_register`
--

CREATE TABLE `purchase_register` (
  `purcregid` int(20) NOT NULL,
  `purcmastid` int(20) NOT NULL,
  `rawmatid` int(20) NOT NULL,
  `quantity` varchar(20) NOT NULL,
  `rate` varchar(50) NOT NULL,
  `cgst` varchar(20) NOT NULL,
  `sgst` varchar(20) NOT NULL,
  `igst` varchar(20) NOT NULL,
  `discount` varchar(50) NOT NULL,
  `roundoff` varchar(20) NOT NULL,
  `amount` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `purchase_register`
--

INSERT INTO `purchase_register` (`purcregid`, `purcmastid`, `rawmatid`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `discount`, `roundoff`, `amount`) VALUES
(1, 1, 1, '10', '2500', '0', '0', '0', '0', '0', '25000'),
(2, 2, 1, '10', '1500', '0', '0', '0', '0', '0', '15000'),
(3, 3, 5, '250', '50', '5', '5', '0', '0', '0', '12500');

-- --------------------------------------------------------

--
-- Table structure for table `rawmat_wastage_master`
--

CREATE TABLE `rawmat_wastage_master` (
  `wastageid` int(20) NOT NULL,
  `rawmatid` int(20) NOT NULL,
  `quantity` varchar(50) NOT NULL,
  `wastagedt` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rawmat_wastage_master`
--

INSERT INTO `rawmat_wastage_master` (`wastageid`, `rawmatid`, `quantity`, `wastagedt`) VALUES
(2, 1, '5', '1556994600000');

-- --------------------------------------------------------

--
-- Table structure for table `raw_material_master`
--

CREATE TABLE `raw_material_master` (
  `rawmatid` int(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hsncode` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of all the raw materials GreenTop purchases';

--
-- Dumping data for table `raw_material_master`
--

INSERT INTO `raw_material_master` (`rawmatid`, `name`, `hsncode`) VALUES
(1, 'Organic Manure (L.M)', '100'),
(2, 'Slaughter House Waste', '101'),
(3, 'Animal Waste Filler', '102'),
(4, 'Filler Powder', '103'),
(5, 'HDPE Bags', '104');

-- --------------------------------------------------------

--
-- Table structure for table `stock_master`
--

CREATE TABLE `stock_master` (
  `stockid` int(20) NOT NULL,
  `rawmatid` int(20) DEFAULT NULL,
  `prodid` int(20) DEFAULT NULL,
  `quantity` varchar(20) NOT NULL,
  `lastmodifieddate` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of stocks available';

--
-- Dumping data for table `stock_master`
--

INSERT INTO `stock_master` (`stockid`, `rawmatid`, `prodid`, `quantity`, `lastmodifieddate`) VALUES
(1, 1, NULL, '65', '1554402600000'),
(2, 2, NULL, '50', '1557381595706'),
(3, 3, NULL, '50', '1557381714495'),
(4, 4, NULL, '50', '1557381758946'),
(5, 5, NULL, '750', '1554661800000'),
(6, NULL, 1, '38', '1557401622702');

-- --------------------------------------------------------

--
-- Table structure for table `stock_register`
--

CREATE TABLE `stock_register` (
  `stockregid` int(20) NOT NULL,
  `stockid` int(20) NOT NULL,
  `INorOUT` varchar(20) NOT NULL,
  `quantity` varchar(20) NOT NULL,
  `date` varchar(20) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores all the records of IN and OUT of stocks';

--
-- Dumping data for table `stock_register`
--

INSERT INTO `stock_register` (`stockregid`, `stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES
(1, 1, 'IN', '50', '1554057000000', 'Opening Balance'),
(2, 2, 'IN', '50', '1554057000000', 'Opening Balance'),
(3, 3, 'IN', '50', '1554057000000', 'Opening Balance'),
(4, 4, 'IN', '50', '1554057000000', 'Opening Balance'),
(5, 5, 'IN', '500', '1554057000000', 'Opening Balance'),
(6, 6, 'IN', '50', '1554057000000', 'Opening Balance'),
(8, 1, 'OUT', '5', '1556994600000', 'Wastage added'),
(9, 1, 'IN', '10', '1554229800000', 'Purchase Raw Material - Purchase id: 1'),
(10, 1, 'IN', '10', '1554402600000', 'Purchase / Party: New Supplier  / Bill: 504'),
(11, 6, 'OUT', '10', '1557399669887', 'Sales / Sheti Sang'),
(12, 6, 'OUT', '2', '1557401622702', 'Sales / Kumar Farms / Order No: GTO-2'),
(13, 5, 'IN', '250', '1554661800000', 'Purchase / Party: Aadi Plastic Pvt / Bill: 804');

-- --------------------------------------------------------

--
-- Table structure for table `transport_master`
--

CREATE TABLE `transport_master` (
  `tmid` int(20) NOT NULL,
  `transportname` varchar(100) NOT NULL,
  `contactno` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of all Transports';

-- --------------------------------------------------------

--
-- Table structure for table `truck_register`
--

CREATE TABLE `truck_register` (
  `truckid` int(20) NOT NULL,
  `tmid` int(20) NOT NULL,
  `lorryno` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of all "Lorries"';

-- --------------------------------------------------------

--
-- Table structure for table `user_register`
--

CREATE TABLE `user_register` (
  `userid` int(10) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='All the users who can access the application';

--
-- Dumping data for table `user_register`
--

INSERT INTO `user_register` (`userid`, `fullname`, `email`, `password`) VALUES
(1, 'Wasim Mulla', 'wasim3ace@gmail.com', '15b58dc9465b768e848cb7584191aa8f'),
(2, 'Rajesab Teli', 'rteli@gmail.com', '15b58dc9465b768e848cb7584191aa8f');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client_master`
--
ALTER TABLE `client_master`
  ADD PRIMARY KEY (`clientid`);

--
-- Indexes for table `client_openingbal`
--
ALTER TABLE `client_openingbal`
  ADD PRIMARY KEY (`openbalid`);

--
-- Indexes for table `dbsetting_master`
--
ALTER TABLE `dbsetting_master`
  ADD PRIMARY KEY (`dbsettingid`);

--
-- Indexes for table `dispatches_batches`
--
ALTER TABLE `dispatches_batches`
  ADD PRIMARY KEY (`dispbatid`);

--
-- Indexes for table `dispatch_register`
--
ALTER TABLE `dispatch_register`
  ADD PRIMARY KEY (`dispatchid`);

--
-- Indexes for table `dispatch_transport`
--
ALTER TABLE `dispatch_transport`
  ADD PRIMARY KEY (`disptransid`);

--
-- Indexes for table `order_consignees`
--
ALTER TABLE `order_consignees`
  ADD PRIMARY KEY (`orderconsignid`);

--
-- Indexes for table `order_master`
--
ALTER TABLE `order_master`
  ADD PRIMARY KEY (`orderid`);

--
-- Indexes for table `order_payments`
--
ALTER TABLE `order_payments`
  ADD PRIMARY KEY (`orderpayid`);

--
-- Indexes for table `order_taxinvoice`
--
ALTER TABLE `order_taxinvoice`
  ADD PRIMARY KEY (`otaxinvoiceid`);

--
-- Indexes for table `paymode_master`
--
ALTER TABLE `paymode_master`
  ADD PRIMARY KEY (`paymodeid`);

--
-- Indexes for table `production_batch_master`
--
ALTER TABLE `production_batch_master`
  ADD PRIMARY KEY (`batchmastid`);

--
-- Indexes for table `production_batch_register`
--
ALTER TABLE `production_batch_register`
  ADD PRIMARY KEY (`prodregid`);

--
-- Indexes for table `product_master`
--
ALTER TABLE `product_master`
  ADD PRIMARY KEY (`prodid`);

--
-- Indexes for table `product_rawmat_register`
--
ALTER TABLE `product_rawmat_register`
  ADD PRIMARY KEY (`prodrawid`);

--
-- Indexes for table `purchase_master`
--
ALTER TABLE `purchase_master`
  ADD PRIMARY KEY (`purcmastid`);

--
-- Indexes for table `purchase_payments`
--
ALTER TABLE `purchase_payments`
  ADD PRIMARY KEY (`purchpayid`);

--
-- Indexes for table `purchase_register`
--
ALTER TABLE `purchase_register`
  ADD PRIMARY KEY (`purcregid`);

--
-- Indexes for table `rawmat_wastage_master`
--
ALTER TABLE `rawmat_wastage_master`
  ADD PRIMARY KEY (`wastageid`);

--
-- Indexes for table `raw_material_master`
--
ALTER TABLE `raw_material_master`
  ADD PRIMARY KEY (`rawmatid`);

--
-- Indexes for table `stock_master`
--
ALTER TABLE `stock_master`
  ADD PRIMARY KEY (`stockid`);

--
-- Indexes for table `stock_register`
--
ALTER TABLE `stock_register`
  ADD PRIMARY KEY (`stockregid`);

--
-- Indexes for table `transport_master`
--
ALTER TABLE `transport_master`
  ADD PRIMARY KEY (`tmid`);

--
-- Indexes for table `truck_register`
--
ALTER TABLE `truck_register`
  ADD PRIMARY KEY (`truckid`);

--
-- Indexes for table `user_register`
--
ALTER TABLE `user_register`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client_master`
--
ALTER TABLE `client_master`
  MODIFY `clientid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `client_openingbal`
--
ALTER TABLE `client_openingbal`
  MODIFY `openbalid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `dbsetting_master`
--
ALTER TABLE `dbsetting_master`
  MODIFY `dbsettingid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dispatches_batches`
--
ALTER TABLE `dispatches_batches`
  MODIFY `dispbatid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dispatch_register`
--
ALTER TABLE `dispatch_register`
  MODIFY `dispatchid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dispatch_transport`
--
ALTER TABLE `dispatch_transport`
  MODIFY `disptransid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_consignees`
--
ALTER TABLE `order_consignees`
  MODIFY `orderconsignid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_master`
--
ALTER TABLE `order_master`
  MODIFY `orderid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_payments`
--
ALTER TABLE `order_payments`
  MODIFY `orderpayid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_taxinvoice`
--
ALTER TABLE `order_taxinvoice`
  MODIFY `otaxinvoiceid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paymode_master`
--
ALTER TABLE `paymode_master`
  MODIFY `paymodeid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `production_batch_master`
--
ALTER TABLE `production_batch_master`
  MODIFY `batchmastid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `production_batch_register`
--
ALTER TABLE `production_batch_register`
  MODIFY `prodregid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_master`
--
ALTER TABLE `product_master`
  MODIFY `prodid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_rawmat_register`
--
ALTER TABLE `product_rawmat_register`
  MODIFY `prodrawid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_master`
--
ALTER TABLE `purchase_master`
  MODIFY `purcmastid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `purchase_payments`
--
ALTER TABLE `purchase_payments`
  MODIFY `purchpayid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `purchase_register`
--
ALTER TABLE `purchase_register`
  MODIFY `purcregid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rawmat_wastage_master`
--
ALTER TABLE `rawmat_wastage_master`
  MODIFY `wastageid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `raw_material_master`
--
ALTER TABLE `raw_material_master`
  MODIFY `rawmatid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stock_master`
--
ALTER TABLE `stock_master`
  MODIFY `stockid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `stock_register`
--
ALTER TABLE `stock_register`
  MODIFY `stockregid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `transport_master`
--
ALTER TABLE `transport_master`
  MODIFY `tmid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `truck_register`
--
ALTER TABLE `truck_register`
  MODIFY `truckid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_register`
--
ALTER TABLE `user_register`
  MODIFY `userid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
