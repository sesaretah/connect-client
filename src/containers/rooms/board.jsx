import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Line, Circle } from 'react-konva';
import { Row, Col, List, BlockTitle, Card, Fab, Icon, Preloader, Progressbar, CardContent, CardHeader, CardFooter } from 'framework7-react';
import { dict } from '../../Dict';
import { CompactPicker } from 'react-color';

class Board extends Component {
    constructor(props) {
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.fitStageIntoParentContainer = this.fitStageIntoParentContainer.bind(this);
        this.getRelativePointerPosition = this.getRelativePointerPosition.bind(this)
        this.stage = React.createRef();
        this.throttle = this.throttle.bind(this)
        this.pointer = this.pointer.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClose = this.handleClose.bind(this)


        this.arrows = this.arrows.bind(this)
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
            lastTime: Date.now(),
            pointer: { x: 0, y: 0 },
            currentPage: 1,
            color: '#22194D',
            displayColorPicker: false,

        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.line !== this.props.line) {
            this.setState({ lines: this.state.lines.concat(this.props.line) });
        }
        if (prevProps.upload !== this.props.upload) {
            this.setState({ currentPage: 1 });
        }
        if (prevProps.currentPoint !== this.props.currentPoint) {
            console.log(this.props.currentPoint)
            var cord = { x: this.props.currentPoint.x, y: this.props.currentPoint.y }
            this.setState({ pointer: cord })
            //this.setState({ lines: this.state.lines.concat(this.props.line) });
        }
    }

    handleMouseDown = (e) => {
        this.setState({ isDrawing: true });
        console.log(this.getRelativePointerPosition(e.target.getStage()))
        console.log(e.target.getStage().getPointerPosition())
        const pos = this.getRelativePointerPosition(e.target.getStage());
        var tool = this.state.tool
        var c = { tool, color: this.state.color, points: [pos.x, pos.y] }
        this.setState({ lines: this.state.lines.concat(c) }, () => {
            //this.props.wsSend({type: 'line', c: c});
            this.throttle(c, 'line')
        });

    };

    handleMouseMove = (e) => {
        // no drawing - skipping
        if (!this.state.isDrawing) {
            const point = this.getRelativePointerPosition(e.target.getStage());
            this.throttle({ x: point.x, y: point.y }, 'point')
            return;
        }
        const stage = e.target.getStage();
        const point = this.getRelativePointerPosition(e.target.getStage());//stage.getPointerPosition();
        let lastLine = this.state.lines[this.state.lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        this.state.lines.splice(this.state.lines.length - 1, 1, lastLine);
        this.setState({ lines: this.state.lines.concat() }, () => {
            //console.log(this.state.lines)
            //this.props.wsSend({type: 'line', c: this.state.lines});
            this.throttle(this.state.lines, 'line')
        });
    };

    throttle(c, t) {
        if (Date.now() - this.state.lastTime > 100) {
            this.setState({ lastTime: Date.now() }, () => {
                this.props.wsSend({ type: t, c: c })
            })
        }
    }

    pointer(x, y) {
        return (<Circle x={x} y={y} radius={2} fill="green" />)
    }

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

    progress() {
        //    console.log(this.props.progressShow)
        if (this.props.progressShow) {
            return (
                <Preloader color="red" />
            )
        } else {
            return (
                <div class="upload-btn">
                    <label for="file-input">
                        <div style={{ float: 'right' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /></svg>
                        </div>
                        <div style={{ marginTop: '0px', width: '90px' }}>{dict.new_slide}</div>
                    </label>
                    <input id="file-input" className="file-input" type="file" name="resume" accept="application/pdf" onInput={(e) => this.props.uploader(e.target.files[0])} />
                </div>
            )
        }
    }

    uploaded() {
        if (this.props.upload) {
            return (<img src={'http://localhost:3001/' + this.props.upload.uuid + '/x-' + this.enumerator(this.state.currentPage) + '.jpg'} class="b-radius-0 " width={this.state.width + 'px'}></img>)
        }
    }

    enumerator(e) {
        if (e < 10) return '000' + e.toString()
        if (10 <= e < 100) return '00' + e.toString()
        if (100 <= e < 1000) return '0' + e.toString()
    }

    arrows() {
        if (this.props.upload) {
            return (
                <React.Fragment>
                    <div>
                        <a onClick={() => this.previousPage()}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="20" y1="12" x2="10" y2="12" /><line x1="20" y1="12" x2="16" y2="16" /><line x1="20" y1="12" x2="16" y2="8" /><line x1="4" y1="4" x2="4" y2="20" /></svg>
                        </a>
                    </div>
                    <div style={{ marginTop: '-4px' }}>{this.props.upload.pages}</div>
                    <div>
                        <a onClick={() => this.nextPage()}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="12" x2="8" y2="16" /><line x1="4" y1="12" x2="8" y2="8" /><line x1="20" y1="4" x2="20" y2="20" /></svg>
                        </a>
                    </div>
                </React.Fragment>
            )
        }
    }

    nextPage() {
        if (this.props.upload && this.props.upload.pages && this.props.upload.pages > this.state.currentPage) {
            this.setState({ currentPage: this.state.currentPage + 1 })
        }
    }

    previousPage() {
        if (this.props.upload && this.props.upload.pages && this.props.upload.pages > this.state.currentPage && this.state.currentPage > 1) {
            this.setState({ currentPage: this.state.currentPage - 1 })
        }
    }

    handleClick(e) {
        console.log(e)
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose(e) {
        this.setState({ displayColorPicker: false })
    };

    handleChange(color, event) {
        console.log(color, event)
        this.setState({ color: color.hex })
    }




    render() {
        const popover = {
            position: 'absolute',
            zIndex: '1000',
        }
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }

        return (
            <Card>
                <CardHeader>
                    <div>
                        <a onClick={this.handleClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" /><line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></svg>
                        </a>
                        {this.state.displayColorPicker ? <div style={popover}>
                            <div style={cover} onClick={this.handleClose} />
                            <CompactPicker onChange={this.handleChange} />
                        </div> : null}
                    </div>


                    {this.progress()}

                </CardHeader>
                <CardContent id='board' className='flex-center'>
                    <div style={{ position: 'absolute' }}>
                        {this.uploaded()}
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
                                    stroke={line.color}
                                    strokeWidth={5}
                                    tension={0.5}
                                    lineCap="round"
                                    globalCompositeOperation={
                                        line.tool === 'eraser' ? 'destination-out' : 'source-over'
                                    }
                                />
                            ))}
                        </Layer>
                        <Layer>
                            <Circle x={this.state.pointer.x} y={this.state.pointer.y} radius={5} fill="green" />
                        </Layer>

                    </Stage>


                </CardContent>
                <CardFooter className='board-footer'>
                    {this.arrows()}
                </CardFooter>
            </Card>
        );
    }
}
export default Board;