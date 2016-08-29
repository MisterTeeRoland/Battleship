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
	//setUpCompPieces();
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
		var currentPiece = p2Ship;
		var pieceDirection = p2Direction;
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

	//if (turn == 'p2')
		//(validMove) ? alert('valid!') : alert('not valid!');

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
				//removeShip(tempShip); 
				//break;
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

		//alert(ship.name + " covers " + ship.placement.toString());
		if (turn == 'p1')
			p1ShipArray[p1ShipArray.length] = ship;
		else if (turn == 'p2') {
			p2ShipArray[p2ShipArray.length] = ship; 
			//alert("p2 ships: " + p2ShipArray.length);
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
		clearBoard();
		turn = 'p2';
		//alert(turn + " turn!");
		setUpCompPieces();
	}
	else if (turn == 'p2')
	{
		if (p2ShipArray.length == 5) {
			turn = 'p1';
			//alert('Start game!');
			startGame();
		}
		else
			setUpCompPieces();
	}
	//else 
		//alert("p1ShipArray = " + p1ShipArray.length);
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
			{
				//alert("Another ship here...background = " + document.getElementById(row+''+col).style.backgroundColor);
				return false;
			}
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
	var usedShips = [];

	//pick a random ship and a random direction
	p2Ship = shipArray[Math.floor(Math.random()*5)];
	p2Direction = directionArray[Math.floor(Math.random()*2)];
	
	//pick a random cell
	var row = Math.floor(Math.random()*8);
	var col = Math.floor(Math.random()*8);
	var cell = (row+''+col);

	//try to place ship and update array
	//alert('trying to place ' + p2Ship + ' , ' + p2Direction + ', at cell ' + cell);
	placeCurrentPiece(cell);
	
}

function startGame() {
	//alert("starting game!");

	//hide set up board
	hideAll();
	//document.getElementById('setupPlayer1').style.display = 'none';
	setUpGameBoard();
	document.getElementById('gameboard').style.display = 'table-cell';
	document.getElementById('p1ShipsLeft').innerHTML = "Ships Left: " + p1ShipArray.length;
	document.getElementById('p2ShipsLeft').innerHTML = "Ships Left: " + p2ShipArray.length;

	//show full game map, start player 1
}

function setUpGameBoard() {
	//set up p1 table
	var table = document.getElementById('p1board');

	for (var i = 0; i < 8; i++) {
		var rowString = "<tr>";

		for (var j = 0; j < 8; j++)
			rowString += "<td id='p1"+i+""+j+"'></td>"; 
		
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

		var row = space.charAt(2);
		var col = space.charAt(3);
		var cell = row + '' + col;
	
		//check each index of opposing turn's ship array
		if (turn == 'p1') {

			for (var i = 0; i < p2ShipArray.length; i++) {
				var ship = p2ShipArray[i];

				for (var j = 0; j < ship.placement.length; j++)
				{
					if (ship.placement[j] == cell)
					{
						//resultboard.innerHTML += "<ul dir='ltr'><li>P1: fired at " + cell + "...HIT!</li></ul>";
						document.getElementById(space).style.backgroundColor = 'red';
						checkSunk(ship);
						return;
					}
				}
			}
			//resultboard.innerHTML += "<ul dir='ltr'><li>P1: fired at " + cell + "...MISS!</li></ul>";
			document.getElementById(space).style.backgroundColor = 'blue';
			setTimeout(function(){
				compTurn();
			}, 0);
			return;
		}
		else if (turn == 'p2') {
			for (var i = 0; i < p1ShipArray.length; i++) {
				var ship = p1ShipArray[i];

				for (var j = 0; j < ship.placement.length; j++)
				{
					if (ship.placement[j] == cell)
					{
						//alert("Comp hit " + ship.name + " at " + cell);
						document.getElementById(space).style.backgroundColor = 'red';
						checkSunk(ship);
						setTimeout(function(){
							compTurn();
						}, 0);
						return;
					}
				}
			}
			document.getElementById(space).style.backgroundColor = 'blue';
			turn = 'p1';
			return;
		}
	}
	else {
		if (turn == 'p1')
			return;
		else if (turn == 'p2') {
			setTimeout(function(){
				compTurn();
			}, 0);
		}
	}
}

function checkSunk(ship) {
	//check all ships spots
	//alert('checking sunk...');
	if (turn == 'p1') {
		for (var i = 0; i < p2ShipArray.length; i++)
		{
			if (ship.name == p2ShipArray[i].name)
			{
				//alert(ship.name + " == " + p2ShipArray[i].name);
				var shots = 0;
				for (var j = 0; j < p2ShipArray[i].placement.length; j++)
				{
					//alert("checking " + p2ShipArray[i].placement[j] + "...");
					if (document.getElementById('p2' + p2ShipArray[i].placement[j]).style.backgroundColor == 'red')
					{
						//alert('hit shot ' + j + ' of ' + p2ShipArray[i].name);
						shots++;
					}
				}
				
				if (shots == p2ShipArray[i].placement.length) {
					document.getElementById('resultboard').innerHTML += "<ul dir='ltr'><li>P1: Sunk the "+ship.name+"</li></ul>";
					p2ShipArray.splice(i, 1);
					//alert("P2 ships left: " + p2ShipArray.length);
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
				//alert(ship.name + " == " + p2ShipArray[i].name);
				var shots = 0;
				for (var j = 0; j < p1ShipArray[i].placement.length; j++)
				{
					//alert("checking " + p2ShipArray[i].placement[j] + "...");
					if (document.getElementById('p1' + p1ShipArray[i].placement[j]).style.backgroundColor == 'red')
					{
						//alert('hit shot ' + j + ' of ' + p2ShipArray[i].name);
						shots++;
					}
				}
				
				if (shots == p1ShipArray[i].placement.length) {
					document.getElementById('resultboard').innerHTML += "<ul dir='rtl'><li>Comp: Sunk the "+ship.name+"</li></ul>";
					p1ShipArray.splice(i, 1);
					//alert("P1 ships left: " + p1ShipArray.length);
					document.getElementById('p1ShipsLeft').innerHTML = "Ships Left: " + p1ShipArray.length;
					if (p1ShipArray.length == 0)
						gameOver('p2');
				}
				
			}
		}
	} 
}

function updateScore(){
	//go through ship array
		//count # spots with SUNK

	//if either player has score of 5, game over
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
	//alert("Computer's turn");

	var resultboard = document.getElementById('resultboard');
	//resultboard.innerHTML += "<ul dir='rtl'><li>Comp: ... NO SHOTS FIRED!</li></ul>";
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
			//alert("valid shot found at " + cell + ". firing...");
			validShot = true;
			Fire(cell);
		}
	}
	//turn = 'p1';
}



/*---Misc game play functions---*/
function hideAll() {
	document.getElementById('playerCount').style.display = 'none';
	document.getElementById('setupPlayer1').style.display = 'none';
	document.getElementById('gameboard').style.display = 'none';
	document.getElementById('gameOver').style.display = 'none';
}

//set up the div heights based on window innerHeight
function setUpPage() {
	var height = window.innerHeight;
	var width = window.innerWidth;
	document.getElementById('header').style.height = (height * 0.3) +"px";
	document.getElementById('header').style.width = width + 'px';
	document.getElementById('gamewrapper').style.height = (height * 0.6) +"px";
	document.getElementById('gamewrapper').style.width = width +"px";
	document.getElementById('footer').style.height = (height * 0.1) + "px";
	document.getElementById('footer').style.width = width + "px";

	var elements = document.getElementsByClassName('game');
	for (var i = 0, length = elements.length; i < length; i++){
		elements[i].style.height = (height * 0.6) + "px";
		elements[i].style.width = width + "px";
	}
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
}

window.onresize = function() {
	setUpPage();
}