/*
  An XPCOM component that stops Facebook from tracking the webpages you go to.

  Copyright 2010-2012 Disconnect, Inc.

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

    Gary Teh <garyjob@gmail.com>
    Brian Kennish <byoogle@gmail.com>
*/
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/**
 * Constants.
 */
var contentPolicy = Components.interfaces.nsIContentPolicy;
var accept = contentPolicy.ACCEPT;

/**
 * Creates the component.
 */
function FacebookDisconnect() { this.wrappedJSObject = this; }

/**
 * A content policy that stops Facebook from tracking the webpages you go to.
 */
FacebookDisconnect.prototype = {
  /**
   * The properties required for XPCOM registration.
   */
  classID: Components.ID('{d32a3c00-4ed3-11de-8a39-0800200c9a61}'),
  classDescription:
      'A content policy that stops Facebook from tracking the webpages you go to.',
  contractID: '@disconnect.me/facebook;1',

  /**
   * The categories to register the component in.
   */
  _xpcom_categories: [{category: 'content-policy'}],

  /**
   * Gets a component interface.
   */
  QueryInterface:
      XPCOMUtils.generateQI([Components.interfaces.nsIContentPolicy]),

  /**
   * The domain names Facebook phones home with, lowercased.
   */
  domains: ['facebook.com', 'facebook.net', 'fbcdn.net'],

  /**
   * Determines whether any of a bucket of domains is part of a host name, regex
   * free.
   */
  isMatching: function(host, domains) {
    var domainCount = domains.length;
    host = host.toLowerCase();
    for (var i = 0; i < domainCount; i++)
        if (host.indexOf(domains[i]) + 1) return true;
  },

  /**
   * Traps and selectively cancels a request.
   */
  shouldLoad: function(contentType, contentLocation, requestOrigin, context) {
    var isMatching = this.isMatching;
    var domains = this.domains;
    var result = accept;

    if (context && context.ownerDocument) {
      var html = context.ownerDocument;
      var content = html.defaultView.content;

      if (
        contentType != contentPolicy.TYPE_DOCUMENT && // The MIME type.
            requestOrigin && requestOrigin.asciiHost &&
                !isMatching(requestOrigin.host, domains) && content &&
                    !isMatching(content.top.location.hostname, domains) &&
                        // The whitelist.
                            contentLocation.asciiHost &&
                                isMatching(contentLocation.host, domains)
                                    // The blacklist.
      ) {
        var facebookRequestCount = html.facebookRequestCount;
        html.facebookRequestCount =
            typeof facebookRequestCount == 'undefined' ? 1 :
                ++facebookRequestCount;
        var facebookUnblocked = content.localStorage.facebookUnblocked;
        if (typeof facebookUnblocked == 'undefined')
            facebookUnblocked = content.localStorage.facebookUnblocked = false;
        if (!JSON.parse(facebookUnblocked))
            result = contentPolicy.REJECT_SERVER; // The blocking state.
      }
    }

    return result;
  },

  /**
   * Passes a request through.
   */
  shouldProcess: function() { return accept; }
}

/**
 * The component entry point.
 */
if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([FacebookDisconnect]);
else var NSGetModule = XPCOMUtils.generateNSGetModule([FacebookDisconnect]);
