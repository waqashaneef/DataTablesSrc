// TK COLIN add tests for multiple tables
describe('cells- cells().every()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		const argumentLength = 4;

		dt.html('basic');

		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.cells().every).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.cells().every(function() {}) instanceof $.fn.dataTable.Api).toBe(true);
		});

		it('Passes the correct parameters to the function', function() {
			let table = $('#example').DataTable();
			let iteration = 0;

			table.cells().every(function() {
				// only check types on the first column iteration
				if (iteration++ == 0) {
					let len = arguments.length;

					expect(len).toBe(argumentLength);

					for (let i = 0; i < len; i++) expect(Number.isInteger(arguments[i])).toBe(true);
				}
			});

			expect(iteration).toBe(table.cells().count());
		});
	});

	describe('Check behaviour', function() {
		const testRow = 3;
		const testColumn = 4;

		let iteratedCells = []; // array of cells returned from iterateFunc() - no method for passing an arg so needs a global

		// callback function for cells().every()
		function iterateFunc(rowIndex, colIndex, tableCounter, counter) {
			expect(this.index().row).toBe(rowIndex);
			expect(this.index().column).toBe(colIndex);

			iteratedCells.push({ row: rowIndex, column: colIndex });
		}

		// tags a requested number of random cells (no check made for duplicates)
		function tagRandomCells(numberToTag) {
			let table = $('#example').DataTable();

			let maxRow = table.rows().count();
			let maxCol = table.columns().count();

			for (let i = 0; i < numberToTag; i++) {
				$(table.cell(Math.floor(Math.random() * maxRow), Math.floor(Math.random() * maxCol)).node()).addClass('myTest');
			}
		}

		dt.html('basic');

		it('Every cell is iterated upon', function() {
			let table = $('#example').DataTable();

			iteratedCells = [];
			table.cells().every(iterateFunc);

			expect($.unique(iteratedCells).length).toBe(table.cells().count());
		});

		dt.html('basic');

		it('A specific cell is iterated upon', function() {
			let table = $('#example').DataTable();

			$(table.cell(testRow, testColumn).node()).addClass('myTest');

			iteratedCells = [];
			table.cells('.myTest').every(iterateFunc);

			expect(iteratedCells.length).toBe(1);
			expect(iteratedCells[0].row).toBe(testRow);
			expect(iteratedCells[0].column).toBe(testColumn);
		});

		dt.html('basic');

		it('A single random cell is iterated upon', function() {
			let table = $('#example').DataTable();

			tagRandomCells(1);

			iteratedCells = [];
			table.cells('.myTest').every(iterateFunc);

			expect($.unique(iteratedCells).length).toBe(1);
		});

		dt.html('basic');

		it('A dozen random cells are iterated upon', function() {
			let table = $('#example').DataTable();

			tagRandomCells(12);

			iteratedCells = [];
			table.cells('.myTest').every(iterateFunc);

			expect($.unique(iteratedCells).length).toBe(table.cells('.myTest').count());
		});

		dt.html('basic');

		it('A column of cells is iterated upon', function() {
			let table = $('#example').DataTable();

			$(table.column(testColumn).nodes()).addClass('myTest');

			iteratedCells = [];
			table.cells('.myTest').every(iterateFunc);

			expect($.unique(iteratedCells).length).toBe(table.rows().count());
		});

		dt.html('basic');

		it('A row of cells is iterated upon', function() {
			let table = $('#example').DataTable();

			$(table.cells(testRow, '*').nodes()).addClass('myTest');

			iteratedCells = [];
			table.cells('.myTest').every(iterateFunc);

			expect($.unique(iteratedCells).length).toBe(table.columns().count());
		});

		dt.html('basic');
	});
});