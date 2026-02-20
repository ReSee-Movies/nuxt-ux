# Changelog

## [0.25.0](https://github.com/ReSee-Movies/nuxt-ux/compare/0.24.2...0.25.0) (2026-02-20)

### Features

* **accordion:** introduce Accordion component ([ec1cfff](https://github.com/ReSee-Movies/nuxt-ux/commit/ec1cfffb707681e449970d1286da719e8ccefac0))
* **checkbox-group:** introduce CheckboxGroup form component ([71e097b](https://github.com/ReSee-Movies/nuxt-ux/commit/71e097bb6041ae5663adadad782653fb1b7c7e68))

## [0.24.2](https://github.com/ReSee-Movies/nuxt-ux/compare/0.24.1...0.24.2) (2026-02-20)

### Documentation

* add correct base path when creating site for GitHub pages ([375253b](https://github.com/ReSee-Movies/nuxt-ux/commit/375253b362381394736f7338a293171bdf44924a))
* fix static site generate action ([68efcaf](https://github.com/ReSee-Movies/nuxt-ux/commit/68efcaf12f0d22466c879a98ca42e772a2d94ba4))
* pre-render with static generation ([919b31a](https://github.com/ReSee-Movies/nuxt-ux/commit/919b31a3ce98f9969cda74bdb3ba8a7dc8198d0c))
* update README ([a3a75b8](https://github.com/ReSee-Movies/nuxt-ux/commit/a3a75b827ce22f34caacaf94d07253b497eb7b9c))
* updates to static site generate for GitHub pages ([88729dd](https://github.com/ReSee-Movies/nuxt-ux/commit/88729dd5a23f35f188e80ef4c47819715ea0b6a5))

## [0.24.1](https://github.com/ReSee-Movies/nuxt-ux/compare/0.24.0...0.24.1) (2026-02-11)

### Bug Fixes

* actual ImageTiler fix for missing images on initial load (Tiler was loading before images were available, with no mechanism to update after they were received) ([dd6b1b5](https://github.com/ReSee-Movies/nuxt-ux/commit/dd6b1b562455a8c0afb6f3f0bde7e31324b3bd5e))

## [0.24.0](///compare/0.23.3...0.24.0) (2026-02-11)

### Features

* added "before" and "after" slots to the SuccessSplash component, and "success-before" and "success-after" to the Form component b146b3a
* added the "note" prop to FormField 23ddab4

### Bug Fixes

* add "out-in" mode to the transition between a Form and success splash b2ebd09
* the ImageTiler would sometimes not select image sources for the tiles on initial load (had something to do with SSR, maybe?) bb87594

## [0.23.3](///compare/0.23.2...0.23.3) (2026-02-07)

### Bug Fixes

* added missing "placeholder" prop to FormFieldText 70a624d
* pass props through to submit button when instantiating via FormFieldBuilder 0a4ab10

## [0.23.2](///compare/0.23.1...0.23.2) (2026-02-02)

### Bug Fixes

* correctly apply the "dark" variant within Vue component styles 417bb73

## [0.23.1](///compare/0.23.0...0.23.1) (2026-01-22)

### Bug Fixes

* mark subheader tableOfContents method experimental while a better solution is figured out 22d8793
* move the logic of useGlobalHeaderState into a Pinia store - useGlobalHeaderStore - to avoid leaking state in SSR fc77164
* move the logic of useReseeUx into a Pinia store - useReseeUxStore - to avoid leaking state in SSR efa3952

## [0.23.0](///compare/0.22.2...0.23.0) (2026-01-22)

### Features

* mark Archivo font for preload a974e74

### Bug Fixes

* reduce the number of images that the ImageTiler generates by default 7064e88

## [0.22.2](///compare/0.22.1...0.22.2) (2026-01-21)

### Bug Fixes

* **useGlobalHeaderState:** subheader menu items are correctly replaced when switching between two views the both supply some c853bae

## [0.22.1](///compare/0.22.0...0.22.1) (2026-01-21)

### Bug Fixes

* wait for the page transition to complete before trying to scroll b928e42

## [0.22.0](///compare/0.21.0...0.22.0) (2026-01-21)

### Features

* drop default usage of CSS scroll behavior in favor of a customized Vue Router scrolling solution for better control 7f5b6c1

### Bug Fixes

* show background color on images 4f7d483

## [0.21.0](///compare/0.20.3...0.21.0) (2026-01-20)

### Features

* **ContinueReadingContainer:** introduce new ContinueReadingContainer component 3859809

### Bug Fixes

* made the ImageTiler usage in the ImageBackdrop component client-only until a better hydration solution can be worked out 4dc6ec5

## [0.20.3](///compare/0.20.2...0.20.3) (2026-01-19)

### Bug Fixes

* **useLoadImage,ImageBase,Image:** tweak behavior to support background loading a higher resolution image without displaying a load indicator 0ad2af1

## [0.20.2](///compare/0.20.1...0.20.2) (2026-01-08)

### Bug Fixes

* **GlobalHeader:** account for scrollbar space when it is removed for things like Dialogs, so the background image doesn't visibly shift to fill the space 228d812
* **ImageBackdrop:** account for scrollbar space when it is removed for things like Dialogs, so the background image doesn't visibly shift to fill the space dad8eb9
* **Tooltip:** remove extraneous padding from around tooltips that caused their content and arrows to become detached when near the edge of the viewport 05f6b53

## [0.20.1](///compare/0.20.0...0.20.1) (2026-01-08)

### Bug Fixes

* **CardScroller:** apply the scale=1 style to the correct element 9a209e2
* **GlobalHeaderAnnouncement:** added z-index equal to the GlobalHeader a37556e
* **GlobalHeader:** moved around transition CSS so the drop shadow removal is tweened as the header docks at the top of the page 6b6491f
* **ImageBackdrop:** ability to opt-out of fixed positioning for the subset of use-cases that need it d22e7cc
* **ImageBackdrop:** changed from absolute to fixed positioning to keep background images from blowing out the bottom of the page when the top offset isn't correctly applied f492f83
* **ImageBackdrop:** only apply animation-timeline rules if supported dfd86e1

## [0.20.0](///compare/0.19.1...0.20.0) (2026-01-07)

### Features

* **MotionArt:** the secondary and tertiary colors are computed as a triad of the primary color if not explicitly provided f63564b

### Bug Fixes

* **Button:** allow the "type" prop to be unset by making it equal to null 685abf8
* **Image:** only apply "aria-hidden=true", not "aria-hidden=false" for accessibility 48ef035

## [0.19.1](///compare/0.19.0...0.19.1) (2026-01-07)

### Bug Fixes

* **InlineStatsListItem:** made the "description" prop optional so as not to conflict with the possibility of it being defined via the default or description slots e79bd34

## [0.19.0](///compare/0.18.0...0.19.0) (2026-01-07)

### Features

* **ImageBackdrop:** added default implementations for the Image, Tiler, and MotionArt backdrops 0fa9157
* **ImageBackdrop:** introduced ImageBackdrop component, for placing a background image, or image, tiles, behind some other content a052ae5
* **Image:** re-emit the loading, load, and error events from the underlying BaseImage instance for further use b2d649d
* **MotionArt:** introduce MotionArt component 855bb45

### Bug Fixes

* **GlobalHeader:** apply a small z-index even when not pinned to the viewport so other content can be positioned underneath e6d166a

## [0.18.0](///compare/0.17.0...0.18.0) (2026-01-06)

### Features

* ability to pass table of contents options to the global subheader, and have those links rendered 28d7216
* added minDepth and maxDepth props to the TableOfContents component to control the render depth independent of the options provided 636f7f0
* introduce areRoutesStrictEqual utility, to compare paths including hash values 8d0d38c
* introduce useReseeWindowScroll composable, used in the GlobalHeader component for better slide in/out behavior on scrolling 1637f65
* introduce useUrlHash composable ac79e38
* updated the TableOfContents component to mark the current anchor with and .active class name 1887ea9
* updated the useUrlHash composable to return a boolean indicating whether the hash has been changed 176ee9f

### Bug Fixes

* limit the depth of subheadings that will be rendered in the GlobalHeader component cb68433

## [0.17.0](///compare/0.16.0...0.17.0) (2026-01-02)

### Features

* introduce ImageTiler component 00da5f0
* introduce InlineStatsList component f2b34c2
* introduce TableOfContents component 97ca413

### Bug Fixes

* huge amount of padding between GlobalHeaderAnnouncement dismiss button and other content 6152e61
* useId hydration mismatch in form controls when the form is wrapped in a Transition. d194a3b

## [0.16.0](///compare/0.15.0...0.16.0) (2025-12-30)

### Features

* adds an optional "xl" width to the LayoutPageColumn component that can be opted into by placing a `.page-column-xl` class name on an ancestor element 4af6f60
* optionally configure whether the CardScroller component tweens the opacity and/or scale of cards as scrolling occurs 5533125

### Bug Fixes

* bind extraneous attrs to the Form element 4159923

## [0.15.0](///compare/0.14.0...0.15.0) (2025-12-25)

### Features

* expose GlobalHeader subheader height in useGlobalHeaderState composable 257bfe9
* introduce CardScroller component ccbb69e
* introduce GlobalHeader component e45cfbf
* introduce GlobalHeaderAnnouncement component 95cfcc1
* introduce LayoutPageRoot component 29e1c00
* introduce ReseeWordLogo component 46f5363
* introduce ScrollPinnedContainer component f330fd5
* introduce SuccessSplash component 60cc60c
* provide default icons for the Message component, and provide the option to scroll it into view on mount 4025236
* the Form component can now conditionally render submit success/error states a4c4b3e

### Bug Fixes

* include z.undefined in union types for optional values fae2556

## [0.14.0](///compare/0.13.1...0.14.0) (2025-12-17)

### Features

* split the Image component into Image and ImageBase, which is just the <img> tag and associated loading logic 7845559

## [0.13.1](///compare/0.13.0...0.13.1) (2025-12-17)

### Bug Fixes

* the <Transition> component, when given the `appear` prop - doesn't matter if true/false/undefined - was causing icon render to be delayed 56cf7f5

## [0.13.0](///compare/0.12.0...0.13.0) (2025-12-16)

### Features

* added ability to control whether query values are added via push or replace in useQueryParameters 5aef6c5
* added the `initialValues` and `changeDelay` props to the Form component, modified the signature of `onChange` 493115f
* introduced useDebouncedSyncRef composable 51fc29b

### Bug Fixes

* do not immediately try to sync left and right reactive objects when useReactiveObjectsSync is called 76efd39
* inject CSS (at)layer ordering very early on so loading order doesn't mess it up bddf43b
* the query param name created by useQueryParameters is now kebab cased 668553f

## [0.12.0](///compare/0.11.1...0.12.0) (2025-12-15)

### Features

* added `chip` toggle to Tag component for styling as an outlined rectangle or not c3783ec

### Bug Fixes

* icons in inverted status indicators can now be seen c8ca735

## [0.11.1](///compare/0.11.0...0.11.1) (2025-12-15)

### Bug Fixes

* only hide the label for a responsive button... not... everything 8d5b8f5
* put component scoped styles in the component layer so utilities can still take precedence 5099aeb
* put LayoutPageContainer scoped styles in the component layer so utilities can still take precedence be6a3fa

## [0.11.0](///compare/0.10.0...0.11.0) (2025-12-15)

### Features

* introduce useQueryParameters composable 05b2219
* introduce useReseeBreakpoints composable, which uses nuxtjs/device under the hood to help sus out the current break for SSR f0eb430

### Bug Fixes

* warning "Non-function value encountered for default slot" from FormFieldBuilder 967babb

## [0.10.0](///compare/0.9.0...0.10.0) (2025-12-09)

### Features

* introduce FormFieldRadioGroup component ca58023

## [0.9.0](///compare/0.8.0...0.9.0) (2025-12-09)

### Features

* introduce FormFieldBuilder component, and the ability to pass a field configuration array to the form instead of defining each field in markup 2b9b43a
* the LayoutPageContainer component now supports subheader text and an actions bar, as well as being able to designate it a prose container for typography styling 0bd455b

### Bug Fixes

* hydration mismatch when the Lorem component is SSR dcbd12b

## [0.8.0](///compare/0.7.1...0.8.0) (2025-12-08)

### Features

* introduce FormFieldTextarea component 6ca7e99
* introduce FormFieldTurnstile component a18bc24

### Bug Fixes

* the FormElementSelectButton form component has its initial value set, if provided 84135e5

## [0.7.1](///compare/0.7.0...0.7.1) (2025-12-07)

### Bug Fixes

* a better check for selected values that a label can be shown for in the FormElementSelectOptions component ae03231
* styles requiring the :deep pseudo helper in Image component eefba49

## [0.7.0](///compare/0.6.0...0.7.0) (2025-12-06)

### Features

* added support for `v-model:values` on a Form instance, which binds to that form's internal state b601f69
* introduce useReactiveObjectsSync composable - a first pass at being able to selectively synchronize the properties of two reactive objects ae570ad

### Bug Fixes

* properly compare values in the ForElementSelectButton component when an optionValue field is provided 4d6ebd4

## [0.6.0](///compare/0.5.0...0.6.0) (2025-12-05)

### Features

* added additional onBlur, onChange, and onInput methods to the default slot of the FormField component so custom controls can be wired f6326c6
* added an [#option](undefined/undefined/undefined/issues/option) slot to the FormFieldSelect component so that options can be customized beyond a string label d75284d
* introduce FormFieldSelectButton component e4ef641
* introduce ToggleButton component 54661cc
* introduced a debounced "onChange" callback to the Form component b6d60d9

### Bug Fixes

* do not execute onSubmit if a form is disabled ca7c3b1
* make toggle buttons disabled in the FormElementSelectButton component if it is made readonly 1552e41
* submit button is disabled if form is 7d2e8f2
* usage of :deep() css Vue pseudo for the IconTextPair component 371b415
* use custom check icon to avoid Vue warning coming from the Primevue CheckIcon component about a duplicate label prop and computed getter 85a36c1

## [0.5.0](///compare/0.4.1...0.5.0) (2025-12-04)

### Features

* basic support for an optional header in the LayoutPageContainer component 0639804
* mobile menus and lists appear on top of drawers/ dialogs, and disable body scrolling 30991df

### Bug Fixes

* add type="button" attribute to buttons by default, to avoid bad behavior inside forms 225f310
* added `data-pc-section="clearicon"` to the Select/MultiSelect clear button, as Primevue uses it internally to drive specific behavior a1f8d20
* apply externally provided classname values to the FormField component 9597f4d
* correct typing of the Message component `severity` prop feda14b
* just the `value` prop is extracted from each state entry processed by getValuesFromFormState aaad7e9

## [0.4.1](https://github.com/ReSee-Movies/nuxt-ux/compare/0.4.0...0.4.1) (2025-11-20)

### Bug Fixes

* added Primevue toast assets to Vite's dep optimization list, added constants file to tailwind sources ([c9b2180](https://github.com/ReSee-Movies/nuxt-ux/commit/c9b218069525c9700c59c22d3e63a7b00b349f24))

## [0.4.0](https://github.com/ReSee-Movies/nuxt-ux/compare/0.3.1...0.4.0) (2025-11-19)

### Features

* added Icon props to Message component ([12c0ca0](https://github.com/ReSee-Movies/nuxt-ux/commit/12c0ca06869da894bbae1cd05d1ccd8f7fe12c3c))

### Bug Fixes

* width of UiImage component outer wrapping ([3c60564](https://github.com/ReSee-Movies/nuxt-ux/commit/3c6056487e80343ea68c41f4e2ba707f094491f7))

## [0.3.1](https://github.com/ReSee-Movies/nuxt-ux/compare/0.3.0...0.3.1) (2025-11-19)

### Bug Fixes

* add support for links to Menu items ([00f7c01](https://github.com/ReSee-Movies/nuxt-ux/commit/00f7c014aa4714753cf595b66bbb0c10b001c379))

## [0.3.0](https://github.com/ReSee-Movies/nuxt-ux/compare/0.2.4...0.3.0) (2025-11-19)

### Features

* introduce Menu component ([482eb0e](https://github.com/ReSee-Movies/nuxt-ux/commit/482eb0eb3645d9d67a59f029f0673dc4b07b41a8))

### Bug Fixes

* passthrough additional attrs to the Icon component ([456e5da](https://github.com/ReSee-Movies/nuxt-ux/commit/456e5da8f60716e872bd84cfe0880311fd5fd202))

## [0.2.4](https://github.com/ReSee-Movies/nuxt-ux/compare/0.2.3...0.2.4) (2025-11-19)

### Style Updates

* add button and anchor styling to .prose blocks ([2990eef](https://github.com/ReSee-Movies/nuxt-ux/commit/2990eef72ab7be43ac0f61a72e1de63a67dd1542))
* added the ability to disable the visible styling of dialogs, for uber customization ([1ec937d](https://github.com/ReSee-Movies/nuxt-ux/commit/1ec937d59cba2050783dd2207598be211024a668))
* update z-index values for various overlay elements (dialogs, tooltips, etc) ([e1f0793](https://github.com/ReSee-Movies/nuxt-ux/commit/e1f0793fe56919d02fe5f5e156c42174b612eefd))

### Refactors

* rename LoadingIndicator to ProgressSpinner ([53b0554](https://github.com/ReSee-Movies/nuxt-ux/commit/53b0554d7cc4db279408e6d455c970fa1566d806))

## [0.2.3](https://github.com/ReSee-Movies/nuxt-ux/compare/0.2.2...0.2.3) (2025-11-18)

### Bug Fixes

* prefer the `icon-size` over `size` prop, if provided, in the Button component ([4cf5dd0](https://github.com/ReSee-Movies/nuxt-ux/commit/4cf5dd00b1abf3f78e5a93fb65d6d1bb11f716d1))

### Style Updates

* make .btn classed elements inline-block ([dd5e673](https://github.com/ReSee-Movies/nuxt-ux/commit/dd5e67343679760181fa219b2fb0a482ea53ad46))
* round over the visible corners of the Drawer component ([56b5c2f](https://github.com/ReSee-Movies/nuxt-ux/commit/56b5c2f2fcb09deb77147170763083730d67ea12))
* tweaked tooltip outer padding to not smash right up against the viewport edges ([997f3c4](https://github.com/ReSee-Movies/nuxt-ux/commit/997f3c4cba5c6b511116547884bf0e7f986c99f1))
* update the horizontal rule color ([1a67415](https://github.com/ReSee-Movies/nuxt-ux/commit/1a6741550a17fc18448afa6450d985706d5e0c2f))
* updated Drawer component to play better with the page scrollbar around all four sides that it can slide in from ([eacb48c](https://github.com/ReSee-Movies/nuxt-ux/commit/eacb48c82586f0da9c48e93b644f06eaf38522f7))

## [0.2.2](https://github.com/ReSee-Movies/nuxt-ux/compare/0.2.1...0.2.2) (2025-11-18)

### Bug Fixes

* drop Link component - good grief ([339f86a](https://github.com/ReSee-Movies/nuxt-ux/commit/339f86ad27f6eb1270a3136a1bed0d19a9ea05cd))

### Style Updates

* center-align text within .btn classes ([6cd6b56](https://github.com/ReSee-Movies/nuxt-ux/commit/6cd6b56c74f8ecd15f0472283f80f21a255feb32))
* don't break words in tooltips ([8327882](https://github.com/ReSee-Movies/nuxt-ux/commit/83278820306b49ce759a54a6e88aaf083301f19d))
* introduce ReSee color scale gradients ([c9aca7d](https://github.com/ReSee-Movies/nuxt-ux/commit/c9aca7dc53a0a3635349c5a12f9a31dc8920878a))

## [0.2.1](https://github.com/ReSee-Movies/nuxt-ux/compare/0.2.0...0.2.1) (2025-11-17)

### Bug Fixes

* resolve NuxtLink within the UxLink component instead of trying to import it in the config ([5a0e27e](https://github.com/ReSee-Movies/nuxt-ux/commit/5a0e27e766700670fa1d1794b8264c628dec54c9))

## [0.2.0](https://github.com/ReSee-Movies/nuxt-ux/compare/0.1.0...0.2.0) (2025-11-17)

### Features

* added `.js` extension to composables imports path so it doesn't need to be explicitly provided ([39434d7](https://github.com/ReSee-Movies/nuxt-ux/commit/39434d703120f1615f85da6486fd0e3347adc487))
* added `resee-ux` alias for module assets ([ec8dacf](https://github.com/ReSee-Movies/nuxt-ux/commit/ec8dacfe0c023b09fbe71bd1a900aeb136468fed))

## [0.1.0](https://github.com/ReSee-Movies/nuxt-ux/compare/0.0.4...0.1.0) (2025-11-14)

### Features

* added a color-cycle prop to UiIcon that will transition the icon color through the ReSee color palette ([286d2b4](https://github.com/ReSee-Movies/nuxt-ux/commit/286d2b4d2e67f60842c19e3ed3703c84fd1eaff5))
* added ability to customize Primevue component prefixes, and load additional components via their base name ([60e2fc1](https://github.com/ReSee-Movies/nuxt-ux/commit/60e2fc1cfab5d2ca925f19a98202aeee4ef5e580))
* added the ability to provide a custom prefix for components ([b1f7895](https://github.com/ReSee-Movies/nuxt-ux/commit/b1f7895adc1bbc0b100da9e5cdb89014c0d8e5b7))
* added the ability to provide a passthrough definition source for Primevue ([5da8e3c](https://github.com/ReSee-Movies/nuxt-ux/commit/5da8e3c4ac7193d1ee20345e6633d7761f5d8493))
* implement UiDialog component ([0dc0e19](https://github.com/ReSee-Movies/nuxt-ux/commit/0dc0e19cebb05a3f2eb694b64c1349446e7d9110))
* implement UiDrawer component ([4864408](https://github.com/ReSee-Movies/nuxt-ux/commit/48644083a28b7a90d7ad4713ca646de53d6ca6b7))
* introduce UiCloseButton for standardization of more complex components that require one ([fbf9c9a](https://github.com/ReSee-Movies/nuxt-ux/commit/fbf9c9ad406037b8a253856fb0cbf63b21663933))
* introduced UiImage component ([a060aec](https://github.com/ReSee-Movies/nuxt-ux/commit/a060aec28a2ef0223d970b5481c9db690c17e265))

## [0.0.4](https://github.com/ReSee-Movies/nuxt-ux/compare/0.0.3...0.0.4) (2025-10-14)

### Bug Fixes

* test for the correct extension on primevue's passthrough config file ([5637ac1](https://github.com/ReSee-Movies/nuxt-ux/commit/5637ac1f421d2ccfb10579df505c3ca73d4037ee))

## [0.0.3](https://github.com/ReSee-Movies/nuxt-ux/compare/0.0.2...0.0.3) (2025-10-14)

### Bug Fixes

* explicit import paths for Tailwind ([8cf9e9e](https://github.com/ReSee-Movies/nuxt-ux/commit/8cf9e9e0bb3176c48a94cb70e9a7e19f09539e34))

## [0.0.2](https://github.com/ReSee-Movies/nuxt-ux/compare/0.0.1...0.0.2) (2025-10-14)

## 0.0.1 (2025-10-14)

### Features

* added size and "loading" options to the UiIcon component, standardized the size of icons with CSS vars, and provided a way to pass those values through the UiIconTextPair component ([8ea857c](https://github.com/ReSee-Movies/nuxt-ux/commit/8ea857cbbb2158adc658819514137e3a09cce454))
* introduce notification support ([3d13b08](https://github.com/ReSee-Movies/nuxt-ux/commit/3d13b08c39f3caf4e7ce3765b7912479ac72a74c))
* introduce the `useSharedIntersectionObserver` composable ([544caa0](https://github.com/ReSee-Movies/nuxt-ux/commit/544caa015ca1972db1d53ecaa4e9db32f0df3360))
* introduce the UiCard component ([b9d71a9](https://github.com/ReSee-Movies/nuxt-ux/commit/b9d71a95196de783e487b0bd09257ffde5ab53c4))
* introduce UiButton component ([569a5d4](https://github.com/ReSee-Movies/nuxt-ux/commit/569a5d4f4c26555d8ccb5c33de4688b66e40c82c))
* introduce UiHeading component and typography CSS ([096a9f1](https://github.com/ReSee-Movies/nuxt-ux/commit/096a9f1e4be69313ee1c5a84c6d1a18499ca5733))
* introduce UiLink component, and useNuxtUxConfig composable ([c45b6f2](https://github.com/ReSee-Movies/nuxt-ux/commit/c45b6f200f8cb9a9d2583c2512adec5e763e792a))
* introduce UiProgressBar component ([c5d147a](https://github.com/ReSee-Movies/nuxt-ux/commit/c5d147a5d1f1d5745dc06c697f940d8301f5c616))
* introduce UiTag component w/tooltip support ([3136883](https://github.com/ReSee-Movies/nuxt-ux/commit/31368836388b53ef214168cd20713106f39beb5f))
* migrate UILorem component ([6e44f0e](https://github.com/ReSee-Movies/nuxt-ux/commit/6e44f0e6276192e3d7879f7eb9bf802d268aad06))
* the UiLayoutPageContainer accentColor controls the --custom-accent-color CSS prop ([e067cc8](https://github.com/ReSee-Movies/nuxt-ux/commit/e067cc8b08244831c475bcd00f34483f1429637c))

### Bug Fixes

* corrected the "types" package exports ([99b8b7c](https://github.com/ReSee-Movies/nuxt-ux/commit/99b8b7c4349e8f7f7fb370b93378f2836bcc2261))
* default to dark color mode ([080be5f](https://github.com/ReSee-Movies/nuxt-ux/commit/080be5f171a29abad324cb93a521bc737753b93a))
* linting ([9899bca](https://github.com/ReSee-Movies/nuxt-ux/commit/9899bcac53fc94b77487fb743334d0649fef48f6))
* provide an alias path for Primevue to find passthrough configs at build-time ([ad20469](https://github.com/ReSee-Movies/nuxt-ux/commit/ad20469c9bd0a20e1562d4d70126f0995eaac2fa))
