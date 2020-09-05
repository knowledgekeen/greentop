import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountRoutingModule } from "../account-routing/account-routing.module";
import { FormsModule } from "@angular/forms";
import { AccountOpenbalComponent } from "../account-openbal/account-openbal.component";
import { PersonalaccledgerComponent } from "../personalaccledger/personalaccledger.component";
import { BankaccledgerComponent } from "../bankaccledger/bankaccledger.component";
import { GraphexpenditureComponent } from "../graphexpenditure/graphexpenditure.component";
import { AddexpenditureComponent } from "src/app/addexpenditure/addexpenditure.component";
import { CashaccledgerComponent } from "../cashaccledger/cashaccledger.component";
import { GeneralModule } from "src/app/general/general.module";
import { PersonalaccadjustmentsComponent } from "../personalaccadjustments/personalaccadjustments.component";

@NgModule({
  declarations: [
    AccountOpenbalComponent,
    PersonalaccledgerComponent,
    AddexpenditureComponent,
    BankaccledgerComponent,
    GraphexpenditureComponent,
    CashaccledgerComponent,
    PersonalaccadjustmentsComponent,
  ],
  imports: [CommonModule, GeneralModule, AccountRoutingModule, FormsModule],
})
export class AccountsModule {}
