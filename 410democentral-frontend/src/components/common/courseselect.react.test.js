import React from 'react';
import renderer from 'react-test-renderer';
import Courseselect from './courseselect.jsx';

test('Component reflects group prop', () => {
    let group1 = {_id: "comp210"}
    const component1 = renderer.create(
        <Courseselect group={group1}></Courseselect>
    );

    let tree1 = component1.toJSON();

    let group2 = {_id: "comp550"}
    const component2 = renderer.create(
        <Courseselect group={group2}></Courseselect>
    );
    let tree2 = component2.toJSON();

    let group3 = {_id: "comp690"}
    const component3 = renderer.create(
        <Courseselect group={group3}></Courseselect>
    );
    let tree3 = component3.toJSON();

    expect(tree1).toMatchSnapshot();
    expect(tree2).toMatchSnapshot();
    expect(tree3).toMatchSnapshot();
})