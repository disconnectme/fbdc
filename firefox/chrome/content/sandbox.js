// JavaScript Document
#include "_path_to_sdk/include/content/nsIContentPolicy.h"  

class MyClass: public nsISupports, public nsIContentPolicy {  

  NS_DECL_NSICONTENTPOLICY  

}  
  
// And this into your implementation file   
NS_IMPL_ISUPPORTSn(MyClass, nsISupports, nsIContentPolicy)  