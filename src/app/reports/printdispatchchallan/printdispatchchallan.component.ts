import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RESTService } from 'src/app/rest.service';

@Component({
  selector: 'app-printdispatchchallan',
  templateUrl: './printdispatchchallan.component.html',
  styleUrls: ['./printdispatchchallan.component.css']
})
export class PrintdispatchchallanComponent implements OnInit {
  dcno: any = null;
  orderno: any = null;
  dcdata: any = null;
  ordernos: any;
  orderdate: any;
  vehno: any;
  totalnoofbags: any;
  totalqty: any;

  constructor(private _route: ActivatedRoute, private _rest: RESTService) { }

  ngOnInit() {
    this.dcdata = null;
    this._route.params.subscribe(Response => {
      this.dcno = Response["dcno"];
      this.orderno = Response["orderno"];
      this.orderno = this.orderno.toUpperCase();
      this.getDeliveryChallanDetails();
    });
  }

  getDeliveryChallanDetails() {
    if (this.orderno == '0') {
      let geturl = "dcno=" + this.dcno;
      this._rest.getData("dispatch.php", "getDeliveryChallanDetails", geturl).subscribe(Response => {
        if (Response["data"]) {
          this.dcdata = Response["data"];
          this.setData();
        }
      });
    }
    else {
      let geturl = "dcno=" + this.dcno + "&orderno=" + this.orderno;
      this._rest.getData("dispatch.php", "getDeliveryChallanDetailsWithOrderno", geturl).subscribe(Response => {
        if (Response["data"]) {
          this.dcdata = Response["data"];
          this.setData();
        }
      });
    }
  }

  setData() {
    this.ordernos = "";
    this.vehno = this.dcdata[0].vehicalno;
    this.orderdate = this.dcdata[0].orderdt;
    this.orderdate = this.dcdata[0].orderdt;
    this.totalnoofbags = 0;
    this.totalqty = 0;
    for (let i in this.dcdata) {
      this.ordernos += this.dcdata[i].orderno + ", ";
      if (this.orderdate && (this.orderdate != this.dcdata[i].orderdt)) {
        this.orderdate = null;
      }
      if (this.vehno && (this.vehno != this.dcdata[i].vehicalno)) {
        this.vehno = null;
      }
      this.totalnoofbags += parseFloat(this.dcdata[i].noofbags);
      this.totalqty += parseFloat(this.dcdata[i].quantity);
    }
  }
}
