module('jboverflowmenu')

/*
 * tests to write
 * 
 * has overflow 
 * has height
 * 
 * 
 * break a part into life cycles
 * 
 * 
 * items: '> *',
		//call the refresh method when this element changes size, with out a speical event window is the only element that this gets called on
		refreshOn: $( window ),

		test evetns - make sure they fire
 * 
 */
function getWidget(){
	return $( '#target').data('overflowmenu')
}

test( 'option - label ', function(){
	expect( 2 )
	var handle = $( '#target' ).find( '.jb-overflowmenu-menu-secondary-handle' );
	var widget = getWidget();
	
	equal( widget.options.label, handle.html() )
	
	widget.option( 'label', '<span>test</span>More' )

	equal( widget.options.label, handle.html() )
	
})

test( 'option - itemsParentTag, do the primary & secondary menus have the same tagName ', function(){
	var widget = getWidget();
	console.log( widget )
	expect( 2 )
	
	equal( widget.primaryMenu[ 0 ].nodeName.toLowerCase(), widget.options.itemsParentTag.toLowerCase() )
	
	equal( widget.primaryMenu[ 0 ].nodeName, widget.secondaryMenu[ 0 ].nodeName )

	//equal( widget )
	
//	equal( getWidget().options.itemsParentTag, $( '#target' ).find( '.jb-overflowmenu-menu-secondary-handle' ).html() )
	
})

test( 'element has a detectible height', function(){
	var widget = getWidget();
	
	var height = widget.primaryMenu.css( 'height' )

	notEqual( '', height )
	notEqual( '0px', height )	
})











test( 'method - refresh, append new item to target did it get cloned and append to the secondary menu?', function(){
/*
 * append item to primary menu refresh detect if its in secondary menu
 * 
 */
	var widget = getWidget();
	var item = $('<li><a href="javascript://" class="refreshtest" >new item</a></li>')
				.appendTo( widget.primaryMenu )
				
	widget.refresh();
	
	equal( 1, widget.secondaryMenu.find( '.refreshtest').length )
	equal( 'none', item.css( 'display' ))

})


test( 'click on handle secondary menu shows up if there are items in it', function(){
	var widget = getWidget();
	
	widget.close();
	
	widget.secondaryMenuContainer.find( '.jb-overflowmenu-menu-secondary-handle' ).trigger('click.overflowmenu');
	
	equal( true, widget.secondaryMenu.is( ':visible') )
	
	widget.close();
})



// test( 'option - primary and secondary have the same tag', function(){
	// //todo figure out haw to test that
// })
// 
// test( 'element has a detectible height', function(){
	// var height = S( '#target').css( 'height' );
	// expect( 2 )
// 	
	// notEqual( '', height )
	// notEqual( '0px', height )
// })
// 
// test( 'click show secondary menu', function(){
	// var $target = S( '#target');
	// $target.find( '.jb-overflowmenu-menu-secondary-handle' ).click();
	// Screen.wait( 250 )
	// var secondary = $target.find('.jb-overflowmenu-menu-secondary');
// })


test( 'destory', function(){
	
	
	//fifure out a way to test this, calling destory makes the over tests fail
	// getWidget().destroy();
// 	
	// var target = $( '#target' );
// 	
	// equal( false, target.hasClass( 'jb-overflowmenu') );
// 	
	
	
	
	
})

