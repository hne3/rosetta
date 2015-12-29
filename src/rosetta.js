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


ReactDOM.render(
  <RElement isVertical={true}
            eValue="aaa" />,
  document.getElementById("elementDiv1")
);

ReactDOM.render(
  <RElement isVertical={false}
            eValue="bbb" />,
  document.getElementById("elementDiv2")
);

ReactDOM.render(
  <RElement isVertical={true}
            eKey="xxx-key"
            eValue="xxx-value" />,
  document.getElementById("elementDiv3")
);

ReactDOM.render(
  <RElement isVertical={false}
            eKey="yyy-key"
            eValue="yyy-value" />,
  document.getElementById("elementDiv4")
);

ReactDOM.render(
  <RElement isVertical={false}
            eKey={<RString data={"Hello, <b>world!</b>"} />}
            eValue={<RNumber typeTag="float"
                   data={123.4567890}
                   renderNumberFunc={(x) => d3.round(x, 3)} />}
  />,
  document.getElementById("elementDiv5")
);

ReactDOM.render(
  <RCollection layout="HorizontalLayout" name="array">

    <RElement isVertical={true}
              eValue="aaa" />

    <RElement isVertical={false}
              eValue="bbb" />

    <RElement isVertical={true}
              eKey="xxx-key"
              eValue="xxx-value" />

    <RElement isVertical={false}
              eKey="yyy-key"
              eValue="yyy-value" />

    <RElement isVertical={false}
              eKey={<RString data={"Hello, <b>world!</b>"} />}
              eValue={<RNumber typeTag="float"
                     data={123.4567890}
                     renderNumberFunc={(x) => d3.round(x, 3)} />}
    />
  </RCollection>,
  document.getElementById("collectionDiv1")
);

ReactDOM.render(
  <RCollection layout="VerticalLayout" name="dict">

    <RElement isVertical={true}
              eValue="aaa" />

    <RElement isVertical={false}
              eValue="bbb" />

    <RElement isVertical={true}
              eKey="xxx-key"
              eValue="xxx-value" />

    <RElement isVertical={false}
              eKey="yyy-key"
              eValue="yyy-value" />

    <RElement isVertical={false}
              eKey={<RString data={"Hello, <b>world!</b>"} />}
              eValue={<RNumber typeTag="float"
                     data={123.4567890}
                     renderNumberFunc={(x) => d3.round(x, 3)} />}
    />
  </RCollection>,
  document.getElementById("collectionDiv2")
);
