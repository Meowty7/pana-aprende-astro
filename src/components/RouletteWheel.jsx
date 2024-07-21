import {useEffect, useRef, useState} from 'react';

// Define the options for the roulette wheel
const options = ["pregunta1", "pregunta2", "pregunta3", "pregunta4", "pregunta5"];

const RouletteWheel = () => {
    const canvasRef = useRef(null);
    const [spinning, setSpinning] = useState(false);

    useEffect(() => {

        let startAngle = 0;
        const arc = Math.PI / (options.length / 2);
        let spinTimeout = null;

        let spinTime = 0;
        let spinTimeTotal = 0;
        let ctx;

        function byte2Hex(n) {
            const nybHexString = "0123456789ABCDEF";
            return (
                String(nybHexString.substr(n >> 4 & 0x0f, 1)) +
                nybHexString.substr(n & 0x0f, 1)
            );
        }

        function RGB2Color(r, g, b) {
            return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
        }

        function getColor(item, maxitem) {
            const phase = 0;
            const center = 128;
            const width = 127;
            const frequency = Math.PI * 2 / maxitem;

            const red = Math.sin(frequency * item + 2 + phase) * width + center;
            const green = Math.sin(frequency * item + phase) * width + center;
            const blue = Math.sin(frequency * item + 4 + phase) * width + center;

            return RGB2Color(red, green, blue);
        }

        function drawRouvarteWheel() {
            const canvas = canvasRef.current;
            if (canvas && canvas.getContext) {
                const outsideRadius = 200;
                const textRadius = 160;
                const insideRadius = 125;

                ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, 500, 500);

                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;

                ctx.font = 'bold 12px Helvetica, Arial';

                for (let i = 0; i < options.length; i++) {
                    const angle = startAngle + i * arc;
                    ctx.fillStyle = getColor(i, options.length);

                    ctx.beginPath();
                    ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
                    ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
                    ctx.stroke();
                    ctx.fill();

                    ctx.save();
                    ctx.shadowOffsetX = -1;
                    ctx.shadowOffsetY = -1;
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = "rgb(220,220,220)";
                    ctx.fillStyle = "black";
                    ctx.translate(
                        250 + Math.cos(angle + arc / 2) * textRadius,
                        250 + Math.sin(angle + arc / 2) * textRadius
                    );

                    ctx.rotate(angle + arc / 2 + Math.PI / 2);
                    const text = options[i];
                    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                    ctx.restore();
                }

                // Arrow
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
                ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
                ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
                ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
                ctx.lineTo(250, 250 - (outsideRadius - 13));
                ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
                ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
                ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
                ctx.fill();
            }
        }

        let spinAngleStart;

        function rotateWheel() {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }
            const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            startAngle += spinAngle * Math.PI / 180;
            drawRouvarteWheel();
            spinTimeout = setTimeout(rotateWheel, 30); // Pass a reference to the function
        }

        function spin() {
            spinAngleStart = Math.random() * 10 + 10;
            spinTime = 0;
            spinTimeTotal = Math.random() * 3 + 4 * 1000;
            drawRouvarteWheel(); // Redraw the wheel before starting to spin
            rotateWheel();
        }

        drawRouvarteWheel()
        if(spinning){
            spin()
            setSpinning(false)
        }

        function stopRotateWheel() {
            clearTimeout(spinTimeout);
            const degrees = startAngle * 180 / Math.PI + 90;
            const arcd = arc * 180 / Math.PI;
            const index = Math.floor((360 - degrees % 360) / arcd);
            ctx.save();
            ctx.font = "bold 30px Helvetica, Arial";
            const text = options[index];
            ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
            ctx.restore();
        }

        function easeOut(t, b, c, d) {
            const ts = (t /= d) * t;
            const tc = ts * t;
            return b + c * (tc + -3 * ts + 3 * t);
        }
    }, [spinning]);

    function handleClick (){
        setSpinning(true)
    }

    return (
        <>
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 ">
                    <canvas ref={canvasRef} width="500" height="500"></canvas>
                    <button onClick={handleClick} className="bg-blue-500 font-mono float:left rounded p-2 mb-4">
                        GIRA LA RULETA
                    </button>
                </div>

                <div className="ml-8 p-6 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Questions</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium">Question 1:</h3>
                            <p className="text-gray-700">What is the capital of France?</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium">Question 2:</h3>
                            <p className="text-gray-700">Who wrote "To Kill a Mockingbird"?</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium">Question 3:</h3>
                            <p className="text-gray-700">What is the smallest planet in our solar system?</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );

};

export default RouletteWheel;
