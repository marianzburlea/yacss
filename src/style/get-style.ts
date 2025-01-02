import { propertyMap } from './property-map'
import type { TCSSPropValue, TStyle } from './property-map'

export const getStyle = ({
  desktop,
  mobile,
  tablet,
  className = '',
  env = 'dev',
}: TStyle) => {
  const classSet = new Set(className.split(' '))

  const rowMap = new Map()
  const styleMap = new Map(Object.entries({ mobile, tablet, desktop }))

  for (const [key, styleData] of styleMap) {
    const responsivePrefix = key === 'mobile' ? '' : `${key[0]}-`

    if (!styleData) {
      continue
    }

    for (const cssProperty in styleData) {
      if (cssProperty in propertyMap) {
        const cssKey = cssProperty as keyof TCSSPropValue
        const className = propertyMap[cssKey].className[env]
        const propertyValue = propertyMap[cssKey].normalize(styleData[cssKey])

        classSet.add(className)
        rowMap.set(`--${responsivePrefix}${className}`, propertyValue)
      }
    }
  }

  return {
    className: Array.from(classSet).join(' ').trim(),
    style: Object.fromEntries(rowMap),
  }
}
