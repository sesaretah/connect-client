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
        this.undo = this.undo.bind(this)
        this.removeLatestLine = this.removeLatestLine.bind(this)
        this.trash = this.trash.bind(this)
        this.updateMovement = this.updateMovement.bind(this)

        this.togglePointer = this.togglePointer.bind(this)

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
            currentPage: 0,
            color: '#22194D',
            displayColorPicker: false,
            upload: null,
            vectorId: [],
            pointers: [],
            pointerEnabled: true
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.line !== this.props.line) {
            this.setState({ lines: this.state.lines.concat(this.props.line) });
        }
        if (prevProps.participants !== this.props.participants) {
            this.props.participants.map((participant) => {
                var exisiting = this.state.pointers.filter(
                    (item) => item.uuid === participant.uuid
                );
                if (exisiting.length === 0) {
                    this.setState({ pointers: this.state.pointers.concat({ uuid: participant.uuid, color: participant.userColor, x: 0, y: 0 }) }, () => {
                        // console.log('>>>>> Pointers ...', this.state.pointers)
                    });
                }
            })

        }
        if (prevProps.undoVector !== this.props.undoVector) {
            if (this.props.undoVector) {
                this.removeLatestLine(this.props.undoVector);
                this.props.revertUndo();
            }
        }
        if (prevProps.trash !== this.props.trash) {
            if (this.props.trash) {
                this.applyTrash();
                this.props.revertTrash();
            }
        }
        if (prevProps.upload !== this.props.upload) {
            if (this.props.upload.converted) {
                this.setState({ currentPage: 0, upload: this.props.upload });
                this.throttle({ currentPage: this.state.currentPage, uuid: this.props.upload.uuid }, 'newUpload')
            }
        }
        if (prevProps.page !== this.props.page) {
            if (this.props.page.uuid == this.state.upload.uuid) {
                this.setState({ currentPage: this.props.page.currentPage });
            } else {
                this.props.recentUpload()
            }
        }

        if (prevProps.currentPoint !== this.props.currentPoint) {
            console.log(this.props.currentPoint)
            console.log(this.state.pointers)
            this.updateMovement(this.props.currentPoint)
            // var cord = { x: this.props.currentPoint.x, y: this.props.currentPoint.y }
            // this.setState({ pointer: cord })
            /*
                        var pointers = this.state.pointers
                        for (let i = 0; i < pointers.length; i++) {
                            if (pointers[i].uuid === this.props.currentPoint.uuid){
                                let newState = Object.assign({}, this.state);
                                newState.pointers[i] = { uuid: pointers[i].uuid, color: pointers[i].color, x: this.props.currentPoint.x, y: this.props.currentPoint.y}
                                this.setState(newState);
                            }
                        }
            */
            //this.setState({ lines: this.state.lines.concat(this.props.line) });
        }
    }

    updateMovement(pointer) {
        var pointers = this.state.pointers
        for (let i = 0; i < pointers.length; i++) {
            if (pointers[i].uuid === pointer.uuid) {
                let newState = Object.assign({}, this.state);
                newState.pointers[i] = { uuid: pointers[i].uuid, color: pointers[i].color, x: pointer.x, y: pointer.y }
                this.setState(newState);
            }
        }
    }

    handleMouseDown = (e) => {
        this.setState({ isDrawing: true });
        console.log(this.getRelativePointerPosition(e.target.getStage()))
        console.log(e.target.getStage().getPointerPosition())
        const pos = this.getRelativePointerPosition(e.target.getStage());
        var tool = this.state.tool
        var vectorId = Math.random().toString(36).substring(7)
        var c = { tool, color: this.state.color, vectorId: vectorId, points: [pos.x, pos.y] }
        this.setState({ lines: this.state.lines.concat(c), vectorId: this.state.vectorId.concat(vectorId) }, () => {
            //this.props.wsSend({type: 'line', c: c});
            this.throttle(c, 'line')
            console.log(c)
        });

    };

    handleMouseMove = (e) => {
        // no drawing - skipping
        if (this.state.pointerEnabled) {
            const point = this.getRelativePointerPosition(e.target.getStage());
            var pointer = { uuid: this.props.userUUID, x: point.x, y: point.y }
            this.updateMovement(pointer)
            this.throttle(pointer, 'point')
            return;
        }
        if (this.state.isDrawing) {
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
        }
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
        if (this.props.progressShow || (this.props.upload && !this.props.upload.converted)) {
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
                    <input id="file-input" className="file-input" type="file" name="resume" accept="application/pdf" onInput={(e) => { this.props.uploader(e.target.files[0]); this.setState({ upload: null }) }} />
                </div>
            )
        }
    }

    uploaded() {
        if (this.state.upload) {
            return (<img src={'http://localhost:3001/' + this.state.upload.uuid + '/x-' + this.enumerator(this.state.currentPage) + '.jpg'} class="b-radius-0 " width={this.state.width + 'px'}></img>)
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
                    <div style={{ marginTop: '-4px' }}>{this.state.currentPage + 1}/{this.props.upload.pages}</div>
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
            this.setState({ currentPage: this.state.currentPage + 1 }, () => {
                this.throttle({ currentPage: this.state.currentPage, uuid: this.props.upload.uuid }, 'page')
            })

        }
    }

    previousPage() {
        if (this.props.upload && this.props.upload.pages && this.props.upload.pages > this.state.currentPage && this.state.currentPage > 0) {
            this.setState({ currentPage: this.state.currentPage - 1 }, () => {
                this.throttle({ currentPage: this.state.currentPage, uuid: this.props.upload.uuid }, 'page')
            })

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
        this.setState({ color: color.hex, pointerEnabled: false })
    }

    undo() {
        var last = this.state.vectorId[this.state.vectorId.length - 1]
        this.throttle(last, 'undo')
        this.removeLatestLine(last)
        this.setState({ vectorId: this.state.vectorId.filter((v) => v !== last) });
    }

    removeLatestLine(undoVector) {
        if (this.state.lines.length > 0) {
            this.setState({ lines: this.state.lines.filter((line) => line.vectorId !== undoVector) });
        }
    }

    trash() {
        this.throttle(null, 'trash')
        this.setState({ lines: [] });
    }

    applyTrash() {
        this.setState({ lines: [] });
    }

    pointers() {
        var result = []
        this.state.pointers.map((pointer) => {
            result.push(<Circle x={pointer.x} y={pointer.y} radius={5} fill={pointer.color} />)
        })
        return result
    }

    togglePointer() {
        this.setState({ pointerEnabled: !this.state.pointerEnabled });
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
                        <a onClick={() => this.togglePointer()}>
                            {!this.state.pointerEnabled ?
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="3" x2="21" y2="21" /><path d="M14.828 9.172a4 4 0 0 1 1.172 2.828" /><path d="M17.657 6.343a8 8 0 0 1 1.635 8.952" /><path d="M9.168 14.828a4 4 0 0 1 0 -5.656" /><path d="M6.337 17.657a8 8 0 0 1 0 -11.314" /></svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="12" x2="12" y2="12.01" /><path d="M14.828 9.172a4 4 0 0 1 0 5.656" /><path d="M17.657 6.343a8 8 0 0 1 0 11.314" /><path d="M9.168 14.828a4 4 0 0 1 0 -5.656" /><path d="M6.337 17.657a8 8 0 0 1 0 -11.314" /></svg>
                            }
                        </a>
                        <a onClick={this.handleClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" /><line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></svg>
                        </a>
                        {this.state.displayColorPicker ? <div style={popover}>
                            <div style={cover} onClick={this.handleClose} />
                            <CompactPicker onChange={this.handleChange} />
                        </div> : null}
                        <a onClick={() => this.undo()}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" /></svg>
                        </a>
                        <a onClick={() => this.trash()}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                        </a>
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
                            {this.pointers()}
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