
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
	
	rejectedLoc : "",
	
	// define the function we want to expose in our interface  
	hello: function() {  
		//return "Hello World!";  
		return this.rejectedLoc ;
	},  	
	
	/*
	  Determines whether any of a bucket of domains is part of a URL, regex free.
	*/
	isMatching: function(url, domains) {
	  const DOMAIN_COUNT = domains.length;
	  for (var i = 0; i < DOMAIN_COUNT; i++)
		  if (url.toLowerCase().indexOf(domains[i], 2) >= 2) return true;
			  // A valid URL has at least two characters ("//"), then the domain.
	},

	shouldLoad: function (contType, contLoc, reqOrig, aContext, typeGuess, extra) {
		if(reqOrig != null && contLoc.host!="browser" && contLoc.host!="global"){
			this.MyLoc += contLoc.host+" : "+reqOrig.host+"\r\n";
			if( reqOrig.host !=contLoc.host && this.isMatching(contLoc.host, this.DOMAINS)){
				try{


					
					if(typeof aContext.ownerDocument.DcFbdcCount == "undefined"){
						aContext.ownerDocument.DcFbdcCount = 1;
					}
					else{
						aContext.ownerDocument.DcFbdcCount += 1;						
					}					
					
					this.rejectedLoc += reqOrig.host + " > getting "+contLoc.host+"\r\n";
				}
				catch(anError){
					this.rejectedLoc += anError+"\r\n";
					
				}
				return Ci.nsIContentPolicy.REJECT;				
			}
		}

		return Ci.nsIContentPolicy.ACCEPT;
	},

    shouldProcess: function (contType, contLoc, reqOrig, ctx, mimeType, extra) {
       return Ci.nsIContentPolicy.ACCEPT;
    }
	

	
};

if (XPCOMUtils.generateNSGetFactory)
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([FbdcContentPolicy]);
else
	var NSGetModule = XPCOMUtils.generateNSGetModule([FbdcContentPolicy]);
