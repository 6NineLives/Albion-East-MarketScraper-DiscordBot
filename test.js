const ChartJsImage = require('chartjs-to-image');
const { createCanvas, loadImage } = require('canvas')
const fs = require('node:fs');

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    fs.writeFileSync(filename, u8arr, { type: mime });
}

async function main() {
    const chart = new ChartJsImage();
    chart.setConfig({
        type: "line",
        data: {
            labels: ['04/04 00', '04/04 12', '04/05 00', '04/05 12', '04/06 00', '04/06 12', '04/07 00'],
            datasets: [
                {
                    label: 'Bridgewatch',
                    borderColor: '#c5641c',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    data: [57, 90, 11, -15, 37, -37, -27],
                },
                // {
                //     label: 'Martlock',
                //     borderColor: '#0087ff',
                //     backgroundColor: 'rgba(0, 0, 0, 0)',
                //     data: [71, -36, -94, 78, 98, 65, -61],
                // },
                // {
                //     label: 'Lymhurst',
                //     borderColor: '#95b83e',
                //     backgroundColor: 'rgba(0, 0, 0, 0)',
                //     data: [48, -64, -61, 98, 0, -39, -70],
                // },
                // {
                //     label: 'Carleon',
                //     borderColor: '#a30096',
                //     backgroundColor: 'rgba(0, 0, 0, 0)',
                //     data: [-58, 88, 29, 44, 3, 78, -9],
                // },
            ],
        },
        options: {
            legend: {
                labels: {
                    fontFamily: "Serif",
                    fontColor: "white",
                    fontSize: 12,
                }
            },
            title: {
                display: true,
                text: "Hide 4.1",
                fontFamily: "Serif",
                fontColor: "white",
                fontSize: 20
            },

            scales: {
                yAxes: [{
                    ticks: {
                        fontFamily: "Serif",
                        fontColor: "white",
                        fontSize: 10,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time line',
                        fontFamily: "Serif",
                        fontColor: "white",
                        fontSize: 12
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontFamily: "Serif",
                        fontColor: "white",
                        fontSize: 10,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Price',
                        fontFamily: "Serif",
                        fontColor: "white",
                        fontSize: 12
                    }
                }]
            }
        }
    });
    chart.setWidth(660).setHeight(260).setBackgroundColor('#2C2F33');
    await chart.toFile('chart.png');
    const canvas = createCanvas(700, 300)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#2C2F33';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var img = await loadImage('chart.png')
    await ctx.drawImage(img, 20, 20, 660, 260)
    var img2 = await loadImage('https://render.albiononline.com/v1/item/T4_HIDE_LEVEL1.png')
    await ctx.drawImage(img2, 700 - 45 - 20, 20, 45, 45);
    const buffer = canvas.toDataURL('image/png')
    dataURLtoFile(buffer, 'chart_final.png')
}
main();