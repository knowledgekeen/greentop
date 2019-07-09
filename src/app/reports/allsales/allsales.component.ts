import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';
import * as moment from "moment";

@Component({
  selector: 'app-allsales',
  templateUrl: './allsales.component.html',
  styleUrls: ['./allsales.component.css']
})
export class AllsalesComponent implements OnInit {
  finanyr: any = null;
  fromdt: any = null;
  todt: any = null;
  customfrom: any = null;
  customto: any = null;
  allinvoices: any = null;
  finalquantity: number = 0;
  finalamt: number = 0;
  finaldiscount: number = 0;
  finalnetamt: number = 0;
  finalcgst: number = 0;
  finalsgst: number = 0;
  finaligst: number = 0;
  finalroundoff: number = 0;
  finaltotalgst: number = 0;
  finalgrandtotal: number = 0;
  monthlabel: any = "Full Year";

  constructor(private _global: GlobalService, private _rest: RESTService) { }

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    this.getInvoicesFromToDt(this.finanyr.fromdt, this.finanyr.todt);
  }

  autofillfromdt() {
    this.fromdt = this._global.getAutofillFormattedDt(this.fromdt);
  }

  autofilltodt() {
    this.todt = this._global.getAutofillFormattedDt(this.todt);
  }

  getInvoicesFromToDt(fromdt, todt) {
    let geturl = "fromdt=" + fromdt + "&todt=" + todt;
    this.allinvoices = null;

    this._rest.getData("taxinvoice.php", "getInvoicesFromToDt", geturl)
      .subscribe(Response => {
        if (Response) {
          this.finalquantity = 0;
          this.finalamt = 0;
          this.finaldiscount = 0;
          this.finalnetamt = 0;
          this.finalcgst = 0;
          this.finalsgst = 0;
          this.finaligst = 0;
          this.finalroundoff = 0;
          this.finaltotalgst = 0;
          this.finalgrandtotal = 0;
          console.log(Response["data"][0])
          this.allinvoices = Response["data"];

          for (let i = 0; i < this.allinvoices.length; i++) {
            this.allinvoices[i].netamt = parseFloat(this.allinvoices[i].amount) - parseFloat(this.allinvoices[i].discount);
            this.allinvoices[i].rateofgst = parseFloat(this.allinvoices[i].cgst) + parseFloat(this.allinvoices[i].sgst) + parseFloat(this.allinvoices[i].igst);
            this.allinvoices[i].cgstinr = (parseFloat(this.allinvoices[i].cgst) / 100) * this.allinvoices[i].netamt;
            this.allinvoices[i].sgstinr = (parseFloat(this.allinvoices[i].sgst) / 100) * this.allinvoices[i].netamt;
            this.allinvoices[i].igstinr = (parseFloat(this.allinvoices[i].igst) / 100) * this.allinvoices[i].netamt;
            this.allinvoices[i].totalgst = this.allinvoices[i].cgstinr + this.allinvoices[i].sgstinr + this.allinvoices[i].igstinr;


            this.finalquantity += parseFloat(this.allinvoices[i].quantity);
            this.finalamt += parseFloat(this.allinvoices[i].amount);
            this.finaldiscount += parseFloat(this.allinvoices[i].discount);
            this.finalnetamt += parseFloat(this.allinvoices[i].netamt);
            this.finalcgst += parseFloat(this.allinvoices[i].cgstinr);
            this.finalsgst += parseFloat(this.allinvoices[i].sgstinr);
            this.finaligst += parseFloat(this.allinvoices[i].igstinr);
            this.finalroundoff += parseFloat(this.allinvoices[i].roundoff);
            this.finaltotalgst += parseFloat(this.allinvoices[i].totalgst);
            this.finalgrandtotal += parseFloat(this.allinvoices[i].totalamount);
          }
        }
      });
  }

  filterData() {
    let myfromdate = moment(this.fromdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let fromtm = new Date(myfromdate).getTime();
    this.customfrom = fromtm;
    let mytodate = moment(this.todt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let totm = new Date(mytodate).getTime();
    this.customto = totm;
    this.getInvoicesFromToDt(fromtm, totm);
  }
}
