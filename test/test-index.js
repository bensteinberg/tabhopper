var main = require("../");

exports["test main"] = function(assert) {
  assert.pass("Unit test running!");
};

exports["test main async"] = function(assert, done) {
  assert.pass("async Unit test running!");
  done();
};

exports["test main opentab"] = function(assert, done) {
    var window = require("sdk/windows").browserWindows.activeWindow;
    window.tabs.open({
	url: "",
	onReady: function(tab) {
	    assert.ok(window.tabs.length == 2, "we have the right number of tabs");
	    tab.close();
	    done();
	}
    });
};

exports["test main opentab pinned"] = function(assert, done) {
    var window = require("sdk/windows").browserWindows.activeWindow;
    window.tabs.open({
	url: "",
	onReady: function(tab) {
	    assert.ok(window.tabs.length == 2, "we have the right number of tabs");
	    tab.close();
	    done();
	},
	isPinned: true
    });
};

exports["test main openmulti"] = function(assert, done) {
    var window = require("sdk/windows").browserWindows.activeWindow;
    var { setTimeout } = require("sdk/timers");
    var number = 5;
    var counter = 0;
    for ( var i = 0 ; i < number ; i++ ) {
	window.tabs.open({
	    url: "",
	    onReady: function(tab) { counter++; }
	});
    }
    setTimeout(function() {
	assert.ok(window.tabs.length == number + 1, "we have the right number of tabs");
	for ( i = number ; i > 0 ; i-- ) {
	    window.tabs[i].close();
	}
	done();
    }, 1000);
}; 

exports["test main openmulti pinned"] = function(assert, done) {
    var window = require("sdk/windows").browserWindows.activeWindow;
    var { setTimeout } = require("sdk/timers");
    var number = 5;
    var counter = 0;
    var pinned = false;
    for ( var i = 0 ; i < number ; i++ ) {
	if (i == 0) {
	    pinned = true;
	} else {
	    pinned = false;
	}
	window.tabs.open({
	    url: "",
	    onReady: function(tab) { counter++; },
	    isPinned: pinned
	});
    }
    setTimeout(function() {
	assert.ok(window.tabs.length == number + 1, "we have the right number of tabs");
	for ( i = number ; i > 0 ; i-- ) {
	    window.tabs[i].close();
	}
	done();
    }, 1000);
}; 

exports["test main hop"] = function(assert, done) {
    var window = require("sdk/windows").browserWindows.activeWindow;
    var { setTimeout } = require("sdk/timers");
    var hop = require('sdk/simple-prefs').prefs['tabhopperHop'];
    var number = hop * 2;
    var counter = 0;
    for ( var i = 0 ; i < number ; i++ ) {
	window.tabs.open({
	    url: "",
	    onReady: function(tab) { counter++; },
	});
    }
    setTimeout(function() {
	window.tabs[0].activate();
	setTimeout(function() {
	    var idx = window.tabs.activeTab.index;
	    assert.ok(idx == 0, "Now at first tab");
	    main.hopTabs("up");
	    setTimeout(function() {
		var newidx = hop + idx;
		assert.ok(window.tabs.activeTab.index == newidx, "we hopped the right distance");
	    }, 200);
	}, 200);

    }, 400);
    setTimeout(function() {
	for ( i = number ; i > 0 ; i-- ) {
	    window.tabs[i].close();
	}
	done();
    }, 1000);
}; 

exports["test main hop pinned"] = function(assert, done) {
    var window = require("sdk/windows").browserWindows.activeWindow;
    var { setTimeout } = require("sdk/timers");
    var hop = require('sdk/simple-prefs').prefs['tabhopperHop'];
    var number = hop * 2;
    var counter = 0;
    for ( var i = 0 ; i < number ; i++ ) {
	var pinned = false;
	if ( i == 0 ) {
	    pinned = true;
	}
	window.tabs.open({
	    url: "",
	    onReady: function(tab) { counter++; },
	    isPinned: pinned
	});
    }
    setTimeout(function() {
	var positions = [];
	for (let tab of window.tabs) {
	    positions.push(tab.index);
	}
	//  when there's a pinned first tab, this activates tab 1!
	//window.tabs[0].activate();
	// this doesn't work either -- why?
	//window.tabs[positions[0]].activate();
	// this does work:
	for (let tab of window.tabs) {
	    tab.activate();
	    break;
	}
	setTimeout(function() {
	    assert.ok(positions[0] == window.tabs.activeTab.index, "Now at first tab");
	    main.hopTabs("up");
	    setTimeout(function() {
	    	assert.ok(window.tabs.activeTab.index == positions[hop], "we hopped the right distance");
	    }, 200);
	}, 200);

    }, 400);
    setTimeout(function() {
	for ( i = number ; i > 0 ; i-- ) {
	    window.tabs[i].close();
	}
	done();
    }, 1000);
}; 

require("sdk/test").run(exports);
