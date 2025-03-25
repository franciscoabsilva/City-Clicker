// Bake-off #2 -- Seleção em UIs Densas
// IPM 2024-25, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sétimo lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 31 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 31; // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE = false; // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS = 12; // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas; // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime; // time between the start and end of one attempt (8 trials)
let hits = 0; // number of successful selections
let misses = 0; // number of missed selections (used to calculate accuracy)
let database; // Firebase DB

// Study control parameters (DO NOT CHANGE!)
let draw_targets = false; // used to control what to show in draw()
let trials; // contains the order of targets that activate in the test
let current_trial = 0; // the current trial number (indexes into trials array above)
let attempt = 0; // users complete each test twice to account for practice (attemps 0 and 1)

// Target list and layout variables
let targets = [];
const GRID_ROWS = 8; // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS = 10; // We divide our 80 targets in a 8x10 grid

const colorPalette = {
  'A': ['#FF6B6B'], // Red
  'B': ['#4ECDC4'], // Teal
  'C': ['#FFD166'], // Yellow
  'D': ['#06D6A0'], // Green
  'E': ['#118AB2'], // Blue
  'F': ['#EF476F'], // Pink
  'G': ['#7D5BA6'], // Purple
  'H': ['#FF9A00'], // Orange
  'I': ['#00B4D8'], // Light blue
  'J': ['#9C6644'], // Brown
  'K': ['#6A4C93'], // Deep purple
  'L': ['#2EC4B6'], // Turquoise
  'M': ['#E71D36'], // Bright red
  'N': ['#FF9F1C'], // Gold
  'O': ['#588B8B'], // Muted teal
  'P': ['#C5AFA4'], // Beige
  'Q': ['#355070'], // Slate blue
  'R': ['#B56576'], // Dusty rose
  'S': ['#F4A261'], // Peach
  'T': ['#E56B6F'], // Coral pink
  'U': ['#84A59D'], // Sage green
  'V': ['#F4A261'], // Mauve
  'W': ['#2A9D8F'], // Green-blue
  'X': ['#E9C46A'], // Mustard
  'Y': ['#F4A261'], // Orange (light)
  'Z': ['#264653']  // Dark teal
};

// Ensures important data is loaded before the program starts
function preload() {
  // Carrega a tabela de legendas e ordena alfabeticamente
  legendas = loadTable('legendas/G_' + GROUP_NUMBER + '.csv', 'csv', 'header', function () {
    // Ordena as linhas da tabela alfabeticamente
    legendas.rows.sort((a, b) => {
      const nameA = a.getString(1).toLowerCase(); // Coluna 1 contém os nomes dos países
      const nameB = b.getString(1).toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    // Atualiza os IDs para refletir a nova ordem
    for (let i = 0; i < legendas.getRowCount(); i++) {
      legendas.setNum(i, 0, i + 1); // Atualiza o ID na coluna 0
    }
  });
}

// Runs once at the start
function setup() {
  createCanvas(700, 500); // window size in px before we go into fullScreen()
  frameRate(60); // frame rate (DO NOT CHANGE!)

  randomizeTrials(); // randomize the trial order at the start of execution
  drawUserIDScreen(); // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw() {
  if (draw_targets && attempt < 2) {
    // The user is interacting with the 6x3 target grid
    background(color(0, 0, 0)); // Altere aqui a cor do fundo

    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255, 255, 255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

    // Draw all targets
    for (let i = 0; i < legendas.getRowCount(); i++) {
      targets[i].draw();
    }

    // Draws the target label to be selected in the current trial. We include
    // a black rectangle behind the trial label for optimal contrast in case
    // you change the background colour of the sketch (DO NOT CHANGE THESE!)
    fill(color(0, 0, 0));
    rect(0, height - 40, width, 40);

    textFont("Arial", 20);
    fill(color(255, 255, 255));
    textAlign(CENTER);
    text(legendas.getString(trials[current_trial], 1), width / 2, height - 20);
  }
}

// Print and save results at the end of 12 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
  if (draw_targets) {
    for (let i = 0; i < legendas.getRowCount(); i++) {
      // Check if the user clicked over one of the targets
      if (targets[i].clicked(mouseX, mouseY)) {
        // Checks if it was the correct target
        if (targets[i].id === trials[current_trial] + 1) {
          hits++;
        } else {
          misses++;
        }

        current_trial++; // Move on to the next trial/target
        break;
      }
    }

    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS) {
      testEndTime = millis();
      draw_targets = false; // Stop showing targets and the user performance results
      printAndSavePerformance(); // Print the user's results on-screen and send these to the DB
      attempt++;

      // If there's an attempt to go create a button to start this
      if (attempt < 2) {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width / 2 - continue_button.size().width / 2, height / 2 - continue_button.size().height / 2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) {
      testStartTime = millis();
    }
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {
  // Re-randomize the trial order
  randomizeTrials();

  // Resets performance variables
  hits = 0;
  misses = 0;

  current_trial = 0;
  continue_button.remove();

  // Shows the targets again
  draw_targets = true;
}

// Group cities by their starting letter
function groupCitiesByLetter() {
  let groupedCities = {};
  for (let i = 0; i < legendas.getRowCount(); i++) {
    let city = legendas.getString(i, 1);
    let firstLetter = city.charAt(0).toUpperCase();
    if (!groupedCities[firstLetter]) {
      groupedCities[firstLetter] = [];
    }
    groupedCities[firstLetter].push({ id: legendas.getNum(i, 0), name: city });
  }
  return groupedCities;
}

// Creates and positions the UI targets
function createTargets(target_size, horizontal_gap, vertical_gap) {
  let groupedCities = groupCitiesByLetter();
  let letters = Object.keys(groupedCities).sort();

  target_size = 55;
  const max_letters_per_row = 6;

  // Define the margins between targets by dividing the white space
  const h_margin = horizontal_gap / (GRID_COLUMNS - 1);
  const v_margin = vertical_gap / (GRID_ROWS - 1);

  // Set targets in a grid with boxes for each letter
  let row = 0;
  let col = 0;
  for (let letter of letters) {
    // Draw the box for the letter
    let box_x = 40 + (h_margin + target_size * 3.15) * col;
    let box_y = 40 + (v_margin + target_size * 3.15) * row;


    let letterColor = color(random(255), random(255), random(255));
    //let letterColor = colorPalette[letter];
    // TODO TENHO A COLOR PALETTE LÁ EM CIMA, ORGANIZAR POR DEGRADÉ, POR ENQT DEIXEI ALEATÓRIO

    // Draw the letter 
    fill(letterColor);
    textFont("Arial", 24);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(letter, box_x + (target_size * 3)/2, box_y - 20);
    // TODO NAO CONSIGO DESENHAR A LETRA, QD FIZERMOS ISTO PROVAVELMENTE VAMOS TER Q DIMINUIR O TRAMANHO DOS CIRCULOS

    // Draw the cities inside the box
    let cityIndex = 0;
    for (let city of groupedCities[letter]) {
      const target_x = box_x + (target_size + 5) * (cityIndex % 3) + target_size / 2;
      const target_y = box_y + (target_size + 5) * Math.floor(cityIndex / 3) + target_size;
      
      const target = new Target(target_x, target_y, target_size, city.name, city.id, letterColor);
      targets.push(target);
      cityIndex++;
    }

    col++;
    if (col >= max_letters_per_row) {
      col = 0;
      row++;
    }
  }
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {
  if (fullscreen()) {
    resizeCanvas(windowWidth, windowHeight);

    // DO NOT CHANGE THE NEXT THREE LINES!
    let display = new Display({ diagonal: display_size }, window.screen);
    PPI = display.ppi; // calculates pixels per inch
    PPCM = PPI / 2.54; // calculates pixels per cm

    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width = display.width * 2.54; // screen width
    let screen_height = display.height * 2.54; // screen height
    let target_size = 2; // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - target_size * GRID_COLUMNS; // empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap = screen_height - target_size * GRID_ROWS; // empty space in cm across the y-axis (based on 8 targets per column)

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createTargets(target_size * PPCM, horizontal_gap * PPCM - 80, vertical_gap * PPCM - 80);

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}