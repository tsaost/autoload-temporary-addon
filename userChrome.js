// First line is always a comment

/*
This is the actual code that autoload Firefox addons from a local directory.

The file must be copied to your Firefox installation directory.  For example
on Windows this is usually "c:\Program Files (x86)\Mozilla Firefox" for the
32-bit version of Firefox.  You can rename the file, but remember to modify
the corresponding line pref("general.config.filename", "userChrome.js") in
 defaults/pref/config-prefs.js

For best security, on Winndows it is best to leave your Firefox install in
"c:\Program Files" so that your config-prefs.js and userChrome.js can only
be modified when you are in root/admin mode.
*/


// https://mike.kaply.com/2016/09/08/debugging-firefox-autoconfig-problems/
lockPref("a.b.c.d", "1.2.3.4"); // Debugging Firefox AutoConfig Problems

// userChrome.js file for [Firefox program folder]
// file name must match the name in [Firefox program folder]\defaults\pref

function reportError(ex) {
	Components.utils.reportError("userChrome.js Ex(" + ex + ")");
}

function printDebut(text) {
	Components.utils.reportError("userChrome.js " + text);
}

// Based on class Addon { static async install(path, temporary = false) ... }
// d:\Files\Firefox102.2.0esr\omni_ja\chrome\remote\content\marionette\addon.js
// from https://developer.mozilla.org/en-US/Add-ons/Add-on_Manager/AddonManager#AddonInstall_errors
const ERRORS = {
  [-1]: "ERROR_NETWORK_FAILURE: A network error occured.",
  [-2]: "ERROR_INCORECT_HASH: The downloaded file did not match the expected hash.",
  [-3]: "ERROR_CORRUPT_FILE: The file appears to be corrupt.",
  [-4]: "ERROR_FILE_ACCESS: There was an error accessing the filesystem.",
  [-5]: "ERROR_SIGNEDSTATE_REQUIRED: The addon must be signed and isn't.",
};

// Untested...
async function installAddon(file) {
	let install = await AddonManager.getInstallForFile(file, null,
		{ source: "internal", });
	if (install.error) {
		reportError(ERRORS[install.error]);
	}
	return install.install().catch(err => {
		reportError(ERRORS[install.error]);
	});
}

async function installExtension(path, temporary) {
    let addon;
    let file;

	printDebut("installTemporaryExtension(" + path + ")");
    try {
      file = new FileUtils.File(path);
    } catch (ex) {
		reportError(`Expected absolute path: ${ex}`, ex);
    }

    if (!file.exists()) {
		reportError(`No such file or directory: ${path}`);
    }

    try {
        // addon = await AddonManager.installTemporaryAddon(file);
		if (temporary) {
			addon = await AddonManager.installTemporaryAddon(file);
		} else {
			addon = installAddon(file);
		}
    } catch (ex) {
		reportError(`Could not install add-on: ${path}: ${ex.message}`, ex);
    }
}


function installUnpackedExtensions() {
	installExtension("d:\\workspace\\go\\src\\chrome\\selectionsk", true);
	installExtension("d:\\workspace\\go\\src\\chrome\\copylink", true);
}

/*
   Single function userChrome.js loader to run the above init function 
   (no external scripts) derived from
   https://www.reddit.com/r/firefox/comments/kilmm2/ 
*/
try {
  let { classes: Cc, interfaces: Ci, manager: Cm  } = Components;
  const {Services} = Components.utils.
						 import('resource://gre/modules/Services.jsm');
  function ConfigJS() {
	  //Services.obs.addObserver(this, 'chrome-document-global-created', false);
	  // Use this if your extension needs to be loaded after UI is ready

	  // Wait for 'final-ui-startup' to avoid the error
	  // "AddonManager is not initialized"
	  Services.obs.addObserver(this, 'final-ui-startup', false);
  }

  const { AddonManager } =
	  Components.utils.import("resource://gre/modules/AddonManager.jsm");

  const { FileUtils } =
	  Components.utils.import("resource://gre/modules/FileUtils.jsm");

  ConfigJS.prototype = {

	  observe: async function observe(subject, topic, data) {
		  switch (topic) {
//			  case 'chrome-document-global-created':
//			  subject.addEventListener('DOMContentLoaded', this, {once: true});
//			  break;
			  case 'final-ui-startup':
			  installUnpackedExtensions(); 
			  break;
		  }
	  }
};


  if (!Services.appinfo.inSafeMode) {
	  new ConfigJS();
  }

} catch(ex) {
	reportError(ex);
};

lockPref("e.f.g.h", "5.6.7.8"); // Debugging Firefox AutoConfig Problems

