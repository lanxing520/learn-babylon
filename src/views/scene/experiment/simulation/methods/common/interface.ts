type NumberArray = [number, number, number]
export type DynamicObject = Record<
  string,
  {
    name: string
    position: NumberArray
    rotate?: NumberArray
    scaling?: NumberArray | number
  }
>
