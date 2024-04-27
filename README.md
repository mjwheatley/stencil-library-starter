# stencil-library-starter

References:
* https://stenciljs.com/docs/angular
* https://ionic.io/blog/how-to-use-storybook-with-stencil
* 
## Create Stencil Library and Angular wrapper and app
```bash
mkdir stencil-library-starter
cd stencil-library-starter
npm init
npm install typescript @types/node --save-dev
git init
mkdir packages
cd packages
ionic start angular-workspace sidemenu --type=angular
cd angular-workspace
npm uninstall jasmine-core @types/jasmine
ng generate library stencil-library-angular
cd ..
npm init stencil components stencil-library
cd stencil-library
npm install
cd stencil-library
npm install @stencil/angular-output-target --save-dev
```

### Edit Stencil Config
```typescript
import { Config } from '@stencil/core';
import { angularOutputTarget } from "@stencil/angular-output-target";

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
    })
  ],
  testing: {
    browserHeadless: "new",
  },
};
```
### Add watch script to stencil-library package
```json
{
  "scripts": {
    "watch:stencil-library": "stencil build --watch"
  }
}
```

### Build and link stencil-library
```bash
npm run build
npm link
npm run watch:stencil-library
```

### Update stencil-library-angular
```bash
cd ../angular-workspace/projects/mawhea/stencil-library-angular
```
Add stencil-library as a peer dependency
```json
{
  "peerDependencies": {
    "@mawhea/stencil-library": "latest"
  }
}
```

### Add paths to angular-workspace tsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@mawhea/stencil-library": [
        "../stencil-library"
      ],
      "@mawhea/stencil-library/loader": [
        "../stencil-library/loader"
      ]
    }
  }
}
```

Update 

Delete the all files in `stencil-library-angular/src/lib/stencil-library-angular.*`
Create `src/lib/stencil-library-angular.module.ts`
```typescript
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
```

### Update stencil-library-angular public-api.ts
```typescript
export * from './lib/stencil-library-angular.module';
export { DIRECTIVES } from './lib/stencil-generated';
export * from './lib/stencil-generated/components';
```

### Build stencil-library-angular
Add these scripts to angular-workspace package.json
```json
{
  "scripts": {
    "build:modules:stencil-library-angular": "ng build @mawhea/stencil-library-angular",
    "watch:stencil-library-angular": "ng build @mawhea/stencil-library-angular --watch",
    "publish:stencil-library-angular": "npm run build:modules:stencil-library-angular && cd dist/mawhea/stencil-library-angular && npm publish --access public"
  }
}
```
```bash
cd packages/angular-workspace
npm run build:modules:stencil-library-angular
cd dist/mawhea/stencil-library-angular
npm link
cd ../../../
npm run watch:stencil-library-angular
```

### Add stencil-library and stencil-library-angular to the Ionic Angular consumer app
Navigate to `packages/angular-workspace`
```bash
npm link @mawhea/stencil-library
npm link @mawhea/stencil-library-angular
```

NPM Link did not work, switch to relative file paths for dependencies

### Create shared.module.ts in angular-workspace/src/app
Import and export StencilLibraryAngularModule
```typescript
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
```
Import the SharedModule in angular-workspace/src/app/folder/folder.module.ts
```typescript
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
```
Add `my-component` to the folder.page.html file

## Create a React wrapper and app
```bash
cd packages/
mkdir react-workspace
cd react-workspace
mkdir stencil-library-react
cd stencil-library-react
npm init
npm install react react-dom typescript @types/react --save-dev
mkdir src
cd ../../../ #root of project
touch tsconfig.json
```
Add content to root tsconfig.json
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "noImplicitAny": false,
    "removeComments": true,
    "noLib": false,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es6",
    "sourceMap": true,
    "lib": ["es6"]
  },
  "exclude": ["node_modules", "**/*.spec.ts", "**/__tests__/**"]
}
```
Extend the root tsconfig.json inside `packages/react-workspace/stencil-library-react`
```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "lib": ["dom", "es2015"],
    "module": "es2015",
    "moduleResolution": "node",
    "target": "es2015",
    "skipLibCheck": true,
    "jsx": "react",
    "allowSyntheticDefaultImports": true,
    "declarationDir": "./dist/types"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```
Update `pacages/react-workspace/stencil-library-react/package.json`
```json
{
  "name": "@mawhea/stencil-library-react",
  "version": "0.0.1",
  "description": "React wrapper for stencil library",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/types/index.d.ts",
  "scripts": {
    "test": "node ./__tests__/react-library.test.js",
    "build": "npm run tsc",
    "tsc": "tsc -p . --outDir ./dist",
    "watch:stencil-library": "tsc-watch --onSuccess \"npm run build\""
  },
  "files": [
    "dist"
  ],
  "keywords": [
    "stencil",
    "react"
  ],
  "author": "mjwheatley",
  "license": "ISC",
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    "@mawhea/stencil-library": "0.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.79",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tsc-watch": "^6.2.0",
    "typescript": "^5.4.5"
  }
}
```

### Adding the React Output Target
Install the @stencil/react-output-target dependency to your Stencil component library package.
```bash
cd packages/stencil-library
npm install @stencil/react-output-target --save-dev
```
In your project's stencil.config.ts, add the reactOutputTarget configuration to the outputTargets array:
```typescript
import { reactOutputTarget } from "@stencil/react-output-target";
export const config: Config = {
  namespace: 'stencil-library',
  outputTargets: [
      reactOutputTarget({
          componentCorePackage:
          '@mawhea/stencil-library',
          proxiesFile:
          '../react-workspace/stencil-library-react/src/lib/components/stencil-generated/index.ts',
        })
  ]
}
```
Create the stencil-library-react entry file
```bash
cd packages/react-workspace/stencil-library-react/src
touch index.ts
```
Add content to the entry file
```typescript
export * from "./lib/components/stencil-generated";
export { defineCustomElements } from "@mawhea/stencil-library/loader";
```

Link the stencil-library package and build the project
```bash
cd ..
npm link @mawhea/stencil-library
npm run build
npm link
```
### Create the React consumer application
```bash
cd packages/react-workspace
ionic start react-app sidemenu --type=react
```
Add the stencil-library-react package as a dependency to `react-app/package.json`
```json
{
  "dependencies": {
    "@mawhea/stencil-library-react": "0.0.1",
  }
}
```
Link the library
```bash
npm link @mawhea/stencil-library-react
```
Update `react-app/vite.config.ts` to allow Vite to access the stencil-library components
```typescript
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
        // your custom rules
        '../../',
      ],
    },
  },
})
```
Update `App.tsx` to call `defineCustomElements()`
```typescript
import { defineCustomElements } from '@mawhea/stencil-library-react';

defineCustomElements();
```

Add the component to `react-app/src/components/ExploreContainer.tsx`
```tsx
import { MyComponent } from '@mawhea/stencil-library-react';
const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div id="container">
      <strong>{name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      <MyComponent first="Your" last="Name" />
    </div>
  );
};
```