import React from 'react';
import renderer from 'react-test-renderer';
import Coursecreate from './coursecreate.jsx';


test('Component responds to text input changes', ()=>{
    const component = renderer.create(
        <Coursecreate></Coursecreate>
    );

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    tree.children[0].props.onChange({target:{value:"hello"}})
        
    expect(tree).toMatchSnapshot()
})