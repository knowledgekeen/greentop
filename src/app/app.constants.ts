export const CONSTANTS = {
  CASH_ACCOUNT: "Cash Account",
  NA: "NA",
  CASH: "CASH",
  ADJUSTMENT: "ADJUSTMENT",
  OTHERS: "Others",
  HDPE_BAGS: "HDPE Bags",
  IN: "IN",
  OUT: "OUT",
  CREDIT: "Credit",
  DEBIT: "Debit",
  WHOLESALE_DEALER: "Wholesale dealer",
  RETAIL_DEALER: "Retail dealer",
  INDUSTRIAL_DEALER: "Industrial dealer",
};

/** FILES affected
 * DB - current_financialyr Table
 * Users.php - Array at the beginning
 * Transfers.php - hardcoded column names
 * */
export let TRANSFER_ACCS = [
  {
    id: 1,
    name: "Client (Customer/Supplier) Opening Balance Transfer",
    filenm: "transfer.php",
    api: "transferCustOpenBal",
    urldata: "",
    data: "",
    method: "",
    columnNm: "client_open_bal",
    status: "inactive",
  },
  {
    id: 2,
    name: "Cash & Bank Account Ledger Balance Transfer",
    filenm: "transfer.php",
    api: "transferCashBankAccLedgerBal",
    columnNm: "cashbank_acc_ledger_bal",
    status: "inactive",
  },
  {
    id: 3,
    name: "Stocks Balance Transfer",
    columnNm: "stock_bal_transfer",
    status: "inactive",
  },
];
