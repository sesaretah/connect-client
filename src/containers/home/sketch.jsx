import {SketchField, Tools} from 'react-sketch';
import React from "react";

const Sketch = (props) => {
        return (
            <SketchField width='200px' 
                         height='200px' 
                         tool={Tools.Pencil} 
                         lineColor='black'
                         lineWidth={3}/>
        )
     }
 export default Sketch;
    