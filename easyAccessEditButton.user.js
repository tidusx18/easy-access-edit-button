// ==UserScript==
// @name         Easy Access Edit Link
// @version      1.0.1
// @description  Adds an edit link immediately before the title of content items. Works with regular Items, Folders, Assessments, Blackboard Assignments (excluding peer evaluations), TurnItIn, Web Links, and Course Links.
// @author       Daniel Victoriano
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// ==/UserScript==

(function() {
    'use strict';

    var courseId = document.querySelector("#content input[name=course_id]").value; // Get course ID

	var itemList = document.querySelectorAll("#content_listContainer > li"); // Get list of items on page

	var elId, openLink, openLinkHref, turnItInCheck, editLink, elDiv; // Declare variables

	for (var li of itemList){
		elId = li.id.replace("contentListItem:", ""); // Get each item's ID
		openLink = li.querySelector("div > h3 > a"); // Get each item's (if exists)
		elDiv = li.querySelector("div.item"); // Get each item's <div> that holds title
	
		// Check if item has a link (is "clickable")
		if (openLink === null) {
			turnItInCheck = li.querySelector("div.vtbegenerated > a");
			
			if (turnItInCheck !== null) {
				
				if (turnItInCheck.innerText.includes("View/Complete")) {
					// Turnitin
					editLink = "/webapps/turn-plgnhndl-BBLEARN/content/modify.jsp?course_id=" + courseId + "&content_id=" + elId;
					insertEditlink(editLink, elDiv);
				}
			}
			
			else {
				// Regular item
				editLink = "/webapps/blackboard/execute/manageCourseItem?content_id=" + elId + "&course_id=" + courseId + "&dispatch=edit";
				insertEditlink(editLink, elDiv);
			}
		}
		// If link exists check link's href to determine which edit link to pass to insertEditlink()
		else if (openLink !== null) {
			openLinkHref = openLink.href;
			
			if ( openLinkHref.includes("launchAssessment") ) {
				//Assessment
				editLink = "/webapps/assessment/do/content/assessment?action=MODIFY&course_id=" + courseId + "&content_id=" + elId + "&assessmentType=Test&method=modifyOptions";
				insertEditlink(editLink, elDiv); // Add an "Edit" link
			}
			
			else if (openLinkHref.includes("uploadAssignment") ) {
				//Assignment
				editLink = "/webapps/assignment/execute/manageAssignment?method=showmodify&content_id=" + elId + "&course_id=" + courseId;
				insertEditlink(editLink, elDiv); // Add an "Edit" link
			}
			
			else if (openLinkHref.includes("http://") || openLinkHref.includes("https://") && !openLinkHref.includes("fiu.blackboard.com") ) {
				// Web link
				editLink = "/webapps/blackboard/execute/manageCourseItem?content_id=" + elId + "&course_id=" + courseId + "&dispatch=edit&type=externallink";
				insertEditlink(editLink, elDiv); // Add an "Edit" link
			}
			
			else if (openLinkHref.includes("listContentEditable") ) {
				// Content folder
				editLink = "/webapps/blackboard/content/manageFolder.jsp?content_id=" + elId + "&course_id=" + courseId;
				insertEditlink(editLink, elDiv); // Add an "Edit" link
			}
			
			else if (openLinkHref.includes("launchLink") ) {
				// Course link
				editLink = "/webapps/blackboard/content/manageCourseLink.jsp?content_id=" + elId + "&course_id=" + courseId;
				insertEditlink(editLink, elDiv); // Add an "Edit" link
			}
			
			else if (openLinkHref.includes("xid") ) {
				// File
				editLink = "/webapps/blackboard/execute/content/file?cmd=edit&content_id=" + elId + "&course_id=" + courseId;
				insertEditlink(editLink, elDiv); // Add an "Edit" link
			}
		}
	}

	function insertEditlink(link, node) {
		node.insertAdjacentHTML('afterbegin', '<a href="' + link +'"' + 'style="float: left; margin-right: 10px; font-size: 110%;">Edit</a>');
	}
})();