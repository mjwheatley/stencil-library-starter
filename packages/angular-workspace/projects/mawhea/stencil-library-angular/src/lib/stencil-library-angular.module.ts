import { DIRECTIVES } from './stencil-generated';
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { defineCustomElements } from '@mawhea/stencil-library/loader';

@NgModule({
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => defineCustomElements,
      multi: true
    },
  ]
})
export class StencilLibraryAngularModule {}
