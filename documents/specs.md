# Overview of the Exodus 40 Lite App
There should be an app called "Exodus 40 Lite", which lets the Good Wine Group, a small men's group at St. Agatha St. James Parish in West Philadelphia, track their progress in the Exodus 40 Lite rule of life that they are living together during Lent 2026.

# Architecture
The app should be a progressive web app (PWA) which can be wrapped for Android (and potentially iOS) using Capacitor.

The app should be hosted in the exodus40lite folder.

## Tech Stack
- Vanilla HTML / CSS / JS -- no frameworks, no build step
- Hand-written Service Worker -- cache-first strategy for offline support
- localStorage -- for persisting checklist state (personal/local only, no backend)
- manifest.json -- for PWA installability
- Apache on Linux -- to serve static files over HTTPS
- Capacitor -- for future Android/iOS wrapping

## Data Model
- All data is stored locally in the browser via localStorage
- No backend, no database, no user accounts
- Each user tracks their own progress privately

# Function
The app should let the user track their progress for the day and week on the Exodus 40 Lite rule, listed below. The user does not need to be able to see anyone else's progress.

For weekly tasks, new weeks should start on Sunday, the Lord's Day and the start of new weeks.

# URL
The app should be accessible at https://exodus40lite.stephens.page

# Analytics via Google Tag
This site's traffic should be measured by Google Analytics.

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0MLTLVTK6F"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-0MLTLVTK6F');
</script>

# Exodus 40 Lite Rule

## 🙏 Prayer
- Daily read the Mass readings and Psalm
- Daily make a holy half hour (attending Mass counts)
- Celebrate the Lord's Day on Sundays by relaxing one discipline

## 🍞 Fasting
- Fast on Fridays (except first Friday given the Ash Wednesday fast)
- Abstain from meat on Fridays

## 🫴 Almsgiving and Works of Charity
* Weekly give alms (counts as a work of charity)
* Daily perform one work of charity:
	* Corporal: Feed the hungry, give drink to the thirsty, clothe the naked, shelter the homeless, visit the sick, visit the imprisoned, bury the dead
	* Spiritual: Instruct the ignorant, counsel the doubtful, admonish the sinner, bear wrongs patiently, forgive offenses willingly, comfort the afflicted, pray for the living and the dead

## 🫂 Fraternity
- Daily anchor check-in with your assigned anchor (Each week you will be assigned a different anchor to provide accountability and support)
- Weekly fraternity meeting on Sunday with the group

## 🏛️ Stewardship
- Get a full night's sleep (7+ hours)
- Exercise three times per week

## 💪 Asceticism
- No unnecessary screen time (smartphone, computer, TV, video games, social media)
- Give up alcohol
- No soda or sweet drinks
- No snacking between meals
- No desserts or sweets
- Listen only to music that lifts the soul to God
- Abstain from unnecessary purchases

# Favicon and Icon
The icon / favicon for the app should be purple and incorporate minimal stylistic elements related to prayer, fasting, and or almsgiving. Given this needs to work as a favicon, it should use fairly basic shapes overall.

The site favicon and icons are in exodus40lite/favicon_io

# Notes
Each day should have a notes box below the checklist which lets the user enter a note about their day. I want to use this to explain for example why I didn't check the "no unnecessary screen time" box on Feb. 19 2026.

# Accounts
To enable updating the checklist on both a user's laptop and phone, the app should let users create an account which can be used to store data on the server with. The create account feature should be optional - the app using localStorage only if the user does not have an account. The app should use PHP and MySQL to store and serve the data. The account feature should be setup to be compatible with using Capacitor to serve this PWA as an Android app.

To create an account, the user must enter an email address and password. To login, the user must enter the email address and password of their account.

# Attribution
This app is a modification of the Exodus 90 rule (https://exodus90.com/), so Exodus 90 should be attributed on the app.