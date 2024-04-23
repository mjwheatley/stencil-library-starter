import { NgModule } from '@angular/core';
import { FolderPageRoutingModule } from './folder-routing.module';
import { FolderPage } from './folder.page';
import { SharedModule } from "../shared.module";

@NgModule({
  imports: [
    SharedModule,
    FolderPageRoutingModule
  ],
  declarations: [FolderPage]
})
export class FolderPageModule {}
