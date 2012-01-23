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
    Jonty Wareing <jonty@jonty.co.uk>
*/

/* The XPCOM interfaces. */
const FACEBOOK_INTERFACES = Components.interfaces;

/* The domain names Facebook phones home with, lowercased. */
const FACEBOOK_DOMAINS = ['facebook.com', 'facebook.net', 'fbcdn.net'];
const FACEBOOK_REGEX = RegExp('^https?://[^?/]*(' + FACEBOOK_DOMAINS.join('|') + ')[/?^]*', 'i');

/* Traps and selectively cancels a request. */
Components.classes['@mozilla.org/observer-service;1']
  .getService(FACEBOOK_INTERFACES.nsIObserverService)
  .addObserver({observe: function(subject) {
    const NOTIFICATION_CALLBACKS =
        subject.QueryInterface(
          FACEBOOK_INTERFACES.nsIHttpChannel
        ).notificationCallbacks || subject.loadGroup.notificationCallbacks;
    const BROWSER =
        NOTIFICATION_CALLBACKS &&
            gBrowser.getBrowserForDocument(
              NOTIFICATION_CALLBACKS
                .getInterface(FACEBOOK_INTERFACES.nsIDOMWindow).top.document
            );
    subject.referrer.ref;
        // HACK: The URL read otherwise outraces the window unload.
    BROWSER && !BROWSER.currentURI.spec.match(FACEBOOK_REGEX) &&
        subject.URI.spec.match(FACEBOOK_REGEX) &&
            subject.cancel(Components.results.NS_ERROR_ABORT);
  }}, 'http-on-modify-request', false);
