// GroupServer module for providing the Topics tab in a group.
jQuery.noConflict();
GSGroupTopicTab = function () {
    // Private variables
    // Widgets
    var toolbar = null;
    var prevButton = null;
    var nextButton = null;
    var searchInput = null;
    var searchButton = null;
    var latestTopics = null;
    var loadingMessage = null;
    var advancedSearch = null;
    // Search Info
    var ajaxPage = 'gs-group-topics-ajax.html';
    var offset = null;
    var limit = null;
    var searchText = '';
    var toolbarShown = true;
    // Constants
    var MAX_ITEMS = 48;
    var FADE_SPEED = 'slow';
    var FADE_METHOD = 'swing';
    
    // Private methods
    
    // Next button
    var init_next_button = function() {
        nextButton = jQuery('#gs-group-messages-topics-toolbar-next');
        nextButton.button({
            text: true,
            icons: { secondary: 'ui-icon-carat-1-e', },
            disabled: true,
        });
        nextButton.click(handle_next);
    };// init_next_button
    var handle_next = function(eventObject) {
        var nSticky = null;
        if (searchInput.val()) {
            offset = offset + limit;
        } else {
            nSticky = latestTopics.find('.sticky').length;
            offset = offset + limit - nSticky;
        }
        latestTopics.fadeOut(FADE_SPEED, FADE_METHOD, do_topics_load);
    };//handle_next
    
    // Previous Button
    var init_prev_button = function() {
        prevButton = jQuery('#gs-group-messages-topics-toolbar-prev');
        prevButton.button({
            text: true,
            icons: { primary: 'ui-icon-carat-1-w', },
            disabled: true,
        });
        prevButton.click(handle_prev);
    };// init_prev_button
    var handle_prev = function(eventObject) {
        offset = offset - limit;
        if (offset < 0) {
            offset = 0
        }
        latestTopics.fadeOut(FADE_SPEED, FADE_METHOD, do_topics_load);
    };//handle_prev
    
    var init_search_button = function() {
        searchButton = jQuery('#gs-group-messages-topics-search-button');
        searchButton.button({
            text: false,
            icons: { primary: 'ui-icon-search', },
            disabled: false,
        });
        searchButton.click(handle_search)
    };//init_search_button
    var handle_search = function (eventObject) {
        searchText = searchInput.val();
        offset = 0;
        latestTopics.fadeOut(FADE_SPEED, FADE_METHOD, do_topics_load);
    };//handle_search
    
    var init_search_input = function () {
        searchInput = jQuery('#gs-group-messages-topics-search-input');
        searchInput.keypress(handle_search_input);
    };
    var handle_search_input = function(eventObject) {
        if (eventObject.which == 13) {
            searchButton.click();
        }
    };
    
    // Code to load the topics in a pleasing way.
    var do_topics_load = function () {
        // Function used by the buttons.
        loadingMessage.fadeIn(FADE_SPEED, FADE_METHOD, load_topics);
    };//do_topics_load
    var load_topics = function() {
        // Actually load the topics, making am AJAX request
        var data = {
            'i': offset,
            'l': limit,
            's': searchText,
        };
        var href = null;
        var query = null;
        var newHref = null;
        
        href = advancedSearch.attr('href');
        query = '&i='+offset+'&s='+searchText.replace(/ /, '+');
        newHref = href.replace(/&i.*$/, query);
        advancedSearch.attr('href', newHref);
        
        jQuery.post(ajaxPage, data, load_complete);
    };// load_topics
    var load_complete = function(responseText, textStatus, request) {
        // Set the contents of the Topics list to the respose.
        latestTopics.html(responseText);
        // Hide the Loading message and show the topics
        loadingMessage.fadeOut(FADE_SPEED, FADE_METHOD, show_topics);
    };// load_complete
    var show_topics = function () {
        // Show the topics list, and enable the buttons as required.
        var nTopics = null;
        latestTopics.fadeIn(FADE_SPEED, FADE_METHOD);
        prevButton.button('option', 'disabled', offset <= 0);
        
        nTopics = latestTopics.find('.topic').length;
        nextButton.button('option', 'disabled', nTopics < limit);
        
        init_keywords();
        
        if ((offset <= 0) && (nTopics < limit) && toolbarShown) {
            toolbar.fadeOut('fast', FADE_METHOD);
            toolbarShown = false;
        } else if (((offset > 0) || (nTopics >= limit)) && !toolbarShown) {
            toolbar.fadeIn('fast', FADE_METHOD);
            toolbarShown = true;
        }
    };//show_topics

    var init_keywords = function () {
        var result = null;
        var keywords = null;
        keywords = latestTopics.find('.keyword');
        keywords.removeAttr('href').css("cursor","pointer");
        keywords.click(handle_keyword_click);
    };//init_keywords
    var handle_keyword_click = function(eventObject) {
        var searchText = jQuery(this).text();
        searchInput.val(searchText);
        searchButton.click();
    };//handle_keyword_click

    // Public methods and properties.
    return {
        init: function (groupId) {
            limit = 6;
            offset = 0;
        
            init_prev_button();
            init_next_button();
            init_search_button();
            init_search_input();
            
            latestTopics = jQuery('#gs-group-messages-topics-latest');
            loadingMessage = jQuery('#gs-group-messages-topics-loading');
            toolbar = jQuery('#gs-group-messages-topics-toolbar');
            advancedSearch = jQuery('#gs-group-messages-topics-advanced-search-link');
            
            load_topics();
        },//init
    };
}(); // GSVerifyEmailAddress
jQuery(document).ready( function () {
    GSGroupTopicTab.init()
});
