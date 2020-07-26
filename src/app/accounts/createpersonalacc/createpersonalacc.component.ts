import { Component, OnInit } from '@angular/core';
import { RESTService } from 'src/app/rest.service';
import { IntervalService } from 'src/app/interval.service';
import { CONSTANTS } from 'src/app/app.constants';

@Component({
  selector: 'app-createpersonalacc',
  templateUrl: './createpersonalacc.component.html',
  styleUrls: ['./createpersonalacc.component.css']
})
export class CreatepersonalaccComponent implements OnInit {
  allpersonalaccs: any = null;
  personalaccnm:string = null;
  successMsg: string = null;
  selectedPersonalAccount:any = null;

  constructor(private _rest:RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this.getAllPersonalAccounts();
  }

  getAllPersonalAccounts(){
    this.allpersonalaccs = null;
    this._rest.getData("accounts.php", "getAllPersonalAccounts")
      .subscribe(Response=>{
        this.allpersonalaccs = Response && Response["data"] ? Response["data"] : null;
        if(this.allpersonalaccs){
          this.allpersonalaccs = this.allpersonalaccs.filter(x=>{
            return (x.personalaccnm != CONSTANTS.NA)
          });
        }
      });
  }

  createPersonalAccount(){
    const personalacc = this.allpersonalaccs.filter(res=>{ return res.personalaccnm === this.personalaccnm});
    if(personalacc.length>0){
      alert("Cannot add Personal account with same name.");
    }else{
      const postdata = {
        personalaccnm: this.personalaccnm
      };
      this._rest.postData("accounts.php", "createPersonalAccount", postdata)
        .subscribe(Response=>{
          this.successMsg = `Personal account created successfully for ${this.personalaccnm}`;
          this.getAllPersonalAccounts();
          this._interval.settimer().then(Resp=>{
            this.personalaccnm = null;
            this.selectedPersonalAccount = null;
            this.successMsg = null;
          })
        });
    }
  }

  editPersonalAccount(acc){
    this.selectedPersonalAccount = acc;
    this.personalaccnm = acc.personalaccnm;
    window.scrollTo(0,0);
  }

  updatePersonalAccount(){
    if(this.selectedPersonalAccount){
      const postdata = {
        personalaccid: this.selectedPersonalAccount.personalaccid,
        personalaccnm: this.personalaccnm
      };
      this._rest.postData("accounts.php", "updatePersonalAccount", postdata)
        .subscribe(Response=>{
          this.successMsg = `Personal account updated successfully for ${this.personalaccnm}`;
          this.getAllPersonalAccounts();
          this._interval.settimer().then(Resp=>{
            this.personalaccnm = null;
            this.successMsg = null;
            this.selectedPersonalAccount = null;
          });
        });
    }
  }

  deletePersonalAccount(acc){
    window.scrollTo(0,0);
    if(confirm(`Are you sure to delete Personal Account for ${acc.personalaccnm}`)){
      const postdata = {
        personalaccid: acc.personalaccid,
      };
      this._rest.postData("accounts.php", "deletePersonalAccount", postdata)
        .subscribe(Response=>{
          this.successMsg = `Personal account deleted successfully for ${acc.personalaccnm}`;
          this.getAllPersonalAccounts();
          this._interval.settimer().then(Resp=>{
            this.personalaccnm = null;
            this.successMsg = null;
            this.selectedPersonalAccount = null;
          });
        });
    }
  }
}
