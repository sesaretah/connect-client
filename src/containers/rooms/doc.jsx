import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, BlockTitle, Card, Fab, Icon, Preloader, Block, CardContent, CardHeader, CardFooter } from 'framework7-react';
import { dict } from '../../Dict';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

class Doc extends Component {
    constructor(props) {
        super(props);
        this.textChangeHandler = this.textChangeHandler.bind(this)
        this.updateCursor = this.updateCursor.bind(this)
        this.selectionChangeHandler = this.selectionChangeHandler.bind(this)
        this.debounce = this.debounce.bind(this)

        this.state = {
            textLatency: 500,
            cursorLatency: 1000

        }
    }


    componentDidMount() {
        Quill.register('modules/cursors', QuillCursors);

        // Constant to simulate a high-latency connection when sending cursor
        // position updates.


        const quillOne = new Quill('#editor-one', {
            theme: 'snow',
            modules: {
                cursors: {
                    transformOnTextChange: true,
                },
            },
        });

        const quillTwo = new Quill('#editor-two', {
            theme: 'snow',
            modules: {
                cursors: {
                    transformOnTextChange: true,
                },
            },
        });

        const cursorsOne = quillOne.getModule('cursors');
        const cursorsTwo = quillTwo.getModule('cursors');

        cursorsOne.createCursor('cursor', 'User 2', 'blue');
        cursorsTwo.createCursor('cursor', 'User 1', 'red');





        quillOne.on('text-change', this.textChangeHandler(quillTwo));
        quillTwo.on('text-change', this.textChangeHandler(quillOne));

        quillOne.on('selection-change', this.selectionChangeHandler(cursorsTwo));
        quillTwo.on('selection-change', this.selectionChangeHandler(cursorsOne));



    }

    textChangeHandler(quill) {
        var self = this;
        return function (delta, oldContents, source) {
            if (source === 'user') {
                setTimeout(() => quill.updateContents(delta), self.state.textLatency);
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

    updateCursor(range, cursors) {
        var self = this;
        // Use a timeout to simulate a high latency connection.
        setTimeout(() => cursors.moveCursor('cursor', range), self.state.cursorLatency);
    }

    selectionChangeHandler(cursors) {
        var self = this;
        const debouncedUpdate = self.debounce(updateCursor, 500);
      
        return function(range, oldRange, source) {
          if (source === 'user') {
            // If the user has manually updated their selection, send this change
            // immediately, because a user update is important, and should be
            // sent as soon as possible for a smooth experience.
            updateCursor(range);
          } else {
            // Otherwise, it's a text change update or similar. These changes will
            // automatically get transformed by the receiving client without latency.
            // If we try to keep sending updates, then this will undo the low-latency
            // transformation already performed, which we don't want to do. Instead,
            // add a debounce so that we only send the update once the user has stopped
            // typing, which ensures we send the most up-to-date position (which should
            // hopefully match what the receiving client already thinks is the cursor
            // position anyway).
            debouncedUpdate(range);
          }
        };
      
        function updateCursor(range) {
          // Use a timeout to simulate a high latency connection.
          setTimeout(() => cursors.moveCursor('cursor', range), 1000);
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
        <h2>User 1</h2>
        <center>(Expanding editor)</center>
        <br />
        <div id="editor-one"></div>
      </div>

      <div className="editor">
        <h2>User 2</h2>
        <center>(Fixed-height editor)</center>
        <br />
        <div id="editor-two"></div>
      </div>
    </div>
                </CardContent>
            </Card>
        );
    }
}
export default Doc;