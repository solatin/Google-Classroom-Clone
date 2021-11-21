import React from 'react';
import Assignments from './Assignments';

import "./ClassAssignments.css";

const ClassAssignments = () => {
    return(
        <>
            <div className="container">
              
                <Assignments />
                <Assignments />
                <Assignments />
            </div>
         
        </>
    );
    
}

export default ClassAssignments;