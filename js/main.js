/**
 * Sudoku
 * Author: Varun Varada
 */

$( document ).ready( function() {
    var game = new Sudoku();
    var view = new SudokuView( '#game', game );

    view.populate( game.generate() );
});
