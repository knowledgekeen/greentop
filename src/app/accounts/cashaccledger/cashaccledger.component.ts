import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { RESTService } from "src/app/rest.service";
import { CONSTANTS } from "src/app/app.constants";

@Component({
  selector: "app-cashaccledger",
  templateUrl: "./cashaccledger.component.html",
  styleUrls: ["./cashaccledger.component.css"],
})
export class CashaccledgerComponent implements OnInit {
  finanyr: any = null;
  ledgerhist: any = null;
  cashopenbal: any = null;
  cashexpenditures: any = null;
  cashacctrans: any = null;
  custmakepays: any = null;
  supprecpays: any = null;
  totalFinanyrs: any = null;
  totaldeposit: number = 0;
  totalpayments: number = 0;

  constructor(private _global: GlobalService, private _rest: RESTService) {}

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    this.getAllFinancialYears();
    this.initializeData();
  }

  initializeData() {
    this.getFinanYrAccOpeningBalance()
      .then((cashaccbal) => {
        this.getExpendituresFromTo()
          .then((cashexp) => {
            this.getCashAccountExpenditure()
              .then((cashacc) => {
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
              .catch((error) => {
                alert(
                  "Cannot get Cash Account Transactions, please try again later."
                );
              });
          })
          .catch((err) => {
            alert("Cannot find cash expenditures, kindly try again.");
          });
      })
      .catch((err) => {
        alert("Cannot fetch cash account balance, kindly try again.");
      });
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

  // Deposit - Cash Account Opening balance
  getFinanYrAccOpeningBalance() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData("accounts.php", "getFinanYrAccOpeningBalance", urldata)
        .subscribe(
          (Response) => {
            _this.cashopenbal =
              Response && Response["data"] ? Response["data"][1] : 0;
            resolve(_this.cashopenbal);
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
            _this.cashexpenditures =
              Response && Response["data"] ? Response["data"] : null;
            _this.cashexpenditures =
              _this.cashexpenditures && _this.cashexpenditures.length > 0
                ? _this.cashexpenditures.filter((res) => res.exptype === "1")
                : null;
            resolve(_this.cashexpenditures);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  // Deposit - Get Cash Accounts expenses made from bank expense type
  getCashAccountExpenditure() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata =
        "fromdt=" + _this.finanyr.fromdt + "&todt=" + _this.finanyr.todt;
      _this._rest
        .getData("accounts.php", "getCashAccountExpenditure", urldata)
        .subscribe(
          (Response) => {
            _this.cashacctrans =
              Response && Response["data"] ? Response["data"] : null;
            resolve(_this.cashacctrans);
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
                  return res.paymode === CONSTANTS.CASH;
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

  // Receipts - Get Receive Payments From Supplier
  getAllReceiveSupplierPayments() {
    const _this = this;
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
                  return res.paymode === CONSTANTS.CASH;
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
      dated: this.cashopenbal.yeardt,
      particular: `Opening balance`,
      deposit: this.cashopenbal.amount,
      payments: 0,
      balance: this.cashopenbal.amount,
    };
    tmparr.push(tmpobj);

    //Deposit - Cash Account Deposits
    if (this.cashacctrans && this.cashacctrans.length > 0) {
      for (let i = 0; i < this.cashacctrans.length; i++) {
        let tmpobj = {
          id: tmparr.length,
          dated: this.cashacctrans[i].expdate,
          particular: this.cashacctrans[i].particulars,
          deposit: this.cashacctrans[i].amount,
          payments: 0,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    //Payments - Expenditure Payments
    if (this.cashexpenditures && this.cashexpenditures.length > 0) {
      for (let i = 0; i < this.cashexpenditures.length; i++) {
        const tmpparticular =
          this.cashexpenditures[i].personalaccnm != CONSTANTS.NA
            ? `${this.cashexpenditures[i].particulars} - <span class="text-primary">${this.cashexpenditures[i].personalaccnm}</span>`
            : `${this.cashexpenditures[i].particulars}`;
        let tmpobj = {
          id: tmparr.length,
          dated: this.cashexpenditures[i].expdate,
          particular: tmpparticular,
          deposit: 0,
          payments: this.cashexpenditures[i].amount,
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
    if (this.ledgerhist && this.ledgerhist.length) {
      // Updating the lastest balance back to DB
      // this.ledgerhist[this.ledgerhist.length - 1].balance
      this.updateLatestCashBalanceToDB(
        this.ledgerhist[this.ledgerhist.length - 1].balance
      );
    }
  }

  updateLatestCashBalanceToDB(balance) {
    const curryrfromdt = this._global.getCurrentFinancialYear().fromdt;

    if (curryrfromdt !== this.finanyr.fromdt) {
      return;
    }
    const _this = this;
    const urldata = {
      acctype: "CASH",
      balanceamt: parseFloat(balance),
      curryr: _this.finanyr.fromdt,
    };
    console.log(urldata);
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
