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

/* The inclusion of the jQuery library*/
$fbdc_mb = jQuery.noConflict();

/* The domain names Facebook phones home with, lowercased. */
const FACEBOOK_DOMAINS = ['facebook.com', 'facebook.net', 'fbcdn.net'];

/* The XPCOM interfaces. */
const FACEBOOK_INTERFACES = Components.interfaces;

/*
  Determines whether any of a bucket of domains is part of a URL, regex free.
*/
function isFacebookMatching(url, domains) {
  const FACEBOOK_DOMAIN_COUNT = domains.length;
  for (var i = 0; i < FACEBOOK_DOMAIN_COUNT; i++)
      if (url.toLowerCase().indexOf(domains[i], 2) >= 2) return true;
          // A valid URL has at least two characters ("//"), then the domain.
}

/* Traps and selectively cancels a request. */
Components.classes['@mozilla.org/observer-service;1']
  .getService(FACEBOOK_INTERFACES.nsIObserverService)
  .addObserver({observe: function(subject) {
    const FACEBOOK_NOTIFICATION_CALLBACKS =
        subject.QueryInterface(FACEBOOK_INTERFACES.nsIHttpChannel).notificationCallbacks
            || subject.loadGroup.notificationCallbacks;
    const FACEBOOK_BROWSER =
        FACEBOOK_NOTIFICATION_CALLBACKS &&
            gBrowser.getBrowserForDocument(
              FACEBOOK_NOTIFICATION_CALLBACKS
                .getInterface(FACEBOOK_INTERFACES.nsIDOMWindow).top.document
            );
    subject.referrer.ref;
        // HACK: The URL read otherwise outraces the window unload.
    FACEBOOK_BROWSER && !isFacebookMatching(FACEBOOK_BROWSER.currentURI.spec, FACEBOOK_DOMAINS) &&
        isFacebookMatching(subject.URI.spec, FACEBOOK_DOMAINS) &&
            subject.cancel(Components.results.NS_ERROR_ABORT);
  }}, 'http-on-modify-request', false);

/* Lifts international trade embargo on Facebook */
function fbdcUnblock(){
	alert("I am unblocking facebook");

}

/* Enforce international trade embargo on Facebook */
function fbdcBlock(){
	alert("I am blocking facebook");
	$fbdc_mb("#FacebookNumberBlocked").attr("value","100");	
}