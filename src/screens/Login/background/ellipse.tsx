interface EllipseProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Ellipse(props: EllipseProps) {
  return (
    <div
      {...props}
      className={`${props.className} h-[360px] w-[360px] rounded-full blur-[160px] 2xl:blur-[200px]`}
    ></div>
  )
}
