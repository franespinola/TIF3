export function createZigZagPath(x0, y0, x1, y1, amplitude = 15, segments = 6) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const angle = Math.atan2(dy, dx);
    let path = `M ${x0},${y0}`;
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const xBase = x0 + dx * t;
      const yBase = y0 + dy * t;
      const sign = i % 2 === 0 ? 1 : -1;
      const perpAngle = angle + Math.PI / 2;
      const xPeak = xBase + sign * amplitude * Math.cos(perpAngle);
      const yPeak = yBase + sign * amplitude * Math.sin(perpAngle);
      path += ` L ${xPeak},${yPeak}`;
    }
    path += ` L ${x1},${y1}`;
    return path;
  }
  
  export function createRoundedWavePath(
    x0,
    y0,
    x1,
    y1,
    amplitude = 10,
    frequency = 4
  ) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const angle = Math.atan2(dy, dx);
    let path = `M ${x0},${y0}`;
    for (let i = 1; i <= frequency; i++) {
      const t0 = (i - 1) / frequency;
      const t1 = i / frequency;
      const xStart = x0 + dx * t0;
      const yStart = y0 + dy * t0;
      const xEnd = x0 + dx * t1;
      const yEnd = y0 + dy * t1;
      const xMid = (xStart + xEnd) / 2;
      const yMid = (yStart + yEnd) / 2;
      const perpAngle = angle + Math.PI / 2;
      const sign = i % 2 === 0 ? 1 : -1;
      const xCtrl = xMid + sign * amplitude * Math.cos(perpAngle);
      const yCtrl = yMid + sign * amplitude * Math.sin(perpAngle);
      path += ` Q ${xCtrl},${yCtrl} ${xEnd},${yEnd}`;
    }
    return path;
  }
  