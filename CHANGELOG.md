# [0.3.0](https://github.com/yhauxell/open-cookie-consent-banner/compare/v0.2.0...v0.3.0) (2026-09-17)


### Bug Fixes

* **code-block:** force monospace font stack and prevent Arial fallback ([c2dfafb](https://github.com/yhauxell/open-cookie-consent-banner/commit/c2dfafb4bbc1ec88d4efaddbd7e7c616ccb0dfea))
* **cookie-banner:** center floating banner on mobile screens and support isMobile prop ([8e72f08](https://github.com/yhauxell/open-cookie-consent-banner/commit/8e72f08785a9f860d31b8d16a2fd23120fb7c1af))
* **playground:** preserve active tab and stay in telemetry when resetting ([72ca623](https://github.com/yhauxell/open-cookie-consent-banner/commit/72ca6237e2bec8879cbd4219ac8c782854608841))
* **playground:** reset button clears modal, telemetry, styling, events, and returns view to design ([873627d](https://github.com/yhauxell/open-cookie-consent-banner/commit/873627d18747b12084db92c1f350c3a3eef91ee4))
* **ui:** load Geist Mono font variables and apply font-mono to code blocks ([14214e7](https://github.com/yhauxell/open-cookie-consent-banner/commit/14214e7bdbb91fdb7d35018b87f6599a5d1655db))


### Features

* **cookie-consent:** add size density, button radius inheritance, and container query responsive reflow ([1fc448f](https://github.com/yhauxell/open-cookie-consent-banner/commit/1fc448f17f4603ab37ba2ab10665141e2d628cb4))
* **playground:** add banner copy customization with real-time preview and export ([c775f76](https://github.com/yhauxell/open-cookie-consent-banner/commit/c775f76f624d9610308d26f452c5ac77039415c4))
* **playground:** add interactive playground and capabilities showcase in /demo ([#8](https://github.com/yhauxell/open-cookie-consent-banner/issues/8)) ([82ca898](https://github.com/yhauxell/open-cookie-consent-banner/commit/82ca898be965381ef16a803fc6a86c6e3a9540de))
* **playground:** add modal content editing and dynamic category management in workbench ([651c73c](https://github.com/yhauxell/open-cookie-consent-banner/commit/651c73cae9bcfb902e3804161b0ce145628b8aec))
* **playground:** display verified backend transmission receipts, metadata, and audit records in event logs ([66d8674](https://github.com/yhauxell/open-cookie-consent-banner/commit/66d867425f4ec58aaa87682d467744dff4fc538b))
* **playground:** focus right stage exclusively on Events when Telemetry is selected ([3fc2d86](https://github.com/yhauxell/open-cookie-consent-banner/commit/3fc2d86f6eb2644ab2f1fce438f6dd08fd1cdeaa))
* **playground:** integrate Telemetry config sidebar and Design/Code/Events studio tabs ([c686b57](https://github.com/yhauxell/open-cookie-consent-banner/commit/c686b57940b6e654bf17a85b610abdde0558af9d))
* **playground:** propagate mobile viewport mode from mock canvas to embedded banner ([ddc3043](https://github.com/yhauxell/open-cookie-consent-banner/commit/ddc30431c4c0d42b39c68fc9a394eeaed3c7764c))
* **playground:** rebuild studio workbench with 3-tab layout, live telemetry cockpit, and persistent recovery ([9e9831a](https://github.com/yhauxell/open-cookie-consent-banner/commit/9e9831a3c9e5795f956904fe11ea7057531576b2))
* **playground:** redesign into v0-style 2-column layout with left sidebar and Design/Code tabs ([9534a35](https://github.com/yhauxell/open-cookie-consent-banner/commit/9534a35f47b67b152e5dc39b2f5e302cb0f80f9f))
* **playground:** responsive viewport height containment and scroll-free simulator content ([f65d8c2](https://github.com/yhauxell/open-cookie-consent-banner/commit/f65d8c2f5ba38d0a71fa443229067a46922256b8))

# [0.2.0](https://github.com/yhauxell/open-cookie-consent-banner/compare/06e9e1808b6b4d511a7c110ad8f22df60c22a3ff...v0.2.0) (2026-08-29)


### Bug Fixes

* adjust flex properties for GitHub stars button text ([e08401a](https://github.com/yhauxell/open-cookie-consent-banner/commit/e08401a4cafb324d0beb82817404c0d7ba0b946b))
* **consent:** resolve compliance bugs with category scope, visitor ID, and expiration ([#1](https://github.com/yhauxell/open-cookie-consent-banner/issues/1)) ([4026378](https://github.com/yhauxell/open-cookie-consent-banner/commit/40263788c1c109e838643a6bb533e03f72109c15))
* linting issues all around ([8c62f94](https://github.com/yhauxell/open-cookie-consent-banner/commit/8c62f942fe122faeab8176f542a32d7f239c29fb))
* loading state at demo ([f0f9cbc](https://github.com/yhauxell/open-cookie-consent-banner/commit/f0f9cbc076f3b4984f3860d6a2e9af9ade86a5e4))
* og image metadata not coming ([40f7295](https://github.com/yhauxell/open-cookie-consent-banner/commit/40f729566a5bb75844d2fae136a44fb29fd3f1ac))
* **registry:** add missing google-consent-mode and cookie-banner-backdrop to registry ([#1](https://github.com/yhauxell/open-cookie-consent-banner/issues/1)) ([bc0d4e0](https://github.com/yhauxell/open-cookie-consent-banner/commit/bc0d4e06076c9843cc260f2b17f861b5ec7d4637))
* **script-manager:** safely parse cookies during cleanup ([62e6cf6](https://github.com/yhauxell/open-cookie-consent-banner/commit/62e6cf63d26cfa8dac42adbe85d4f12712da93d7))
* sync state when toggle consent ([06e9e18](https://github.com/yhauxell/open-cookie-consent-banner/commit/06e9e1808b6b4d511a7c110ad8f22df60c22a3ff))
* **use-consent-script:** prevent state updates on unmounted component ([9971760](https://github.com/yhauxell/open-cookie-consent-banner/commit/99717608385c43f4181ff608f683ec7618609824))


### Features

* add CookieBannerBackdrop component and enhance cookie consent UI ([566716b](https://github.com/yhauxell/open-cookie-consent-banner/commit/566716b8815dbb6ef1d24e93812b07d1e0ac70e6))
* add github stars button ([e2fa0e6](https://github.com/yhauxell/open-cookie-consent-banner/commit/e2fa0e60fc1c23d9e26bc50ee469e4979ce6d9d0))
* add gradient animations and glow effects to UI components ([21a369c](https://github.com/yhauxell/open-cookie-consent-banner/commit/21a369c1220f27265dd021f8ec92712dddb050a4))
* add linting capability ([b47e185](https://github.com/yhauxell/open-cookie-consent-banner/commit/b47e185826d41589ef64101704da479e86422d94))
* add missing og metadata ([605a0d3](https://github.com/yhauxell/open-cookie-consent-banner/commit/605a0d3389b3d54ddc87b2c34d622080ef1be6b9))
* add og url to pages ([95b6dcc](https://github.com/yhauxell/open-cookie-consent-banner/commit/95b6dcc591fe0f9162c97e6e8279006aabff83dd))
* add testing utilities and Vitest configuration for OpenConsent ([b3aa7ac](https://github.com/yhauxell/open-cookie-consent-banner/commit/b3aa7ac0861a663d8822293d96c7355d69238392))
* add theme support + improve docs rendering ([3c5a135](https://github.com/yhauxell/open-cookie-consent-banner/commit/3c5a1353b8a5c985f82f0e746469f6d44dd25c36))
* add Vitest type definitions and include in TypeScript configuration ([795a4d7](https://github.com/yhauxell/open-cookie-consent-banner/commit/795a4d72611b0f0b23dcc6c963e9f852adb4a162))
* change favicon to solid black ([cb01753](https://github.com/yhauxell/open-cookie-consent-banner/commit/cb017531dac4968608a4731f8b0927faf279fe39))
* change workflow to quality checks only ([5ba95b7](https://github.com/yhauxell/open-cookie-consent-banner/commit/5ba95b730a56d38d51d39956a209f2d81d38815d))
* **changelog:** add changelog script, devDependency, and initial CHANGELOG.md ([c3501c7](https://github.com/yhauxell/open-cookie-consent-banner/commit/c3501c7054512b337a3f381ff22c5ffa2080edc6))
* **cookie-trigger:** support custom children and localized text ([dc58beb](https://github.com/yhauxell/open-cookie-consent-banner/commit/dc58beb7e0ec569fcb1c48b12aeaadb4144b9f92))
* enhance CookieConsentProvider with Google Consent Mode v2 checks and improve consent state management ([5894f55](https://github.com/yhauxell/open-cookie-consent-banner/commit/5894f55a33ec2ca30026afba3c8c701ce379b661))
* enhance Vitest configuration for CI environments and improve localStorage cleanup in tests ([8cfd078](https://github.com/yhauxell/open-cookie-consent-banner/commit/8cfd0788945db72d464549b2ccba8fb3c3219d22))
* implement Google Consent Mode v2 integration and enhance documentation for cookie consent features ([66cd0e9](https://github.com/yhauxell/open-cookie-consent-banner/commit/66cd0e9f5c420d5af77f60376cb046d9a99d709a))
* improce og-image generation ([ba0f3c4](https://github.com/yhauxell/open-cookie-consent-banner/commit/ba0f3c426bf896cc49c50c8f831693404e20a832))
* remove "Open Settings" button from cookie consent demo and update Google script detection for better accuracy ([d398670](https://github.com/yhauxell/open-cookie-consent-banner/commit/d39867008e3bd6b7caf42373bcfff4fb78bb919f))
* rename project to OpenConsent and integrate Google Consent Mode v2 support ([148487d](https://github.com/yhauxell/open-cookie-consent-banner/commit/148487d7da8951a91c8fa423661d30b2ecf217fb))
* SEO-ready website ([57cf152](https://github.com/yhauxell/open-cookie-consent-banner/commit/57cf152afa030965f986aa1d9e120ff0cee4e0d1))
* update app icon ([72245e1](https://github.com/yhauxell/open-cookie-consent-banner/commit/72245e1bb9c34c8771c58510f2659725d7d81811))
