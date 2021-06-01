import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { RESTService } from "src/app/rest.service";
import { CONSTANTS } from "src/app/app.constants";

@Component({
  selector: "app-bankaccledger",
  templateUrl: "./bankaccledger.component.html",
  styleUrls: ["./bankaccledger.component.css"],
})
export class BankaccledgerComponent implements OnInit {
  finanyr: any = null;
  bankopenbal: any = null;
  purchaseacs: any = null;
  bankexpenditures: any = null;
  bankreceipts: any = null;
  salereceipts: any = null;
  custmakepays: any = null;
  supprecpays: any = null;
  ledgerhist: any = null;
  totaldeposit: any = 0;
  totalpayments: any = 0;
  totalFinanyrs: any = null;
  annualMonthWiseData: any = null;

  constructor(private _global: GlobalService, private _rest: RESTService) {}

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    // console.log(this.finanyr);
    this.getAllFinancialYears();
    this.initializeData();
  }

  getAllFinancialYears() {
    this._rest.getData("sales_payments.php", "getAllFinancialYears").subscribe(
      (Response: any) => {
        // console.log(Response.data);
        this.totalFinanyrs = Response ? Response.data : null;
        for (let index in this.totalFinanyrs) {
          this.totalFinanyrs[index].finanyr =
            this._global.getSpecificFinancialYear(
              parseInt(this.totalFinanyrs[index].finanyr)
            );
        }
        // console.log(this.totalFinanyrs);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeFinancialyrs(finanyrs) {
    // console.log("change finanyrs", finanyrs);
    this.finanyr = this._global.getSpecificFinancialYear(
      parseInt(finanyrs.fromdt)
    );
    // console.log(this.finanyr);
    this.initializeData();
  }

  initializeData() {
    this.getFinanYrAccOpeningBalance()
      .then((openbal) => {
        this.getFromToPurchasesForAccounts()
          .then((purchbal) => {
            this.getExpendituresFromTo()
              .then((expenditure) => {
                this.getBankReceiptsFromTo()
                  .then((bankreceipts) => {
                    this.getAllOrderPaymentsFromToDt()
                      .then((orderpays) => {
                        this.getAllCustMakePayments()
                          .then((custmakepays) => {
                            this.getAllReceiveSupplierPayments()
                              .then((supprecpay) => {
                                this.filterData();
                              })
                              .catch((err) => {
                                alert("Cannot get Supplier Receipt Payments");
                              });
                          })
                          .catch((err) => {
                            alert("Cannot get Customer Make Payments");
                          });
                      })
                      .catch((errorderpays) => {
                        alert("Cannot fetch All order payments");
                      });
                  })
                  .catch((errbankreceipt) => {
                    alert("Cannot fetch Bank Receipts");
                  });
              })
              .catch((errexpenditure) => {
                alert("Cannot fetch Expenditure balance");
              });
          })
          .catch((errpurchbal) => {
            alert("Cannot fetch purchase balance");
          });
      })
      .catch((erropenbal) => {
        alert("Cannot fetch opening balance for bank account");
      });
  }

  //Deposit - Getting Financial Opening Balance
  getFinanYrAccOpeningBalance() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData("accounts.php", "getFinanYrAccOpeningBalance", urldata)
        .subscribe(
          (Response) => {
            _this.bankopenbal =
              Response && Response["data"] ? Response["data"][0] : 0;
            resolve(_this.bankopenbal);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  // Payments - Get Purchase For Accounts
  getFromToPurchasesForAccounts() {
    // console.log("getFromToPurchasesForAccounts", this.finanyr);
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // console.log("getFromToPurchasesForAccounts promise", _this.finanyr);
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData(
          "reports_purchases.php",
          "getFromToPurchasesForAccounts",
          urldata
        )
        .subscribe(
          (Response) => {
            _this.purchaseacs =
              Response && Response["data"] ? Response["data"] : 0;
            _this.purchaseacs = _this.purchaseacs
              ? _this.purchaseacs.filter((res) => {
                  return (
                    res.paymode !== CONSTANTS.CASH &&
                    res.paymode !== CONSTANTS.OTHERS
                  );
                })
              : null;
            resolve(_this.purchaseacs);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  // Payments -  Get Expenditures for Accounts
  getExpendituresFromTo() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData("expenditure.php", "getExpendituresFromTo", urldata)
        .subscribe(
          (Response) => {
            _this.bankexpenditures =
              Response && Response["data"] ? Response["data"] : null;
            _this.bankexpenditures =
              _this.bankexpenditures && _this.bankexpenditures.length > 0
                ? _this.bankexpenditures.filter((res) => res.exptype === "2")
                : null;
            resolve(_this.bankexpenditures);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  // Deposit -  Get Bank Receipts
  getBankReceiptsFromTo() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData("expenditure.php", "getReceiptsFromTo", urldata)
        .subscribe(
          (Response) => {
            _this.bankreceipts =
              Response && Response["data"] ? Response["data"] : null;
            _this.bankreceipts =
              _this.bankreceipts && _this.bankreceipts.length > 0
                ? _this.bankreceipts.filter((res) => res.receipttype === "2")
                : null;
            resolve(_this.bankreceipts);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  // Deposit - Get all order payments
  getAllOrderPaymentsFromToDt() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData("sales_payments.php", "getAllOrderPaymentsFromToDt", urldata)
        .subscribe(
          (Response) => {
            _this.salereceipts =
              Response && Response["data"] ? Response["data"] : null;
            _this.salereceipts =
              _this.salereceipts && _this.salereceipts.length > 0
                ? _this.salereceipts.filter(
                    (res) =>
                      res.paymode !== CONSTANTS.CASH &&
                      res.paymode !== CONSTANTS.OTHERS
                  )
                : null;
            resolve(_this.salereceipts);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  // Payments - Get Customer Make Payments
  getAllCustMakePayments() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData("accounts.php", "getAllCustMakePayments", urldata)
        .subscribe(
          (Response) => {
            _this.custmakepays =
              Response && Response["data"] ? Response["data"] : null;
            _this.custmakepays = _this.custmakepays
              ? _this.custmakepays.filter((res) => {
                  return (
                    res.paymode !== CONSTANTS.CASH &&
                    res.paymode !== CONSTANTS.OTHERS
                  );
                })
              : null;
            resolve(_this.custmakepays);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  // Deposit - Get Receive Payments From Supplier
  getAllReceiveSupplierPayments() {
    const _this = this;
    this.totaldeposit = 0;
    this.totalpayments = 0;
    const promise = new Promise((resolve, reject) => {
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData("accounts.php", "getAllReceiveSupplierPayments", urldata)
        .subscribe(
          (Response) => {
            _this.supprecpays =
              Response && Response["data"] ? Response["data"] : null;
            _this.supprecpays = _this.supprecpays
              ? _this.supprecpays.filter((res) => {
                  return res.paymode !== CONSTANTS.CASH;
                })
              : null;
            resolve(_this.supprecpays);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  filterData() {
    let tmparr = [];

    //Deposit - Opening Balance
    let tmpobj = {
      id: tmparr.length,
      dated: this.bankopenbal.yeardt,
      particular: `Opening balance`,
      deposit: this.bankopenbal.amount,
      payments: 0,
      balance: this.bankopenbal.amount,
    };
    tmparr.push(tmpobj);

    //Deposit - Bank Receipts
    if (this.bankreceipts && this.bankreceipts.length > 0) {
      for (let i = 0; i < this.bankreceipts.length; i++) {
        let tmpobj = {
          id: tmparr.length,
          dated: this.bankreceipts[i].receiptdate,
          particular: this.bankreceipts[i].particulars,
          deposit: this.bankreceipts[i].amount,
          payments: 0,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    // Deposit - Sale Receipts
    if (this.salereceipts && this.salereceipts.length > 0) {
      for (let i = 0; i < this.salereceipts.length; i++) {
        let tmpobj = {
          id: tmparr.length,
          dated: this.salereceipts[i].paydate,
          particular: `${this.salereceipts[i].particulars} - ${this.salereceipts[i].name}`,
          deposit: this.salereceipts[i].amount,
          payments: 0,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    //Payments - Purchase Payments
    if (this.purchaseacs && this.purchaseacs.length > 0) {
      for (let i = 0; i < this.purchaseacs.length; i++) {
        let tmpobj = {
          id: tmparr.length,
          dated: this.purchaseacs[i].paydate,
          particular: `${this.purchaseacs[i].particulars} - ${this.purchaseacs[i].name}`,
          deposit: 0,
          payments: this.purchaseacs[i].amount,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    //Payments - Expenditure Payments
    if (this.bankexpenditures && this.bankexpenditures.length > 0) {
      for (let i = 0; i < this.bankexpenditures.length; i++) {
        const tmpparticular =
          this.bankexpenditures[i].personalaccnm != CONSTANTS.NA
            ? `${this.bankexpenditures[i].particulars} - <span class="text-primary">${this.bankexpenditures[i].personalaccnm}</span>`
            : `${this.bankexpenditures[i].particulars}`;
        let tmpobj = {
          id: tmparr.length,
          dated: this.bankexpenditures[i].expdate,
          particular: tmpparticular,
          deposit: 0,
          payments: this.bankexpenditures[i].amount,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    //Payments - Customer Made payments
    if (this.custmakepays && this.custmakepays.length > 0) {
      for (let i = 0; i < this.custmakepays.length; i++) {
        let tmpobj = {
          id: tmparr.length,
          dated: this.custmakepays[i].paydate,
          particular: `${this.custmakepays[i].particulars} - ${this.custmakepays[i].name}`,
          deposit: 0,
          payments: this.custmakepays[i].amountpaid,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    //Receipts - Supplier Receipt payments
    if (this.supprecpays && this.supprecpays.length > 0) {
      for (let i = 0; i < this.supprecpays.length; i++) {
        let tmpobj = {
          id: tmparr.length,
          dated: this.supprecpays[i].paydate,
          particular: `${this.supprecpays[i].particulars} - ${this.supprecpays[i].name}`,
          deposit: this.supprecpays[i].amountpaid,
          payments: 0,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    tmparr.sort(this._global.sortArr("dated"));
    this.ledgerhist = tmparr;

    let tmpbalance = parseFloat(this.ledgerhist[0].deposit);
    for (let k = 1; k < this.ledgerhist.length; k++) {
      this.ledgerhist[k].balance =
        tmpbalance +
        parseFloat(this.ledgerhist[k].deposit) -
        parseFloat(this.ledgerhist[k].payments);
      tmpbalance = parseFloat(this.ledgerhist[k].balance);
    }

    for (const j in this.ledgerhist) {
      this.totaldeposit += parseFloat(this.ledgerhist[j].deposit);
      this.totalpayments += parseFloat(this.ledgerhist[j].payments);
    }
    // console.log(this.ledgerhist);
    this.updateLatestBankBalanceToDB(
      this.ledgerhist[this.ledgerhist.length - 1].balance
    );

    // CALCULATE MONTHWAISE TOTALS FOR DEPOSITS AND PAYMENTS
    this.calculateMonthWiseTotals();
  }

  calculateMonthWiseTotals() {
    const ledhist = JSON.parse(JSON.stringify(this.ledgerhist)); //Creating a copy so as not to change the original data
    //console.log(ledhist);
    let annualdata = new Array();
    let selmonth = new Date(parseInt(ledhist[0].dated));
    let monthMM = new Date(parseInt(ledhist[0].dated));
    const monthnm = `${monthMM.toLocaleString("default", {
      month: "long",
    })} , ${monthMM.getFullYear()}`;
    annualdata.push({
      depositAmt: 0,
      paymentAmt: 0,
      monthName: monthnm,
    });

    // Starting from 1 as leaving the first entry
    for (let i = 1; i < ledhist.length; i++) {
      let monthMM = new Date(parseInt(ledhist[i].dated));
      const monthnm = `${monthMM.toLocaleString("default", {
        month: "long",
      })} , ${monthMM.getFullYear()}`;
      if (selmonth.getMonth() === monthMM.getMonth()) {
        //console.log(ledhist[i]);
        annualdata.find((o, index) => {
          if (o.monthName === monthnm) {
            //console.log(parseFloat(ledhist[i].deposit));
            const anndepamt =
              annualdata[index].depositAmt + parseFloat(ledhist[i].deposit);
            const annpayamt =
              annualdata[index].paymentAmt + parseFloat(ledhist[i].payments);
            annualdata[index] = {
              depositAmt: anndepamt,
              paymentAmt: annpayamt,
              monthName: monthnm,
            };
            return true;
          }
        });
      } else {
        selmonth = new Date(parseInt(ledhist[i].dated));
        let monthMM = new Date(parseInt(ledhist[i].dated));
        const monthnm = `${monthMM.toLocaleString("default", {
          month: "long",
        })} , ${monthMM.getFullYear()}`;
        annualdata.push({
          depositAmt: parseFloat(ledhist[i].deposit),
          paymentAmt: parseFloat(ledhist[i].payments),
          monthName: monthnm,
        });
      }
      // console.log(monthMM, monthnm);
      this.annualMonthWiseData = annualdata;
      // console.log(annualdata);
    }
  }

  updateLatestBankBalanceToDB(balance) {
    const curryrfromdt = this._global.getCurrentFinancialYear().fromdt;

    if (curryrfromdt !== this.finanyr.fromdt) {
      return;
    }
    const _this = this;
    const urldata = {
      acctype: "BANK",
      balanceamt: parseFloat(balance),
      curryr: _this.finanyr.fromdt,
    };
    // console.log(urldata);
    _this._rest
      .postData("accounts.php", "updateLatestBalanceToDB", urldata)
      .subscribe(
        (Response) => {
          console.log("Balance updated");
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
