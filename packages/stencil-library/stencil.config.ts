import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from "@stencil/vue-output-target";
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';
import postcssPurgeCss from '@fullhuman/postcss-purgecss';

const purgecss = postcssPurgeCss({
  content: ["./src/**/*.tsx", "./src/**/*.css", "./src/index.html"],
  defaultExtractor: (content: any) => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

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
    vueOutputTarget({
      componentCorePackage: '@mawhea/stencil-library',
      proxiesFile: '../vue-workspace/stencil-library-vue/src/lib/components.ts',
    })
  ],
  plugins: [
    postcss({
      plugins: [
        require("postcss-import"),
        require("tailwindcss")("./tailwind.config.js"),
        autoprefixer(),
        ...(process.env.NODE_ENV === "production"
          ? [purgecss, require("cssnano")]
          : [])
      ],
    })
  ],
  testing: {
    browserHeadless: "new",
  },
};
