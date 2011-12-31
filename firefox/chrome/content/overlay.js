/*
  An overlay script that stops Facebook from tracking the webpages you go to.

  Copyright 2010, 2011 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <byoogle@gmail.com>
*/

if (typeof Fbdc == "undefined") {  

  var Fbdc = {
	  
	/* The domain names Facebook phones home with, lowercased. */
	DOMAINS : ['facebook.com', 'facebook.net', 'fbcdn.net'],
	
		
	/* The XPCOM interfaces. */
	INTERFACES : Components.interfaces,
	
	/* The inclusion of the jQuery library*/
	jQuery : jQuery.noConflict(),
	  
	/*
	  Determines whether any of a bucket of domains is part of a URL, regex free.
	*/
	isMatching: function(url, domains) {
	  const DOMAIN_COUNT = domains.length;
	  for (var i = 0; i < DOMAIN_COUNT; i++)
		  if (url.toLowerCase().indexOf(domains[i], 2) >= 2) return true;
			  // A valid URL has at least two characters ("//"), then the domain.
	},
	

	/* Lifts international trade embargo on Facebook */
	fbdcUnblock: function(){
		alert("I am unblocking facebook");
	
	},
	
	/* Enforce international trade embargo on Facebook */
	fbdcBlock: function(){
		alert("I am blocking facebook");
		Fbdc.jQuery("#FacebookNumberBlocked").attr("value","100");	
	},
	  
	/* Initialization */	  
    init : function() {  

		/* Traps and selectively cancels a request. */
        Fbdc.obsService =  Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);  
		Fbdc.obsService.addObserver({observe: function(subject) {
			Fbdc.NOTIFICATION_CALLBACKS =
				subject.QueryInterface(Fbdc.INTERFACES.nsIHttpChannel).notificationCallbacks
					|| subject.loadGroup.notificationCallbacks;
			Fbdc.BROWSER =
				Fbdc.NOTIFICATION_CALLBACKS &&
					gBrowser.getBrowserForDocument(
					  Fbdc.NOTIFICATION_CALLBACKS
						.getInterface(Fbdc.INTERFACES.nsIDOMWindow).top.document
					);
			subject.referrer.ref;
				// HACK: The URL read otherwise outraces the window unload.
			Fbdc.BROWSER && !Fbdc.isMatching(Fbdc.BROWSER.currentURI.spec, Fbdc.DOMAINS) &&
				Fbdc.isMatching(subject.URI.spec, Fbdc.DOMAINS) &&
					subject.cancel(Components.results.NS_ERROR_ABORT);
		  }}, 'http-on-modify-request', false);
	}
  }
}

/* Initialization of Fbdc object on load */
window.addEventListener("load", function() { Fbdc.init(); }, false);  
