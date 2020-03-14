import React, { useState, useEffect, useRef } from "react"
import "../assets/sass/graph_canvas.scss"


const x = () => {

    const theCanvas = useRef(null)
    const graphWorkArea = useRef(null)

    let currentScale = 40

    const adjustPixelLength = (val) => {
        if(val % 2 === 0){
            return val + 0.5
        }

        else return val 
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    useEffect(() => {
        let c = theCanvas.current
        let ctx = c.getContext("2d")

        // DETECT MOUSE SCROLL UP AND DOWN
        // DETECT MOUSE SCROLL UP AND DOWN
        const zoomWorkarea = (e) => {
            let sign = Math.sign(e.deltaY)
            if(sign > 0 && currentScale > 10){
                currentScale-=5
            }
    
            else if(sign < 0 && currentScale < 500){
                currentScale+=5
            }
    
            if(currentScale % 3 === 0){
                updateGraph(currentScale, ctx)
            }

        }

        window.addEventListener("wheel", zoomWorkarea)


        function animate( time ) {
            updateGraph(currentScale, ctx)
            requestAnimationFrame( animate )
        }

        requestAnimationFrame( animate )

        
        
        // changeGraph("division-space-1513431", currentScale)

        
    }, [])

    const updateGraph = (graphDivSpace, ctx) => {
        theCanvas.current.width = graphWorkArea.current.scrollWidth
        theCanvas.current.height = graphWorkArea.current.scrollHeight

        

        const createAxes = (scaleSpace) => {
            let xWidth = theCanvas.current.width, yHeight = theCanvas.current.height

            function subAxes(){
                
                ctx.beginPath ()
                let numberOfDivisions = Math.floor(
                    xWidth / scaleSpace
                )

                let count = 0
    
                while(count < numberOfDivisions){
                    
                    // create -ve horizontals
                    ctx.moveTo(adjustPixelLength(0), adjustPixelLength((count * scaleSpace) + yHeight / 2) )
                    ctx.lineTo(adjustPixelLength(xWidth), adjustPixelLength((count * scaleSpace) + yHeight / 2) )
                    ctx.strokeStyle = "#CCCCCC"
                    ctx.stroke()

                    // create +ve horizontals
                    ctx.moveTo(adjustPixelLength(0), adjustPixelLength((-count * scaleSpace) + yHeight / 2) )
                    ctx.lineTo(adjustPixelLength(xWidth), adjustPixelLength((-count * scaleSpace) + yHeight / 2) )
                    ctx.strokeStyle = "#CCCCCC"
                    ctx.stroke()

                    // create -ve verticals
                    ctx.moveTo(adjustPixelLength((-count * scaleSpace) + xWidth / 2) , adjustPixelLength(0))
                    ctx.lineTo(adjustPixelLength((-count * scaleSpace) + xWidth / 2) , adjustPixelLength(yHeight))
                    ctx.strokeStyle = "#CCCCCC"
                    ctx.stroke()

                    // create +ve verticals
                    ctx.moveTo(adjustPixelLength((count * scaleSpace) + xWidth / 2) , adjustPixelLength(0))
                    ctx.lineTo(adjustPixelLength((count * scaleSpace) + xWidth / 2) , adjustPixelLength(yHeight))
                    ctx.strokeStyle = "#CCCCCC"
                    ctx.stroke()

                    count++
                }
            }
            

            function mainAxes(){

                ctx.beginPath ()
                ctx.strokeStyle = "#000000"
                ctx.moveTo(xWidth/2,0)
                ctx.lineTo(xWidth/2,yHeight)
                ctx.stroke()

                ctx.moveTo(0,yHeight/2)
                ctx.lineTo(xWidth,yHeight/2)
                ctx.stroke()
            }

            subAxes()
            mainAxes()
        }

        createAxes(graphDivSpace)

        let obj1 = {
            posX : 290,
            posY : 200,
            mass : 2
        },
        obj2 = {
            posX : -100,
            posY : -100,
            mass : 3
        }

        const simulateGravity = (firstObj, secondObj) => {
            let newCor1 = shiftCoordinates(firstObj.posX, firstObj.posY),
            newCor2 = shiftCoordinates(secondObj.posX, secondObj.posY)

            let x1 = newCor1.xNew, y1 = newCor1.yNew,
                x2 = newCor2.xNew, y2 = newCor2.yNew

            ctx.beginPath()
            ctx.arc(x1, y1, obj1.mass, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.fill()

            ctx.beginPath()
            ctx.strokeStyle = "#29abe2"
            ctx.fillStyle = "#29abe2"
            ctx.arc(x2, y2, obj2.mass, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.fill()


            let R = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y1 - y2), 2))
            let normalizedDirection = {
                x : ((x1 - x2) / R) ,
                y : ((y1 - y2) / R)
            }

            let G = 0.1, t = 0, u = 0.1

            let startSim = setInterval(() => {
                let s2 = (u * t) + (1 / 2 * ( G * (obj1.mass) / Math.pow(R, 2) ) * t * t)
                // // ctx.clearRect(0, 0, c.width, c.height)
                // // new position for obj1
                ctx.beginPath()
                ctx.strokeStyle = "red"
                ctx.fillStyle = "red"
                ctx.arc(
                    normalizedDirection.x * s2 + x2, 
                    normalizedDirection.y * s2 + y2,
                    obj1.mass, 
                    0, 
                    2 * Math.PI
                )
                ctx.stroke()
                ctx.fill()

                t+= 100

                if(t > 2180){
                    clearInterval(startSim)
                }

            }, 100)


        }

        // simulateGravity(obj1, obj2)

        

        const makeHyperbola = (a, b) => {
            let x = -10
            while(x < 10){

                const yFunction = (x) => {
    
                    let y = (x * x / 2) + (2 / x)
                    // // Math.pow(100 - (x * x), 1/2)
                    // // getRandomArbitrary(-500, 500)
                    // // Math.sqrt( ((b * x * x / a)) - 1)
                    // // +
                    // Math.pow((10 - x * x ), 1/2) 
                    // // + Math.sin(x)
                    // // + Math.sin(x)
                    // // + Math.tan(x)
    
                    ctx.beginPath()
                    // ctx.strokeStyle = "#29abe2"
                    ctx.arc(shiftCoordinates(x, -y).xNew, shiftCoordinates(x, -y).yNew, getRandomArbitrary(0,0.8), 0, 2 * Math.PI)
                    ctx.stroke()
                    ctx.fill()
    
                    return y
                }
    
                let newCor = shiftCoordinates(x, yFunction(x))
    
                ctx.beginPath()
                ctx.strokeStyle = "#000000"
                ctx.arc(newCor.xNew, newCor.yNew, 0.7, 0, 2 * Math.PI)
                ctx.stroke()
                ctx.fill()
    
                x = x + 0.05
            }
        }

        makeHyperbola(2, 5)
    }

    const shiftCoordinates = (xCo, yCo) => {
        let c = theCanvas.current
        let ctx = c.getContext("2d")

        let xWidth = c.width, yHeight = c.height

        return {
            xNew : (xCo * currentScale + xWidth / 2) ,
            yNew : -yCo * currentScale + yHeight / 2 
        }
    }

    const changeGraph = (type, val) => {
        if(val !== ""){
            if(type === "division-space-1513431"){
                let c = theCanvas.current
                let ctx = c.getContext("2d")

                updateGraph(val, ctx)
            }
        }
    }

    const toggleSettings = (type) => {
        if(type === "graph"){
            let graphSettings = document.getElementsByClassName("graph-work-settings")[0]

            if(graphSettings.style.display === "none"){
                graphSettings.style.display = "block"
            }

            else if(graphSettings.style.display === "block"){
                graphSettings.style.display = "none"
            }
        }
    }

    return (
        <div className="main-wrap-canvas">
            <div 
                className="canvas-tool-bar"
                >
                <div 
                    className="create-graph"
                    onClick = { () => {
                        toggleSettings("graph")
                    } }
                    >
                </div>

                <div 
                    className="zoom-workspace"
                    onClick = { () => {
                        toggleSettings("zoom")
                    } }
                    >
                </div>

                
                <div 
                    className="graph-work-settings"
                    style = {{display : "none"}}
                    >
                    <div className="graph-work-dummy-wrap">
                        <div className="graph-wrap">
                            <div className="col-graph">
                                {/* put inputs and buttons for graph settings here */}
                                <p>Space between divisions</p>
                                <input 
                                    type="number"
                                    className = "graph-settings-workspace"
                                    onKeyPress = {e => {
                                        if(e.key === "Enter"){
                                            changeGraph("division-space-1513431", e.target.value)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div 
                className="canvas-chill"
                ref= {graphWorkArea}
                
                >
                <canvas
                    width = "600"
                    height = "200"
                    ref = {theCanvas}
                    >
                </canvas>
            </div>
        </div>
    )
}

export default x