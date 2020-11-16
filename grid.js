//creates an 8x8 grid for game board
function createGrids() {
    var div = document.querySelectorAll('.grid');
	for (var grid = 0; grid < div.length; grid++) {
		for (var row = 0; row < 8; row++) {
			for (var col = 0; col < 8; col++) {
				var el = document.createElement('div');
				el.className = 'grid-cell';
				div[grid].appendChild(el);
			}
		}
	}
}

createGrids();