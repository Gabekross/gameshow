# games-show
Gameshow :images are displayed
How It Works
- Start Timer:

When startTimer is called, it displays a random image and tracks the current image and its corresponding answer.
- Show Answer:

When the "Show Answer" button is clicked, the showAnswer function sends a showAnswer action to the display.html page.
The display.js retrieves the answer corresponding to the current image and displays it in the answerBox.
- Reset Timers:

Hides the image and answer, resets timers, and clears the current image and answer tracking.
Example Flow
Click "Start Player 1":
A random image is displayed.
Click "Show Answer":
The corresponding answer for the displayed image appears.
Click "Reset Timers":
The image and answer are hidden, and everything resets.
