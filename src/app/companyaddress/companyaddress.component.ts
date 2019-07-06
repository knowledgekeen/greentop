import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'companyaddress',
  templateUrl: './companyaddress.component.html',
  styleUrls: ['./companyaddress.component.css']
})
export class CompanyaddressComponent implements OnInit {
  companyaddress: string = null;
  constructor(private _session: SessionService) { }

  ngOnInit() {
    this._session.getData("userkey").then(Response => {
      this.companyaddress = Response[0].address;
    })
  }

}
