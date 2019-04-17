-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2019 at 10:07 PM
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
  `clientid` int(10) NOT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `dispatches_batches`
--

CREATE TABLE `dispatches_batches` (
  `dispbatid` int(10) NOT NULL,
  `dispatchid` int(10) NOT NULL,
  `batchid` int(10) NOT NULL,
  `quantity` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `dispatch_register`
--

CREATE TABLE `dispatch_register` (
  `dispatchid` int(10) NOT NULL,
  `orderid` int(10) NOT NULL,
  `dispatchdate` varchar(20) NOT NULL,
  `dcno` varchar(10) NOT NULL,
  `vehicalno` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `dispatch_transport`
--

CREATE TABLE `dispatch_transport` (
  `disptransid` int(10) NOT NULL,
  `dispatchid` int(10) NOT NULL,
  `rate` varchar(20) NOT NULL,
  `amount` varchar(20) NOT NULL,
  `advance` varchar(20) NOT NULL,
  `paidondate` varchar(20) NOT NULL,
  `remarks` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_consignees`
--

CREATE TABLE `order_consignees` (
  `orderconsignid` int(10) NOT NULL,
  `orderid` int(10) NOT NULL,
  `contactperson` varchar(50) NOT NULL,
  `contactnumber` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `address` varchar(500) NOT NULL,
  `quantity` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_master`
--

CREATE TABLE `order_master` (
  `orderid` int(10) NOT NULL,
  `orderdt` varchar(20) NOT NULL,
  `clientid` int(10) NOT NULL,
  `prodid` int(10) NOT NULL,
  `quantity` varchar(20) NOT NULL,
  `amount` varchar(20) DEFAULT NULL,
  `discount` varchar(20) DEFAULT NULL,
  `rate` varchar(50) DEFAULT NULL,
  `cgst` varchar(10) DEFAULT NULL,
  `sgst` varchar(10) DEFAULT NULL,
  `igst` varchar(10) DEFAULT NULL,
  `totalamount` varchar(20) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `production_batch_master`
--

CREATE TABLE `production_batch_master` (
  `batchid` varchar(15) NOT NULL,
  `prodid` int(10) NOT NULL,
  `qtyproduced` varchar(10) NOT NULL,
  `qtyremained` varchar(10) NOT NULL,
  `manufacdate` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `production_batch_register`
--

CREATE TABLE `production_batch_register` (
  `prodregid` int(10) NOT NULL,
  `rawmatid` int(10) NOT NULL,
  `rawmatqty` varchar(10) NOT NULL,
  `batchid` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `product_master`
--

CREATE TABLE `product_master` (
  `prodid` int(10) NOT NULL,
  `prodname` varchar(50) NOT NULL,
  `hsncode` varchar(30) NOT NULL,
  `status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of all products GreenTop produces';

-- --------------------------------------------------------

--
-- Table structure for table `product_rawmat_register`
--

CREATE TABLE `product_rawmat_register` (
  `prodrawid` int(10) NOT NULL,
  `prodid` int(10) NOT NULL,
  `rawmatid` int(10) NOT NULL,
  `defquantity` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_master`
--

CREATE TABLE `purchase_master` (
  `purcmastid` int(10) NOT NULL,
  `clientid` int(10) NOT NULL,
  `vehicalno` varchar(15) NOT NULL,
  `dcno` varchar(10) NOT NULL,
  `billno` varchar(10) NOT NULL,
  `billdt` varchar(20) NOT NULL,
  `arrivaldt` varchar(20) NOT NULL,
  `totaldiscount` varchar(25) NOT NULL,
  `totalamount` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the data of page "Purchase Raw Material" and stores all details of purchases';

-- --------------------------------------------------------

--
-- Table structure for table `purchase_register`
--

CREATE TABLE `purchase_register` (
  `purcregid` int(10) NOT NULL,
  `purcmastid` int(10) NOT NULL,
  `rawmatid` int(10) NOT NULL,
  `quantity` varchar(10) NOT NULL,
  `rate` varchar(20) NOT NULL,
  `cgst` varchar(10) NOT NULL,
  `sgst` varchar(10) NOT NULL,
  `igst` varchar(10) NOT NULL,
  `discount` varchar(10) NOT NULL,
  `amount` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `raw_material_master`
--

CREATE TABLE `raw_material_master` (
  `rawmatid` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hsncode` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of all the raw materials GreenTop purchases';

-- --------------------------------------------------------

--
-- Table structure for table `stock_master`
--

CREATE TABLE `stock_master` (
  `stockid` int(10) NOT NULL,
  `rawmatid` int(10) DEFAULT NULL,
  `prodid` int(10) DEFAULT NULL,
  `quantity` varchar(10) NOT NULL,
  `lastmodifieddate` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of stocks available';

-- --------------------------------------------------------

--
-- Table structure for table `stock_register`
--

CREATE TABLE `stock_register` (
  `stockregid` int(10) NOT NULL,
  `stockid` int(10) NOT NULL,
  `INorOUT` varchar(5) NOT NULL,
  `quantity` varchar(10) NOT NULL,
  `date` varchar(20) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores all the records of IN and OUT of stocks';

-- --------------------------------------------------------

--
-- Table structure for table `transport_master`
--

CREATE TABLE `transport_master` (
  `tmid` int(10) NOT NULL,
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
  `transportpayid` int(10) NOT NULL,
  `rate` varchar(25) NOT NULL,
  `amount` varchar(25) NOT NULL,
  `advance` varchar(25) NOT NULL,
  `paidon` varchar(20) NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `truck_register`
--

CREATE TABLE `truck_register` (
  `truckid` int(10) NOT NULL,
  `tmid` int(10) NOT NULL,
  `lorryno` varchar(15) NOT NULL
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
  MODIFY `clientid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispatches_batches`
--
ALTER TABLE `dispatches_batches`
  MODIFY `dispbatid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispatch_register`
--
ALTER TABLE `dispatch_register`
  MODIFY `dispatchid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispatch_transport`
--
ALTER TABLE `dispatch_transport`
  MODIFY `disptransid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_consignees`
--
ALTER TABLE `order_consignees`
  MODIFY `orderconsignid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `production_batch_register`
--
ALTER TABLE `production_batch_register`
  MODIFY `prodregid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_master`
--
ALTER TABLE `product_master`
  MODIFY `prodid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_rawmat_register`
--
ALTER TABLE `product_rawmat_register`
  MODIFY `prodrawid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_master`
--
ALTER TABLE `purchase_master`
  MODIFY `purcmastid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_register`
--
ALTER TABLE `purchase_register`
  MODIFY `purcregid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `raw_material_master`
--
ALTER TABLE `raw_material_master`
  MODIFY `rawmatid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_master`
--
ALTER TABLE `stock_master`
  MODIFY `stockid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_register`
--
ALTER TABLE `stock_register`
  MODIFY `stockregid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transport_master`
--
ALTER TABLE `transport_master`
  MODIFY `tmid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transport_payment_register`
--
ALTER TABLE `transport_payment_register`
  MODIFY `transportpayid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `truck_register`
--
ALTER TABLE `truck_register`
  MODIFY `truckid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_register`
--
ALTER TABLE `user_register`
  MODIFY `userid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
