/*
 * jQuery UI jb.overflowmenu
 *
 * Copyright 2011, Jesse Baird <jebaird@gmail.com> jebaird.com
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * 
 * http://jebaird.com/blog/overflow-menu-jquery-ui-widget
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 * 
 * 
 * suggested markup
 * <nav>
 *  <ul>
 *      <li>
 *  </ul>
 * </nav>
 * 
 * $('nav').overflowmenu()
 * 
 * 
 * 
 * events
 *  change - after items are moved to / from the secondary menu
 *  beforeChange - called before items are moved to / from the secondary menu
 *  open - when the secondary menu is shown
 *  close - when the secondary menu is closed
 */

(function( $, undefined ) {

$.widget( "jb.overflowmenu", {
    options: {
        "items": "> *",
        "itemsParentTag": "ul",
        "cloneItems": true, //this decides if the items should be moved to sub menu via cloneing or detaching and appending. Detach and append works for things that have problems being cloned like .sortable 
        "label": $l("more"),
        //call the refresh method when this element changes size, with out a speical event window is the only element that this gets called on
        "refreshOn": $( window ),
        
        //attempt to guess the height of the menu, if not the target element needs to have a height
        "guessHeight": true,
        //clone helper, since http://api.jquery.com/clone/ still keeps a reference to the orgainal data if its an object or an array, you many need to add your own cloning method by doing something like this:
        /*
         * lifted from  http://api.jquery.com/clone/ 
         *
         * var $elem = $('#elem').data( "arr": [ 1 ] ), // Original element with attached data
            $clone = $elem.clone( true )
            .data( "arr", $.extend( [], $elem.data("arr") ) ); // Deep copy to prevent data sharing
         *
         * elements are a jquery collection of items  that will be displayed in the secondaryMenu
         * has to return a jquery collection
         */
        "clone": function( $elements ){
            return $elements.clone( true, true )
        }
        
    },

    _create: function() {
        var self = this;
        
        this.element
            .addClass('jb-overflowmenu');
            
        this.primaryMenu = this.element
                        .children( this.options.itemsParentTag )
                        .addClass( 'jb-overflowmenu-menu-primary jb-overflowmenu-helper-postion' );
        
        this._setHeight();  
                
        //TODO: allow the user to change the markup for this because they might not be using ul -> li
        this.secondaryMenuContainer = $(
                            [
                                '<div class="jb-overflowmenu-container jb-overflowmenu-helper-postion">',
                                    '<a href="javascript://" class="jb-overflowmenu-menu-secondary-handle"></a>',
                                    '<' + this.options.itemsParentTag + ' class="jb-overflowmenu-menu-secondary jb-overflowmenu-helper-postion"></' + this.options.itemsParentTag + '>',
                                '</div>'
                            ].join('')
                        )
                        .appendTo( this.element )
                        
        this.secondaryMenu = this.secondaryMenuContainer.find('ul');
        
        this.secondaryMenuContainer.children( 'a' ).bind( 'click.overflowmenu', function( e ){
            self.toggle();
        });
        
        //has to be set first
        this._setOption( 'label', this.options.label )
        this._setOption( 'refreshOn', this.options.refreshOn )
            
    },

    destroy: function() {
        this.element
            .removeClass('jb-overflowmenu')
        
        this.primaryMenu
            .removeClass('jb-overflowmenu-menu-primary jb-overflowmenu-helper-postion')
            .find( this.options.items )
            .filter( ':hidden' )
            .css( 'display', '' )
        
        this.options.refreshOn.unbind( 'resize.overflowmenu' );
        
        this.secondaryMenuContainer.remove()
        
        //TODO: possibly clean up the height & right on the ul
        
        $.Widget.prototype.destroy.apply( this, arguments );
    },
    
    
    refresh: function() {
        
        this._trigger( 'beforeChange', {}, this._uiHash() );

    
        var vHeight = this.primaryMenuHeight,
            //get the items, filter out the the visible ones
            itemsToHide = this._getItems()
                                .css( 'display', '' )
                                .filter(function(){
                                    //if the element is not overflown and should be visible remove placeholder
                                    if(this.offsetTop + $(this).height() < vHeight){
                                        $(this).removeClass('placeholder');
                                    }
                                    //if the element is overflown add to the items to Hide list
                                    return this.offsetTop + $(this).height() > vHeight;
                                })
           
        
        if(!this.options.cloneItems)
        {                   
            /*
             * Intead of removing and cloning let try detaching and moving menu items from primary 
             * to secondary menu. Less efficient but solves the problem of cloning pistol wipping 
             * widgets etc that have been instantiated on menu items. 
             */ 
            
            /*
             * Grab none placeholder elements that need to get moved to secondary menu.
             */
            var items = itemsToHide.filter(":not(.placeholder)");
            
            /*
             * Hide any placeholder elements that have been added. 
             */
            itemsToHide.filter(".placeholder").css("display","none");
            
            /*
             * Grab any placeholders that have become visible.
             */
            var placeholdersToReplace = this.primaryMenu.children('.placeholder:visible');
            
            /*
             * Move none placeholder elements to seconday menu.
             */
            this.secondaryMenu.prepend(items.detach());
           
           /*
            * Make placeholder copies of the originals that got moved to secondary menu then add 
            * them to the primary menu to keep track of the menu item position.
            */
            var placeholders = items.clone();
            placeholders.addClass("placeholder");
            
            /*
             * Insert the place holder after all the original items. 
             */
            this.primaryMenu.children(":not(.placeholder)").last().after(placeholders);
            
            /*
             * Remove place holder items that are now visible in the primary menu.
             */
            if(placeholdersToReplace.length)
            {
                var moveToPrimary = this.secondaryMenu.children().slice(0, placeholdersToReplace.length);             
                placeholdersToReplace.after(moveToPrimary.detach());
                placeholdersToReplace.remove();
            }
            
            if( this.secondaryMenu.children().length == 0 )
            {
                this.close();
            }
        }
        else
        {                   
           //remove all of the actions out of the overflow menu
            this.secondaryMenu
                .children()
                .remove();
            //hide the orginal items
            itemsToHide.addClass('placeholder');    
            
            this.options.clone.apply( this, [ itemsToHide ] )
                .prependTo( this.secondaryMenu );   
            
            this.secondaryMenu.find('li').removeClass('placeholder');    
            
            
            if( itemsToHide.length == 0 )
            {
                this.close();
            }
        
        }
        this._trigger( 'change', {}, this._uiHash() );
        return this;
    },
    
    //more menu opitons
    
    open: function(){
        if( this.secondaryMenu.find( this.options.items ).length == 0){
            return;
        }
        this.secondaryMenu.show();
        this._trigger( 'open', {}, this._uiHash() );
        return this;
    },
    close: function(){
        this.secondaryMenu.hide();
        this._trigger( 'close', {}, this._uiHash() );
        return this;
    },
    toggle: function(){
        if( this.secondaryMenu.is( ':visible') ){
            this.close();
        }else{
            this.open();
        }
        return this;
    },
    _getItems: function(){
        return this.primaryMenu.find( this.options.items );
    },
    _setHeight: function(){
        if( this.options.guessHeight ){
            //get the first items height and set that as the height of the parent
            this.primaryMenuHeight = this.primaryMenu.find( this.options.items ).filter(':first').outerHeight();
            this.primaryMenu.css('height', this.primaryMenuHeight )
            
        }else{
            this.primaryMenuHeight = this.element.innerHeight();
        }
        
    },
    _setOption: function( key, value ) {
        var self = this;
        if( key == 'refreshOn' && value ){
            this.options.refreshOn.unbind( 'resize.overflowmenu' );
            
            this.options.refreshOn = $( value )
                                        .bind( 'resize.overflowmenu', function(){
                                            self.options.cloneItems = true;
                                            self.refresh();
                                            self.options.cloneItems = false;
                                        })
                                        //call to set option
                                        self.refresh();
            
        }else if( key == 'label' && value ){
            //figure out the width of the hadel and subtract that from the parend with and set that as the right
            
            var width = this.secondaryMenuContainer.find('.jb-overflowmenu-menu-secondary-handle')
                        .html( value )
                        .outerWidth();
            this.primaryMenu.css( 'right',  width ) 
                    
        }
        
        $.Widget.prototype._setOption.apply( this, arguments );
    },
    _uiHash: function(){
        return {
            primary: this.primaryMenu,
            secondary: this.secondaryMenu,
            container: this.secondaryMenuContainer 
        };
    }

});


})( jQuery );