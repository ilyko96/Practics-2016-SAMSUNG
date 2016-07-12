/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global tau */
/*jshint unused: vars*/

(function() {
    var page = document.querySelector("#alarm-set-page"),
        changer = document.querySelector("#sectionchanger-newalarm"),
        sections = document.querySelectorAll("section"),
        sectionChanger,
        elPageIndicator = document.querySelector("#indicator"),
        pageIndicator,
        pageIndicatorHandler,
        pageIndicatorFooterButton = document.querySelector("#alarm-set-page-footer-button");

    // Pagebeforeshow event handler for 'alarm-set-page'
    // When 'alarm-set-page' is created, all settings are set in this handler
    page.addEventListener("pagebeforeshow", function(event) {
        // pageIndicator consists of sections
        // 'numberOfPages' is the number of 'section tag' in 'sectionchanger'
        pageIndicator =  tau.widget.PageIndicator(elPageIndicator, { numberOfPages: sections.length });
        // The first section's state set as 'active'
        pageIndicator.setActive(0);
        // Make 'Section Changer' object as 'non-circular', 'horizontal' and use bouncing effect
        sectionChanger = new tau.widget.SectionChanger(changer, {
            circular: false,
            orientation: "horizontal",
            useBouncingEffect: true
        });
    });

    /**
    * Pagehide event handler for 'alarm-set-page'
    * When 'alarm-set-page' is disappeared, sectionChanger and pageIndicator object are released
    * @param {Object} event - pagehide event object
     */
    page.addEventListener("pagehide", function(event) {
        // release object
        sectionChanger.destroy();
        pageIndicator.destroy();
    });

    /**
    * Section change event handler for sections in 'alarm-set-page'
    * If you change section information, the text will be changed in 'alarm-set-page footer'
    * In first page (set time), text is 'SET', the next (in set repeat) text is 'SAVE'
    * @param {Object} event - sectionchange event object
    */
    pageIndicatorHandler = function(event) {
        pageIndicator.setActive(event.detail.active);
        var activeSectionIndex = sectionChanger.getActiveSectionIndex();
        if (activeSectionIndex === 0) {
            pageIndicatorFooterButton.innerHTML = "NEXT";
        } else {
            pageIndicatorFooterButton.innerHTML = "SAVE";
        }
    };
    // Bind event listener for 'sectionchange' in 'sectionchanger-newalarm'
    changer.addEventListener("sectionchange", pageIndicatorHandler, false);
}());

