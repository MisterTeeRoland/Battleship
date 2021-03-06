/*
	game.js
	Tyler Roland
	Modified 6/24/17
	Battleship functionality
*/

var gameType = "";
var turn = "p1";
var p2Ship = "", p2Direction = "";

var p1PiecesPlaced = 0, p2PiecesPlaced = 0;
var p1ShipArray = [], p2ShipArray = [];

var currentShip = "", currentDirection = "";

var shipArray = ['c', 'b', 'd', 's', 'pb'];
var directionArray = ['h', 'v'];



/*---Pre game play---*/

//sets game type and brings up P1 setup board
function setGame(type) {
	
	gameType = type;
	
	hideAll();
	
	$("#setupPlayer1").show();
	
	if (gameType == 'pvp') {
		$("#p2scoreheader").html("Player 2");
		$("#p2Title").html("Player 2's Board");
	}
}

function setShip(ship) {
	
	currentShip = ship;
	
	for (var i = 0; i < shipArray.length; i++)
		$("#"+shipArray[i]).removeClass('activeSetup');

	$("#"+ship).removeClass('setupPlaced').addClass('activeSetup');
}

function setDirection(dir) {
	
	currentDirection = dir;
	
	for (var i = 0; i < directionArray.length; i++)
		$("#"+directionArray[i]).removeClass('activeSetup');

	$("#"+dir).removeClass('setupPlaced').addClass('activeSetup');
}


//function to place a ship at clicked location
function placeCurrentPiece(cell) {
	
	var row = cell.charAt(0);
	var col = cell.charAt(1);

	if (turn == 'p1') {
		var currentPiece = currentShip;
		var pieceDirection = currentDirection;
	}
	else if (turn == 'p2') {
		if (gameType == 'pvc') {
			var currentPiece = p2Ship;
			var pieceDirection = p2Direction;
		}
		else {
			var currentPiece = currentShip;
			var pieceDirection = currentDirection;
		} 
	}

	//dont do anything unless a piece is picked
	if (currentPiece == '') { 
		alert("Pick a piece!");
		return;
	}
	
	//dont do anything unless a direction is picked
	if (currentDirection == '') {
		alert("Pick a direction!");
		return;
	}

	//define the current ship piece
	var ship;

	if (currentPiece == 'c')		ship = {name:'Carrier', length:5, color:'red'};
	else if (currentPiece == 'b')	ship = {name:'Battleship', length:4, color:'orange'}
	else if (currentPiece == 'd')	ship = {name:'Destroyer', length:3, color:'yellow'}
	else if (currentPiece == 's')	ship = {name:'Submarine', length:3, color:'green'}
	else if (currentPiece == 'pb')	ship = {name:'PatrolBoat', length:2, color:'blue'}

	//check if this placement is valid
	var validMove = checkPlacement(ship, pieceDirection, cell);

	//go through already put down ships and replace a ship if its already on the board
	if (turn == 'p1') {
		
		for (var i = 0; i < p1ShipArray.length; i++) {
			
			//current ship is already on the board, remove it.
			if (p1ShipArray[i].name == ship.name) {
				removeShip(p1ShipArray[i]); 
				break;
			}
		}
	}
	else if (turn == 'p2') {
		
		for (var i = 0; i < p2ShipArray.length; i++) {
		
			if (p2ShipArray[i].name == ship.name) {
				if (gameType=='pvc') {
					setUpCompPieces();
					return;
				}
				else if(gameType == 'pvp') {
					removeShip(p2ShipArray[i]);
					break;
				}
			}
		}
	}
	
	var placement = [];
	
	//if the move is valid, place the ship
	if (validMove) {
		
		//change the button from "active" to "placed" (red to green)
		$("#"+currentShip).removeClass('activeSetup').addClass('setupPlaced');
		
		//go through number of spaces and turn them to a color to mark that a "ship" is there
		for (var i = 0; i < ship.length; i++) {
			$("#"+row+""+col).css('background-color', ship.color);
			
			placement[placement.length] = (row+''+col); 

			if (pieceDirection == 'h')
				col++;
			else if (pieceDirection == 'v')
				row++;
		}
		
		ship.placement = placement;

		if (turn == 'p1')
			p1ShipArray[p1ShipArray.length] = ship;
		else if (turn == 'p2')
			p2ShipArray[p2ShipArray.length] = ship; 
	}

	//if the move is not valid, don't place it
	else {
		
		if (turn == 'p1')
			alert('cannot place here. not enough space.');
		
		if (turn == 'p2') {

			//playing against commputer, just try again
			if (gameType == 'pvc') 
				setUpCompPieces();
			else if (gameType == 'pvp')
				alert("cannot place here. not enough space.");
		}
		
		return;
	}

	//if all of player 1's pieces are set show button to save and either set up p2 pieces or comp pieces
	if (turn == 'p1' && p1ShipArray.length == 5)
		$("#savePieces").show();
	
	//if all of player 2's pieces are set, show button to save or just save the pieces.
	else if (turn == 'p2') {
		
		if (p2ShipArray.length == 5) {
		
			if (gameType == 'pvp')
				$("#savePieces").show();
			else
				savePieces();
		}
		else {
			if (gameType == 'pvc')
				setUpCompPieces();
		}
	}
}

//function to save a player's ships on the board
function savePieces() {
	
	if (turn == 'p1') {
		
		clearBoard();

		//if playing against another player, simply clear the board and the buttons for the other player to use.
		if (gameType == 'pvp') {
			for(var i = 0; i < shipArray.length; i++)
				$("#"+shipArray[i]).removeClass('setupPlaced');

			for (var i = 0; i < directionArray.length; i++)
				$("#"+directionArray[i]).removeClass('activeSetup');

			currentShip="";
			currentDirection="";
		}

		$('#savePieces').hide();
		$('#titleSetup').html("Player 2:<br>Place your pieces!");
		
		turn = 'p2';

		//automatically set up computer ships
		if (gameType == 'pvc')
			setUpCompPieces();
	}

	//if player 2 is saving pieces, just start the game
	else {
		
		$('#savePieces').hide();
		$('#titleSetup').html("Player 1:<br>Place your pieces!");
		
		turn = 'p1';
		
		startGame();
	}
}

//function to check if the placement to try is valid
function checkPlacement(ship, direction, cell) {
	
	var row = cell.charAt(0);
	var col = cell.charAt(1);
	
	//make sure there is space for the current piece
	for (var i = 0; i < ship.length; i++) {

		var rowCol = row + '' + col;
		
		//if there is space, keep going
		if (document.getElementById(rowCol) != null) {
			
			//check to see if the next space is empty, blank, or the player's ship color
			if (turn == 'p1' && (document.getElementById(rowCol).style.backgroundColor == 'gray' || document.getElementById(rowCol).style.backgroundColor == '' || document.getElementById(rowCol).style.backgroundColor == ship.color)) {
				
				if (direction == 'h')
					col++;
				else if (direction == 'v')
					row++;
			}

			//check to see if the next space is empty, blank, or the player's ship color
			else if (turn == 'p2' && (document.getElementById(rowCol).style.backgroundColor == 'gray' || document.getElementById(rowCol).style.backgroundColor == '' || document.getElementById(rowCol).style.backgroundColor == ship.color)) {
				
				if (direction == 'h')
					col++;
				else if (direction == 'v')
					row++;
			}

			//placement not valid. Ran out of space
			else
				return false;
		}

		//placement not valid. Out of bounds.
		else
			return false;
	}

	return true;
}

//function to remove a ship from the board (when placing ships, and moving ship around the board. Resets color.)
function removeShip(ship) {
	
	for (var i = 0; i < ship.length; i++)
		$("#"+ship.placement[i]).css('background-color', 'gray');
	
	if (turn == 'p1') {
		
		for (var i = 0; i < p1ShipArray.length; i++) {
			
			if (p1ShipArray[i].name == ship.name)
				p1ShipArray.splice(i,1);
		}
	}
	else if (turn == 'p2') {
		
		for (var i = 0; i < p2ShipArray.length; i++) {
			
			if (p2ShipArray[i].name == ship.name)
				p2ShipArray.splice(i,1);
		}
	}
}

//function to randomly set up computer's ships
function setUpCompPieces() {
	
	p2Ship = "";
	p2Direction = "";

	//pick a random ship and a random direction
	p2Ship = shipArray[Math.floor(Math.random()*5)];
	p2Direction = directionArray[Math.floor(Math.random()*2)];
	
	//pick a random cell
	var row = Math.floor(Math.random()*8);
	var col = Math.floor(Math.random()*8);
	var cell = (row+''+col);

	//try to place ship and update array
	placeCurrentPiece(cell);
}

//function to start the game after both sets of ships have been saved
function startGame() {

	//user "Player 2" instead of "Computer" if applicable
	if (gameType == 'pvp')
		$('#p2Title').html("Player 2");

	//hide set up board
	hideAll();
	setUpGameBoard();

	$("#gameboard").show();
	$("#p1ShipsLeft").html("Ships Left: " + p1ShipArray.length);
	$("#p2ShipsLeft").html("Ships Left: " + p2ShipArray.length);
}

//function to set up the gameboard
function setUpGameBoard() {
	
	//set up p1 table
	for (var i = 0; i < 8; i++) {
		
		var rowString = "<tr>";

		//if playing against computer, don't do anything special
		if (gameType == 'pvc') {
			for (var j = 0; j < 8; j++)
				rowString += "<td id='p1"+i+""+j+"'></td>"; 
		}

		//if playing against a second player, wire up an event handler for firing
		else if (gameType == 'pvp') {
			for (var j = 0; j < 8; j++)
				rowString += "<td id='p1"+i+""+j+"' onclick='Fire(\"p1"+i+''+j+"\")'></td>";
		}
		
		rowString += "</tr>";

		$("#p1board").html($("#p1board").html() + rowString);
	}

	//set up p2 table
	for (var i = 0; i < 8; i++) {
		
		var rowString = "<tr>";

		for (var j = 0; j < 8; j++)
			rowString += "<td id='p2"+i+""+j+"' onclick='Fire(\"p2"+i+''+j+"\")'></td>"; 
		
		rowString += "</tr>";
		
		$("#p2board").html($("#p2board").html() + rowString);
	}
}



/*---Game play---*/

//function to "fire" at a space on the board
function Fire(space) {

	//PLAY UNTIL MISS
	if (!$("#"+space).hasClass('hit') || !$("#"+space).hasClass('miss')) {

		var p = 'p' + space.charAt(1);
		var row = space.charAt(2);
		var col = space.charAt(3);
		var cell = row + '' + col;

		//only work if it is current player's turn. (no playing out of turn)
		if ((p == 'p2' && turn == 'p1') || (p == 'p1' && turn == 'p2')) {
	
			//check each index of opposing turn's ship array
			if (turn == 'p1') {

				for (var i = 0; i < p2ShipArray.length; i++) {
					var ship = p2ShipArray[i];

					for (var j = 0; j < ship.placement.length; j++)
					{
						if (ship.placement[j] == cell)
						{
							$("#"+space).addClass('hit');
							checkSunk(ship);
							return;
						}
					}
				}
				
				$("#"+space).addClass('miss');
				
				turn = 'p2';
				
				setTimeout(function(){ 
					$('#p1').show();
					$('#p2').hide();

					if (gameType == 'pvc') {
						$('#turn').html("Computer's Turn");
						setTimeout(function(){ compTurn(); }, 1000);
					}
					else {
						$('#turn').html("Player 2's Turn");
					}


				}, 500);

				

				return;
			}
			else if (turn == 'p2') {
				
				for (var i = 0; i < p1ShipArray.length; i++) {
					var ship = p1ShipArray[i];

					for (var j = 0; j < ship.placement.length; j++) {
						
						if (ship.placement[j] == cell) {
							
							$("#"+space).addClass('hit');
							
							checkSunk(ship);
							
							if (gameType == 'pvc')
								setTimeout(function(){ compTurn(); }, 500);
							
							return;
						}
					}
				}
				$("#"+space).addClass('miss');
				turn = 'p1';
				
				setTimeout(function() {
					$('#p2').show();
					$('#turn').html("Player 1's Turn");
					$('#p1').hide();
				}, 500);
				return;
			}
		}
		else
			alert("playing out of turn!");
	}
	else {
		if (turn == 'p1' || (turn == 'p2' && gameType == 'pvp'))
			return;
		else if (turn == 'p2' && gameType == 'pvc')
			setTimeout(function(){ compTurn(); }, 500);
	}
}

function checkSunk(ship) {
	//check all ships spots
	if (turn == 'p1') {
		for (var i = 0; i < p2ShipArray.length; i++)
		{
			if (ship.name == p2ShipArray[i].name)
			{
				var shots = 0;

				for (var j = 0; j < p2ShipArray[i].placement.length; j++)
				{
					if ($('#p2' + p2ShipArray[i].placement[j]).hasClass('hit'))
						shots++;
				}
				
				if (shots == p2ShipArray[i].placement.length) {
					$("#p2"+ship.name).css('text-decoration', 'line-through');
					shinkShip(p2ShipArray[i], 'p2');
					p2ShipArray.splice(i, 1);
					$('#p2ShipsLeft').html("Ships Left: " + p2ShipArray.length);
					if (p2ShipArray.length == 0)
						gameOver('p1');
				}
				
			}
		}
	}

	else if (turn == 'p2') {

		for (var i = 0; i < p1ShipArray.length; i++)
		{
			if (ship.name == p1ShipArray[i].name)
			{
				var shots = 0;

				for (var j = 0; j < p1ShipArray[i].placement.length; j++)
				{
					if ($('#p1' + p1ShipArray[i].placement[j]).hasClass('hit'))
						shots++;
				}
				
				if (shots == p1ShipArray[i].placement.length) {
					$("#p1"+ship.name).css('text-decoration', 'line-through');
					shinkShip(p1ShipArray[i], 'p1'); //sink the ship
					p1ShipArray.splice(i, 1);
					$('#p1ShipsLeft').html("Ships Left: " + p1ShipArray.length);
					if (p1ShipArray.length == 0)
						gameOver('p2');
				}
				
			}
		}
	} 
}

//function to mark a ship as "sunk"
function shinkShip(ship, player) {
	
	//change the ship's previous spots to gold ("sunk" class)
	for (var i = 0; i < ship.placement.length; i++)
		$("#"+player+ship.placement[i]).removeClass('hit').addClass('sunk');
}

//function to show the winner at the end of the game
function gameOver(winner) {
	
	hideAll();
	$('#gameOver').show();

	if (winner == 'p1')
		$('#winner').html("Player 1 Wins!!");
	
	else if (winner == 'p2') {
		if (gameType == 'pvp')	$('#winner').html("Player 2 Wins!!");
		if (gameType == 'pvc')	$('#winner').html("The Computer Wins :(");
	}	
}


function compTurn() {
	
	//show computer turn!
	turn = 'p2';
	if (gameType == 'pvc')
		$('#turn').html("Computer's Turn");
	else if (gameType == 'pvp')
		$('#turn').html("Player 2's Turn");

	var resultboard = document.getElementById('resultboard');
	var validShot = false;

	//while not miss
	while(!validShot)
	{
		//get random cell
		var row = Math.floor(Math.random()*8);
		var col = Math.floor(Math.random()*8);
		var cell = 'p1'+row+''+col;

		//check if cell background is empty or gray (not tried before)
		if (!$("#"+cell).hasClass('hit') && !$("#"+cell).hasClass('miss'))
		{
			validShot = true;
			Fire(cell);
		}
	}
}


/*---Misc game play functions---*/

//function to hide all divs on the screen
function hideAll() {
	$("#playerCount").hide();
	$("#setupPlayer1").hide();
	$("#gameboard").hide();
	$("#gameOver").hide();
	$("header").hide();
}

//function to dynamically build a game board
function buildBoard() {

	for (var i = 0; i < 8; i++) {
		
		var rowString = "<tr>";

		for (var j = 0; j < 8; j++)
			rowString += "<td id='"+i+""+j+"' onclick='placeCurrentPiece(\""+i+''+j+"\")'></td>"; 
		
		rowString += "</tr>";
		
		$("#board").html($("#board").html() + rowString);
	}
}

//function to set the board space colors to gray
function clearBoard() {
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++)
			$("#"+i+''+j).css('backgroundColor', 'gray');
	}
}

window.onload = function() {
	buildBoard();
	hideAll();
	$("#playerCount").show();
}