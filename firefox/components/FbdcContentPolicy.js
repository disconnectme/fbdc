/*
  An XPcom component that stops Facebook from tracking the webpages you go to.

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

    Gary Teh <garyjob@gmail.com>	
*/

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

/**
 * Application startup/shutdown observer, triggers init()/shutdown() methods in Bootstrap.jsm module.
 * @constructor
 */
function FbdcContentPolicy() {
	//allows access of native methods by scripts in content area
	this.wrappedJSObject = this;  	
}

FbdcContentPolicy.prototype =
{
	classDescription: "This is an image blocker",
	contractID: "@disconnect.me/fbdc/contentpolicy;1",
	classID: Components.ID("{d32a3c00-4ed3-11de-8a39-0800200c9a61}"),
	
	_xpcom_categories:  [{ category: "content-policy"}],

	QueryInterface:     XPCOMUtils.generateQI([Ci.nsIContentPolicy]),

	/* The domain names Facebook phones home with, lowercased. */
	DOMAINS : ['facebook.com', 'facebook.net', 'fbcdn.net'],
	
	/* list of all rejected locations */
	rejectedLoc : "",
	
	// define the function we want to expose in our interface  
	showStatus: function() {  
		//return "Hello World!";  
		return this.rejectedLoc ;
	},  	
	
	/* Determines whether any of a bucket of domains is part of a URL, regex free. */
	isMatching: function(url, domains) {
	  url = "   "+url;
	  const DOMAIN_COUNT = domains.length;
	  for (var i = 0; i < DOMAIN_COUNT; i++)
		  if (url.toLowerCase().indexOf(domains[i], 2) >= 2) return true;
			  // A valid URL has at least two characters ("//"), then the domain.
	},
	
	/* A function of the nsIContentPolicy interface : called when an element is to be loaded from the internet */
	shouldLoad: function (contType, contLoc, reqOrig, aContext, typeGuess, extra) {
		
		if(reqOrig != null && reqOrig.host!="browser" && contLoc.host!="browser" && contLoc.host!="global" && contType!=6){

			if( reqOrig.host !=contLoc.host && !this.isMatching(reqOrig.host, this.DOMAINS) && this.isMatching(contLoc.host, this.DOMAINS) && typeof aContext.ownerDocument != null){
				
				try{
					
					if(typeof aContext.ownerDocument.FbdcCount == "undefined"){
						aContext.ownerDocument.FbdcCount = 1;
					}
					else{
						aContext.ownerDocument.FbdcCount += 1;						
					}					
					
					var finalBlocking = aContext.ownerDocument.defaultView.content.localStorage.getItem('FbdcStatus');
					if(finalBlocking == "unblock"){
						return Ci.nsIContentPolicy.ACCEPT;						
					}

				}
				catch(anError){
					this.rejectedLoc += anError+"\r\n";
					
				}
				this.rejectedLoc += contType+" : "+contLoc.host+" : "+reqOrig.host+"\r\n";				
				return Ci.nsIContentPolicy.REJECT;				
			}
		}

		return Ci.nsIContentPolicy.ACCEPT;
	},

	/* A function of the nsIContentPolicy interface : called when an element is to be loaded from the internet */
    shouldProcess: function (contType, contLoc, reqOrig, ctx, mimeType, extra) {
       return Ci.nsIContentPolicy.ACCEPT;
    }
	

	
};

if (XPCOMUtils.generateNSGetFactory)
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([FbdcContentPolicy]);
else
	var NSGetModule = XPCOMUtils.generateNSGetModule([FbdcContentPolicy]);
