interface EllipseProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Ellipse(props: EllipseProps) {
  return (
    <div
      {...props}
      className={`${props.className} h-64 w-64 lg:h-68 lg:w-68 2xl:h-96 2xl:w-96 rounded-full blur-[68px] lg:blur-[128px] 2xl:blur-[140px] opacity-30 lg:opacity-10`}
    ></div>
  )
}
