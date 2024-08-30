import { Ellipse } from './ellipse'

const Ellipses = [
  'absolute left-1/5 top-1/2 bg-gradient-ellipse-1',
  'absolute left-1/2 top-8 bg-gradient-ellipse-3',
  'absolute -right-20 -bottom-20 bg-gradient-ellipse-2',
  'absolute right-0 top-0 bg-gradient-ellipse-1',
  'absolute left-16 top-0 bg-gradient-ellipse-3',
  'absolute left-1/3 bottom-1/3 bg-gradient-ellipse-2',
  'absolute left-1/2 -bottom-20 bg-gradient-ellipse-4',
]

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Background({ children, ...props }: BackgroundProps) {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {Ellipses.map((ellipse, index) => (
        <Ellipse key={index} className={ellipse} />
      ))}
      <div {...props}>{children}</div>
    </div>
  )
}
