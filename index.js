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
    var tabs = require("sdk/tabs");
    var hop = require('sdk/simple-prefs').prefs['tabhopperHop'];
    if (direction == "down") {
	hop = -hop;
    }
    var nextTab = tabs.activeTab.index + hop;
    if (nextTab >= tabs.length) {
	nextTab = tabs.length - 1;
    } else if (nextTab < 0) {
	nextTab = 0;
    }
    tabs[nextTab].activate();
}
