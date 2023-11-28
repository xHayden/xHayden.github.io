---
title: I Created a Workout Tracker That Charges Me $$$ If I Don't Go to the Gym
description: >-
  I've had a hard time having motivation to work out, but I also like keeping my
  money. Which force will win? To decide this, I created an iOS app in Swift.
date: 2023-11-28T05:00:00.000Z
slug: workout-tracker-apple-health-charges-money
---

<style>
  @media screen and (min-width: 800px) {
    .responsive-gap {
      gap: 2em;
    }
  }
</style>

# Introduction

Ever since I've come to college, I've had a hard time motivating myself to go the gym. When school's not in session, I find it easy to go every day, but classes and the stresses of life convince me that *anything and everything else* is more important.

But...I should be going. One night, I wanted to force myself to go, so I promised a friend I'd pay them $20 if I didn't go in the next few hours. I ended up going the next morning instead and paid them $20, but it was enough motivation to make me go so I decided to make a streamline way to keep this extrinsic motivtation going.

## Existing Solutions

I looked for something that'd do the job without me having to do any work and I found [Beeminder](https://www.beeminder.com/) and [StickK](https://www.stickk.com/) being the notable ones. But these apps focused around general habit tracking, and that wasn't what I was trying to do. They also didn't sync with my Apple Health data which was the only way I was going to make this manageable. There was no way I was going to manually do **anything** related to tracking if this was going to work.

## My Solution

I've never made an iOS app before, but using HealthKit, the interface for Apple Health data, requires writing code for Apple devices, so I caved. I've written a few games in Android Studio before and writing an iOS App in Xcode was fairly similar.

I started with creating a general tracker of the workout streak I was on. A streak is defined as a period of days that starts with zero workouts in the past month. If there is a workout in the past month, new workouts become part of that streak.

Then I expanded to judging what a "workout day" was. This was the hardest part of the project, because it meant dealing with *dates* (I shiver even saying the name). Dates are reallllllyyyy annoying, as anyone who's had to deal with them will tell you. Of course, I made it harder on myself by making an early morning workout, one that is before 3AM, count as the day before's workout if there wasn't one in the previous day. This leads to some weird behavior but it's my app and no one can tell me what is or isn't right and I needed this feature because I regularly work out at 2AM. Out of my time working on this app, dealing with date weirdness probably accounted for half of it.

Now that I know what is and isn't a workout, I can charge based on missed workout days. Look at this UI!

<div style="display: flex; padding-bottom: 2em; padding-top: 2em; width: 100%; justify-content: center; align-items: center">
<img alt="Workout calendar view" height="400" style="height: auto; max-width: 100%; max-height: 400px !important" src="https://img.hayden.gg/VgJW8uDdGX.png"></img>
</div>

I also implemented an overview screen and some settings to manage how much each missed day should cost the user. One fun thing I added was allowing for "break days". Of course, you can mark every day as a "break day" if you really wanted to, but that's sad and defeats the purpose so you really shouldn't do that. I also made a setting for automatic break days so I could get one day off each week without manually overriding a day's workout status.

<div style="display: flex; padding-bottom: 2em; padding-top: 2em; width: 100%; justify-content: center; align-items: center;" class="responsive-gap">
  <img alt="Workout overview view" height="400" style="height: auto; max-width: 100%; max-height: 400px !important; max-width: 50%;" src="https://img.hayden.gg/y0o8mDU8Ul.png"></img> <img alt="Workout settings view" style="height: auto; max-width: 100%; max-height: 400px !important; max-width: 50%;" height="400" src="https://img.hayden.gg/PjLTljcsgp.png"></img>
</div>

## The Future

I was planning to keep working on this app and make payments automatic, but the App Store terms and conditions slashed any dreams of having this product be fully automated. The app requires payments be easily changeable, since different people have to pay different amounts every month, and Apple offers no way to do that. They also don't allow me to use an external payment processor like one on my website or a PayPal subscription because they want you to pay their [insane fees](https://appleinsider.com/articles/23/01/08/the-cost-of-doing-business-apples-app-store-fees-explained), so I guess this project is dead in the water commercially. You can still [clone my repo](https://github.com/xHayden/sweat-stake) and build it manually to your device, though.

Overall this was a fun break to my schoolwork and I enjoyed writing code in Swift for iOS more than I thought I would. Maybe I'll write another iOS app sometime, or maybe not. So far, this app has been getting me to go to the gym. I'm on a one week streak!

The code can be found [on my GitHub](https://github.com/xHayden/sweat-stake).
