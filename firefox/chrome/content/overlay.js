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
    Gary Teh <garyjob@gmail.com>	
*/

if (typeof Fbdc == "undefined") {  

  var Fbdc = {
	  

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
	
	/* updates the menu icon with the number of blocks */
	updateCount: function(){

		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIWebNavigation)
						   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
						   .rootTreeItem
						   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIDOMWindow);		
				
		//alert(mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount);
		if(typeof mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount == "undefined"){
			mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount= 0;
		}
		
		if(	mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount > 0 ){
			Fbdc.jQuery("#FbdcBlockingIcon").attr("src", "chrome://fbdc/content/facebook-blocked.png" );
		}
		else{
			Fbdc.jQuery("#FbdcBlockingIcon").attr("src", "chrome://fbdc/content/facebook-activated.png" );			
		}
		
		if(window.content.localStorage.getItem('FbdcStatus')=="unblock"){
			Fbdc.jQuery("#FbdcBlock").attr("value","Block");			
			Fbdc.jQuery("#FbdcUnblock").attr("value",mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount+" unblocked");						
		}
		else{
			Fbdc.jQuery("#FbdcBlock").attr("value",mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount+" blocked");			
			Fbdc.jQuery("#FbdcUnblock").attr("value","Unblock");						
		}		


	},
	
	/* show Xpcom status */
	showXpcom: function(){
		var myComponent = Cc['@disconnect.me/fbdc/contentpolicy;1'].getService().wrappedJSObject;;
    	alert(myComponent.showStatus()); 			
	},

	/* Lifts international trade embargo on Facebook */
	unblock: function(){
		if(window.content.localStorage.getItem('FbdcStatus')=="unblock"){		
			return;
		}
		window.content.localStorage.setItem('FbdcStatus', "unblock");	
		window.content.location.reload();

	},
	
	/* Enforce international trade embargo on Facebook */
	block: function(){
		if(window.content.localStorage.getItem('FbdcStatus')!="unblock"){		
			return;
		}		
		window.content.localStorage.setItem('FbdcStatus', "block");	
		window.content.location.reload();		
	},
	
	/* Switches the image displayed by the Url Bar icon */
	iconAnimation : function(){
		Fbdc.jQuery("#fbdc-image-urlbar").mouseover(function(){
															 
			Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar.png");
		});	
		Fbdc.jQuery("#fbdc-image-urlbar").mouseout(function(){
			if(window.content.localStorage.getItem('FbdcStatus')=="unblock"){
				Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar_inactive.png");								
			}
			else{
				Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar_active.png");
			}
		});			
		if(window.content.localStorage.getItem('FbdcStatus')=="unblock"){
			Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar_inactive.png");								
		}
		else{
			Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar_active.png");
		}
		
		
	},
	
	/* Initialization */	  
    init : function() {  

		/* handles the url bar icon animation */
		Fbdc.iconAnimation();	

		if(gBrowser){
			gBrowser.addEventListener("DOMContentLoaded", Fbdc.onPageLoad, false);  
			gBrowser.tabContainer.addEventListener("TabAttrModified", Fbdc.onTabChanged, false);  		
		}
	},
	
	/* called when another tab is clicked */
	onTabChanged: function(aEvent){
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIWebNavigation)
						   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
						   .rootTreeItem
						   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIDOMWindow);
						   
		//alert(mainWindow.getBrowser().selectedBrowser.contentWindow.document.DcFbdcCount);
		
		if(typeof mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount == "undefined"){
			mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount = 0;			
			Fbdc.jQuery("#fbdc-image-urlbar").hide();			
		}
		else if(mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount == 0){
			Fbdc.jQuery("#fbdc-image-urlbar").hide();			
		}
		else{
			Fbdc.jQuery("#fbdc-image-urlbar").show();						
		}
		if(window.content.localStorage.getItem('FbdcStatus')=="unblock"){
			Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar_inactive.png");								

		}
		else{
			Fbdc.jQuery("#fbdc-image-urlbar").attr("src", "chrome://fbdc/content/icon_urlbar_active.png");
		}		
		
	},
	
	/* called when page is loaded */	
    onPageLoad: function(aEvent) {  
		
		window.setTimeout(function() {		
			var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIWebNavigation)
							   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
							   .rootTreeItem
							   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIDOMWindow);
							   
			//alert(mainWindow.getBrowser().selectedBrowser.contentWindow.document.DcFbdcCount);
			
			if(typeof mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount == "undefined"){
				mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount = 0;			
				Fbdc.jQuery("#fbdc-image-urlbar").hide();			
			}
			else if(mainWindow.getBrowser().selectedBrowser.contentWindow.document.FbdcCount == 0){
				Fbdc.jQuery("#fbdc-image-urlbar").hide();			
			}
			else{
				Fbdc.jQuery("#fbdc-image-urlbar").show();						
			}
			
			var doc = mainWindow.getBrowser().selectedBrowser.contentWindow.document;


		}, 500);		
		
    },
	
	/* Returns all attributes in any javascript/DOM Object in a string */
	getAllAttrInObj: function(obj){
		status = "";	
		status += "<p>";
		Fbdc.jQuery.each(obj , function(name, value) {
			status += name + ": " + value+"<br>";
		});	
		status += "</p>";	
		return status;
	},	
	
	
  }
}

/* Initialization of Fbdc object on load */
window.addEventListener("load", function() { Fbdc.init(); }, false);  
