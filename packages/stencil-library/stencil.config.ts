import { Config } from '@stencil/core';
import { angularOutputTarget } from "@stencil/angular-output-target";
import { reactOutputTarget } from "@stencil/react-output-target";

export const config: Config = {
  namespace: 'stencil-library',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    angularOutputTarget({
      componentCorePackage: '@mawhea/stencil-library',
      outputType: 'component',
      directivesProxyFile: '../angular-workspace/projects/mawhea/stencil-library-angular/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular-workspace/projects/mawhea/stencil-library-angular/src/lib/stencil-generated/index.ts',
    }),
    reactOutputTarget({
      componentCorePackage: '@mawhea/stencil-library',
      proxiesFile: '../react-workspace/stencil-library-react/src/lib/components/stencil-generated/index.ts',
    }),
  ],
  testing: {
    browserHeadless: "new",
  },
};
