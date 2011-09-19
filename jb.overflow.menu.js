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
 * 	<ul>
 * 		<li>
 * 	</ul>
 * </nav>
 * 
 * $('nav').overflowmenu()
 * 
 */


/*
 * TODO: add optoin for menu postion
 * 		setHeight
 * 
 */
(function( $, undefined ) {

$.widget( "jb.overflowmenu", {
	options: {
		items: '> *',
		itemsParentTag: 'ul',
		label: 'more',
		//call the refresh method when this element changes size, with out a speical event window is the only element that this gets called on
		triggerOn: $( window ),
		
		//attempt to guess the height of the menu, if not the target element needs to have a height
		guessHeight: true,
		
		//called after the all of the menu positions have been recalulated and cloned to their proper menu
		change: $.noop,
		
		closeOn: function(){
			return true;
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
		
		this.secondaryMenuContainer.bind('click.overflowmenu', function(){
			self.toggle()
		})
		
		//has to be set first
		this._setOption( 'label', this.options.label )
		this._setOption( 'triggerOn', this.options.triggerOn )
		
			
	},

	destroy: function() {
		this.element
			.removeClass('jb-overflowmenu')
		
		this.primaryMenu
			.removeClass('jb-overflowmenu-menu-primary jb-overflowmenu-helper-postion')
			.find( this.options.items )
			.filter( ':hidden' )
			.css( 'display', '' )
		
		this.options.triggerOn.unbind( 'resize.overflowmenu' );
		
		this.secondaryMenuContainer.remove()
		
		
		//TODO: possibly clean up the height + right on the ul
		
		$.Widget.prototype.destroy.apply( this, arguments );
	},
	
	
	refresh: function() {
		
		
		var vHeight = this.primaryMenuHeight,
			//get the items, filter out the the visible ones
			itemsToHide = this._getItems()
							    .css( 'display', '' )
							    .filter(function(){
							        return this.offsetTop + $(this).height() > vHeight;
							    })
						    
	    //remove all of the actions out of the overflow menu
	    this.secondaryMenu
	    	.children()
	    	.remove();

	    itemsToHide
	    	.clone( true, true )
	    	.prependTo( this.secondaryMenu );
	    	
	    //hide the orginal items
	    itemsToHide.css( 'display','none' )
	    
	    
	    this._trigger( 'change', {}, this._uiHash() );

	},
	
	//more menu opitons
	show: function(){
		this.secondaryMenuContainer.find('.jb-overflowmenu-menu-secondary').show();
	},
	hide: function(){
		this.secondaryMenuContainer.find('.jb-overflowmenu-menu-secondary').hide();
	},
	toggle: function(){
		this.secondaryMenuContainer.find('.jb-overflowmenu-menu-secondary').toggle();
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
		if( key == 'triggerOn' && value ){
			this.options.triggerOn.unbind( 'resize.overflowmenu' );
			
			this.options.triggerOn = $( value )
										.bind( 'resize.overflowmenu', function(){
											self.refresh();
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
			pirmary: this.primaryMenu,
			secondary: this.secondaryMenu,
			container: this.secondaryMenuContainer 
		};
	}

});


})( jQuery );