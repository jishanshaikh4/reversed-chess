var board, game = new Chess();

var calculateBestMove = function(game){
    var newGameMoves = game.ugly_moves();

    return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
};

/* State handling and Visualization */
var onDragStart = function (source, piece, position, orientation){
    if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1){
        return false;
    }
};

var makeBestMove = function (){
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()){
        alert('Game Over !');
    }
};

var getBestMove = function (game){
    if (game.game_over()) {
        alert('Game Over !');
    }
    var bestMove = calculateBestMove(game);
    return bestMove;
};

var renderMoveHistory = function (moves){
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i += 2){
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);
};

var onDrop = function (source, target){
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'	// Always promote pawn to queen when reaches to opposite end.
    });
    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }
    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function (){
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece){
    var moves = game.moves({
        square: square,
        verbose: true
    });
    if (moves.length === 0) return;
    
    greySquare(square);
    for (var i = 0; i < moves.length; i++){
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece){
    removeGreySquares();
};

var removeGreySquares = function(){
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square){
    var squareEl = $('#board .square-' + square);
    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }
    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};

/*  Object of a Chessboard class implemented in chessboard.js  */
board = ChessBoard('board', cfg);
