/**
 * Sudoku
 * Author: Varun Varada
 */

(function ( window ) {

// Enable strict mode
'use strict';

/**
 * Instantiates a new Sudoku board
 */
var Sudoku = function() {

    /**
     * Holds the size (n) of the current board, where the board is (n x n)
     *
     * @type {Number}
     */
    this.boardSize = 0;

    /**
     * Holds the number of currently filled cells on the board
     *
     * @type {Number}
     */
    this.filledCells = 0;

    /**
     * Multidimensional array that holds the initial board state
     *
     * @type {Array}
     */
    this.initialBoard = [];

    /**
     * Multidimensional array that holds the current board state
     *
     * @type {Array}
     */
    this.board = [];

    /**
     * Multidimensional array that holds the current board's solution
     *
     * @type {Array}
     */
    //this.solution = [];

};

$.extend( true, Sudoku.prototype, {

    /**
     * Gets the current board
     *
     * @return {Array[]} The current board
     */
    getBoard: function() {
        return this.board;
    },

    /**
     * Gets the current board's solution
     *
     * @return {Array[]} The current board's solution
     */
    getSolution: function() {
        return this.solution;
    },

    /**
     * Generates a new board
     * Note: Gives the same board every time for the moment (have to implement a real board generator).
     *
     * @return {Array[]} The generated board
     */
    generate: function() {
        var i;

        // Set board size
        this.boardSize = 9;

        // Initialize board
        var difficulty = $('#difficulty option:selected').val();
        var boardString = sudoku.generate(difficulty);
        this.board = sudoku.board_string_to_grid(boardString.replace(/\./g, '0'));

        // Set number of filled cells
        this.filledCells = 81 - (boardString.match(/\./g) || []).length;

        // Keep a copy of the initial board
        this.initialBoard = $.extend( true, [], this.board );

        return this.board;
    },

    /**
     * Checks whether the provided solution is correct
     * Note: Assumes puzzles have unique solutions, which is true in 99.99% of the cases.
     *
     * @param  {Array}    board
     * @return {Boolean}          Whether the provided solution is correct or not
     */
    isSolved: function() {
        var i, j;

        // Check whether all cells have been filled
        if( this.filledCells !== Math.pow( this.boardSize, 2 ) ) {
            return false;
        }

        for( i = 0; i < this.board.length; i++ ) {
            // Verify values
            // Note: Not using strict equals to because we want to ignore type inconsistencies.
            for( j = 0; j < this.board[i].length; j++ ) {
                // Empty value
                if( this.board[i][j] == 0 ) {
                    return false;
                }
            }
        }

        // verify that it is a valid solution
        var boardString = sudoku.board_grid_to_string(this.board).replace(/0/g, '.');
        if(!sudoku.get_candidates(boardString)) {
          return false;
        }

        return true;
    },

    /**
     * Updates the board at specified position with number.
     *
     * @param  {Object} position The position to update
     * @param  {Number} number   The number to update the position with
     */
    update: function ( position, number ) {
        // Update filled cells count
        if( this.board[position.row][position.column] == 0 && number != 0 ) {
            ++this.filledCells;
        } else if( this.board[position.row][position.column] != 0 && number == 0 ) {
            --this.filledCells;
        }

        this.board[position.row][position.column] = number;
    },

    /**
     * Clears a position on the board
     *
     * @param  {Object} position The position to clear
     */
    clear: function ( position ) {
        this.update( position, 0 );
    },

    /**
     * Resets the board to its initial state and returns it
     *
     * @return {Array[]} The reset board
     */
    reset: function() {
        this.board = $.extend( true, [], this.initialBoard );
        return this.board;
    },

    /**
     * Gets a list of valid numbers that can be played in a certain board position
     *
     * @param  {Object} position The position on the board
     * @return {Array}          An array of valid numbers
     */
    getValidNumbers: function ( position ) {
        var i, j, index, validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // Check row
        for( i = 0; i < this.board[position.row].length; i++ ) {
            if( this.board[position.row][i] != 0 ) {
                // Remove number that's been used from the valid numbers
                // Note: Converting array items to numbers to make types compatible
                index = validNumbers.indexOf( +this.board[position.row][i] );
                if( index !== -1 ) {
                    validNumbers.splice( index, 1 );
                }
            }
        }

        // Check column
        for( i = 0; i < this.board.length; i++ ) {
            if( this.board[i][position.column] != 0 ) {
                // Remove number that's been used from the valid numbers
                // Note: Converting array items to numbers to make types compatible
                index = validNumbers.indexOf( +this.board[i][position.column] );
                if( index !== -1 ) {
                    validNumbers.splice( index, 1 );
                }
            }
        }

        // Check block
        var beginRow = position.row - (position.row % 3),
            beginCol = position.column - (position.column % 3),
            endRow = beginRow + 2,
            endCol = beginCol + 2;
        for( i = beginRow; i <= endRow; i++ ) {
            for( j = beginCol; j <= endCol; j++ ) {
                if( this.board[i][j] != 0 ) {
                    // Remove number that's been used from the valid numbers
                    // Note: Converting array items to numbers to make types compatible
                    index = validNumbers.indexOf( +this.board[i][j] );
                    if( index !== -1 ) {
                        validNumbers.splice( index, 1 );
                    }
                }
            }
        }

        return validNumbers;
    }

});

// Expose the constructor to the global scope
window.Sudoku = Sudoku;

})( window );
