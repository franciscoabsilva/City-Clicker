// Target class (position and width)
class Target
{
  constructor(x, y, w, l, id, color)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.label  = l;
    this.id     = id;
    this.color  = color
  }
  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y)
  {
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }
  
  // Draws the target (i.e., a circle)
  // and its label
  draw()
  {
    // Draw target
    fill(this.color);                 
    circle(this.x, this.y, this.width);
    
    // Draw label
    textFont("Arial", 10);
    textStyle(BOLD);
    fill(color(0,0,0));
    textAlign(CENTER);

    // Insert line breaks after every 8 characters
    let formattedLabel = '';
    for (let i = 0; i < this.label.length; i++) {
      formattedLabel += this.label[i];
      if ((i + 1) % 8 === 0 && i !== this.label.length - 1) {
        formattedLabel += '\n';
      }
    }

    text(formattedLabel, this.x, this.y);
  }
}