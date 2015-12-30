// Rosetta
// Created on 2015-12-27 by Philip Guo

/* TODOs

- remember to add 'key' field for object constancy

*/

import React from 'react';
import ReactDOM from 'react-dom';
import 'd3';

//import _ from 'underscore';
//console.log(_);

import {RNumber, RString, RSymbol} from 'rprimitive';
import {RElement} from 'relement';
import {RCollection} from 'rcollection';


var f = <RNumber typeTag="float"
          data={123.4567890}
          renderNumberFunc={(x) => d3.round(x, 3)} />;

var s = <RString data={"Hello, <b>world!</b>"} />;

var b = <RSymbol typeTag="bool"
          data={"True"} />;

var i = <RNumber typeTag="int"
          data={-123.4567890}
          renderNumberFunc={(x) => d3.round(x, 0)} />;

var sym = <RSymbol data={"globalX"} />;

ReactDOM.render(f, document.getElementById("primitiveDiv1"));
ReactDOM.render(s, document.getElementById("primitiveDiv2"));
ReactDOM.render(b, document.getElementById("primitiveDiv3"));
ReactDOM.render(i, document.getElementById("primitiveDiv4"));
ReactDOM.render(sym, document.getElementById("primitiveDiv5"));


var e1 = <RElement isVertical={true} key="e1">
           {s}
           {f}
         </RElement>;

var e2 = <RElement isVertical={false} key="e2">
           {s}
           {i}
         </RElement>

var e3 = <RElement isVertical={true} key="e3">
           {b}
           {sym}
         </RElement>

var e4 = <RElement isVertical={false} key="e4">
           {sym}
           {i}
         </RElement>

var e5 = <RElement isVertical={false} key="e5">
           <RNumber typeTag="float"
             data={123.4567890}
             renderNumberFunc={(x) => d3.round(x, 3)} />
           <RString data={"Hello, <b>world!</b>"} />
         </RElement>

var e6 = <RElement isVertical={true} key="e6">
           {sym}
           {i}
         </RElement>

ReactDOM.render(e1, document.getElementById("elementDiv1"));
ReactDOM.render(e2, document.getElementById("elementDiv2"));
ReactDOM.render(e3, document.getElementById("elementDiv3"));
ReactDOM.render(e4, document.getElementById("elementDiv4"));
ReactDOM.render(e5, document.getElementById("elementDiv5"));
ReactDOM.render(e6, document.getElementById("elementDiv6"));

ReactDOM.render(
  <RCollection layout="HorizontalLayout" name="array">
    {[e1, e3, e6]}
  </RCollection>,
  document.getElementById("collectionDiv1"));

ReactDOM.render(
  <RCollection layout="VerticalLayout" name="dict">
    {[e2, e4, e5]}
  </RCollection>,
  document.getElementById("collectionDiv2"));
