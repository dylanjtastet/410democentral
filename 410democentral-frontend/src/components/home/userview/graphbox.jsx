import React from 'react';
import { ScatterChart, Scatter, CartesianGrid, Tooltip,
 XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function Graphbox(props) {
    return(
       <ResponsiveContainer width="95%" height={400}>
          <ScatterChart margin={{ top: 25, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" name="x" label={{
                offset: 0,
                position: "bottom"
            }} />
            <YAxis dataKey="y" name="y" label={{
                offset: 10,
                angle: -90,
                style: {textAnchor: "middle"},
                position: "left"
            }} />
            <CartesianGrid />
            <Tooltip cursor={{ stroke: '#808080', strokeDasharray: '5 5' }}/>
            <Scatter line shape="square" legendType="square" data={props.data} fill="rebeccapurple" />
          </ScatterChart>
        </ResponsiveContainer>
    )
}

