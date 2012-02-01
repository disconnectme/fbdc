/*
  An overlay script that stops Facebook from tracking the webpages you go to.

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

    Brian Kennish <byoogle@gmail.com>
    Gary Teh <garyjob@gmail.com>
*/

/**
 * The Facebook Disconnect namespace.
 */
if (typeof FacebookDisconnect == 'undefined') {
  var FacebookDisconnect = {
    /**
     * Fetches the number of tracking requests.
     */
    getRequestCount: function() {
      return gBrowser.contentWindow.document.facebookRequestCount;
    },

    /**
     * Fetches the blocking state.
     */
    isUnblocked: function() {
      return JSON.parse(content.localStorage.facebookUnblocked);
    },

    /**
     * Paints the UI.
     */
    render: function(that, icon) {
      var sourceName = 'src';
      if (that.getRequestCount())
          icon.setAttribute(
            sourceName,
            'chrome://facebook-disconnect/content/' +
                (that.isUnblocked() ? 'unblocked' : 'blocked') + '.png'
          );
      else icon.removeAttribute(sourceName);
    },

    /**
     * Navigates to a URL.
     */
    go: function(that) { open(that.getAttribute('value'), '_blank'); },

    /**
     * Registers event handlers.
     */
    initialize: function() {
      var render = this.render;
      var that = this;
      var icon = document.getElementById('facebook-disconnect-icon');

      gBrowser.tabContainer.addEventListener('TabAttrModified', function() {
        render(that, icon);
      }, false);

      gBrowser.addEventListener('error', function() {
        render(that, icon);
      }, false);

      gBrowser.addEventListener('DOMContentLoaded', function() {
        render(that, icon);
      }, false);

      icon.onmouseover = function() { this.className = 'highlighted'; };

      icon.onmouseout = function() { this.removeAttribute('class'); };

      var blocking = document.getElementById('facebook-disconnect-blocking');

      icon.onclick = function() {
        var labelName = 'label';
        var requestCount = that.getRequestCount() || 0;
        var label = ' Facebook request';
        var shortcutName = 'accesskey';

        if (that.isUnblocked()) {
          blocking.setAttribute(
            labelName,
            'Block ' + requestCount + label + (requestCount - 1 ? 's' : '')
          );
          blocking.setAttribute(shortcutName, 'B');
        } else {
          blocking.setAttribute(
            labelName,
            'Unblock ' + requestCount + label + (requestCount - 1 ? 's' : '')
          );
          blocking.setAttribute(shortcutName, 'U');
        }
      };

      var command = 'command';

      blocking.addEventListener(command, function() {
        content.localStorage.facebookUnblocked = !that.isUnblocked();
        content.location.reload();
      }, false);

      var go = this.go;

      document.
        getElementById('facebook-disconnect-help').
        addEventListener(command, function() { go(this); }, false);

      document.
        getElementById('facebook-disconnect-feedback').
        addEventListener(command, function() { go(this); }, false);
    }
  };
}

/**
 * Initializes the object.
 */
addEventListener('load', function() {
  FacebookDisconnect.initialize();
}, false);
