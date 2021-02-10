import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, BlockTitle, Card, Fab, Icon, Preloader, Block, CardContent, CardHeader, CardFooter } from 'framework7-react';
import { dict } from '../../Dict';
import randomColor from 'randomcolor';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

class Doc extends Component {
    constructor(props) {
        super(props);
        this.textChangeHandler = this.textChangeHandler.bind(this)
        this.selectionChangeHandler = this.selectionChangeHandler.bind(this)
        this.debounce = this.debounce.bind(this)
        this.throttle = this.throttle.bind(this)
        this.setContent = this.setContent.bind(this)
        this.setCursor = this.setCursor.bind(this)
        this.typingNow = this.typingNow.bind(this)
        this.showTyping = this.showTyping.bind(this)
        this.constructCursor = this.constructCursor.bind(this)

        this.state = {
            textLatency: 500,
            cursorLatency: 1000,
            lastTime: Date.now(),
            curserName: null, //Math.random().toString(36).substring(7),
            curserColor: this.props.userColor,//randomColor({luminosity: 'dark', alpha: 0.4}),
            cursor: null,
            delta: null,
            quill: null,
            range: null,
            clients: [{ id: 'self', color: randomColor() }],
            cursors: [],
            isTypying: null,

        }
    }

    componentDidUpdate(prevProps) {
        var self = this;
        if (prevProps.quillDelta !== this.props.quillDelta) {
            this.setState({ delta: this.props.quillDelta }, () => {
                self.setContent(self.state.quill, this.props.quillDelta)
            });
        }
        
        if (prevProps.typing !== this.props.typing) {
            self.typingNow(self.props.typing)
        }
        if (prevProps.contentSync !== this.props.contentSync) {
            //console.log(this.props.contentSync)
                self.state.quill.setContents(this.props.contentSync)
        }
        
        if (this.props.newComerLength  && this.props.newComerLength < self.state.quill.getLength()) {
            console.log(this.props.newComerLength,  self.state.quill.getLength())
          // if(this.props.newComerLength < self.state.quill.getLength()) {
            setTimeout(() =>  self.throttle( self.state.quill.getContents(), 'contentSync'), 3000);
            this.props.newComerReset();
          // }
        }
        if (prevProps.name !== this.props.name) {
            self.setState({ curserName: this.props.name }, () => {
                self.constructCursor(this.state.curserName, this.state.curserColor)
                setTimeout(() =>  self.throttle( self.state.quill.getLength(), 'newComer'), 3000);
               
            })
        }
        if (prevProps.client !== this.props.client) {

        }
        if (prevProps.cursorRange !== this.props.cursorRange) {
            console.log(this.props.cursorRange)
            console.log(this.state.cursor)
            if (self.state.cursor._cursors) {
                var item = this.state.cursor._cursors[this.props.cursorRange.name]
                if (item) {
                    self.setCursor(this.props.cursorRange.name, this.props.cursorRange.range)
                } else {
                    self.constructCursor(this.props.cursorRange.name, this.props.cursorRange.color)
                }
            }

        }
        if (prevProps.newCursor !== this.props.newCursor) {
            var client = self.state.clients.filter(
                (item) => item.name === this.props.newCursor.name
            )
            if (client.length == 0) {
                self.constructCursor(this.props.newCursor.name, this.props.newCursor.color)
            }
        }
    }

    constructCursor(cursorName, curserColor) {
        var self = this;
        var cursor = self.state.quill.getModule('cursors');
        cursor.createCursor(cursorName, cursorName, curserColor);
        self.state.quill.on('selection-change', self.selectionChangeHandler(cursor));
        this.setState({ cursor: cursor });
    }



    componentDidMount() {
        var self = this;
        Quill.register('modules/cursors', QuillCursors);

        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],   // superscript/subscript        // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'header': [1, 2, false] }],
        ];

        var quillOne = new Quill('#editor-one', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                cursors: {
                    //cursors: true,
                    transformOnTextChange: true,
                },
            },
        });


        quillOne.format('direction', 'rtl');
        quillOne.format('align', 'right');

        this.setState({ quill: quillOne })

        const cursorsOne = quillOne.getModule('cursors');
        this.setState({ cursor: cursorsOne })
        //const cursorsTwo = quillTwo.getModule('cursors');

        //    cursorsOne.createCursor('cursor', this.state.curserName, this.state.curserColor);
        //    setTimeout(() => self.props.wsSend({ type: 'newCursor', c: { name: self.state.curserName, color: self.state.curserColor } }), 1000);

        // cursorsOne.createCursor('cursor', 'User 1', 'red');

        quillOne.on('text-change', this.textChangeHandler(quillOne));


        //quillOne.on('text-change', this.textChangeHandler(quillTwo));
        //quillTwo.on('text-change', this.textChangeHandler(quillOne));

        //  quillOne.on('selection-change', this.selectionChangeHandler(cursorsOne));
        //quillTwo.on('selection-change', this.selectionChangeHandler(cursorsOne));


    }

    setContent(quill, delta) {
        quill.updateContents(delta);
    }

    setCursor(id, range) {
        this.state.cursor.moveCursor(id, range)
    }


    typingNow(typer) {
        var self = this;
        console.log(typer.name + ' is Typing')
        console.log(self.state.quill.getLength())
        this.setState({ isTypying: typer.name })
        setTimeout(() =>
            this.setState({ isTypying: null })
            , 2000);
    }

    showTyping() {
        if (this.state.isTypying) {
            return (<span>{this.state.isTypying} {' ' + dict.is_typing}</span>)
        }
    }


    textChangeHandler(quill) {
        var self = this;
        return function (delta, oldContents, source) {
            if (source === 'user') {
                self.props.wsSend({ type: 'quill', c: delta })
                self.throttle({ name: self.state.curserName, rnd: Math.random().toString(36).substring(4) }, 'typing')
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            const later = function () {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(c, t) {
        if (Date.now() - this.state.lastTime > 100) {
            this.setState({ lastTime: Date.now() }, () => {
                this.props.wsSend({ type: t, c: c })
            })
        }
    }


    selectionChangeHandler(cursors) {
        var self = this;
        const debouncedUpdate = self.debounce(updateCursor, 500);

        return function (range, oldRange, source) {
            if (source === 'user') {
                updateCursor(range);
            } else {
                debouncedUpdate(range);
            }
        };

        function updateCursor(range) {
            self.props.wsSend({ type: 'cursor', c: { range: range, name: self.state.curserName, color: self.state.curserColor } })
        }
    }




    render() {
        return (
            <Card>
                <CardHeader>
                </CardHeader>
                <CardContent >
                    <div className="container">
                        <div clclassNameass="editor">
                            <br />
                            <div id="editor-one"></div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='editor-footer'>
                    {this.showTyping()}
                </CardFooter>
            </Card>
        );
    }
}
export default Doc;