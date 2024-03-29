# CURRENT STATUS
This project is not being maintained anymore. Vail Resorts has stopped requireing reservations for their mountains. If anything changes I'll update this

# epic-reservations
This repo contains various scripts to automatically reserve ski days for epic pass. Feel free to use them within the bounds of the epic pass terms of service (note: I dont actually know if the terms of service allow the use of scripts to make reservations so use at your own risk as well). Each of the scripts in this repo will continuously check availability at a given list of mountains as well as make and confirm your reservation if an availability is found. If you use and you like it, you can support me here. No obligation but greatly appreciated

<a href="https://www.buymeacoffee.com/dangorman" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" height="41" width="174" >
</a>

## Repo Contents
- [Timeout Based Reservation Script](https://github.com/dangothemango/epic-reservations/blob/main/scripts/timeoutReservationMaker.js)
  - This script uses a configurable delay between actions. The purpose of this delay is to wait for api calls and loading times. ***Warning: this has not been updated with feature improvements only use this if the async script fails for some reason*** 
- [Async Function Based Reservation Script](https://github.com/dangothemango/epic-reservations/blob/main/scripts/asyncReservationMaker.js)
  - This script is based on async function calls and can detect when the epic pass reservation page is loading. This checks availablility at a theoretically optimal rate.
- [Async Reservation Script for Buddy Passes / SWAF](https://github.com/dangothemango/epic-reservations/blob/main/scripts/asyncReservationMaker_buddy.js)
  - This script is the same as the async script above, but for reserving buddy passes or Ski With A Friend (SWAF) passes. Because this option requires payment, you would still have to check out manually (do so quickly before someone else snags the spot). You only need to use this script if the desired day is already booked. I've had a 100% success rate with finding a spot even if it's booked. See usage instructions [below](#usage-instructions-buddy-pass).

## Usage Instructions

1. Copy your script of choice into a local text editor
2. Set top level variables
   1. Day Selection
      - `desiredDay` (timeout script only) = set this to the day of the month you are looking to reserve. it must be in the current month.
      - `desiredDays` (async script only) = a list of month/day for the days youd like to reserve
   2. `mountains` = this is a list of the numerical value of the mountains you would be willing to ski/ride on that day. there is a mapping of mountain names to numbers in each script
   3. `people` = this is the list of passholders on your account you are looking to get reservations for on the given day. enter their full names.
   4. `delay` (timeout based script only) = this is the number of milliseconds between actions in the script. too low and the webpage wont load fast enough and the script will break, too high and the script may not be fast enough to reserve days for you.
3. Navigate to the [epic pass reservation site](https://www.epicpass.com/plan-your-trip/lift-access/reservations.aspx)
4. Open up the web console. I do this by right clicking and selecting inspect element but its different by browser. You're smart, google it
5. Copy and paste the script with your set variables into the web console. make sure to get the whole thing (cmd+a). (when its pasted make sure to hit enter)
6. type `start()` into the console and hit enter.
7. Profit

## Usage Instructions: Buddy Pass

1. Follow steps 1 and 2 from above.
2. Navigate to the [Season Passes](https://www.epicpass.com/account/my-account.aspx?ma_1=4) tab of the My Account page.
3. Click on "Benefit Tickets", then "Buy for a Buddy" or "Ski With A Friend", then "Get Started".
4. Open up the JavaScript Web console. On Chrome for the Mac, it's Option+Command+J. You can also do this by right clicking, selecting inspect element, and then clicking "Console", but its different by browser. If you're confused, Google it.
5. Copy and paste the script with your set variables into the web console. make sure to get the whole thing (cmd+a). (when its pasted make sure to hit enter)
6. Type `start()` into the console and hit enter.
7. It will run until it finds an open spot. It will then open a new tab so that you can continue the checkout process. Do so quickly so you don't lose the spot. If the checkout process fails, please refresh the page and restart from Step 2. Note: It's possible that the code stops running and a new tab does not open - in that case just check manually and there should be an empty spot.
8. Profit

## Current Limitations
- Assumes that the passholders in question do not something preventing them from reserving on that day
  - So far the only thing i know that falls into this category is when a passholder has a reservation for said day
