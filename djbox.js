p5.prototype.djBox = function () {
  let x = getMidi(20, windowWidth, undefined);
  let y = getMidi(21, windowHeight, undefined);
  let scaleF = getMidi(22, 1, undefined);
  let size = getMidi(22, 500, undefined);
  let opacity = getMidi(23, 1, undefined);
  let blindTheDJMode = false;

  fill(0, 0);

  let offsetx = getMidi(10, width, width / 2) - width / 2;
  let offsety = getMidi(11, height, height / 2) - height / 2;

  if (size === 0) {
    return;
  }

  translate(-offsetx, -offsety);

  let rectWidth = (size ?? 0) * 3;
  let rectHeight = size ?? 0;

  if (blindTheDJMode) {
    fill(255, 0);
    stroke(0);
    strokeWeight(1500);
    rect(x ?? 0, y ?? 0, rectWidth * 4, rectHeight * 10);

    strokeWeight(C.strokeWeight);
  } else {
    fill(0, opacity);
    rect(x ?? 0, y ?? 0, rectWidth, rectHeight);
  }
};
