import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function DashboardChart({ chartData }: { chartData: Array<Object> }) {
  const data = chartData;
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart width={500} height={300} data={data}>
        <defs>
          <linearGradient id='colorUv' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#FFE0B2' stopOpacity={1} />
            <stop offset='100%' stopColor='#DA9100' stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 0' vertical={false} stroke='#F8E9CC' />
        <XAxis
          tickLine={false}
          dataKey='date'
          padding={{ left: 50, right: 0 }}
          tick={{ fill: '#A59280', fontSize: 14, fontWeight: 'normal' }}
          stroke='#F8E9CC'
          strokeWidth={4}
          dy={0}
          dx={0}
          style={{ color: '#F8E9CC' }}
          tickFormatter={label => `${label}`}
          minTickGap={0}
          tickMargin={6}
        />
        <YAxis
          tickLine={false}
          tickCount={7}
          tick={{ fill: '#A59280', fontSize: 14, fontWeight: 'normal' }}
          stroke='#F8E9CC'
          strokeWidth={4}
          dy={10}
          dx={10}
          style={{ color: '#F8E9CC' }}
          interval={0}
          tickFormatter={label => `$${label}`}
          minTickGap={0}
          tickMargin={10}
        />
        <Tooltip
          labelStyle={{ color: '#A59280' }}
          contentStyle={{ color: '#A59280' }}
          itemStyle={{ color: '#A59280' }}
          cursor={{ fill: '#F8E9CC' }}
          wrapperStyle={{ color: '#A59280' }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <p className='text-sm bg-[#F8E9CC] border border-[#F8E9CC] px-2 py-1 rounded-md'>{`${label} : $${Number(
                  payload[0].value
                ).toFixed(2)}`}</p>
              );
            }
          }}
        />
        {/* <Legend /> */}
        <Line
          isAnimationActive={false}
          type='monotone'
          dataKey='totalPrice'
          strokeWidth={4}
          strokeLinecap='round'
          // stroke='#eaa316'
          dot={false}
          activeDot={{ r: 3 }}
          stroke='url(#colorUv)'
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
