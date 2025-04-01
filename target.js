// Target class (position and width)
class Target {
  constructor(x, y, w, l, id, color) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.label = l;
    this.id = id;
    this.color = color
  }

  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y) {
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }

  // Draws the target (i.e., a circle)
  // and its label
  draw() {
    // Draw target
    fill(this.color);
    circle(this.x, this.y, this.width);

    // Draw label
    /*
    ISTO FAZ DOS FONT SIZES MELHORZINHOS
    let fontSize = Math.min(this.width / 4, 100 / this.label.length); // Adjust font size dynamically
    textFont("Arial", fontSize);
    if (this.label.length > 10) {
      textFont("Arial", Math.min(this.width / 4, 220 / this.label.length)); // Adjust font size dynamically
    }
    */
    textFont("Arial", 12);
    textStyle(BOLD);
    fill(color(0, 0, 0));
    textAlign(CENTER);

    // Insert line breaks after every 8 characters
    let formattedLabel = '';
    for (let i = 0; i < this.label.length; i++) {
      formattedLabel += this.label[i];
      if ((i + 1) % 10 === 0 && i !== this.label.length - 1) {
        formattedLabel += '\n';
      }
    }

    text(formattedLabel, this.x, this.y);


    // ISTO SERVE PARA TER AS 3 LETRAS EM CIMA DO TARGET
    /*
    // Draw the first three letters of the city in big text
    let cityAbbreviation = this.label.substring(0, 3).toUpperCase();
    textFont("Arial", 15); // Bigger font size
    textStyle(BOLD);
    fill(color(255)); // Red color for emphasis
    text(cityAbbreviation, this.x, this.y - 20); // Position below the label
    */
  }
}