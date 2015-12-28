// Rosetta
// Created on 2015-12-27 by Philip Guo

/* TODOs

- remember to add 'key' field for object constancy

*/

import React from 'react';
import ReactDOM from 'react-dom';

import {RNumber, RString, RSymbol} from 'rprimitive';

ReactDOM.render(
  <RNumber typeTag="float"
           data={123.4567890}
           renderNumberFunc={(x) => d3.round(x, 3)} />,
  document.getElementById("primitiveDiv1")
);

ReactDOM.render(
  <RString data={"Hello, <b>world!</b>"} />,
  document.getElementById("primitiveDiv2")
);

ReactDOM.render(
  <RSymbol typeTag="bool"
           data={"True"}
           customStyle={{backgroundColor: 'purple'}} />,
  document.getElementById("primitiveDiv3")
);

ReactDOM.render(
  <RNumber typeTag="int"
           data={-123.4567890}
           renderNumberFunc={(x) => d3.round(x, 0)} />,
  document.getElementById("primitiveDiv4")
);

ReactDOM.render(
  <RSymbol data={"globalX"} />,
  document.getElementById("primitiveDiv5")
);
