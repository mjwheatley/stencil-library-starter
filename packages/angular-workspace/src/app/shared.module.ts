import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StencilLibraryAngularModule } from "@mawhea/stencil-library-angular";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    StencilLibraryAngularModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    StencilLibraryAngularModule
  ]
})
export class SharedModule {
}
