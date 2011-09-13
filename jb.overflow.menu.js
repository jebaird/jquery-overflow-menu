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
		//call the resize method when this element changes size, with out a speical event window is the only element that this gets called on
		triggerOn: $( window ),
		
		//attempt to guess the height of the menu, if not the target element needs to have a height
		guessHeight: true
	},

	_create: function() {
		var self = this;
		
		this.element
			.addClass('jb-overflowmenu');
			
		this.visMenu = this.element
						.children( this.options.itemsParentTag )
						.addClass( 'jb-overflowmenu-menu-primary jb-overflowmenu-helper-postion' );
		
		if( this.options.guessHeight ){
			this._setHeight();	
		}
		
								
		//TODO: allow the user to change the markup for this because they might not be using ul -> li
		this.hiddenContainer = $(
							[
								'<div class="jb-overflowmenu-container jb-overflowmenu-helper-postion">',
									'<a href="javascript://" class="jb-overflowmenu-menu-secondary-handle"></a>',
									'<' + this.options.itemsParentTag + ' class="jb-overflowmenu-menu-secondary jb-overflowmenu-helper-postion"></' + this.options.itemsParentTag + '>',
								'</div>'
							].join('')
						)
						.appendTo( this.element )
						
		this.hiddenMenu = this.hiddenContainer.find('ul');
		
		this.hiddenContainer.bind('click.overflowmenu', function(){
			self.toggle()
		})
		
		
		this._setOption( 'triggerOn', this.options.triggerOn )
		this._setOption( 'label', this.options.label )
			
	},

	destroy: function() {
			//TODO: add Clearup
		$.Widget.prototype.destroy.apply( this, arguments );
	},
	
	
	resize: function() {
		// trigger resize event on window || this.element
		var $items = this._getItems(),
			vHeight = this.visMenuHeight
	    //remove all of the actions out of the overflow menu
	    this.hiddenMenu.children().remove();
	    
	    //find all of the that arent visiable and add/clone them to the overflow menu 
	    $items.filter(function(){
	        return this.offsetTop + $(this).height() > vHeight;
	    })
	    .clone( true )
	    .prependTo( this.hiddenMenu );
	    
	    if( this.hiddenMenu.children().length == 0 ){
	    	this.hiddenMenu.hide();
	    }

	},
	
	//more menu opitons
	show: function(){
		this.hiddenContainer.find('.jb-overflowmenu-menu-secondary').show();
	},
	hide: function(){
		this.hiddenContainer.find('.jb-overflowmenu-menu-secondary').hide();
	},
	toggle: function(){
		this.hiddenContainer.find('.jb-overflowmenu-menu-secondary').toggle();
	},
	
	_getItems: function(){
		return this.visMenu.find( this.options.items );
	},
	_setHeight: function(){
		//get the first items height and set that as the height of the parent
		this.visMenuHeight = this.visMenu.find( this.options.items ).filter(':first').outerHeight();
		this.visMenu.css('height', this.visMenuHeight )
		
	},
	_setOption: function( key, value ) {
		var self = this;
		if( key == 'triggerOn' && value ){
			this.options.triggerOn.unbind( 'resize.overflowmenu' );
			
			this.options.triggerOn = $( value )
										.bind( 'resize.overflowmenu', function(){
											self.resize();
										})
										//call to set option
										self.resize();
			
		}else if( key == 'label' && value ){
			//figure out the width of the hadel and subtract that from the parend with and set that as the right
			
			var width = this.hiddenContainer.find('.jb-overflowmenu-menu-secondary-handle')
						.html( value )
						.outerWidth();
			this.visMenu.css( 'right',  width ) 
					
		}
		
		$.Widget.prototype._setOption.apply( this, arguments );
	},

});


})( jQuery );
