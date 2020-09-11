import React, { useState, useEffect, useRef } from "react"
import "../assets/sass/graph_canvas.scss"


const x = () => {

    const theCanvas = useRef(null)
    const graphWorkArea = useRef(null)

    const [ selectedFunc, setSelectedFunc ] = useState(undefined)

    let currentFunc = "3", ctx, currentScale = 40

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
        ctx = c.getContext("2d")

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

    }, [])


    useEffect(() => {
        // console.log(selectedFunc)
    }, [selectedFunc])





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



        
        // Hyperbola was here
        // if(currentFunc)
        // currentFunc()

        showFunction(ctx)

        
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

    const showFunction = (ctx) => {


        let x = -10
        while(x < 10){

            const yFunction = (x) => {

                let y

                const drawReverse = (y) => {
                    ctx.beginPath()
                    ctx.strokeStyle = "#29abe2"
                    ctx.fillStyle = "#29abe2"
                    ctx.arc(
                        shiftCoordinates(x, -y).xNew, 
                        shiftCoordinates(x, -y).yNew, 
                        // getRandomArbitrary(0,0.8), 
                        0.7,
                        0, 
                        2 * Math.PI
                    )
                    ctx.stroke()
                    ctx.fill()
                }
                // = 
                // (x * x / 2) + (2 / x) // Equation
                // Math.pow(100 - (x * x), 1/2)
                // getRandomArbitrary(-500, 500)
                // Math.sqrt( ((b * x * x / a)) - 1)
                // +
                // Math.pow((10 - x * x ), 1/2) 
                // + Math.sin(x)
                // + Math.sin(x)
                // + Math.tan(x)

                switch (currentFunc) {
                    case "1":
                        y = 2 * x + 3
                        break
        
                    case "2":
                        y = x * x 
                        break
        
                    case "3":
                        y = Math.sqrt( ((3 * x * x / 2)) + 1)
                        drawReverse(y)
                        break
        
                    case "4":
                        y = Math.pow(10 - (x * x), 1/2)
                        drawReverse(y)
                        break
        
                    case "5":
                        y = Math.sin(x)
                        break
        
                    case "6":
                        y = Math.tan(x)
                        break
        
                    case "7":
                        y = Math.sqrt( ((2 * x * x / 2)) + 1) + Math.pow(10 - (x * x), 0.5)
                        drawReverse(y)
                        break
        
                    case "8":
                        y = Math.pow(10 - (x * x), 1/2) + Math.tan(x)
                        drawReverse(y)
                        break

                    case "9":
                        y = Math.sqrt( ((5 * x * x / 2)) - 1)
                        drawReverse(y)
                        break
        
                
                    default:
                        break
                }

               

                return y
            }

            let newCor = shiftCoordinates(x, yFunction(x))

            ctx.beginPath()
            ctx.strokeStyle = "#000000"
            ctx.fillStyle = "#000000"
            ctx.arc(newCor.xNew, newCor.yNew, 0.7, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.fill()

            x = x + 0.05
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

    const formSubmitted = (e) => {
        // console.log(selectedFunc)
        e.preventDefault()
    }

    const selectFunc = (e) => {
        // setSelectedFunc(e.target.value)

        currentFunc = e.target.value

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
                        <p>Choose graph</p>
                </div>




                <div 
                    className="graph-work-settings"
                    style = {{display : "none"}}
                    >
                    <div className="graph-work-dummy-wrap">
                        <div className="graph-wrap">
                            <div className="col-graph ">
                                {/* put inputs and buttons for graph settings here */}
                                {/* <h1>Pick your graph</h1> */}


                                <div   
                                    className="inner-graph" 
                                    onChange={(e) => selectFunc(e)}
                                    >
                                    <label>
                                        <input selected type="radio" value="1" name="gender" /> 
                                        y = 2x + 3 (Straight line)
                                    </label>

                                    <label>
                                        <input type="radio" value="2" name="gender" /> 
                                        y = x^2 (Square graph)
                                    </label>

                                    <label>
                                        <input type="radio" value="3" name="gender" /> 
                                        Hyperbola
                                    </label>

                                    <label>
                                        <input type="radio" value="9" name="gender" /> 
                                        Inversed Hyperbola
                                    </label>

                                    <label>
                                        <input type="radio" value="4" name="gender" /> 
                                        Circle
                                    </label>

                                    <label>
                                        <input type="radio" value="5" name="gender" /> 
                                        Sin
                                    </label>

                                    <label>
                                        <input type="radio" value="6" name="gender" /> 
                                        Tan
                                    </label>

                                    <label>
                                        <input type="radio" value="7" name="gender" /> 
                                        Circle and Hyperbola combined
                                    </label>

                                    <label>
                                        <input type="radio" value="8" name="gender" /> 
                                        Circle + Tan
                                    </label>

                                  


                                </div>

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