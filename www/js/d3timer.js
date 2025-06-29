
function createD3Timer(duration, onComplete, options = {}) {
  const {
    selector = "body",     // parent to insert timer into
    id = "d3-timer",       // ID to assign to timer container
    position = "top-right", // one of: top-right, top-left, bottom-right, bottom-left
    refreshInterval=100,
    yMargin="50px",
    xMargin="50px",
    fillColor="#8573af"
  } = options;

  const size = 150;
  const radius = size / 2 - 10;

  // Remove any previous timer with same ID
  d3.select(`#${id}`).remove();

  // Create container div
  const container = d3.select(selector)
    .append("div")
    .attr("id", id)
    .style("position", "absolute")
    .style("width", `${size}px`)
    .style("height", `${size}px`)
    .style("z-index", 1000);

  // Positioning
  switch (position) {
    case "top-left":
      container.style("top", yMargin).style("left", xMargin);
      break;
    case "top-right":
      container.style("top", yMargin).style("right", xMargin);
      break;
    case "bottom-left":
      container.style("bottom", yMargin).style("left", xMargin);
      break;
    case "bottom-right":
      container.style("bottom", yMargin).style("right", xMargin);
      break;
    case "top-middle":
      container
        .style("top", yMargin)
        .style("left", "50%")
        .style("transform", "translateX(-50%)");
    default:
      container.style("top", yMargin).style("right", xMargin);
  }

  // Add SVG
  const svg = container
    .append("svg")
    .attr("width", size)
    .attr("height", size)
    .append("g")
    .attr("transform", `translate(${size / 2}, ${size / 2})`);

  const background = svg.append("path").attr("fill", "#eee");
  const foreground = svg.append("path").attr("fill", fillColor);
  const text = svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("font-size", "24px")
    .text(duration);

  const arc = d3.arc()
    .innerRadius(radius - 10)
    .outerRadius(radius)
    .startAngle(0);

  background.datum({ endAngle: 2 * Math.PI }).attr("d", arc);
  foreground.datum({ endAngle: 2 * Math.PI }).attr("d", arc);

  let timeLeft = duration;
  const total = duration;

  const interval = d3.interval(() => {
    timeLeft-=(refreshInterval/1000);
    const progress = timeLeft / total;
    foreground.datum({ endAngle: 2 * Math.PI * progress }).attr("d", arc);
    text.text(parseInt(timeLeft));

    if (timeLeft <= 0) {
      interval.stop();
      foreground.datum({ endAngle: 0 }).attr("d", arc);
      text.text("0");
      if (typeof onComplete === "function") onComplete();
    }
  }, refreshInterval);
}