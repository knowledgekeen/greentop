import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-letterhead',
  templateUrl: './letterhead.component.html',
  styleUrls: ['./letterhead.component.css']
})
export class LetterheadComponent implements OnInit {
  companyaddress: any = null;
  email: any = null;

  constructor(private _session: SessionService) { }

  ngOnInit() {
    this._session.getData("userkey").then(Response => {
      this.companyaddress = Response[0].address;
      this.email = Response[0].email;
    });
  }

}
