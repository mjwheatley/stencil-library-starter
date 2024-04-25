import { Plugin } from 'vue';
import { applyPolyfills, defineCustomElements } from '@mawhea/stencil-library/loader';

export const ComponentLibrary: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};