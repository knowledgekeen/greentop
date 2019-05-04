-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2019 at 09:44 AM
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
(4, 3, '10', '1554143400000'),
(5, 1, '5', '1554057000000'),
(6, 2, '0', '1554057000000'),
(7, 9, '0', '1554057000000'),
(8, 10, '0', '1554057000000');

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
(1, 1, 1, '5'),
(2, 2, 1, '5'),
(3, 2, 2, '5'),
(4, 3, 2, '5'),
(5, 3, 3, '10'),
(6, 4, 3, '5'),
(7, 5, 3, '10'),
(8, 6, 3, '5'),
(9, 6, 4, '11');

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
(1, 1, '1556562600000', '3004', 'MH12LL1212'),
(2, 2, '1555266600000', '154', 'MH12LL1234'),
(3, 3, '1555698600000', '204', 'MH11224'),
(4, 6, '1556649000000', '0105', 'MH1255FF1'),
(5, 4, '1556908200000', '405', 'MH0011GG'),
(6, 7, '1557253800000', '99', 'MH12RT4343');

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
(1, 1, '0', '0', '0', '1556562600000', 'Self Transport'),
(2, 2, '0', '0', '0', '1555266600000', 'Party\'s Transport'),
(3, 3, '1000', '150', '1000', '1555698600000', 'Self Transport'),
(4, 4, '0', '0', '0', '1556649000000', 'Party\'s Transport'),
(5, 5, '2000', '100', '0', '1556908200000', 'Self Transport'),
(6, 6, '90', '10000', '0', '1557253800000', 'Self Transport');

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
(27, 3, 'Kumar Farms', 'Mr. Kumar', '22776655', 'Pune', 'Maharashtra', 'Pune, Maharashtra', '15', 'SELF'),
(28, 2, 'Mrs. Kapoor', 'Mr. Arjun', '123456789', 'Kolhapur', 'Maharashtra', 'Kolhapur', '10', 'CONSIGNEE'),
(29, 4, 'Kumar Farms', 'Mr. Kumar', '22776655', 'Pune', 'Maharashtra', 'Pune, Maharashtra', '10', 'SELF'),
(30, 5, 'Sheti Sang', 'Mr. Shetilal', '2525252525', 'Kolhapur', 'Maharashtra', 'Kolhapur, Maharashtra', '15', 'SELF'),
(31, 5, 'Ahzar Sang', 'Mr. Azhar', '56545654', 'Pune', 'Maharashtra', 'Pune', '10', 'CONSIGNEE'),
(32, 1, 'Kumar Farms', 'Mr. Kumar', '22776655', 'Pune', 'Maharashtra', 'Pune, Maharashtra', '10', 'SELF'),
(33, 6, 'Sheti Sang', 'Mr. Shetilal', '2525252525', 'Kolhapur', 'Maharashtra', 'Kolhapur, Maharashtra', '5', 'SELF'),
(34, 7, 'Kumar Farms', 'Mr. Kumar', '22776655', 'Pune', 'Maharashtra', 'Pune, Maharashtra', '6', 'SELF'),
(35, 7, 'consignee1', 'sudesh', '7687656545', 'solapur', 'Maharashtra', 'solapur', '10', 'CONSIGNEE');

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
(1, 'GTO-1', '1554834600000', 2, 1, '10', 'SELF', 'closed'),
(2, 'GTO-2', '1553452200000', 2, 1, '10', 'CONSIGNEE', 'closed'),
(3, 'GTO-3', '1555007400000', 2, 1, '15', '', 'dispatched'),
(4, 'GTO-4', '1556821800000', 2, 1, '10', 'SELF', 'closed'),
(5, 'GTO-5', '1557599400000', 9, 1, '25', 'CONSIGNEE', 'open'),
(6, 'GTO-6', '1556649000000', 9, 1, '5', 'SELF', 'closed'),
(7, 'GTO-7', '1557253800000', 2, 1, '16', 'CONSIGNEE', 'closed');

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
(1, 2, 2, '1', '1555698600000', '35000', '0', '3500', '8', '8', '0', '0', '40600'),
(2, 6, 9, '2', '1556649000000', '1000', '0', '200', '5', '5', '0', '0', '1100'),
(3, 4, 2, '3', '1556908200000', '150000', '200', '15000', '5', '5', '0', '20', '164800'),
(4, 7, 2, '4', '1557253800000', '80000', '0', '5000', '2.5', '2.5', '0', '0', '84000');

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
(2, 'Cheque'),
(3, 'Netbanking'),
(4, 'NEFT / RTGS');

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
('1', 1, '10', '0', '1554661800000', 'closed'),
('2', 1, '10', '0', '1554834600000', 'closed'),
('3', 1, '30', '0', '1554921000000', 'closed'),
('4', 1, '25', '14', '1556649000000', 'open'),
('5', 1, '10', '10', '1556649000000', 'open');

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
(1, 1, '10', '1'),
(2, 2, '50', '1'),
(3, 1, '10', '2'),
(4, 2, '55', '2'),
(5, 1, '10', '3'),
(6, 2, '100', '3'),
(7, 1, '10', '4'),
(8, 2, '50', '4'),
(9, 1, '5', '5'),
(10, 2, '70', '5'),
(11, 3, '2', '5');

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
(1, 'ECHOMEAL', '3101', 1);

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
(1, 1, 1, '5'),
(2, 1, 2, '70'),
(3, 1, 3, '2');

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
(1, 3, 'MH12LL2', '204', '304', '1554229800000', '1554143400000', '0', '3000'),
(2, 1, 'MH23D1', '504', '604', '1554489000000', '1554402600000', '0', '23100'),
(3, 3, 'MH12K3', '304', '404', '1554316200000', '1554229800000', '0', '2000'),
(4, 10, 'MH12RT4343', '90', '90', '1556908200000', '1556908200000', '0', '26250');

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
(1, '1554359712000', '3', '1000', '1', 'Cash Payment'),
(2, '1554834600000', '3', '500', '1', 'Cash Payment'),
(3, '1554748200000', '3', '2000', '1', 'Cash Payment'),
(4, '1554921000000', '3', '1400', '2', 'Cheque 000001'),
(5, '1557167400000', '10', '26000', '4', ''),
(6, '1557253800000', '10', '100', '1', ''),
(7, '1556649000000', '3', '200', '1', '');

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
(1, 1, 1, '15', '200', '0', '0', '0', '0', '0', '3000'),
(2, 2, 2, '105', '200', '5', '5', '0', '0', '0', '21000'),
(3, 3, 1, '5', '400', '0', '0', '0', '0', '0', '2000'),
(4, 4, 3, '50', '500', '2.5', '2.5', '0', '0', '0', '25000');

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
(1, 'Organic Manure', '100'),
(2, 'HDPE Bags', '101'),
(3, 'mud', '3101');

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
(1, NULL, 1, '29', '1556871059474'),
(2, 1, NULL, '-15', '1556870529538'),
(3, 2, NULL, '280', '1556870529538'),
(4, 3, NULL, '133', '1556870529538');

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
(1, 1, 'IN', '10', '1554057000000', 'Opening Balance'),
(2, 2, 'IN', '10', '1554057000000', 'Opening Balance'),
(3, 3, 'IN', '500', '1554057000000', 'Opening Balance'),
(4, 2, 'IN', '10', '1554229800000', 'Purchase Raw Material'),
(5, 2, 'IN', '5', '1554229800000', 'Update Purchase Raw Material'),
(6, 3, 'IN', '100', '1554489000000', 'Purchase Raw Material'),
(7, 2, 'IN', '5', '1554316200000', 'Purchase Raw Material - Purchase id: 3'),
(8, 3, 'IN', '5', '1554489000000', 'Update Purchase Raw Material - Purchase id: 2'),
(9, 2, 'OUT', '10', '1554661800000', 'Updated Stock, created new batch, batchid: 1'),
(10, 3, 'OUT', '50', '1554661800000', 'Updated Stock, created new batch, batchid: 1'),
(11, 1, 'IN', '10', '1554661800000', 'Updated Stock, created new batch, batchid: 1'),
(12, 1, 'OUT', '10', '1556630559010', 'Order Dispathed, Order No: 1'),
(13, 2, 'OUT', '10', '1554834600000', 'Updated Stock, created new batch, batchid: 2'),
(14, 3, 'OUT', '55', '1554834600000', 'Updated Stock, created new batch, batchid: 2'),
(15, 1, 'IN', '10', '1554834600000', 'Updated Stock, created new batch, batchid: 2'),
(16, 2, 'OUT', '10', '1554921000000', 'Updated Stock, created new batch, batchid: 3'),
(17, 3, 'OUT', '100', '1554921000000', 'Updated Stock, created new batch, batchid: 3'),
(18, 1, 'IN', '30', '1554921000000', 'Updated Stock, created new batch, batchid: 3'),
(19, 1, 'OUT', '10', '1556792589893', 'Order Dispathed, Order No: 2'),
(20, 1, 'OUT', '15', '1556792649423', 'Order Dispathed, Order No: 3'),
(21, 2, 'OUT', '10', '1556649000000', 'Updated Stock, created new batch, batchid: 4'),
(22, 3, 'OUT', '50', '1556649000000', 'Updated Stock, created new batch, batchid: 4'),
(23, 1, 'IN', '25', '1556649000000', 'Updated Stock, created new batch, batchid: 4'),
(24, 1, 'OUT', '5', '1556801957642', 'Order Dispathed, Order No: 6'),
(25, 1, 'OUT', '10', '1556815251951', 'Order Dispathed, Order No: 4'),
(26, 4, 'IN', '85', '1554143400000', 'Opening Balance'),
(27, 4, 'IN', '50', '1556908200000', 'Purchase Raw Material - Purchase id: 4'),
(28, 2, 'OUT', '5', '1556649000000', 'Updated Stock, created new batch, batchid: 5'),
(29, 3, 'OUT', '70', '1556649000000', 'Updated Stock, created new batch, batchid: 5'),
(30, 4, 'OUT', '2', '1556649000000', 'Updated Stock, created new batch, batchid: 5'),
(31, 1, 'IN', '10', '1556649000000', 'Updated Stock, created new batch, batchid: 5'),
(32, 1, 'OUT', '16', '1556871059474', 'Order Dispathed, Order No: 7');

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

--
-- Dumping data for table `transport_master`
--

INSERT INTO `transport_master` (`tmid`, `transportname`, `contactno`, `address`, `status`) VALUES
(1, 'Abc roadlines', '99998765433', 'wadki pune', 1),
(2, 'xyz', '767665644334', 'pune maha', 1);

-- --------------------------------------------------------

--
-- Table structure for table `truck_register`
--

CREATE TABLE `truck_register` (
  `truckid` int(20) NOT NULL,
  `tmid` int(20) NOT NULL,
  `lorryno` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of all "Lorries"';

--
-- Dumping data for table `truck_register`
--

INSERT INTO `truck_register` (`truckid`, `tmid`, `lorryno`) VALUES
(1, 1, 'MH12WA6789'),
(2, 1, 'MH12RT4343'),
(3, 2, 'MH12ER6565');

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
  MODIFY `openbalid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `dbsetting_master`
--
ALTER TABLE `dbsetting_master`
  MODIFY `dbsettingid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dispatches_batches`
--
ALTER TABLE `dispatches_batches`
  MODIFY `dispbatid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `dispatch_register`
--
ALTER TABLE `dispatch_register`
  MODIFY `dispatchid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `dispatch_transport`
--
ALTER TABLE `dispatch_transport`
  MODIFY `disptransid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_consignees`
--
ALTER TABLE `order_consignees`
  MODIFY `orderconsignid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `order_master`
--
ALTER TABLE `order_master`
  MODIFY `orderid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_taxinvoice`
--
ALTER TABLE `order_taxinvoice`
  MODIFY `otaxinvoiceid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `paymode_master`
--
ALTER TABLE `paymode_master`
  MODIFY `paymodeid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `production_batch_register`
--
ALTER TABLE `production_batch_register`
  MODIFY `prodregid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `product_master`
--
ALTER TABLE `product_master`
  MODIFY `prodid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_rawmat_register`
--
ALTER TABLE `product_rawmat_register`
  MODIFY `prodrawid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `purchase_master`
--
ALTER TABLE `purchase_master`
  MODIFY `purcmastid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `purchase_payments`
--
ALTER TABLE `purchase_payments`
  MODIFY `purchpayid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `stockid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stock_register`
--
ALTER TABLE `stock_register`
  MODIFY `stockregid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `transport_master`
--
ALTER TABLE `transport_master`
  MODIFY `tmid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `truck_register`
--
ALTER TABLE `truck_register`
  MODIFY `truckid` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_register`
--
ALTER TABLE `user_register`
  MODIFY `userid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
