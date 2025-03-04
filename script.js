const projects = [
  { id: 1, name: "Vehicle Control Unit", description: "A system to implement CANbus communication.", url: "#", imageUrl: "img/microp.png" },
  { id: 2, name: "Custom STM32 CAN Node", description: "Control system for robotics using microcontrollers.", url: "#", imageUrl: "img/microp.png" },
  { id: 3, name: "FSAE", description: "A project for calibrating sensors in an automotive system.", url: "#", imageUrl: "img/motorsport.png" },
  { id: 4, name: "Hand Sign Detection", description: "Model for bicycle simulation in robotics.", url: "#", imageUrl: "img/hand.png" },
  { id: 5, name: "Sorting Robot", description: "Model for bicycle simulation in robotics.", url: "#", imageUrl: "img/arm.png" },
  { id: 6, name: "Robotic Art Installation", description: "Model for bicycle simulation in robotics.", url: "#", imageUrl: "img/origami.png" },
  { id: 7, name: "Inverse Kinematics Geo", description: "Model for bicycle simulation in robotics.", url: "#", imageUrl: "img/ik_urp.png" },
  { id: 8, name: "Photonics", description: "Model for bicycle simulation in robotics.", url: "#", imageUrl: "img/photonics.jpg" }
];

// Set up the canvas
const width = 800, height = 600;
const svg = d3.select("#canvas").attr("width", width).attr("height", height);

// Define the list of connections (links between nodes)
const links = [
  { source: 1, target: 2 },
  { source: 2, target: 3 },
  { source: 4, target: 5 },
  { source: 5, target: 6 },
  { source: 5, target: 7 }
];

// Define the nodes from the projects array
const nodes = projects.map(project => ({ id: project.id, name: project.name, imageUrl: project.imageUrl }));

// Set up the simulation
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(width / 2, height / 2));

// Define a pattern for the twisted wire effect (using repeating pattern instead of a linear gradient)
const pattern = svg.append("defs")
  .append("pattern")
  .attr("id", "twistedWirePattern")
  .attr("width", 10)
  .attr("height", 10)
  .attr("patternUnits", "userSpaceOnUse");

pattern.append("rect")
  .attr("width", 5)
  .attr("height", 10)
  .style("fill", "#FFCC00");  // Yellow part of the twisted pair

pattern.append("rect")
  .attr("x", 5)
  .attr("width", 5)
  .attr("height", 10)
  .style("fill", "#00FF00");  // Green part of the twisted pair

// Create a link group to hold links and apply the twisted wire pattern
const linkGroup = svg.append("g").selectAll(".link")
  .data(links)
  .enter().append("path")
  .attr("class", "link")
  .style("fill", "none")
  .style("stroke", "url(#twistedWirePattern)")  // Apply repeating pattern for twisted wire look
  .style("stroke-width", 3)
  .style("stroke-linecap", "round")
  .style("stroke-dasharray", "0");  // Remove dashed effect for a solid wire

// Add nodes
const node = svg.append("g")
  .selectAll(".node")
  .data(nodes)
  .enter().append("image")
  .attr("class", "node")
  .attr("x", d => d.x - 25)  // Position image
  .attr("y", d => d.y - 25)  // Position image
  .attr("width", 50)  // Adjust image size
  .attr("height", 50)  // Adjust image size
  .attr("xlink:href", d => d.imageUrl)  // Set image source
  .call(d3.drag()  // Add drag behavior to the nodes
      .on("start", dragStart)
      .on("drag", dragging)
      .on("end", dragEnd))
  .on("click", (event, d) => displayDetails(d));  // Display project details on click

// Node labels (the names of the projects)
svg.append("g")
  .selectAll(".label")
  .data(nodes)
  .enter().append("text")
  .attr("class", "label")
  .attr("dx", 30)
  .attr("dy", ".35em")
  .text(d => d.name);

// Update the simulation on each tick
simulation.on("tick", () => {
  nodes.forEach(d => {
    d.x = Math.max(25, Math.min(width - 25, d.x));
    d.y = Math.max(25, Math.min(height - 25, d.y));
  });

  linkGroup
      .attr("d", d => {
          const curvature = 0.3; // Adjust curvature for twist effect
          const sourceX = d.source.x;
          const sourceY = d.source.y;
          const targetX = d.target.x;
          const targetY = d.target.y;
          const dx = targetX - sourceX;
          const dy = targetY - sourceY;
          const dr = Math.sqrt(dx * dx + dy * dy) * curvature; // Control the twist strength
          return `M${sourceX},${sourceY}C${sourceX + dr},${sourceY} ${targetX - dr},${targetY} ${targetX},${targetY}`;
      });

  node
    .attr("x", d => d.x - 25)  // Center img based on position
    .attr("y", d => d.y - 25); // Center img based on position

  svg.selectAll(".label")
      .attr("x", d => d.x)
      .attr("y", d => d.y);
});

// Drag event functions
function dragStart(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragging(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnd(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// Function to display project details when a node is clicked
function displayDetails(node) {
  const project = projects.find(p => p.id === node.id);
  const detailsDiv = document.getElementById("details");
  detailsDiv.innerHTML = `<h3>${project.name}</h3><p>${project.description}</p><a href="${project.url}">Project Link</a>`;
  detailsDiv.style.display = "block";
}


document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const resetBtn = document.getElementById("reset-btn");

  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  nav.addEventListener("mousedown", (event) => {
      isDragging = true;
      nav.classList.add("dragging");

      offsetX = event.clientX - nav.getBoundingClientRect().left;
      offsetY = event.clientY - nav.getBoundingClientRect().top;
  });

  document.addEventListener("mousemove", (event) => {
      if (!isDragging) return;

      let newX = event.clientX - offsetX;
      let newY = event.clientY - offsetY;

      newX = Math.max(0, Math.min(window.innerWidth - nav.offsetWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - nav.offsetHeight, newY));

      nav.style.left = `${newX}px`;
      nav.style.top = `${newY}px`;
  });

  document.addEventListener("mouseup", () => {
      isDragging = false;
      nav.classList.remove("dragging");
  });

  // Reset Button - Moves Navbar Back to Original Position
  resetBtn.addEventListener("click", () => {

      // Add transition only when resetting
      nav.style.transition = "background 0.2s, left 0.3s, top 0.3s"; 

      nav.style.left = "20px";
      nav.style.top = "50px";


      // Remove transition after animation completes (300ms)
      setTimeout(() => {
        nav.style.transition = "background 0.2s";
    }, 300);  // Match the duration of the transition
  });
});
