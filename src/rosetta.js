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

import {StepVisualizer} from 'stepVisualizer';


// to generate trace, run:
// JSON.stringify(myVisualizer.curTrace[myVisualizer.curInstr])

// generated from:
// http://www.pythontutor.com/visualize.html#code=x+%3D+%5B1,+2,+3%5D%0Ay+%3D+%5B4,+5,+6%5D%0Az+%3D+y%0Ay+%3D+x%0Ax+%3D+z%0A%0Ax+%3D+%5B1,+2,+3%5D+%23+a+different+%5B1,+2,+3%5D+list!%0Ay+%3D+x%0Ax.append(4%29%0Ay.append(5%29%0Az+%3D+%5B1,+2,+3,+4,+5%5D+%23+a+different+list!%0Ax.append(6%29%0Ay.append(7%29%0Ay+%3D+%22hello%22%0A%0A%0Adef+foo(lst%29%3A%0A++++lst.append(%22hello%22%29%0A++++bar(lst%29%0A%0Adef+bar(myLst%29%3A%0A++++print(myLst%29%0A%0Afoo(x%29%0Afoo(z%29&mode=display&origin=opt-frontend.js&cumulative=false&heapPrimitives=false&textReferences=false&py=2&rawInputLstJSON=%5B%5D&curInstr=21
var step21 = {"ordered_globals":["x","y","z","foo","bar"],"stdout":"[1, 2, 3, 4, 5, 6, 7, 'hello']\n","func_name":"bar","stack_to_render":[{"frame_id":1,"encoded_locals":{"lst":["REF",3]},"is_highlighted":false,"is_parent":false,"func_name":"foo","is_zombie":false,"parent_frame_id_list":[],"unique_hash":"foo_f1","ordered_varnames":["lst"]},{"frame_id":2,"encoded_locals":{"__return__":null,"myLst":["REF",3]},"is_highlighted":true,"is_parent":false,"func_name":"bar","is_zombie":false,"parent_frame_id_list":[],"unique_hash":"bar_f2","ordered_varnames":["myLst","__return__"]}],"globals":{"y":"hello","x":["REF",3],"foo":["REF",5],"bar":["REF",6],"z":["REF",4]},"heap":{"3":["LIST",1,2,3,4,5,6,7,"hello"],"4":["LIST",1,2,3,4,5],"5":["FUNCTION","foo(lst)",null],"6":["FUNCTION","bar(myLst)",null]},"line":22,"event":"return"}

// generated from:
// http://www.pythontutor.com/visualize.html#code=%23+Philip's+10-minute+intro+to+Python%0A%0A%23+numbers!%0Aage+%3D+26%0Api+%3D+3.14159%0A%0A%23+strings!%0As+%3D+'Rutherford+Birchard+Hayes'%0Atokens+%3D+s.split(%29%0AfirstName+%3D+tokens%5B0%5D%0AmiddleName+%3D+tokens%5B1%5D%0AlastName+%3D+tokens%5B2%5D%0As2+%3D+firstName+%2B+'+'+%2B+middleName+%2B+'+'+%2B+lastName%0A%0A%23+'if'+statement+-+indentation+matters!%0Aif+(s+%3D%3D+s2%29%3A%0A++++print('yes!!!'%29%0Aelse%3A%0A++++print('nooooooo'%29%0A%0A%23+list+(mutable+sequence%29%0Abeatles+%3D+%5B'John',+'Paul',+'George'%5D%0Abeatles.append('Ringo'%29%0A%0A%23+'for'+loop+-+indentation+matters!%0Afor+b+in+beatles%3A%0A++++print('Hello+'+%2B+b%29%0A%0A%23+tuple+(immutable+sequence%29%0Aages+%3D+(18,+21,+28,+21,+22,+18,+19,+34,+9%29%0A%0A%23+set+(no+order,+no+duplicates%29%0AuniqueAges+%3D+set(ages%29%0AuniqueAges.add(18%29+%23+already+in+set,+no+effect%0AuniqueAges.remove(21%29%0A%0A%23+no+guaranteed+order+when+iterating+over+a+set%0Afor+thisAge+in+uniqueAges%3A%0A++++print(thisAge%29%0A%0A%23+testing+set+membership%0Aif+18+in+uniqueAges%3A%0A++++print('There+is+an+18-year-old+present!'%29%0A%0A%23+sorting%0Abeatles.sort(%29+%23+in-place%0AorderedUniqueAges+%3D+sorted(uniqueAges%29+%23+new+list%0A%0A%23+dict+-+mapping+unique+keys+to+values%0AnetWorth+%3D+%7B%7D%0AnetWorth%5B'Donald+Trump'%5D+%3D+3000000000%0AnetWorth%5B'Bill+Gates'%5D+%3D+58000000000%0AnetWorth%5B'Tom+Cruise'%5D+%3D+40000000%0AnetWorth%5B'Joe+Postdoc'%5D+%3D+20000%0A%0A%23+iterating+over+key-value+pairs%3A%0Afor+(person,+worth%29+in+netWorth.items(%29%3A%0A++++if+worth+%3C+1000000%3A%0A++++++++print('haha+'+%2B+person+%2B+'+is+not+a+millionaire'%29%0A%0A%23+testing+dict+membership%0Aif+'Tom+Cruise'+in+netWorth%3A%0A++++print('show+me+the+money!'%29&mode=display&origin=opt-frontend.js&cumulative=false&heapPrimitives=false&textReferences=false&py=2&rawInputLstJSON=%5B%5D&curInstr=59
var stepLast = {"ordered_globals":["age","pi","s","tokens","firstName","middleName","lastName","s2","beatles","b","ages","uniqueAges","thisAge","orderedUniqueAges","netWorth","person","worth"],"stdout":"yes!!!\nHello John\nHello Paul\nHello George\nHello Ringo\n34\n9\n18\n19\n22\n28\nThere is an 18-year-old present!\nhaha Joe Postdoc is not a millionaire\nshow me the money!\n","func_name":"<module>","stack_to_render":[],"globals":{"netWorth":["REF",6],"beatles":["REF",2],"firstName":"Rutherford","uniqueAges":["REF",4],"middleName":"Birchard","lastName":"Hayes","age":26,"orderedUniqueAges":["REF",5],"ages":["REF",3],"tokens":["REF",1],"person":"Tom Cruise","s":"Rutherford Birchard Hayes","b":"Ringo","s2":"Rutherford Birchard Hayes","thisAge":28,"pi":3.1416,"worth":40000000},"heap":{"1":["LIST","Rutherford","Birchard","Hayes"],"2":["LIST","George","John","Paul","Ringo"],"3":["TUPLE",18,21,28,21,22,18,19,34,9],"4":["SET",34,9,18,19,22,28],"5":["LIST",9,18,19,22,28,34],"6":["DICT",["Donald Trump",3000000000],["Bill Gates",58000000000],["Joe Postdoc",20000],["Tom Cruise",40000000]]},"line":63,"event":"return"}

// generate from:
// http://www.pythontutor.com/visualize.html#code=%23+Object-oriented+programming+intro%0A%23+Adapted+from+MIT+6.01+course+notes+(Section+3.5%29%0A%23+http%3A//mit.edu/6.01/mercurial/spring10/www/handouts/readings.pdf%0A%0Aclass+Staff601%3A%0A++++course+%3D+'6.01'%0A++++building+%3D+34%0A++++room+%3D+501%0A%0A++++def+salutation(self%29%3A%0A++++++++return+self.role+%2B+'+'+%2B+self.name%0A%0Apat+%3D+Staff601(%29%0Aprint(pat.course%29%0A%0Apat.name+%3D+'Pat'%0Apat.age+%3D+60%0Apat.role+%3D+'Professor'%0A%0Aprint(pat.building%29%0Apat.building+%3D+32%0Aprint(pat.building%29%0A%0Aprint(pat.salutation(%29%29%0Aprint(Staff601.salutation(pat%29%29&mode=display&origin=opt-frontend.js&cumulative=false&heapPrimitives=false&textReferences=false&py=2&rawInputLstJSON=%5B%5D&curInstr=16
var stepOop = {"ordered_globals":["Staff601","pat"],"stdout":"6.01\n34\n32\nProfessor Pat\n","func_name":"salutation","stack_to_render":[{"frame_id":2,"encoded_locals":{"__return__":"Professor Pat","self":["REF",3]},"is_highlighted":true,"is_parent":false,"func_name":"salutation","is_zombie":false,"parent_frame_id_list":[],"unique_hash":"salutation_f2","ordered_varnames":["self","__return__"]}],"globals":{"Staff601":["REF",1],"pat":["REF",3]},"heap":{"1":["CLASS","Staff601",[],["building",34],["course","6.01"],["room",501],["salutation",["REF",2]]],"2":["FUNCTION","salutation(self)",null],"3":["INSTANCE","Staff601",["age",60],["building",32],["name","Pat"],["role","Professor"]]},"line":11,"event":"return"};

// generate from:
// http://www.pythontutor.com/visualize.html#code=class+A%3A%0A++++x+%3D+1%0A++++y+%3D+'hello'%0A%0Aclass+B%3A%0A++++z+%3D+'bye'%0A%0Aclass+C(A,B%29%3A%0A++++def+salutation(self%29%3A%0A++++++++return+'%25d+%25s+%25s'+%25+(self.x,+self.y,+self.z%29%0A%0Ainst+%3D+C(%29%0Aprint(inst.salutation(%29%29%0Ainst.x+%3D+100%0Aprint(inst.salutation(%29%29&mode=display&origin=opt-frontend.js&cumulative=false&heapPrimitives=false&textReferences=false&py=2&rawInputLstJSON=%5B%5D&curInstr=12
var stepOopInherit = {"ordered_globals":["A","B","C","inst"],"stdout":"1 hello bye\n","func_name":"salutation","stack_to_render":[{"frame_id":2,"encoded_locals":{"__return__":"100 hello bye","self":["REF",5]},"is_highlighted":true,"is_parent":false,"func_name":"salutation","is_zombie":false,"parent_frame_id_list":[],"unique_hash":"salutation_f2","ordered_varnames":["self","__return__"]}],"globals":{"A":["REF",1],"C":["REF",3],"B":["REF",2],"inst":["REF",5]},"heap":{"1":["CLASS","A",[],["x",1],["y","hello"]],"2":["CLASS","B",[],["z","bye"]],"3":["CLASS","C",["A","B"],["salutation",["REF",4]]],"4":["FUNCTION","salutation(self)",null],"5":["INSTANCE","C",["x",100]]},"line":10,"event":"return"};

var sv = <StepVisualizer visualizerID={42} data={step21} />
//var sv = <StepVisualizer visualizerID={42} data={stepLast} />
//var sv = <StepVisualizer visualizerID={42} data={stepOop} />
//var sv = <StepVisualizer visualizerID={42} data={stepOopInherit} />
ReactDOM.render(sv, document.getElementById("stepViz"));
