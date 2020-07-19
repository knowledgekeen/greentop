import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from '../account-routing/account-routing.module';
import { FormsModule } from '@angular/forms';
import { AccountOpenbalComponent } from '../account-openbal/account-openbal.component';

@NgModule({
  declarations: [
    AccountOpenbalComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule
  ]
})
export class AccountsModule { }
