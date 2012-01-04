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
	
	/* Switches the image displayed by the Url Bar icon */
	iconAnimation : function(){
		Fbdc.jQuery("#fbdc-image-urlbar").mouseover(function(){
			Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar.png");
		});	
		Fbdc.jQuery("#fbdc-image-urlbar").mouseout(function(){
			Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar_deactive.png");
		});			
	},
	
	
	  
	/* Initialization */	  
    init : function() {  
	
		/* handles the url bar icon animation */
		Fbdc.iconAnimation();	
		
		
		if(gBrowser) gBrowser.addEventListener("DOMContentLoaded", this.onPageLoad, false);  
	},
	
    onPageLoad: function(aEvent) {  
        var doc = aEvent.originalTarget; // doc is document that triggered the event  
        var win = doc.defaultView; // win is the window for the doc  
        // test desired conditions and do something  
        // if (doc.nodeName == "#document") return; // only documents  
        // if (win != win.top) return; //only top window.  
        // if (win.frameElement) return; // skip iframes/frames  
        alert("Number of Facebook Widgets : " +doc.DcFbdcCount);  
		
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIWebNavigation)
						   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
						   .rootTreeItem
						   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIDOMWindow);
						   
		alert(typeof mainWindow.getBrowser().selectedBrowser.contentWindow.document.DcFbdcCount);
		if(typeof mainWindow.getBrowser().selectedBrowser.contentWindow.document.DcFbdcCount == "undefined"){
			Fbdc.jQuery("#fbdc-image-urlbar").hide();			
		}
		else{
			Fbdc.jQuery("#fbdc-image-urlbar").display();						
		}
		
    }  	
	
  }
}

/* Initialization of Fbdc object on load */
window.addEventListener("load", function() { Fbdc.init(); }, false);  
