import { Component, OnInit } from '@angular/core';
import { IntervalService } from '../interval.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthoriseduser',
  templateUrl: './unauthoriseduser.component.html',
  styleUrls: ['./unauthoriseduser.component.css']
})
export class UnauthoriseduserComponent implements OnInit {

  constructor(private _interval: IntervalService, private _session: SessionService, private _router: Router) { }

  ngOnInit() {
    this._interval.settimer(5000).then(Response => {
      console.log("Logout");
      this._session.deleteSession().then(Resp => {
        this._router.navigate(["/"]);
      })
    })
  }

}
