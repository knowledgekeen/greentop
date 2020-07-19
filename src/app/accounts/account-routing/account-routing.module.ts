import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountOpenbalComponent } from '../account-openbal/account-openbal.component';
import { CreatepersonalaccComponent } from '../createpersonalacc/createpersonalacc.component';
import { PersonalaccledgerComponent } from '../personalaccledger/personalaccledger.component';

const accountsRoutes: Routes = [
  {path:'accounts/openingbal', component:AccountOpenbalComponent},
  {path:'accounts/createpersonalacc', component:CreatepersonalaccComponent},
  {path:'accounts/personalaccledger', component:PersonalaccledgerComponent},
]

@NgModule({
  imports: [RouterModule.forChild(accountsRoutes)],
  exports:[RouterModule]
})
export class AccountRoutingModule { }
