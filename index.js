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
    var window = require("sdk/windows").browserWindows.activeWindow;
    var hop = require('sdk/simple-prefs').prefs['tabhopperHop'];
    if (direction == "down") {
	hop = -hop;
    }
    var nextTab = window.tabs.activeTab.index + hop;
    if (nextTab >= window.tabs.length) {
	nextTab = window.tabs.length - 1;
    } else if (nextTab < 0) {
	nextTab = 0;
    }
    window.tabs[nextTab].activate();
}
