import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PropellantGraph (props) {
  let data = []
  const thrustConstant = props.thrust / 9.81
  for (let i = 0; i <= props.max; i += props.interval) {
    const wetMass = props.dryMass + i * 100
    data.push({
      count: i,
      dv: 2.3 * props.ev * Math.log10(wetMass / props.dryMass),
      accel: props.thrust
    })
  }
  console.log(thrustConstant)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <XAxis dataKey="count"/>
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" /><YAxis />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="dv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="accel" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}