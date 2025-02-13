# "Permanent Install" (Autoload) of Temporary Firefox Addons

One of the problems that really bothers me as an extension developer is that Firefox took away the ability to run personal addons from a local file directory without having to package it into a xpi (at least with Developer Edition and ESR it is possible to run your personal xpi without having to sign it, thank goodness).  This is a [bad decision](https://blog.mozilla.org/addons/2015/12/23/loading-temporary-add-ons/) which Mike Kaply also disagreed with: 
> "This fix doesn't help the thousands of add-ons that are not restartless.  Please just do a developer mode like Chrome.  Have a giant popup that says "You are in developer mode" and be done with it. Please."

This is a standard feature in every major browser I tried (just turn on "Developer Mode" in Chrome), so that even casual users can dabble in extension.  But for whatever reason (security? to prevent clueless users from being duped into running addons that are unziped into a local directory?) Mozilla do not allow it. .

Since Mozilla [will not provide this functionality](https://bugzilla.mozilla.org/show_bug.cgi?id=1309288#c25), I need to find a way to do it.  I started to google for various options to go about it. Initially I thought about hacking omni.ja directly, but Mike Kaply convince me that it is [better to do it via AutoConfig](https://mike.kaply.com/2013/05/06/dont-unpack-and-repack-omni-jar/).

I found another [article by Mike Kaply](https://mike.kaply.com/2012/03/22/customizing-firefox-advanced-autoconfig-files) and found a very useful reply from Mike when asked about AddonManager.jsm . His comment about Components.utils.import("resource://gre/modules/AddonManager.jsm") provided exactly the information I needed.  After studying his CCK2 code and a few hours of trial and error I found the solution.  What is even better is that this solution seems to work even on the current release version of Firefox (tested on Windows 10 running Firefox version 104.0.2 32-bit)

The procedure involves a few steps, but it needs to be done only once.

First you need to enable [AutoConfig aka userchrome.js](https://www.userchrome.org/what-is-userchrome-js.html) by copying the file [config-prefs.js](https://github.com/tsaost/autoload-temporary-addon/blob/main/config-prefs.js) to [Your Firefox install directory]/defaults/pref

Note: For best security, on Windows it is best to leave your Firefox install in "c:\Program Files" so that your config-prefs.js and userChrome.js can only be modified when you are in root/admin mode.

Then you need to edit the file [userChrome.js](https://github.com/tsaost/autoload-temporary-addon/blob/main/userChrome.js) and modify the function installUnpackedExtensions() to reflect the locations of your own addons.

The modified userChrome.js then must be copied to your Firefox installation directory.  For example on Windows this is usually "c:\Program Files (x86)\Mozilla Firefox" for the 32-bit version of Firefox.  You can rename the file, but remember to modify the corresponding line pref("general.config.filename", "userChrome.js") in defaults/pref/config-prefs.js

Now your addons from your local directories will be loaded automatically whenever Firefox starts.  After editing your code remember to reload it from [about:debuggin](about:debugging#/runtime/this-firefox). You can also get there via the menu by selecting "More Tools", then "Remote Debugging", and click on "This Firefox" on the left side (but the quickest way is to bookmark it and then add a bookmark keyword such as "dbg" for quick access.)

Please note that this is an automated installation of the extension every time Firefox starts, so it is not quite the same as a "permanent install".  That is, this procedure has exactly the same effect as clicking on "Load Temporary Addon..." from the [about:debugging](about:debugging#/runtime/this-firefox) page, just that the process is now automated via userChrome.js.  This means that if you have code that does something after the installation of the extension such as `browser.runtime.onInstalled.addListener(details => { if (details.reason == "install") { ...do something after install... });` then this code will be called every time Firefox is launched. 

Because the extension is re-installed every time, you must make sure you have [browser_specific_settings](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings) such as `"browser_specific_settings": {"gecko": { "id": "you.extension.your.name@gmail.com" }}` in your manifest.jason or changes to your options and local storage will be lost when you restart Firefox.

I hope that Mozilla will not cripple AutoConfig to prevent this workaround for the lack of a Developer Mode like most other browsers.  Seems to me that AutoConfig does not represent a new security loophole because if an attacker has access to the Firefox install directory to install or modify config-prefs.js and userChrome.js then every file in the directory, including firefox.exe and omni.ja are at risk already.

The auto-generated github page is [here](https://tsaost.github.io/autoload-temporary-addon/).
