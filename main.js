function cubicBezier(t, p0, p1, p2, p3) {

    const p0Coefficient = Math.pow((1 - t), 3);
    const p1Coefficient = 3 * Math.pow((1 - t), 2) * t;
    const p2Coefficient = 3 * (1 - t) * Math.pow(t, 2);
    const p3Coefficient = Math.pow((t), 3);

    const x = Math.round((p0Coefficient * p0.x) + (p1Coefficient * p1.x) + (p2Coefficient * p2.x) + (p3Coefficient * p3.x));
    const z = Math.round((p0Coefficient * p0.z) + (p1Coefficient * p1.z) + (p2Coefficient * p2.z) + (p3Coefficient * p3.z));

    return { x, z };
}

function drawAnchorPoints(ctx, p0, p1, p2, p3) {
    ctx.beginPath();
    ctx.arc(p0.x, p0.z, 4, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p1.x, p1.z, 4, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p2.x, p2.z, 4, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p3.x, p3.z, 4, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.moveTo(p0.x, p0.z);
    ctx.lineTo(p1.x, p1.z);

    ctx.moveTo(p2.x, p2.z);
    ctx.lineTo(p3.x, p3.z);
}

function drawPointsArray(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].z);
    for (const point of points) {
        ctx.lineTo(point.x, point.z);
        ctx.arc(point.x, point.z, 2, 0, 2 * Math.PI);
    }
    ctx.lineTo(points[0].x, points[0].z)
    ctx.stroke();
}

function transformPoints(points, scaleFactor) {
    let min = { x: Infinity, z: Infinity };
    for (const point of points) {
        min.x = Math.min(min.x, point.x);
        min.z = Math.min(min.z, point.z);
    }

    for (const point of points) {
        point.x = (point.x + Math.abs(min.x)) * scaleFactor;
        point.z = (point.z + Math.abs(min.z)) * scaleFactor;
    }
}

async function main() {
    const surfacePoints = await (await fetch('pointsArray.json')).json();
    console.log(surfacePoints);

    const points = [];

    const oneOverSegmentCount = 1 / 20;

    // These are the control points.
    const p0 = { x: 10, z: 10 };
    const p1 = { x: 310, z: 10 };
    const p2 = { x: 410, z: 110 };
    const p3 = { x: 410, z: 410 };

    const ctx = document.getElementById('canvas').getContext('2d');
    const plotterCtx = document.getElementById('plotter').getContext('2d');

    drawAnchorPoints(ctx, p0, p1, p2, p3);
    transformPoints(surfacePoints, 1);
    drawPointsArray(plotterCtx, surfacePoints);

    ctx.moveTo(p0.x, p0.z);
    for (let i = 0; i < 1; i += oneOverSegmentCount) {
        const p = cubicBezier(i, p0, p1, p2, p3);
        points.push(p);
        ctx.arc(p.x, p.z, 2, 0, 2 * Math.PI);
        ctx.lineTo(p.x, p.z);
    }

    ctx.stroke()

    document.getElementById('points').innerHTML = JSON.stringify(points);
}

window.addEventListener('DOMContentLoaded', main);
