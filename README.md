<!--Actually 10:18-->
<!--WDI4 11:40 -->

# Legacy Code Is "The Best"

![](https://s-media-cache-ak0.pinimg.com/236x/c7/b5/e1/c7b5e1827478b8f703a74371e6f2b214.jpg)

## The Task

You are currently interviewing for a new development team, and they are planning on releasing their new product in 3 months.  There's only one problem: their lead dev, Trevor, just left to travel around Southeast Asia and "find himself" and has been unreachable for weeks.  We have no idea when he will be back.

Fortunately, one of your instructors was closely involved in the coding earlier.  He will introduce the code base and the problems he would like you to solve.  Since this would be your job for the next 3 months, he wants to make sure you can solve these problems.  If you do well on this coding challenge, you may find yourself with a job offer.

Solve as many of these problems as you can in whatever order you feel comfortable with.  Just like in any interview process, you should feel free to ask the instructors any questions you have, but they reserve the right to not answer them or answer them as cryptically as an interviewer would.

Lean heavily on your fellow developers for second opinions on this challenge, but **no copying code**.  Also, Professor Google and Captain Stackoverflow's doors are always open, and you are encouraged to use any and all notes from them or from your former projects.

As you work through these problems, use your commit messages to show your interviewers which problems you are solving, like so:

`git commit -m "Making text the appropriate size on mobile from 'The Problems' section"`

## The Code

Below is a basic rundown of the files in the app, and what they do.  This is mostly exhaustive of the code you will have to touch in this coding challenge, but perhaps not completely.  For any questions on file organization, please ask your instructors.  For any questions on what a line of code in a file is doing, follow the Read-Search-Ask pattern.

1. Basically all code you need is in `ionic/senseus/www/`
2. `index.html` includes all the outside resources and kicks off the show
3. All default Ionic/Angular CSS is in `www/css`
4. All custom CSS for this app is in `www/static/css`
4. Images are located in both `www/img` and `www/static/images`
5. Most external tools are located in `www/libs`
6. All the actual HTML on screens are located in `www/templates` with a name similar to that of the title of the screen in the browser
7. All front-end functionality for this app is in `www/static/js`
8. Most of the Angular functionality for this app is in `www/static/js/controllers.js`

## The Problems

### There Is No "I" in UI...ummm, Nevermind

1. The input label text is incredibly small on the Event Details screen.  Please make it bigger.  Bonus points if you can make the right size for mobile.
2. The rows on the Event Review page are pretty squished.  Make them a consistent height, and improve their appearance as you see fit.
3. The input field for the "Event Location" screen is in the wrong place.  Try to move it down *below* the map.
4. The date/time bar on the "Event Times" screen should be fixed at the top of the screen.  Please shift the calendar so it is neither above nor behind it.

**HARD**

5. The Event Times screen on some mobile screens looks like a lion ate a zebra and threw it back up.  Please untangle this mess.

### The Code We Deserve, but Not the Code We Need

There are a bunch of features the product has decided to abandon, but we still have the code for them.  Make sure you clean them out entirely if you start work on them, but be careful not to break other features.  Please get rid of these relics:

1. The "Find an Event" button on the landing page, and the modal it pops up.
2. The "Enable location sharing?" toggle button.
3. The "Event Type" section on the "Event Details" screen.
4. The five-dot div above the four-dot div on the "Event Locations" screen is confusing.  We can probably remove it.  Make sure you get rid of all its remnants, though.

### Squashing Bugs

Some things are just not working right.  See if you can make these things work.

1. If you fixed the five-dot-div above, the text input on "Event Location" may not create a marker with the Google Places API. Make sure it does.
2. If you change weeks on the "Event Times" screen, the divs are still highlighted.  Make sure that divs are highlighted only if they were selected (time-based not location-on-screen-based).
3. The Login/Signup button on the landing page does not do anything.  Can you figure out what it's supposed to do?  Once you have, fix it up to be as functional as possible.

### All the Features!

1. There is no way to get back to other screens (like Event Location and Event Invite) from the Event Review page.  Add some buttons to each of our summary rows that redirects to the respective screen on our ui-router.
2. It is OK that "Create Event" does not currently save to the Database, but we need to test that all the information *can* be saved.  Rewire the "Create Event" button so it displays all the eventInfo in an alert dialog.  Bonus points if you can wire it up with a modal.

### Anything else?

There are always more problems to solve.  If you see any other issues you think are worth fixing, please fix them.  Just make sure you make your commit messages descriptive enough for the interviewer to follow.

### A Note on Refactoring

This company cares a lot about sustainable code.  So if you see a place to make things more scalable, or cleaner, please improve the code.  However, remember two things:

1. **Separate** refactoring commits from commits for feature implementation, bug squashing etc.  You should *only refactor* in the commit, not change functionality.
2. Before you commit, test that the feature you're touching still works as expected.

## Set Up

To get this project started, you will need to do a few things first.

1. You will all be added as collaborators to this repo shortly. Go into your email and accept the invite to collaborate.
1. Install Ionic globally with `npm`
  - You have probably installed a newer version of `ionic` than the one this team uses
  - To install this team's legacy version you should run `npm install -g ionic@2.2.2`
2. Clone this repo
2. Checkout the `starter-code` branch
3. Checkout a new branch from this one with your first name
4. In this new branch, navigate to `ionic/senseus` and start your web server.
  4. Check this [documentation](http://ionicframework.com/docs/guide/testing.html) for how to do this.
  5. If prompted to select an address for the server, type or select `localhost`.
  6. If you are not prompted, you will need to manually set the `--address` to `localhost`.  Check the documentation or `ionic help` for the right syntax for this.
5. If this does not open a version of the app, please ask an instructor for help.
6. Navigate around the landing page, and the "Create an Event" workflow.  All of the problems listed above will be found in those places.

## General Advice

1. Open up Dev Tools, and don't close it ever.
2. Check the Terminal for any errors with your web server.
3. Commit early, and commit often.  You can always revert a small change, but a big change could be very messy.

<!--Actually 10:35-->

<!--11:57 WDI4 -->
