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

/*for alarm list page animation */
(function(){
    var page = document.querySelector("#main-page"),
        listHelper,
        elScroller;

    // Pagebeforeshow event listener in 'main-page'
    page.addEventListener("pagebeforeshow", function (e) {
        var list;

        elScroller = page.querySelector(".ui-scroller");

        if (elScroller) {
            list = elScroller.querySelector(".ui-listview");
              /**
             * If 'ui-scroller' and 'ui-listview' existed, create scroll animation on list
             * If elScroller existed, set 'tizen-circular-scrollbar' attribute
               */
            if (list) {
                listHelper = tau.helper.SnapListStyle.create(list, {animate: "scale"});
                elScroller.setAttribute("tizen-circular-scrollbar", "");
            }
        }
    });
    /**
    * Pagebeforehide event listener in 'main-page'
    * When event 'pagebeforehide' is executed, 'ui-scroller' remove 'tizen-circular-scrollbar' attribute and destroy scroll animation
     */
    page.addEventListener("pagebeforehide", function (e) {
        if (listHelper) {
            listHelper.destroy();
            listHelper = null;

            if (elScroller) {
                elScroller.removeAttribute("tizen-circular-scrollbar");
            }
        }
    });
}());