var gameType = "";
var turn = "p1";
var p2Ship = "", p2Direction = "";

var p1PiecesPlaced = 0, p2PiecesPlaced = 0;
var p1ShipArray = [], p2ShipArray = [];

/*---Pre game play---*/

//sets game type and brings up P1 setup board
function setGame(type) {
	gameType = type;
	hideAll();
	document.getElementById('setupPlayer1').style.display = 'table-cell';
}


//function to place a ship at clicked location
function placeCurrentPiece(cell) {
	var row = cell.charAt(0);
	var col = cell.charAt(1);

	if (turn == 'p1') {
		var currentPiece = document.getElementById('pieces').value;
		var pieceDirection = document.getElementById('direction').value;
	}
	else if (turn == 'p2') {
		if (gameType == 'pvc') {
			var currentPiece = p2Ship;
			var pieceDirection = p2Direction;
		}
		else {
			var currentPiece = document.getElementById('pieces').value;
			var pieceDirection = document.getElementById('direction').value;
		} 

	}

	if (currentPiece == 'c')
		var ship = {name:'Carrier', length:5, color:'red'};
	else if (currentPiece == 'b')
		var ship = {name:'Battleship', length:4, color:'orange'}
	else if (currentPiece == 'd')
		var ship = {name:'Destroyer', length:3, color:'yellow'}
	else if (currentPiece == 's')
		var ship = {name:'Submarine', length:3, color:'green'}
	else if (currentPiece == 'pb')
		var ship = {name:'Patrol Boat', length:2, color:'blue'}

	var validMove = checkPlacement(ship, pieceDirection, cell);

	//go through already put down ships and replace a ship if its already on the board
	if (turn == 'p1')
	{
		for (var i = 0; i < p1ShipArray.length; i++)
		{
			var tempShip = p1ShipArray[i];
			if (tempShip.name == ship.name) {
				removeShip(tempShip); 
				break;
			}
		}
	}
	else if (turn == 'p2')
	{
		for (var i = 0; i < p2ShipArray.length; i++)
		{
			var tempShip = p2ShipArray[i];
			if (tempShip.name == ship.name) {
				setUpCompPieces();
				return;
			}
		}
	}
	

	var placement = [];
	if (validMove) {
		
		//go through number of spaces and turn them green to mark that a "ship" is there
		for (var i = 0; i < ship.length; i++) {
			document.getElementById(row+""+col).style.backgroundColor = ship.color;
			
			placement[placement.length] = (row+''+col); 

			if (pieceDirection == 'h')
				col++;
			else if (pieceDirection == 'v')
				row++;
		}
		ship.placement = placement;

		if (turn == 'p1')
			p1ShipArray[p1ShipArray.length] = ship;
		else if (turn == 'p2') {
			p2ShipArray[p2ShipArray.length] = ship; 
		}
	}
	else {
		if (turn == 'p1')
			alert('cannot place here. not enough space.');
		if (turn == 'p2')
			setUpCompPieces();
		return;
	}

	//p1 pieces set, either set up p2 pieces or comp pieces
	if (turn == 'p1' && p1ShipArray.length == 5) {
		document.getElementById("savePieces").style.display = 'block';
	}
	else if (turn == 'p2')
	{
		if (p2ShipArray.length == 5) {
			if (gameType == 'pvp')
				document.getElementById("savePieces").style.display = 'block';
			else
				savePieces();
			
		}
		else
			setUpCompPieces();
	}
}

function savePieces() {
	if (turn == 'p1') {
		clearBoard();
		document.getElementById('savePieces').style.display = 'none';
		document.getElementById('titleSetup').innerHTML = "Player 2: Place your pieces!";
		turn = 'p2';

		if (gameType == 'pvc')
			setUpCompPieces();
	}
	else {
		turn = 'p1';
		document.getElementById('savePieces').style.display = 'none';
		document.getElementById('titleSetup').innerHTML = "Player 1: Place your pieces!";
		startGame();
	}
}

function checkPlacement(ship, direction, cell) {
	//make sure of valid placement
	var row = cell.charAt(0);
	var col = cell.charAt(1);

	//make sure there is space for the current piece
	for (var i = 0; i < ship.length; i++) {
		//if there is space, keep going
		if (document.getElementById(row+''+col) != null)
		{
			if (turn == 'p1' && (document.getElementById(row+''+col).style.backgroundColor == 'gray' || document.getElementById(row+''+col).style.backgroundColor == '' || document.getElementById(row+''+col).style.backgroundColor == ship.color))
			{
				if (direction == 'h')
					col++;
				else if (direction == 'v')
					row++;
			}
			else if (turn == 'p2' && (document.getElementById(row+''+col).style.backgroundColor == 'gray' || document.getElementById(row+''+col).style.backgroundColor == ''))
			{
				if (direction == 'h')
					col++;
				else if (direction == 'v')
					row++;
			}
			else
				return false;
		}
		else
			return false;
	}

	return true;
}

function removeShip(ship) {
	for (var i = 0; i < ship.length; i++)
		document.getElementById(ship.placement[i]).style.backgroundColor = 'gray';
	
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

function setUpCompPieces() {

	//hideAll();
	p2Ship = "";
	p2Direction = "";

	var shipArray = ['c', 'b', 'd', 's', 'pb'];
	var directionArray = ['h', 'v'];

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

function startGame() {
	//alert("starting game!");

	if (gameType == 'pvp')
		document.getElementById('p2Title').innerHTML = "Player 2";

	//hide set up board
	hideAll();
	setUpGameBoard();
	document.getElementById('gameboard').style.display = 'table-cell';
	document.getElementById('p1ShipsLeft').innerHTML = "Ships Left: " + p1ShipArray.length;
	document.getElementById('p2ShipsLeft').innerHTML = "Ships Left: " + p2ShipArray.length;
}

function setUpGameBoard() {
	//set up p1 table
	var table = document.getElementById('p1board');

	for (var i = 0; i < 8; i++) {
		var rowString = "<tr>";

		if (gameType == 'pvc') {
			for (var j = 0; j < 8; j++)
				rowString += "<td id='p1"+i+""+j+"'></td>"; 
		}
		else if (gameType == 'pvp') {
			for (var j = 0; j < 8; j++)
				rowString += "<td id='p1"+i+""+j+"' onclick='Fire(\"p1"+i+''+j+"\")'></td>";
		}
		
		rowString += "</tr>";
		table.innerHTML += rowString;
	}

	//set up p2 table
	var table = document.getElementById('p2board');

	for (var i = 0; i < 8; i++) {
		var rowString = "<tr>";

		for (var j = 0; j < 8; j++)
			rowString += "<td id='p2"+i+""+j+"' onclick='Fire(\"p2"+i+''+j+"\")'></td>"; 
		
		rowString += "</tr>";
		table.innerHTML += rowString;
	}
}



/*---Game play---*/

function Fire(space) {

	//PLAY UNTIL MISS
	if (document.getElementById(space).style.backgroundColor != 'red' || document.getElementById(space).style.backgroundColor != 'blue') {
		var resultArea = document.getElementById('resultboard');

		var p = 'p' + space.charAt(1);
		var row = space.charAt(2);
		var col = space.charAt(3);
		var cell = row + '' + col;

		//alert("Turn: " + turn + " | Cell fired at: " + (p + cell));

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
							document.getElementById(space).style.backgroundColor = 'red';
							checkSunk(ship);
							return;
						}
					}
				}
				document.getElementById(space).style.backgroundColor = 'blue';
				turn = 'p2';
				setTimeout(function(){ 
					document.getElementById('p1').style.display = 'inline-table';
					document.getElementById('p2').style.display = 'none';
				}, 500);

				if (gameType == 'pvc') {
					document.getElementById('turn').innerHTML = "Computer's Turn";
					setTimeout(function(){ compTurn(); }, 1000);
				}
				else {
					document.getElementById('turn').innerHTML = "Player 2's Turn";
				}

				return;
			}
			else if (turn == 'p2') {
				for (var i = 0; i < p1ShipArray.length; i++) {
					var ship = p1ShipArray[i];

					for (var j = 0; j < ship.placement.length; j++)
					{
						if (ship.placement[j] == cell)
						{
							document.getElementById(space).style.backgroundColor = 'red';
							checkSunk(ship);
							if (gameType == 'pvc')
								setTimeout(function(){ compTurn(); }, 500);
							return;
						}
					}
				}
				document.getElementById(space).style.backgroundColor = 'blue';
				turn = 'p1';
				document.getElementById('turn').innerHTML = "Player 1's Turn";
				setTimeout(function() {
					document.getElementById('p2').style.display = 'inline-table';
					document.getElementById('p1').style.display = 'none';
				}, 500);
				return;
			}
		}
		else
			alert("playing out of turn!");
	}
	else {
		if (turn == 'p1')
			return;
		else if (turn == 'p2' && gameType == 'pvp')
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
					if (document.getElementById('p2' + p2ShipArray[i].placement[j]).style.backgroundColor == 'red')
						shots++;
				}
				
				if (shots == p2ShipArray[i].placement.length) {
					document.getElementById('resultboard').innerHTML += "<ul><li>P1: Sunk the "+ship.name+"</li></ul>";
					p2ShipArray.splice(i, 1);
					document.getElementById('p2ShipsLeft').innerHTML = "Ships Left: " + p2ShipArray.length;
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
					if (document.getElementById('p1' + p1ShipArray[i].placement[j]).style.backgroundColor == 'red')
						shots++;
				}
				
				if (shots == p1ShipArray[i].placement.length) {
					if (gameType == 'pvc')
						document.getElementById('resultboard').innerHTML += "<ul><li>Comp: Sunk the "+ship.name+"</li></ul>";
					else if (gameType == 'pvp')
						document.getElementById('resultboard').innerHTML += "<ul><li>P2: Sunk the "+ship.name+"</li></ul>";
					p1ShipArray.splice(i, 1);
					document.getElementById('p1ShipsLeft').innerHTML = "Ships Left: " + p1ShipArray.length;
					if (p1ShipArray.length == 0)
						gameOver('p2');
				}
				
			}
		}
	} 
}

function gameOver(winner) {
	hideAll();
	document.getElementById('gameOver').style.display = 'table-cell';

	if (winner == 'p1')
		document.getElementById('winner').innerHTML = "Player 1 Wins!!";
	else if (winner == 'p2' && gameType == 'pvp')
		document.getElementById('winner').innerHTML = "Player 2 Wins!!";
	else if (winner == 'p2' && gameType == 'pvc')
		document.getElementById('winner').innerHTML = "The Computer Wins :(";
}


function compTurn() {
	
	//show computer turn!
	turn = 'p2';
	if (gameType == 'pvc')
		document.getElementById('turn').innerHTML = "Computer's Turn";
	else if (gameType == 'pvp')
		document.getElementById('turn').innerHTML = "Player 2's Turn";

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
		if (document.getElementById(cell).style.backgroundColor != 'red' && document.getElementById(cell).style.backgroundColor != 'blue')
		{
			validShot = true;
			Fire(cell);
		}
	}
}


/*---Misc game play functions---*/

function hideAll() {
	document.getElementById('playerCount').style.display = 'none';
	document.getElementById('setupPlayer1').style.display = 'none';
	document.getElementById('gameboard').style.display = 'none';
	document.getElementById('gameOver').style.display = 'none';
	document.getElementById('header').style.display = 'none';
	document.getElementById('footer').style.display = 'none';
}

//set up the div heights based on window innerHeight
function setUpPage() {
	var height = window.innerHeight;
	var width = window.innerWidth;

	document.getElementById('header').style.height = (height * 0.3) +"px";
	document.getElementById('header').style.width = width + 'px';
	document.getElementById('gamewrapper').style.width = width +"px";
	if (document.getElementById('header').style.display == 'none')
		document.getElementById('gamewrapper').style.height = height + 'px';
	else
		document.getElementById('gamewrapper').style.height = (height * 0.6) +"px";
	document.getElementById('footer').style.width = width + "px";
	document.getElementById('footer').style.height = (height * 0.1) + "px";


	var elements = document.getElementsByClassName('game');
	for (var i = 0, length = elements.length; i < length; i++)
		elements[i].style.width = width + "px";
}

//function to dynamically build a game board
function buildBoard() {
	var table = document.getElementById('board');

	for (var i = 0; i < 8; i++) {
		var rowString = "<tr>";

		for (var j = 0; j < 8; j++)
			rowString += "<td id='"+i+""+j+"' onclick='placeCurrentPiece(\""+i+''+j+"\")'></td>"; 
		
		rowString += "</tr>";
		table.innerHTML += rowString;
	}
}

function clearBoard() {
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++)
			document.getElementById(i+''+j).style.backgroundColor = 'gray';
	}
}

window.onload = function() {
	setUpPage();
	buildBoard();
	document.getElementById('date').innerHTML = new Date().getFullYear();
	hideAll();
	document.getElementById('playerCount').style.display = 'table-cell';
	document.getElementById('header').style.display = 'table-cell';
	document.getElementById('footer').style.display = 'table-cell';
}

window.onresize = function() {
	setUpPage();
}