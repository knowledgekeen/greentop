import { Component, OnInit } from '@angular/core';
import { RESTService } from '../rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchinvoice',
  templateUrl: './searchinvoice.component.html',
  styleUrls: ['./searchinvoice.component.css']
})
export class SearchinvoiceComponent implements OnInit {
  invoiceno: string = null;
  invoiceerror: boolean = false;

  constructor(private _rest: RESTService, private _router: Router) { }

  ngOnInit() {
  }

  searchInvoice() {
    let geturl = "invoiceno=" + this.invoiceno;
    this._rest.getData("taxinvoice.php", "checkIfInvoicePresent", geturl).subscribe(Response => {
      if (Response) {
        this._router.navigate(["/reports/printsaleinvoice", this.invoiceno]);
      } else {
        this.invoiceerror = true;
      }
    })
  }

}
