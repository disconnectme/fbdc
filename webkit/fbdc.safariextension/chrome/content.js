/*
  A content script that stops Facebook from tracking the webpages you go to.

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

/* The domain names Facebook phones home with */
const FACEBOOK_DOMAINS = ['facebook\.com', 'facebook\.net', 'fbcdn\.net'];
const FACEBOOK_REGEX = RegExp('^https?://[^?/]*(' + FACEBOOK_DOMAINS.join('|') + ')[/?^]*', 'i');

/* Traps and selectively cancels a request. */
if (!location.href.match(FACEBOOK_REGEX)) {
    document.addEventListener('beforeload', function(event) {
        if (event.url.match(FACEBOOK_REGEX)) event.preventDefault();
    }, true);
}
