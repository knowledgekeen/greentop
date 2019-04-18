-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2019 at 08:04 AM
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
(1, 'Aadi Plastic Pvt. Ltd.', 'Pune, Maharashtra', '1234567890', 'Mr. Kumar', '9090909090', '', '', 'aadi@gmail.com', 'Pune', 'Maharashtra', 'GST11223344', 1, 1),
(2, 'Kumar Farms', 'Pune, Maharashtra', '22776655', 'Mr. Kumar', '', '', '', '', 'Pune', 'Maharashtra', 'GGNNSSTT', 2, 1);

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
  `address` varchar(500) NOT NULL,
  `quantity` varchar(20) NOT NULL,
  `remarks` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_master`
--

CREATE TABLE `order_master` (
  `orderid` int(20) NOT NULL,
  `orderdt` varchar(20) NOT NULL,
  `clientid` int(20) NOT NULL,
  `prodid` int(20) NOT NULL,
  `quantity` varchar(20) NOT NULL,
  `amount` varchar(50) DEFAULT NULL,
  `discount` varchar(50) DEFAULT NULL,
  `rate` varchar(50) DEFAULT NULL,
  `cgst` varchar(20) DEFAULT NULL,
  `sgst` varchar(20) DEFAULT NULL,
  `igst` varchar(20) DEFAULT NULL,
  `totalamount` varchar(50) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `production_batch_master`
--

CREATE TABLE `production_batch_master` (
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

INSERT INTO `production_batch_master` (`batchid`, `prodid`, `qtyproduced`, `qtyremained`, `manufacdate`, `status`) VALUES
('1', 3, '3', '3', '1556994600000', 'open'),
('2', 3, '2', '2', '1554402600000', 'open'),
('3', 3, '1', '1', '1554229800000', 'open');

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

--
-- Dumping data for table `production_batch_register`
--

INSERT INTO `production_batch_register` (`prodregid`, `rawmatid`, `rawmatqty`, `batchid`) VALUES
(1, 1, '100', '1'),
(2, 3, '3', '1'),
(3, 1, '50', '2'),
(4, 3, '2', '2'),
(5, 1, '100', '3'),
(6, 3, '1', '3');

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
(3, 'ECHOMEAL', '100', 1);

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

--
-- Dumping data for table `product_rawmat_register`
--

INSERT INTO `product_rawmat_register` (`prodrawid`, `prodid`, `rawmatid`, `defquantity`) VALUES
(1, 3, 3, '3'),
(2, 3, 1, '100');

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
(1, 1, 'MH12LL1234', '104', '114', '1554921000000', '1554834600000', '0', '22000'),
(2, 1, 'MH09AB2233', '114', '124', '1555007400000', '1554921000000', '0', '11000'),
(3, 1, 'MH21DD432', '123', '133', '1552415400000', '1552329000000', '0', '12345'),
(4, 1, 'MH10HH1212', '44', '54', '1554402600000', '1554316200000', '0', '2000');

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
(1, 1, 1, '100', '200', '5', '5', '0', '0', '0', '20000'),
(2, 2, 1, '50', '200', '5', '5', '0', '0', '0', '10000'),
(3, 3, 2, '10', '1234', '0', '0', '0', '0', '5', '12340'),
(4, 4, 2, '10', '200', '0', '0', '0', '0', '0', '2000');

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
(1, 'HDPE Bags', '100'),
(3, 'Organic Manure (L.M)', '100');

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
(2, 1, NULL, '0', '1555493166897'),
(5, 3, NULL, '4', '1555493166897'),
(6, NULL, 3, '11', '1555493166897');

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
(2, 2, 'IN', '100', '1555266600000', 'Opening Balance'),
(3, 2, 'IN', '100', '1554921000000', 'Purchase Raw Material'),
(4, 2, 'IN', '50', '1555007400000', 'Purchase Raw Material'),
(9, 5, 'IN', '10', '1554921000000', 'Opening Balance'),
(10, 6, 'IN', '10', '1554834600000', 'Opening Balance'),
(11, 2, 'OUT', '100', '1555490490179', 'Updated Stock, created new batch, batchid: 1'),
(12, 5, 'OUT', '3', '1555490490179', 'Updated Stock, created new batch, batchid: 1'),
(13, 2, 'OUT', '50', '1555491387786', 'Updated Stock, created new batch, batchid: 2'),
(14, 5, 'OUT', '2', '1555491387786', 'Updated Stock, created new batch, batchid: 2'),
(15, 2, 'OUT', '100', '1555493166897', 'Updated Stock, created new batch, batchid: 3'),
(16, 5, 'OUT', '1', '1555493166897', 'Updated Stock, created new batch, batchid: 3'),
(17, 6, 'IN', '1', '1554229800000', 'Updated Stock, created new batch, batchid: 3');

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
-- Table structure for table `transport_payment_register`
--

CREATE TABLE `transport_payment_register` (
  `transportpayid` int(20) NOT NULL,
  `rate` varchar(50) NOT NULL,
  `amount` varchar(50) NOT NULL,
  `advance` varchar(50) NOT NULL,
  `paidon` varchar(20) NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Indexes for table `production_batch_master`
--
ALTER TABLE `production_batch_master`
  ADD PRIMARY KEY (`batchid`);

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
-- Indexes for table `purchase_register`
--
ALTER TABLE `purchase_register`
  ADD PRIMARY KEY (`purcregid`);

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
-- Indexes for table `transport_payment_register`
--
ALTER TABLE `transport_payment_register`
  ADD PRIMARY KEY (`transportpayid`);

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
  MODIFY `clientid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dispatches_batches`
--
ALTER TABLE `dispatches_batches`
  MODIFY `dispbatid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispatch_register`
--
ALTER TABLE `dispatch_register`
  MODIFY `dispatchid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispatch_transport`
--
ALTER TABLE `dispatch_transport`
  MODIFY `disptransid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_consignees`
--
ALTER TABLE `order_consignees`
  MODIFY `orderconsignid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `production_batch_register`
--
ALTER TABLE `production_batch_register`
  MODIFY `prodregid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_master`
--
ALTER TABLE `product_master`
  MODIFY `prodid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_rawmat_register`
--
ALTER TABLE `product_rawmat_register`
  MODIFY `prodrawid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `purchase_master`
--
ALTER TABLE `purchase_master`
  MODIFY `purcmastid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `purchase_register`
--
ALTER TABLE `purchase_register`
  MODIFY `purcregid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `raw_material_master`
--
ALTER TABLE `raw_material_master`
  MODIFY `rawmatid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stock_master`
--
ALTER TABLE `stock_master`
  MODIFY `stockid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `stock_register`
--
ALTER TABLE `stock_register`
  MODIFY `stockregid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `transport_master`
--
ALTER TABLE `transport_master`
  MODIFY `tmid` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transport_payment_register`
--
ALTER TABLE `transport_payment_register`
  MODIFY `transportpayid` int(20) NOT NULL AUTO_INCREMENT;

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
