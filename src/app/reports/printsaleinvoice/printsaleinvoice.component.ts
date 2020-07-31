import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RESTService } from 'src/app/rest.service';

@Component({
  selector: 'app-printsaleinvoice',
  templateUrl: './printsaleinvoice.component.html',
  styleUrls: ['./printsaleinvoice.component.css']
})
export class PrintsaleinvoiceComponent implements OnInit {
  invoiceno: number = -1;
  invoicedata: any = null;
  totaldcamt: number = null;
  totaldcqty: number = null;
  subtotal: number = null;
  finaldiscount: number = null;
  finalamtb4tax: number = null;
  cgstamt: number = null;
  sgstamt: number = null;
  igstamt: number = null;
  totalroundoff: number = null;
  finalamount: number = null;
  amtinwords: string = null;
  billdt: string = null;
  blankrows: any = null;
  discountremarks: string;

  constructor(private _route: ActivatedRoute, private _rest: RESTService) { }

  ngOnInit() {
    this.blankrows = [1,2,3,4,5,6,7,8,9,10,11,12];
    this._route.params.subscribe(Response => {
      this.invoiceno = Response.invoiceno;
      this.getInvoiceDetailsFromInvoiceNo();
    });
  }

  getInvoiceDetailsFromInvoiceNo() {
    let geturl = "invoiceno=" + this.invoiceno;
    this._rest.getData("taxinvoice.php", "getInvoiceDetailsFromInvoiceNo", geturl).subscribe(Response => {
      if (Response) {
        this.blankrows = [];
        this.invoicedata = Response["data"];
        for(let i=0;i<12-this.invoicedata.length;i++){
          this.blankrows.push(i);
        }
        this.calculateAmounts();
      }
      else {
        alert("No Invoice Available for this bill:" + this.invoiceno);
      }
    }, err => {
      console.log(err);
    });
  }

  calculateAmounts() {
    this.discountremarks = "";
    this.billdt = this.invoicedata[this.invoicedata.length - 1].billdt;
    this.totaldcamt = 0;
    this.totaldcqty = 0;
    this.finaldiscount = 0;
    this.totalroundoff = 0;
    this.finalamtb4tax = 0;
    this.cgstamt = 0;
    this.sgstamt = 0;
    this.igstamt = 0;
    this.finalamount = 0;
    this.amtinwords = null;
    for (let i in this.invoicedata) {
      this.discountremarks += this.invoicedata[i].discountremarks + ", ";
      this.totaldcamt += parseFloat(this.invoicedata[i].amount);
      this.totaldcqty += parseFloat(this.invoicedata[i].quantity);
      this.finaldiscount += parseFloat(this.invoicedata[i].discount);
      this.totalroundoff += parseFloat(this.invoicedata[i].roundoff);
    }

    this.finalamtb4tax = this.totaldcamt - this.finaldiscount;
    this.cgstamt = this.finalamtb4tax * (this.invoicedata[0].cgst / 100);
    this.sgstamt = this.finalamtb4tax * (this.invoicedata[0].sgst / 100);
    this.igstamt = this.finalamtb4tax * (this.invoicedata[0].igst / 100);
    this.finalamount = this.finalamtb4tax + this.cgstamt + this.sgstamt + this.igstamt + this.totalroundoff;
    this.amtinwords = this.amountInWords(this.finalamount);
  }

  amountInWords(num) {
    let a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    let n;
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]): '';
    return str;
  }
}
