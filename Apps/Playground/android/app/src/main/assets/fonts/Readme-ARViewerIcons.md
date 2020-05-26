# ARViewerIcons.ttf

## Where did this font come from

This font is derived as a subset of icons of the Office UI Fabric Icons which can be found here.
<https://uifabricicons.azurewebsites.net/>

The fonts need to be in .ttf format for React Native, so you may need to convert the fonts from .woff to .ttf

The downloaded glyphs include the following and can be used in JS as a string "\uE423".

## Included Glyphs

``` JSON
    {
      "name": "Reset",
      "unicode": "E423"
    },
    {
      "name": "Add",
      "unicode": "E710"
    },
    {
      "name": "Camera",
      "unicode": "E722"
    },
    {
      "name": "Back",
      "unicode": "E72B"
    },
    {
      "name": "Undo",
      "unicode": "E7A7"
    }
```

## How to Add these Fonts to the App

You need to add the fonts in the test app and in any consumer/client apps.

- Add the fonts in the apps /assets/fonts/ folder.
- Run `react-native link` on the project
- You can reference the files in the native module and the module will just assume that the font family is correct.
- When you update the test app, you MUST update the Power Apps Client as well!
