One of the problems that really bothers me as an extension developer is that Firefox took away the ability to run personal addons from a local file directory without having to package it into a xpi (at least with Developer Edition and ESR it is possible to run your personal xpi without having to sign it, thank goodness).  This is a bad decision which Mike Kaply also disagreed with: https://blog.mozilla.org/addons/2015/12/23/loading-temporary-add-ons/. "This fix doesn't help the thousands of add-ons that are not restartless.  Please just do a developer mode like Chrome.  Have a giant popup that says "You are in developer mode" and be done with it. Please."

This is a standard feature in every major browser I tried (just turn on "Developer Mode" in Chrome), so that even casual users can dabble in extension.  But for whatever reason (security? to prevent clueless users from being duped into running addons that are unziped into a local directory?) Mozilla do not allow it: https://bugzilla.mozilla.org/show_bug.cgi?id=1309288

Mozilla's answer is RESOLVED WONTFIX: "I'm not convinced we should pursue this path of allowing permanent installation of unsigned add-ons via about:debugging. There are multiple alternative paths that would allow developers to test behavior of the add-on which have been previously mentioned. They may not lead to the highest level of convenience w.r.t loading unpacked extensions into Firefox for development, but there are some trade-offs we need to make.  My recommendation would be to make use of Nightly along with web-ext".  The very valid objections from developers sleepwalkingnarcolepticinsomniac and Gabriele Tozzit explaining why web-ext is not a solution are ignored.

Rant: Mozilla seems to have forgotten that what made Firefox wildly popular in its early days was not just that it was lightweight and standard compliant, but also because Firefox provided a platform for customizing the browser to do just about anything through extensions.  The availability of a large number of useful extension, and the ability to allow someone to develop extensions for personal use (which is Gabriele Tozzi's main objective) is a very important factor to attract and retain users, specially power users who often are the ones in the position to recommend Firefox to friends, families and co-workers.

Since Mozilla will not provide this functionality, I need to find a way to do it.  I started to google for various options to go about it. Initially I thought about hacking omni.ja directly, but Mike Kaply convince me that it is better to it via AutoConfig https://mike.kaply.com/2013/05/06/dont-unpack-and-repack-omni-jar/

I found another of Mike Kaply's article and found a very useful reply from Make when asked about AddonManager.jsm (https://mike.kaply.com/2012/03/22/customizing-firefox-advanced-autoconfig-files). His comment about Components.utils.import("resource://gre/modules/AddonManager.jsm") provided exactly the information I needed.  After studying his CCK2 code and a few hours of trial and error I found the solution.  What is even better is that this solution seems to work even on the current release version of Firefox (tested on Windows 10 running Firefox version 104.0.2 32-bit)

The procedure is involves a few steps, but it needs to be done only once.

First you need to enable AutoConfig aka userchrome.js (See https://www.userchrome.org/what-is-userchrome-js.html if you want to understand AutoConfig better.)  By copying the file config-prefs.js to [Your Firefox install directory]/defaults/pref

For best security, on Windows it is best to leave your Firefox install in "c:\Program Files" so that your config-prefs.js and userChrome.js can only be modified when you are in root/admin mode.

Then you need to edit the file userChrome.js and modify the function installUnpackedExtensions() to reflect the location of your own addons.

The modified userChrome.js then must be copied to your Firefox installation directory.  For example on Windows this is usually "c:\Program Files (x86)\Mozilla Firefox" for the 32-bit version of Firefox.  You can rename the file, but remember to modify the corresponding line pref("general.config.filename", "userChrome.js") in defaults/pref/config-prefs.js

I hope that Mozilla will not cripple AutoConfig to prevent this workaround for the lack of a Developer Mode like most other browsers.  AutoConfig does not represent a security loophole because if an attacker has access to the Firefox install directory to install or modify config-prefs.js and userChrome.js then every file in the directory, including firefox.exe and omni.ja are at risk already.

Security is very important, but so is usability and the ability to customize the browser.  Protecting users from harm is a worthy goal but there is a limit. If one tries to make everything foolproof then the world will just produce a better fool.  Some users will just click on anything, install anything, and harm themselves even if the system shows them in big red letters that they should not do it.

One of the few areas in which Firefox is better than Chrome based browser is its hackability.  Now that Firefox has caught up with Chrome in terms of speed and usability, it should maintain its edge in Security, Privacy, and Customizability to keep and expand its user base .
