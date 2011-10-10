/*
 * jboverflowmen_methods
 * https://github.com/jquery/jquery-ui/blob/master/tests/unit/progressbar/progressbar_methods.js
 */
(function($){
	module("jboverflowmenu: methods");
	
	test( 'init', function(){
		expect( 1 )
		
		$( '<div><ul><li>one</li><ul></div>' )
			.appendTo('body')
			.overflowmenu()
			.remove()
			
		ok( true, '.overflowmenu() called on element ')
	})
	

	test( 'destroy', function(){
		expect( 2 )
		
		$( '<div><ul><li>one</li><ul></div>' )
			.appendTo('body')
			.overflowmenu()
			.overflowmenu('destory')
			.remove()
			
		ok( true, '.overflowmenu() called on element ')
		
		var expected = $( '<div><ul><li>one</li><ul></div>' ).overflowmenu(),
			actual = expected.overflowmenu('destroy');
			
			equals(actual, expected, 'destroy is chainable');
					
	})	
	
	test( 'open', function(){
		expect( 1 )
		
		var el = $( '<div><ul><li>one</li><li>one</li><li>one</li><li>one</li><li>one</li><ul></div>' )
				.css({
					width: 100,
					height: '1em',
				})
				.appendTo('body')
				.overflowmenu()
				
				
		el.data('overflowmenu').open();
		
		ok( el.data('overflowmenu').secondaryMenu.is(':visible'), 'secondary menu is visible' )		
			
		el.remove();
	})
	
	
	test( 'close', function(){
		expect( 1 )
		
		var el = $( '<div><ul><li>one</li><li>one</li><li>one</li><li>one</li><li>one</li><ul></div>' )
				.css({
					width: 100,
					height: '1em',
				})
				.appendTo('body')
				.overflowmenu()
				
				
		el.data('overflowmenu').close();
		
		ok( el.data('overflowmenu').secondaryMenu.is(':not(:visible)'), 'secondary menu is hidden' )		
			
		el.remove();
	})
	
	test( 'toggle', function(){
		expect( 2 )
		
		var el = $( '<div><ul><li>one</li><li>one</li><li>one</li><li>one</li><li>one</li><ul></div>' )
				.css({
					width: 100,
					height: '1em',
				})
				.appendTo('body')
				.overflowmenu()
				
		el.data('overflowmenu').open();
		
		ok( el.data('overflowmenu').secondaryMenu.is(':visible'), 'secondary menu is visible' )	
				
		el.data('overflowmenu').close();
		
		ok( el.data('overflowmenu').secondaryMenu.is(':not(:visible)'), 'secondary menu is hidden' )		
			
		el.remove();
	})
	
	
	
	test( 'refresh', function(){
		//expect( 6 )
		//test clone
		var el = $( '<div><ul>' +
			'<li class="one">one</li>' +
			'<li class="two">two</li>' +
			'<li class="three">three</li>' + 
			'<li class="four">four</li>' +
			'<li class="five">five</li>'+ 
			'</ul></div>' )
				.css({
					width: 100,
					height: '1em',
				})
				.appendTo('body')
				.overflowmenu()
				
		var item  = $('<li class="new">new</li>') 
						.appendTo( el.children( 'ul') )
						
		
		var classNames = [];
						
		//get list of class names 
		
		el.children( 'ul' ).children('li').each(function(index) {
			classNames.push( this.className );
		});							
		
		el.data('overflowmenu').refresh();
		
		var i = classNames.length;
		
		el.children( 'ul' ).children(':hidden').each(function(){
			equal( 1, el.find( '.jb-overflowmenu-menu-secondary .' + this.className ).length, 'element is hidden in pirmary menu but is in the secondary menu' + this.className );
		})
		
		
		
		
		el.remove();
		
	})
	
	
	
	test('state', function(){
		componetn
		
		ok( state, compont.state(0) )
	})
	
	
	
	
	// test( 'method - open', function(){
// 		
// 		
		// $
// 		
		// var $target = $( '#target').overflowmenu()getWidget();
// 		
		// widget.open()
// 		
		// ok( widget.secondaryMenu.is(':visible') )
	// })
// 	
	// test( 'method - close', function(){
		// var widget = getWidget();
// 		
		// widget.close()
// 		
		// ok( widget.secondaryMenu.is(':hidden') )
	// })
		
	
})( jQuery );