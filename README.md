# Local Development Instructions

Set up an apache server with SHTML (Server Side Includes) module activated. 
https://httpd.apache.org/docs/2.4/howto/ssi.html

Clone the repo.

Copy the tracking folder into your apache server.

To get the look and feel for what it will look like on the current PDS site:
Download the files from the SVN repo at:
https://starcell.jpl.nasa.gov/repo/websites/pds-beta/
into an apache server with .includes module enabled.

Paste the tracking service folder in the PDS beta "tools" folder of the beta site on the SVN repo.
Then go to your localhost in your browser:
http://localhost/tools/tracking/deliveriesTracking/
