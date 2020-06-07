import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RESTService } from 'src/app/rest.service';

@Component({
  selector: 'app-searchdispatchchallan',
  templateUrl: './searchdispatchchallan.component.html',
  styleUrls: ['./searchdispatchchallan.component.css']
})
export class SearchdispatchchallanComponent implements OnInit {
  challanno: string = null;
  orderno: string = null;
  challanerror: boolean = false;

  constructor(private _rest: RESTService, private _router: Router) { }

  ngOnInit() {
    this.orderno = "GTO-";
  }

  searchChallan() {
    if (this.challanno === '0' && !this.orderno) {
      alert("Order number is compulsory, when challan no. is 0");
    }
    else {
      if (this.challanno != "0") {
        let geturl = "dcno=" + this.challanno;
        this._rest.getData("dispatch.php", "checkIfDCPresent", geturl).subscribe(Response => {
          if (Response) {
            this._router.navigate(["/reports/printdispatchchallan/", this.challanno, 0]);
          }
          else {
            this.challanerror = true;
          }
        });
      }
      else {
        this.orderno = this.orderno.toUpperCase();
        let geturl = "dcno=" + this.challanno + "&orderno=" + this.orderno;
        this._rest.getData("dispatch.php", "checkIfDCPresentWithOrderNo", geturl).subscribe(Response => {
          console.log(Response)
          if (Response) {
            this._router.navigate(["/reports/printdispatchchallan/", this.challanno, this.orderno]);
          }
          else {
            this.challanerror = true;
          }
        });
      }
    }
  }
}
