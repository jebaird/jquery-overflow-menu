/*
 * jboverflowmenu_core
 */
(function($){
	module("jboverflowmenu: core");
	
	test("markup and css check", function(){
	
		var $target = $( '#target').overflowmenu()
		expect( 4 )

		equal( true, $target.hasClass('jb-overflowmenu') )
		
		equal( 1 , $target.find( '.jb-overflowmenu-menu-primary').size() )
		
		equal( 1 , $target.find( '.jb-overflowmenu-container').size() )
		
		equal( 1 , $target.find( '.jb-overflowmenu-container .jb-overflowmenu-menu-secondary').size() )
	
	})
	
})( jQuery );
