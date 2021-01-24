import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Line, Text } from 'react-konva';
import { Page, Navbar, List, BlockTitle, Card, Fab, Icon, Preloader, Block, CardContent, CardHeader, CardFooter } from 'framework7-react';
import { dict } from '../../Dict';

class Board extends Component {
    constructor(props) {
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.fitStageIntoParentContainer = this.fitStageIntoParentContainer.bind(this);
        this.getRelativePointerPosition = this.getRelativePointerPosition.bind(this)
        this.stage = React.createRef();

        this.state = {
            tool: 'pen',
            lines: [],
            isDrawing: false,
            baseWidth: 800,
            baseHeight: 600,
            width: 800,
            height: 600,
            scale: 4 / 3,
            scaleX: 1,
            scaleY: 1,
        }
    }

    handleMouseDown = (e) => {
        this.setState({ isDrawing: true });
        console.log(this.getRelativePointerPosition(e.target.getStage()))
        console.log(e.target.getStage().getPointerPosition())
        const pos = this.getRelativePointerPosition(e.target.getStage());
        var tool = this.state.tool
        var c = { tool, points: [pos.x, pos.y] }
        this.setState({ lines: this.state.lines.concat(c) });
    };

    handleMouseMove = (e) => {
        // no drawing - skipping
        if (!this.state.isDrawing) {
            return;
        }
        const stage = e.target.getStage();
        const point = this.getRelativePointerPosition(e.target.getStage());//stage.getPointerPosition();
        let lastLine = this.state.lines[this.state.lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        this.state.lines.splice(this.state.lines.length - 1, 1, lastLine);
        this.setState({ lines: this.state.lines.concat() });
    };

    handleMouseUp = () => {
        this.setState({ isDrawing: false });
    };

    componentDidMount() {


        // this.fitStageIntoParentContainer();
        window.addEventListener('resize', this.fitStageIntoParentContainer);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.fitStageIntoParentContainer);
    }

    fitStageIntoParentContainer() {
        var cardWidth = this.$$('#board').width()
        var cardHeight = this.$$('#board').height()

        var scale = Math.min(
            cardWidth / this.state.baseWidth,
            cardHeight / this.state.baseHeight
        );

        //var scaleX = Math.min(cardWidth, this.state.width) / 800;
        //var scaleY = Math.min(cardHeight, this.state.width) / 600;

        if (window.innerWidth < 1090) {

            this.setState({ scale: scale })
            this.setState({ width: this.$$('#board').width(), height: this.$$('#board').width() * 3 / 4 }, () => {
                this.stage.current.width(this.$$('#board').width());
                this.stage.current.height(this.$$('#board').width() * 3 / 4);
                this.stage.current.scale({ x: scale, y: scale });
                this.stage.current.draw()
            });
        }

        if (window.innerWidth > 1090) {
            this.setState({ scale: scale })
            this.setState({ width: 800, height: 600 }, () => {
                this.stage.current.width(800);
                this.stage.current.height(600);
                this.stage.current.scale({ x: scale, y: scale });
                this.stage.current.draw()
            });
        }


    }

    getRelativePointerPosition(node) {

        var transform = node.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();

        // get pointer (say mouse or touch) position
        var pos = node.getStage().getPointerPosition();

        // now we can find relative point
        return transform.point(pos);
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <select
                        value={this.state.tool}
                        onChange={(e) => {
                            this.setState({ tool: e.target.value });
                        }}
                    >
                        <option value="pen">Pen</option>
                        <option value="eraser">Eraser</option>
                    </select></CardHeader>
                <CardContent id='board' className='flex-center'>
                    <div style={{ position: 'absolute' }}>
                        <img src='https://picsum.photos/800/600' class="b-radius-0 " width={this.state.width}></img>
                    </div>
                    <Stage
                        width='800'
                        height='600'
                        onMouseDown={this.handleMouseDown}
                        onMousemove={this.handleMouseMove}
                        onMouseup={this.handleMouseUp}
                        ref={this.stage}
                    >
                        <Layer
                        >
                            {this.state.lines.map((line, i) => (
                                <Line
                                    key={i}
                                    points={line.points}
                                    stroke="#df4b26"
                                    strokeWidth={5}
                                    tension={0.5}
                                    lineCap="round"
                                    globalCompositeOperation={
                                        line.tool === 'eraser' ? 'destination-out' : 'source-over'
                                    }
                                />
                            ))}
                        </Layer>

                    </Stage>
                </CardContent>
            </Card>
        );
    }
}
export default Board;