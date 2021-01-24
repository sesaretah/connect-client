import React from "react";
import { dict } from "../../Dict";


const Board = (props) => {

    if (true) {
        return (
            <React.Fragment>
                <div>
                    <canvas id="whiteboard" width="1600" height="1200"></canvas>
                    <canvas id="shape-layer" width="1600" height="1200"></canvas>
                    <div id="sticky-note-container">
                        <div id="note-origin" className="note hidden">
                            <div className="delete-note"><i className="fas fa-times"></i></div>
                            <div>
                                <textarea className="expanding"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tools">
                    <div className="colors">
                        <div className="tool color black" data-color="black">
                            <i className="fas fa-pen" data-color="black"></i>
                        </div>
                        <div className="tool color red" data-color="red">
                            <i className="fas fa-pen" data-color="red"></i>
                        </div>
                        <div className="tool color green" data-color="green">
                            <i className="fas fa-pen" data-color="green"></i>
                        </div>
                        <div className="tool color blue" data-color="blue">
                            <i className="fas fa-pen" data-color="blue"></i>
                        </div>
                        <div className="tool color gold" data-color="gold">
                            <i className="fas fa-pen" data-color="gold"></i>
                        </div>
                        <div className="tool shape line tooltip">
                            <i className="fa fa-ruler-horizontal"></i>
                            <span className="tooltiptext">Line</span>
                        </div>
                        <div className="tool shape box tooltip">
                            <i className="far fa-square"></i>
                            <span className="tooltiptext">Square</span>
                        </div>
                        <div className="tool shape circle tooltip">
                            <i className="far fa-circle"></i>
                            <span className="tooltiptext">Circle</span>
                        </div>
                        <div className="tool color white tooltip" data-color="white">
                            <i className="fas fa-eraser" data-color="white"></i>
                            <span className="tooltiptext">Eraser</span>
                        </div>
                    </div>
                    <div className="sticky-notes">
                        <div className="tool sticky-note hotpink" data-color="hotpink">
                            <i className="fas fa-sticky-note" data-color="hotpink"></i>
                        </div>
                        <div className="tool sticky-note gold" data-color="gold">
                            <i className="fas fa-sticky-note" data-color="gold"></i>
                        </div>
                    </div>
                    <div className="tool hand tooltip">
                        <i className="far fa-hand-paper"></i>
                        <span className="tooltiptext">Hand tool</span>
                    </div>
                    <div className="tool undo tooltip">
                        <i className="fas fa-undo-alt"></i>
                        <span className="tooltiptext">Undo</span>
                    </div>
                    <div className="tool redo tooltip">
                        <i className="fas fa-redo-alt"></i>
                        <span className="tooltiptext">Redo</span>
                    </div>
                </div>
            </React.Fragment>
        )
    } else {
        return (null)
    }
}
export default Board;
