# Design Change Report

The core code of this application is only about 400 lines. This excludes tests and scripts used to compile the code.
Although the code could be written without some type of architecture, it was more managable to create a component based system for specific UI elements/areas.

## Design Priniciples

We modularized components based on function and responsibility.

- App.jsx is the core of the program and contains logic for the textarea.
- Frequency.jsx is a feature that analyizes the frequrency of words within the text.
- Replace.jsx is a feature that allows for search & replace of various words within the text.
  Much of the logic for each component was independent of one another.

Components had low coupling wherever possible:

- App.jsx & Frequency.jsx has low coupling requiring an input of a list of words.
- App.jsx & Replace.jsx had higher coupling, but only to the extent required. This included allowing modifications to text and selected text position.
  - The higher level of coupling was determined to be logical due to the interactive nature of the feature. Futher, this type of coupling would not handicap future features to the textarea.

Fault tolerance & defense was heavily considered.

- By prohibiting network request, network failure is not possible once the user loads the page.
- Invalid user input was interactivly handled with the enabling/disabling of feature buttons.
- Data corruption was detered by implementing the application inside an HTML program.

## Design Patterns
We utilized a composite pattern. As long as App.jsx is in the program the core functionality works (i.e., the textarea). The features for frequence & find/replace are contained within separate & independent folders. Moreover each feature represents a composite, verticle column glyph of the UI. If the file is included, then the feature is added.

## Design Changes
1. The initial set of requirements were relatively simple, however we separated the textarea and frequency elements into separate elements. This was useful for future features.
2. The second set of requirements also required creating modular functions to achieve the end functionality. This was modularized by creating functions for find next, replace, and replace all. An unexpected difficulty included creating a highlight effect in the textarea UI element when the find button was clicked. This feature required more coupling so that the replace component could read & set the selection area as well as read & set the text. 
3. The third set of requirements only took one commit and about 20 lines of code (excluding tests)! This was due to the prior work in step to. Creating a more modularized version allowed us to not repeat ourselves and utilize some of the work from step 2.