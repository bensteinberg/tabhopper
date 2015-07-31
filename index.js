// see:
// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/hotkeys
// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-prefs
// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/windows#BrowserWindow

var self = require('sdk/self');

var { Hotkey } = require("sdk/hotkeys");

var hopUpKey = Hotkey({
    combo: "accel-alt-shift-]",
    onPress: function() {
	hopTabs("up");
    }
});

var hopDownKey = Hotkey({
    combo: "accel-alt-shift-[",
    onPress: function() {
	hopTabs("down");
    }
});

function hopTabs(direction) {
    // we get the list of tabs from the window
    var window = require("sdk/windows").browserWindows.activeWindow;
    // get the hop distance and negate it if necessary
    var hop = require('sdk/simple-prefs').prefs['tabhopperHop'];
    if (direction == "down") {
	hop = -hop;
    }
    // make an ordered list of tab IDs
    var positions = [];
    for (let tab of window.tabs) {
	positions.push(tab.index);
    }
    // calculate the next tab position
    var nextTabPosition = positions.indexOf(window.tabs.activeTab.index) + hop;
    if (nextTabPosition >= positions.length) {
	nextTabPosition = positions.length - 1;
    } else if (nextTabPosition < 0) {
	nextTabPosition = 0;
    }

    // does it make a difference which of these we use?
    //window.tabs[positions[nextTabPosition]].activate();
    // or:
    // iterate over tabs and activate the one at the right position
    var counter = 0;
    for (let tab of window.tabs) {
    	if (counter == nextTabPosition) {
    	    tab.activate();
    	    return;
    	}
    	counter++;
    }
}

exports.hopTabs = hopTabs;
